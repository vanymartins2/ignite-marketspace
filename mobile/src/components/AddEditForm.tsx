import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import {
  Box,
  HStack,
  Radio as NativeBaseRadio,
  Checkbox as NativeBaseCheckbox,
  Switch,
  Text,
  VStack,
  FormControl,
  useToast,
  Skeleton
} from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { AppStackNavigationRoutesProps } from '@routes/appStack.routes'
import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'

import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import CurrencyInput from 'react-native-currency-input'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'
import { ProductDetails } from '@dtos/productResponseDTO'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { Input } from '@components/Input'
import { Radio } from '@components/Radio'
import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { TextArea } from '@components/TextArea'
import { Checkbox } from '@components/Checkbox'
import { PickerImg } from '@components/PickerImg'
import { ProductImageDTO } from '@dtos/productImageDTO'

type AdFormData = {
  name: string
  description: string
  is_new: boolean
  price: number
  accept_trade?: boolean
  payment_methods: string[]
}

type RouteParams = {
  id: string
}

const adDataSchema = yup.object({
  name: yup.string().required('Informe um nome.'),
  description: yup.string().required('Informe uma descrição.'),
  is_new: yup.boolean().required('Informe a condição do produto.'),
  price: yup.number().required('Informe o preço.'),
  accept_trade: yup.boolean().optional(),
  payment_methods: yup
    .array()
    .min(1, 'Escolha pelo menos 1 método de pagamento.')
})

export function AddEditForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [photos, setPhotos] = useState([] as ImagePicker.ImagePickerAsset[])
  const [payments, setPayments] = useState<string[]>([])
  const [currentAd, setCurrentAd] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const { refreshedToken } = useAuth()
  const { saveImagesInStorage } = useProduct()

  const route = useRoute()
  const { id } = route.params as RouteParams
  const toast = useToast()
  const navigation = useNavigation<AppStackNavigationRoutesProps>()
  const tabNavigation = useNavigation<AppTabsNavigationRoutesProps>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AdFormData>({
    resolver: yupResolver(adDataSchema)
  })

  const defaultValues = {
    name: currentAd.name,
    description: currentAd.description,
    is_new: currentAd.is_new,
    price: currentAd.price / 100,
    accept_trade: currentAd.accept_trade,
    payment_methods: payments
  }

  function handleCancel() {
    tabNavigation.navigate('my-ads')
  }

  async function handleSelectImages() {
    setPhotoIsLoading(true)

    try {
      const photosSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsMultipleSelection: true,
        selectionLimit: 3
      })

      if (photosSelected.canceled) return

      if (Platform.OS === 'android' && photosSelected.assets.length > 3) {
        return toast.show({
          title: 'Não é possível selecionar mais do que 3 imagens.',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      setPhotos(prevState => [...prevState, ...photosSelected.assets])
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  function handleRemoveImage(uri: string) {
    const filteredPhotos = photos.filter(photo => photo.uri !== uri)

    setPhotos(filteredPhotos)
  }

  async function saveImageFiles(fileName: string, id: string) {
    try {
      const form = new FormData()

      const fileExtension = photos[0].uri.split('.').pop()

      const photoFiles = photos.map(photo => {
        return {
          name: `${fileName}.${fileExtension}`.toLowerCase().replace(/\s/g, ''),
          uri: photo.uri,
          type: `${photo.type}/${fileExtension}`
        }
      }) as any

      form.append('product_id', id)
      photoFiles.map((file: any) => form.append('images', file))

      const response = await api.post('/products/images', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      saveImagesInStorage(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível salvar as imagens.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  async function handleFormSubmit(data: AdFormData) {
    setIsLoading(true)

    try {
      if (photos.length === 0) {
        return toast.show({
          title: 'Selecione ao menos 1 imagem do produto.',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      data.is_new = Boolean(data.is_new)
      data.price = Number(data.price * 100)
      if (data.accept_trade === undefined) data.accept_trade = false

      const response = await api.post('/products', data)

      await saveImageFiles(data.name, response.data.id)

      navigation.navigate('preview', { productId: response.data.id })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível cadastrar os dados. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFormEdit(data: AdFormData) {
    setIsLoading(true)
    try {
      data.is_new = Boolean(data.is_new)
      data.price = Number(data.price * 100)
      if (data.accept_trade === undefined) data.accept_trade = false

      await api.put(`/products/${id}`, data)

      navigation.navigate('preview', { productId: id })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível cadastrar os dados. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCurrentAdToEdit() {
    setIsLoading(true)
    try {
      if (!id) {
        return
      }

      const response = await api.get(`/products/${id}`)
      setCurrentAd(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar as informações do anúncio.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function resetValues() {
    if (!currentAd.id) {
      return
    } else {
      const paymentsArray = currentAd.payment_methods.map(item => item.key)
      setPayments(paymentsArray)

      reset(defaultValues)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCurrentAdToEdit()
    }, [refreshedToken])
  )

  useFocusEffect(
    useCallback(() => {
      resetValues()
    }, [currentAd.id])
  )

  return (
    <>
      <VStack px={8} pb={8}>
        <Text color="gray.200" fontSize="md" fontFamily="heading">
          Imagens
        </Text>
        <Text color="gray.300" fontSize="sm" fontFamily="body">
          Escolha até 3 imagens para mostrar o quanto seu produto é incrível!
        </Text>

        <HStack mt={4} mb={8} flex={1}>
          {photoIsLoading ? (
            <Skeleton
              w={24}
              h={24}
              borderRadius="md"
              startColor="gray.400"
              endColor="gray.600"
            />
          ) : photos.length === 0 ? (
            <PickerImg onPress={handleSelectImages} />
          ) : (
            <>
              {photos.map(photo => (
                <PickerImg
                  key={photo.uri}
                  uri={photo.uri}
                  onRemove={() => handleRemoveImage(photo.uri)}
                  hasImage
                />
              ))}

              {photos.length < 3 && <PickerImg onPress={handleSelectImages} />}
            </>
          )}
        </HStack>

        <Text color="gray.200" fontSize="md" fontFamily="heading" mb={4}>
          Sobre o produto
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Título do anúncio"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextArea
              placeholder="Descrição do produto"
              mb={4}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.description?.message}
            />
          )}
        />

        <FormControl isInvalid={'is_new' in errors}>
          <Controller
            control={control}
            name="is_new"
            render={({ field: { value, onChange } }) => (
              <NativeBaseRadio.Group
                name="is_new"
                onChange={onChange}
                value={currentAd.id ? String(currentAd.is_new) : String(value)}
              >
                <Box flexDirection="row">
                  <Radio value={String(true)} title="Produto novo" />
                  <Radio value={String(false)} title="Produto usado" ml={4} />
                </Box>
              </NativeBaseRadio.Group>
            )}
          />
          <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
            {errors.is_new?.message}
          </FormControl.ErrorMessage>
        </FormControl>

        <Text color="gray.200" fontSize="md" fontFamily="heading" mt={8} mb={4}>
          Venda
        </Text>

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <CurrencyInput
              value={value}
              onChangeValue={onChange}
              delimiter="."
              separator=","
              precision={2}
              renderTextInput={textInputProps => (
                <Input
                  placeholder="Valor do produto"
                  keyboardType="numeric"
                  errorMessage={errors.price?.message}
                  InputLeftElement={
                    <Text
                      color="gray.100"
                      fontSize="md"
                      fontFamily="body"
                      ml={4}
                    >
                      R$
                    </Text>
                  }
                  {...textInputProps}
                />
              )}
            />
          )}
        />

        <VStack alignItems="flex-start" mb={6}>
          <Text fontSize="sm" fontFamily="heading" color="gray.200">
            Aceita troca?
          </Text>
          <Controller
            control={control}
            name="accept_trade"
            render={({ field: { onChange, value } }) => (
              <Switch
                onToggle={(value: boolean) => onChange(value)}
                value={value}
                isChecked={value}
                isInvalid={'accept_trade' in errors}
                size="lg"
                onTrackColor="blue.500"
                offTrackColor="gray.500"
              />
            )}
          />
        </VStack>

        <FormControl isInvalid={'payment_methods' in errors}>
          <Controller
            control={control}
            name="payment_methods"
            render={({ field: { value, onChange } }) => (
              <NativeBaseCheckbox.Group
                onChange={value => onChange(value)}
                value={currentAd.id ? payments : value}
              >
                <Checkbox value="pix" label="Pix" />
                <Checkbox value="card" label="Cartão de crédito" />
                <Checkbox value="boleto" label="Boleto" />
                <Checkbox value="cash" label="Dinheiro" />
                <Checkbox value="deposit" label="Depósito bancário" />
              </NativeBaseCheckbox.Group>
            )}
          />
          <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
            {errors.payment_methods?.message}
          </FormControl.ErrorMessage>
        </FormControl>
      </VStack>

      <Box bgColor="gray.700" px={8} pb={8}>
        <HStack mt={8}>
          <Button
            flex={1}
            title="Cancelar"
            variant="gray"
            mr={3}
            onPress={handleCancel}
          />
          <Button
            flex={1}
            title="Avançar"
            variant="black"
            onPress={
              id ? handleSubmit(handleFormEdit) : handleSubmit(handleFormSubmit)
            }
            isLoading={isLoading}
          />
        </HStack>
      </Box>
    </>
  )
}

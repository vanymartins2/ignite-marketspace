import { useCallback, useEffect, useRef, useState } from 'react'
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
import CurrencyInput from 'react-native-currency-input'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'
import { ProductDetails } from '@dtos/productResponseDTO'
import { ProductImageDTO } from '@dtos/productImageDTO'

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
  const [isEditing, setIsEditing] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<any[]>([])
  const [photos, setPhotos] = useState<ProductImageDTO[]>([])
  const [productImagesIds, setProductImagesIds] = useState<string[]>([])
  const [currentAd, setCurrentAd] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const { refreshedToken } = useAuth()
  const {
    storedImages,
    saveImagesInStorage,
    loadImagesFromStorage,
    removeImagesFromStorage,
    isLoadingDataFromStorage
  } = useProduct()

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

  function handleCancel() {
    tabNavigation.navigate('my-ads')
  }

  function handleRemoveImage(uri: string) {
    const filteredPhotos = photoFiles.filter(photo => photo.uri !== uri)
    setPhotoFiles(filteredPhotos)
  }

  function handleDeletePhoto(photoId: string) {
    setPhotoIsLoading(true)
    try {
      const filteredPhotos = photoFiles.filter(photo => photo.id !== photoId)
      setPhotoFiles(filteredPhotos)

      const productImagesIds = photoFiles
        .filter(photo => photo.id === photoId)
        .map(item => item.id)

      setProductImagesIds(prevState => [...prevState, ...productImagesIds])
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível excluir a imagem. Tente novamente mais tarde.',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function saveImageFiles(
    photosArray: any[],
    fileName: string,
    productId: string
  ) {
    try {
      const form = new FormData()

      const fileExtension = photosArray[0].uri.split('.').pop()

      const files = photosArray.map(photo => {
        return {
          name: `${fileName}.${fileExtension}`.toLowerCase().replace(/\s/g, ''),
          uri: photo.uri,
          type: `${photo.type}/${fileExtension}`
        }
      }) as any

      form.append('product_id', productId)
      files.map((file: any) => form.append('images', file))

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

      setPhotoFiles(prevState => [...prevState, ...photosSelected.assets])
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível selecionar as imagens.',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleFormSubmit(data: AdFormData) {
    setIsLoading(true)
    try {
      if (photoFiles.length === 0) {
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

      saveImageFiles(photoFiles, data.name, response.data.id)

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
      if (photoFiles.length === 0) {
        return toast.show({
          title: 'Selecione ao menos 1 imagem do produto.',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      const objectsWithUri = photoFiles.filter(file =>
        Object.keys(file).includes('uri')
      )

      if (objectsWithUri.length > 0) {
        saveImageFiles(objectsWithUri, data.name, id)
      }

      if (productImagesIds.length !== 0) {
        removeImagesFromStorage(productImagesIds)

        await api.delete('/products/images', {
          data: { productImagesIds }
        })
      }

      data.is_new = Boolean(data.is_new)
      data.price = Number(data.price * 100)
      if (data.accept_trade === undefined) data.accept_trade = false

      await api.put(`/products/${id}`, data)

      navigation.navigate('preview', { productId: id, isEditing })
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
    try {
      if (!id) {
        return
      }
      setIsEditing(true)

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
    }
  }

  async function resetValues() {
    try {
      if (!currentAd.id) {
        return
      }

      const adImages = storedImages.filter(
        image => image.product_id === currentAd.id
      )
      setPhotoFiles(adImages)

      const payments = currentAd.payment_methods.map(item => item.key)

      const defaultValues = {
        name: currentAd.name,
        description: currentAd.description,
        is_new: currentAd.is_new,
        price: currentAd.price / 100,
        accept_trade: currentAd.accept_trade,
        payment_methods: payments
      }

      reset(defaultValues)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível carregar as informações deste anúncio.',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCurrentAdToEdit()
    }, [refreshedToken])
  )

  useFocusEffect(
    useCallback(() => {
      loadImagesFromStorage()
      resetValues()
    }, [currentAd.id, storedImages.length])
  )

  return (
    <>
      {isLoadingDataFromStorage && isEditing ? (
        <Loading />
      ) : (
        <>
          <VStack px={8} pb={8}>
            <Text color="gray.200" fontSize="md" fontFamily="heading">
              Imagens
            </Text>
            <Text color="gray.300" fontSize="sm" fontFamily="body">
              Escolha até 3 imagens para mostrar o quanto seu produto é
              incrível!
            </Text>

            <HStack mt={4} mb={8} flex={1}>
              {/* {photoIsLoading ? (
            <Skeleton
              w={24}
              h={24}
              borderRadius="md"
              startColor="gray.400"
              endColor="gray.600"
            />
          ) : currentAd.id ? (
            photos.map(photo => (
              <PickerImg
                key={photo.id}
                path={photo.path}
                onRemove={() => handleDeletePhoto(photo.id)}
                isEditing={isEditing}
                hasImage
              />
            ))
          ) : (
            photoFiles.map(photo => (
              <PickerImg
                key={photo.uri}
                uri={photo.uri}
                onRemove={() => handleRemoveImage(photo.uri)}
                hasImage
              />
            ))
          )} */}

              {photoIsLoading ? (
                <Skeleton
                  w={24}
                  h={24}
                  mr={2}
                  borderRadius="md"
                  startColor="gray.400"
                  endColor="gray.600"
                />
              ) : (
                photoFiles.map(photo => (
                  <PickerImg
                    key={isEditing && !photo.uri ? photo.id : photo.uri}
                    uri={
                      !isEditing || !photo.id
                        ? photo.uri
                        : `${api.defaults.baseURL}/images/${photo.path}`
                    }
                    onRemove={
                      isEditing || !photo.uri
                        ? () => handleDeletePhoto(photo.id)
                        : () => handleRemoveImage(photo.uri)
                    }
                    hasImage
                  />
                ))
              )}
              {photoFiles.length < 3 && (
                <PickerImg onPress={handleSelectImages} />
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
                    value={id ? String(currentAd.is_new) : String(value)}
                  >
                    <Box flexDirection="row">
                      <Radio value={String(true)} title="Produto novo" />
                      <Radio
                        value={String(false)}
                        title="Produto usado"
                        ml={4}
                      />
                    </Box>
                  </NativeBaseRadio.Group>
                )}
              />
              <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
                {errors.is_new?.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <Text
              color="gray.200"
              fontSize="md"
              fontFamily="heading"
              mt={8}
              mb={4}
            >
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
                render={({ field: { onChange, value } }) => (
                  <NativeBaseCheckbox.Group
                    onChange={onChange}
                    value={value || []}
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
                  id
                    ? handleSubmit(handleFormEdit)
                    : handleSubmit(handleFormSubmit)
                }
                isLoading={isLoading}
              />
            </HStack>
          </Box>
        </>
      )}
    </>
  )
}

import { useState } from 'react'
import {
  Box,
  Center,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack
} from 'native-base'

import { useNavigation } from '@react-navigation/native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useAuth } from '@hooks/useAuth'

import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import userDefaultPhoto from '@assets/userDefault.png'
import LogoSvg from '@assets/logo.svg'

import { UserPhoto } from '@components/UserPhoto'
import { Button } from '@components/Button'
import { Input } from '@components/Input'

type FormDataProps = {
  name: string
  email: string
  tel: string
  password: string
  password_confirm: string
  avatar: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Inform o e-mail.').email('E-mail inválido.'),
  tel: yup.string().required('Informe o telefone.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve conter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.')
})

const PHOTO_SIZE = 24

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState({} as any)
  const [photoUri, setPhotoUri] = useState('')

  const toast = useToast()
  const navigation = useNavigation()
  const { signIn } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500'
          })
        }

        setSelectedPhoto(photoSelected)
        setPhotoUri(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleSignUp(data: FormDataProps) {
    try {
      setIsLoading(true)

      if (!photoUri) {
        await api.post('/users', data)
        await signIn(data.email, data.password)
      } else {
        const fileExtension = selectedPhoto.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${data.name}.${fileExtension}`.toLowerCase().trim(),
          uri: selectedPhoto.assets[0].uri,
          type: `${selectedPhoto.assets[0].type}/${fileExtension}`
        } as any

        const userUploadForm = new FormData()
        userUploadForm.append('avatar', photoFile)
        userUploadForm.append('name', data.name)
        userUploadForm.append('email', data.email)
        userUploadForm.append('password', data.password)
        userUploadForm.append('tel', data.tel)

        await api.post('/users', userUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        await signIn(data.email, data.password)
      }

      toast.show({
        title: 'Cadastrado com sucesso!',
        placement: 'top',
        bgColor: 'blue.500'
      })
    } catch (error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível cadastrar o usuário. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} py={12}>
        <Center>
          <LogoSvg />

          <Heading
            mt={4}
            mb={2}
            fontSize="lg"
            fontFamily="heading"
            color="gray.100"
          >
            Boas vindas!
          </Heading>

          <Text textAlign="center" fontSize="sm" fontFamily="body">
            Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos
          </Text>
        </Center>

        <Center mt={8} mb={8}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.400"
              endColor="gray.300"
            />
          ) : (
            <UserPhoto
              source={!!photoUri ? { uri: photoUri } : userDefaultPhoto}
              size={24}
              alt="Foto do usuário"
            />
          )}

          <Pressable mt={-12} mr={-16} onPress={handleUserPhotoSelect}>
            <Box
              w={10}
              h={10}
              rounded="full"
              bgColor="blue.500"
              alignItems="center"
              justifyContent="center"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="pencil-plus-outline"
                size={4}
                color="gray.600"
              />
            </Box>
          </Pressable>
        </Center>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="tel"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Telefone"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.tel?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              isPassword
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password_confirm"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar senha"
              isPassword
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password_confirm?.message}
            />
          )}
        />

        <Button
          title="Criar"
          variant="black"
          mt={6}
          onPress={handleSubmit(handleSignUp)}
          isLoading={isLoading}
        />

        <Center mt={12}>
          <Text mb={4} fontSize="sm" fontFamily="body" color="gray.200">
            Já tem uma conta?
          </Text>

          <Button
            title="Ir para o login"
            variant="gray"
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}

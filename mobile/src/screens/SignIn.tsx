import { useState } from 'react'
import { ScrollView, Center, Text, VStack, Box, useToast } from 'native-base'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useNavigation } from '@react-navigation/native'

import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import MarketSpaceSvg from '@assets/marketspace.svg'
import LogoSvg from '@assets/logo.svg'

import { Button } from '@components/Button'
import { Input } from '@components/Input'

type FormData = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().required('Insira o e-mail.'),
  password: yup.string().required('Insira a senha')
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const toast = useToast()

  const { signIn } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(signInSchema)
  })

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true)

      await signIn(email, password)
    } catch (error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar agora. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} py={16}>
        <Center>
          <Box mb={7}>
            <LogoSvg />
          </Box>

          <MarketSpaceSvg />

          <Text color="gray.300" fontSize="sm" fontFamily="body">
            Seu espaço de compra e venda
          </Text>
        </Center>

        <Center mt={20}>
          <Text color="gray.200" fontSize="sm" fontFamily="body" mb={7}>
            Acesse sua conta
          </Text>

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
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                mb={8}
                isPassword
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Entrar"
            variant="blue"
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>
      </VStack>

      <Box flex={1} bgColor="gray.700" px={10}>
        <Center mt={8}>
          <Text color="gray.200" fontSize="sm" fontFamily="body" mb={4}>
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar uma conta"
            variant="gray"
            onPress={handleNewAccount}
            isLoading={isLoading}
          />
        </Center>
      </Box>
    </ScrollView>
  )
}

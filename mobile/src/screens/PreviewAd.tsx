import { useState, useCallback } from 'react'
import { Box, HStack, ScrollView, Text, useToast, VStack } from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { AppStackNavigationRoutesProps } from '@routes/appStack.routes'

import { Feather, AntDesign } from '@expo/vector-icons'

import { ProductDetails } from '@dtos/productResponseDTO'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import { useProduct } from '@hooks/useProduct'
import { useAuth } from '@hooks/useAuth'

import { AdDetails } from '@components/AdDetails'
import { RNSwiper } from '@components/RNSwiper'
import { Loading } from '@components/Loading'
import { Button } from '@components/Button'

type RouteParams = {
  productId: string
  isEditing?: boolean
}

export function PreviewAd() {
  const [isLoading, setIsLoading] = useState(true)
  const [previewInfo, setPreviewInfo] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const { refreshedToken } = useAuth()
  const { saveProductInStorage } = useProduct()

  const route = useRoute()
  const toast = useToast()
  const { productId, isEditing } = route.params as RouteParams

  const navigation = useNavigation<AppStackNavigationRoutesProps>()

  function handleGoBackAndEdit() {
    navigation.navigate('new', { id: productId })
  }

  function handleGoToEdit() {
    navigation.navigate('edit', { id: productId })
  }

  async function handlePublishAd() {
    setIsLoading(true)
    try {
      await saveProductInStorage(previewInfo)

      navigation.navigate('my-ad-details', { productId })
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Erro ao publicar o anúncio.',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchAdDetails() {
    setIsLoading(true)
    try {
      const response = await api.get(`/products/${productId}`)
      setPreviewInfo(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar a pré-visualização.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAdDetails()
    }, [refreshedToken])
  )

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box pt={16} px={6} pb={4} bgColor="blue.500" alignItems="center">
          <Text color="gray.700" fontSize="md" fontFamily="heading">
            Pré-visualização do anúncio
          </Text>
          <Text color="gray.700" fontSize="sm" fontFamily="body">
            É assim que seu produto vai aparecer!
          </Text>
        </Box>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <RNSwiper data={previewInfo.product_images} />

            <VStack py={5} px={6}>
              <AdDetails data={previewInfo} />
            </VStack>
          </>
        )}
      </ScrollView>

      <HStack pt={5} px={6} pb={7} bgColor="gray.700">
        <Button
          flex={1}
          title="Voltar e editar"
          variant="gray"
          hasIcon
          iconType={AntDesign}
          iconName="arrowleft"
          onPress={isEditing ? handleGoToEdit : handleGoBackAndEdit}
        />
        <Button
          flex={1}
          title="Publicar"
          variant="blue"
          ml={3}
          hasIcon
          iconType={Feather}
          iconName="tag"
          onPress={handlePublishAd}
          isLoading={isLoading}
        />
      </HStack>
    </>
  )
}

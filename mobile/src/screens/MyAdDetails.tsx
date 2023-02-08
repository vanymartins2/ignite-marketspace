import { useState, useCallback, useEffect } from 'react'
import { Box, ScrollView, useToast, VStack } from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { useProduct } from '@hooks/useProduct'

import { Feather } from '@expo/vector-icons'

import { AdDetails } from '@components/AdDetails'
import { RNSwiper } from '@components/RNSwiper'
import { Header } from '@components/Header'
import { Swiper } from '@components/Swiper'
import { Button } from '@components/Button'
import { ProductDetails } from '@dtos/productResponseDTO'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'
import { Loading } from '@components/Loading'

type RouteParams = {
  productId: string
  product: ProductDetails
}

export function MyAdDetails() {
  const [loading, setLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const navigation = useNavigation()
  const route = useRoute()
  const { productId, product } = route.params as RouteParams

  const { authToken, refreshedToken } = useAuth()

  const toast = useToast()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleDisableAd() {
    setLoading(true)
    try {
      await api.patch(`products/${productId}`, { is_active: false })

      toast.show({
        title: 'Anúncio desativado!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setCurrentProduct({ ...currentProduct, is_active: false })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível alterar a visualização do anúncio.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleEnableAd() {
    setLoading(true)
    try {
      await api.patch(`products/${productId}`, { is_active: true })

      toast.show({
        title: 'Anúncio reativado!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setCurrentProduct({ ...currentProduct, is_active: true })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível alterar a visualização do anúncio.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAd() {
    setLoading(true)
    try {
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
      setLoading(false)
    }
  }

  async function fetchAdDetails() {
    setLoading(true)
    try {
      const response = await api.get(`/products/${productId}`)
      setCurrentProduct(response.data)
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
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAdDetails()
    }, [authToken, currentProduct.is_active])
  )

  console.log('ID:', productId)

  console.log('Current Product:', currentProduct)

  return (
    <>
      <Box px={6} pt={12} pb={3}>
        <Header onPressBackButton={handleGoBack} hasIcon />
      </Box>
      <ScrollView>
        {!currentProduct || loading ? (
          <Loading />
        ) : (
          <>
            <RNSwiper
              data={currentProduct.product_images}
              disabledAd={!currentProduct.is_active ? true : false}
            />

            <VStack px={6} py={5}>
              <AdDetails data={currentProduct} />

              <VStack mt={8}>
                <Button
                  title={
                    !currentProduct.is_active
                      ? 'Reativar anúncio'
                      : 'Desativar anúncio'
                  }
                  mb={2}
                  variant={!currentProduct.is_active ? 'blue' : 'black'}
                  hasIcon
                  iconType={Feather}
                  iconName="power"
                  onPress={
                    !currentProduct.is_active ? handleEnableAd : handleDisableAd
                  }
                  isLoading={loading}
                />

                <Button
                  title="Excluir anúncio"
                  variant="gray"
                  hasIcon
                  iconType={Feather}
                  iconName="trash"
                  onPress={handleDeleteAd}
                />
              </VStack>
            </VStack>
          </>
        )}
      </ScrollView>
    </>
  )
}

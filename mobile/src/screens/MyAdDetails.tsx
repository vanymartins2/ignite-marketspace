import { useState, useCallback, useEffect } from 'react'
import { Box, ScrollView, useToast, VStack } from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { useProduct } from '@hooks/useProduct'

import { Feather } from '@expo/vector-icons'

import { adData, DATA } from '@screens/PreviewAd'

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
  // const [product, setProduct] = useState<ProductDetails>({} as ProductDetails)
  const [updatedProduct, setUpdatedProduct] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const navigation = useNavigation()
  const route = useRoute()
  const { productId, product } = route.params as RouteParams

  const { refreshedToken, authToken } = useAuth()
  const { products } = useProduct()

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

      setUpdatedProduct({ ...updatedProduct, is_active: false })
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

      setUpdatedProduct({ ...updatedProduct, is_active: true })
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
    }
  }

  function fetchAdDetails() {
    setLoading(true)
    try {
      // const response = await api.get(`/products/${productId}`)
      // setUpdatedProduct(response.data)
      setUpdatedProduct(product)
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
    }, [])
  )

  console.log(updatedProduct)

  return (
    <>
      <Box px={6} pt={12} pb={3}>
        <Header onPressBackButton={handleGoBack} hasIcon />
      </Box>
      <ScrollView>
        {!product || loading ? (
          <Loading />
        ) : (
          <>
            <RNSwiper
              data={product.product_images}
              disabledAd={!product.is_active ? true : false}
            />

            <VStack px={6} py={5}>
              <AdDetails data={product} />

              <VStack mt={8}>
                <Button
                  title={
                    !updatedProduct.is_active
                      ? 'Reativar anúncio'
                      : 'Desativar anúncio'
                  }
                  mb={2}
                  variant={!product.is_active ? 'blue' : 'black'}
                  hasIcon
                  iconType={Feather}
                  iconName="power"
                  onPress={
                    !product.is_active ? handleEnableAd : handleDisableAd
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

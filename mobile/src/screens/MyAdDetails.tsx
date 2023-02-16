import { useState, useCallback } from 'react'
import { Box, ScrollView, useToast, VStack } from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'
import { ProductDetails } from '@dtos/productResponseDTO'

import { useProduct } from '@hooks/useProduct'
import { useAuth } from '@hooks/useAuth'

import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import { Feather } from '@expo/vector-icons'

import { AdDetails } from '@components/AdDetails'
import { RNSwiper } from '@components/RNSwiper'
import { Loading } from '@components/Loading'
import { Header } from '@components/Header'
import { Button } from '@components/Button'

type RouteParams = {
  productId: string
  product: ProductDetails
}

export function MyAdDetails() {
  const [loading, setLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const navigation = useNavigation<AppTabsNavigationRoutesProps>()
  const route = useRoute()
  const { productId } = route.params as RouteParams

  const { authToken } = useAuth()
  const { products, saveProductInStorage, removeProductFromStorage } =
    useProduct()

  const toast = useToast()

  function handleGoBack() {
    navigation.navigate('my-ads')
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

  async function handleDisableAd() {
    setLoading(true)
    try {
      await api.patch(`products/${productId}`, { is_active: false })
      currentProduct.is_active = false

      const foundProduct = products.find(product => product.id === productId)

      if (foundProduct) {
        const updatedProduct = { ...foundProduct, is_active: false }
        saveProductInStorage(updatedProduct)
      }

      toast.show({
        title: 'Anúncio desativado!',
        placement: 'top',
        bgColor: 'green.500'
      })
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
      currentProduct.is_active = true

      const foundProduct = products.find(product => product.id === productId)

      if (foundProduct) {
        const updatedProduct = { ...foundProduct, is_active: true }
        saveProductInStorage(updatedProduct)
      }

      toast.show({
        title: 'Anúncio reativado!',
        placement: 'top',
        bgColor: 'green.500'
      })
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
      await api.delete(`/products/${productId}`)
      removeProductFromStorage(productId)

      toast.show({
        title: 'Anúncio removido com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigation.navigate('my-ads')
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
    }, [authToken])
  )

  if (!currentProduct.id) {
    return <Loading />
  }

  return (
    <>
      <Box px={6} pt={12} pb={3}>
        <Header onPressBackButton={handleGoBack} hasIcon />
      </Box>
      <ScrollView>
        {loading ? (
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

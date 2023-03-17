import { useState, useCallback } from 'react'
import { Box, ScrollView, useToast, VStack } from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'
import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'
import { AppStackNavigationRoutesProps } from '@routes/appStack.routes'

import { Feather } from '@expo/vector-icons'

import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ProductDetails } from '@dtos/productResponseDTO'

import { Header } from '@components/Header'
import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { RNSwiper } from '@components/RNSwiper'
import { AdDetails } from '@components/AdDetails'

type RouteParams = {
  productId: string
}

export function MyAdDetails() {
  const [loading, setLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const navigation = useNavigation<AppTabsNavigationRoutesProps>()
  const stackNavigation = useNavigation<AppStackNavigationRoutesProps>()
  const route = useRoute()
  const { productId } = route.params as RouteParams

  const { refreshedToken } = useAuth()
  const { removeProductFromStorage, editProductInStorage } = useProduct()

  const toast = useToast()

  function handleGoBack() {
    navigation.navigate('my-ads')
  }

  function handleGoEdit() {
    stackNavigation.navigate('edit', { id: productId })
  }

  async function handleDisableAd() {
    setLoading(true)
    try {
      await api.patch(`products/${productId}`, { is_active: false })

      currentProduct.is_active = false

      editProductInStorage(productId, false)

      toast.show({
        title: 'Anúncio desativado!',
        placement: 'top',
        bgColor: 'blue.500'
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

      editProductInStorage(productId, true)

      toast.show({
        title: 'Anúncio reativado!',
        placement: 'top',
        bgColor: 'blue.500'
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
        bgColor: 'blue.500'
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
    }, [refreshedToken])
  )

  if (!currentProduct.id) {
    return <Loading />
  }

  return (
    <>
      <Box px={6} pt={12} pb={3}>
        <Header
          hasIcon
          onPressBackButton={handleGoBack}
          onPressEditButton={handleGoEdit}
        />
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

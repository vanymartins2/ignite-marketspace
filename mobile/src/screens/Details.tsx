import { useState, useCallback } from 'react'
import { Linking } from 'react-native'

import { Box, HStack, Text, ScrollView, useToast, Center } from 'native-base'

import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'

import { FontAwesome } from '@expo/vector-icons'

import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import { ProductDetails } from '@dtos/productResponseDTO'

import { AdDetails } from '@components/AdDetails'
import { RNSwiper } from '@components/RNSwiper'
import { Loading } from '@components/Loading'
import { Header } from '@components/Header'
import { Button } from '@components/Button'

type RouteParams = {
  id: string
}

export function Details() {
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const toast = useToast()

  const route = useRoute()
  const { id } = route.params as RouteParams
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchAdDetails() {
    setLoading(true)
    try {
      const response = await api.get(`/products/${id}`)
      setSelectedProduct(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível filtrar os produtos.'

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
    }, [id])
  )

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Box px={6} pt={12} pb={3}>
        <Header onPressBackButton={handleGoBack} />
      </Box>

      {!selectedProduct.id ? (
        <Center flex={1}>
          <Text fontSize="sm" fontFamily="body" color="gray.400">
            Produto não encontrado
          </Text>
        </Center>
      ) : (
        <>
          <Box minH={280}>
            <RNSwiper
              data={selectedProduct.product_images}
              disabledAd={!selectedProduct.is_active}
            />
          </Box>

          <ScrollView py={5} px={6}>
            <AdDetails data={selectedProduct} />
          </ScrollView>

          <HStack px={6} pt={5} pb={7} bgColor="gray.700">
            <HStack flex={1} alignItems="center">
              <Text color="blue.700" fontSize="sm" fontFamily="heading" mr={1}>
                R$
              </Text>
              <Text color="blue.700" fontSize="xl" fontFamily="heading">
                {(selectedProduct.price / 100).toFixed(2).replace('.', ',')}
              </Text>
            </HStack>

            <Button
              flex={1}
              title="Entrar em contato"
              hasIcon
              iconType={FontAwesome}
              iconName="whatsapp"
              onPress={() =>
                Linking.openURL(`https://wa.me/${selectedProduct.user.tel}`)
              }
            />
          </HStack>
        </>
      )}
    </>
  )
}

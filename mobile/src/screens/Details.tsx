import { useState, useCallback } from 'react'
import { Linking } from 'react-native'
import { Box, HStack, Text, ScrollView } from 'native-base'
import {
  useNavigation,
  useRoute,
  useFocusEffect
} from '@react-navigation/native'

import { FontAwesome } from '@expo/vector-icons'

import { useProduct } from '@hooks/useProduct'
import { ProductDetails } from '@dtos/productResponseDTO'

import { AdDetails } from '@components/AdDetails'
import { RNSwiper } from '@components/RNSwiper'
import { Button } from '@components/Button'
import { Header } from '@components/Header'

type RouteParams = {
  id: string
}

export function Details() {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails>(
    {} as ProductDetails
  )

  const { products } = useProduct()

  const route = useRoute()
  const { id } = route.params as RouteParams
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  function fetchAdDetails() {
    const foundAd = products.find(product => id === product.id)

    if (!foundAd) {
      return
    }

    setSelectedProduct(foundAd)
  }

  useFocusEffect(
    useCallback(() => {
      fetchAdDetails()
    }, [id])
  )

  return (
    <>
      <Box px={6} pt={12} pb={3}>
        <Header onPressBackButton={handleGoBack} />
      </Box>

      <Box minH={280}>
        <RNSwiper data={selectedProduct.product_images} />
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
  )
}

import { useState, useCallback } from 'react'
import {
  Box,
  FlatList,
  HStack,
  Icon,
  Pressable,
  Select,
  Text,
  useToast,
  VStack
} from 'native-base'

import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { AppStackNavigationRoutesProps } from '@routes/appStack.routes'

import { AntDesign, Feather } from '@expo/vector-icons'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ProductDetails } from '@dtos/productResponseDTO'

import { useAuth } from '@hooks/useAuth'

import { AdCard } from '@components/AdCard'
import { Loading } from '@components/Loading'

export function Ads() {
  const [isLoading, setIsLoading] = useState(false)
  const [ads, setAds] = useState<ProductDetails[]>([] as ProductDetails[])

  const { refreshedToken } = useAuth()

  const navigation = useNavigation<AppStackNavigationRoutesProps>()
  const toast = useToast()

  function handleNewAd() {
    navigation.navigate('new')
  }

  function handleOpenDetails(id: string) {
    navigation.navigate('my-ad-details', { productId: id })
  }

  async function fetchAdsFromLoggedUser() {
    setIsLoading(true)

    try {
      const response = await api.get('users/products')

      setAds(response.data)
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
      fetchAdsFromLoggedUser()
    }, [refreshedToken])
  )

  return (
    <VStack flex={1} py={12} px={8}>
      <HStack alignItems="center" justifyContent="center" mb={8}>
        <Text fontSize="lg" fontFamily="heading" color="gray.100">
          Meus anúncios
        </Text>

        <Pressable position="absolute" right={0} onPress={handleNewAd}>
          <Icon as={AntDesign} name="plus" color="gray.100" size={6} />
        </Pressable>
      </HStack>

      <HStack alignItems="center" justifyContent="space-between" mb={5}>
        <Text fontSize="sm" fontFamily="body" color="gray.200">
          {ads.length} anúncios
        </Text>

        <Select
          w={32}
          h={10}
          color="gray.100"
          fontSize="sm"
          fontFamily="body"
          selectedValue="all"
          dropdownIcon={
            <Icon as={Feather} name="chevron-down" size={4} mr={2} />
          }
          dropdownOpenIcon={
            <Icon as={Feather} name="chevron-up" size={4} mr={2} />
          }
        >
          <Select.Item label="Todos" value="all" />
          <Select.Item label="Ativos" value="active" />
          <Select.Item label="Inativos" value="inactive" />
        </Select>
      </HStack>

      {ads.length === 0 && (
        <Box flex={1} justifyContent="center">
          <Text textAlign="center" color="gray.400">
            Você ainda não possui anúncios criados.
          </Text>
        </Box>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={ads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AdCard
              item={item}
              hasUserPhoto={false}
              is_active={item.is_active}
              onPress={() => handleOpenDetails(item.id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ flexShrink: 1 }}
          _contentContainerStyle={{
            paddingBottom: 270
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  )
}

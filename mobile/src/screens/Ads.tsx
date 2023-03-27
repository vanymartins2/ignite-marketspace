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

import { ProductDetails } from '@dtos/productResponseDTO'
import { AppError } from '@utils/AppError'

import { useProduct } from '@hooks/useProduct'
import { useAuth } from '@hooks/useAuth'

import { Loading } from '@components/Loading'
import { AdCard } from '@components/AdCard'

export function Ads() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [filteredAds, setFilteredAds] = useState<ProductDetails[]>([])

  const { refreshedToken } = useAuth()
  const { loadProductsFromUser, userProducts } = useProduct()

  const toast = useToast()
  const navigation = useNavigation<AppStackNavigationRoutesProps>()

  function handleNewAd() {
    navigation.navigate('new', { id: undefined })
  }

  function handleOpenDetails(id: string) {
    navigation.navigate('my-ad-details', { productId: id })
  }

  function handleFilterAds(value: string) {
    setSelectedFilter(value)

    switch (value) {
      case 'all':
        const all = userProducts
        setFilteredAds(all)
        break
      case 'active':
        const activeAds = userProducts.filter(ad => ad.is_active)
        setFilteredAds(activeAds)
        break
      case 'inactive':
        const inactiveAds = userProducts.filter(ad => ad.is_active === false)
        setFilteredAds(inactiveAds)
        break
    }
  }

  function fetchAdsFromLoggedUser() {
    setIsLoading(true)
    try {
      loadProductsFromUser()
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os anúncios do usuário.'

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
          {userProducts.length} anúncios
        </Text>

        <Select
          w={32}
          h={10}
          color="gray.100"
          fontSize="sm"
          fontFamily="body"
          selectedValue={selectedFilter}
          dropdownIcon={
            <Icon as={Feather} name="chevron-down" size={4} mr={2} />
          }
          dropdownOpenIcon={
            <Icon as={Feather} name="chevron-up" size={4} mr={2} />
          }
          onValueChange={value => handleFilterAds(value)}
        >
          <Select.Item label="Todos" value="all" />
          <Select.Item label="Ativos" value="active" />
          <Select.Item label="Inativos" value="inactive" />
        </Select>
      </HStack>

      {userProducts.length === 0 && (
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
          data={selectedFilter !== 'all' ? filteredAds : userProducts}
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

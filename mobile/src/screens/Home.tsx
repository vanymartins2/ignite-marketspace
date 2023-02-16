import { useEffect } from 'react'
import {
  FlatList,
  HStack,
  Icon,
  Pressable,
  Text,
  useDisclose,
  VStack
} from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'
import { AppStackNavigationRoutesProps } from '@routes/appStack.routes'

import { useAuth } from '@hooks/useAuth'
import { useProduct } from '@hooks/useProduct'

import { api } from '@services/api'

import { AntDesign, Feather } from '@expo/vector-icons'

import userDefaultPhoto from '@assets/userDefault.png'

import { UserPhoto } from '@components/UserPhoto'
import { Filter } from '@components/Filter'
import { AdCard } from '@components/AdCard'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ProductDetails } from '@dtos/productResponseDTO'

export function Home() {
  const { isOpen, onOpen, onClose } = useDisclose()
  const navigation = useNavigation<AppStackNavigationRoutesProps>()
  const tabNavigation = useNavigation<AppTabsNavigationRoutesProps>()

  const { user } = useAuth()
  const { products, loadProductFromStorage } = useProduct()

  const nameWithoutSurname = user.name.split(' ')[0]

  function handleOpenNewAd() {
    navigation.navigate('new')
  }

  function handleOpenMyAds() {
    tabNavigation.navigate('my-ads')
  }

  function handleOpenDetails(id: string) {
    navigation.navigate('details', { id })
  }

  useEffect(() => {
    loadProductFromStorage()
  }, [])

  return (
    <VStack flex={1} py={12} px={8}>
      <HStack>
        <UserPhoto
          source={
            user.avatar
              ? {
                  uri: `${api.defaults.baseURL}/images/${user.avatar}`
                }
              : userDefaultPhoto
          }
          size={12}
          alt="Foto do usuário"
        />

        <VStack flex={1} ml={3}>
          <Text fontSize="md" fontFamily="body" color="gray.100">
            Boas vindas,
          </Text>
          <Text fontSize="md" fontFamily="heading" color="gray.100">
            {nameWithoutSurname}
          </Text>
        </VStack>

        <Button
          title="Criar anúncio"
          variant="black"
          w="auto"
          leftIcon={<Icon as={AntDesign} name="plus" />}
          onPress={handleOpenNewAd}
        />
      </HStack>

      <VStack mt={8} mb={3}>
        <Text fontSize="sm" fontFamily="body" color="gray.300">
          Seus produtos anunciados para venda
        </Text>

        <Pressable onPress={handleOpenMyAds}>
          <HStack
            mt={3}
            mb={8}
            px={3}
            pt={5}
            pb={4}
            bgColor="#647AC71A"
            borderRadius="md"
            alignItems="center"
          >
            <Icon as={Feather} name="tag" color="blue.700" size={5} />

            <VStack ml={4} flex={1}>
              <Text fontSize="lg" fontFamily="heading" color="gray.200">
                {products.filter(product => product.is_active).length}
              </Text>
              <Text fontSize="xs" fontFamily="body" color="gray.200">
                anúncios ativos
              </Text>
            </VStack>

            <HStack alignItems="center">
              <Text mr={3} fontSize="xs" fontFamily="heading" color="blue.700">
                Meus anúncios
              </Text>
              <Icon
                as={AntDesign}
                name="arrowright"
                color="blue.700"
                size={4}
              />
            </HStack>
          </HStack>
        </Pressable>

        <VStack>
          <Text fontSize="sm" fontFamily="body" color="gray.300" mb={3}>
            Compre produtos variados
          </Text>

          <Input
            placeholder="Buscar anúncio"
            InputRightElement={
              <>
                <Pressable borderRightWidth={1} borderRightColor="gray.400">
                  <Icon
                    as={Feather}
                    name="search"
                    size={5}
                    color="gray.300"
                    mx={3}
                  />
                </Pressable>

                <Pressable mx={3} onPress={onOpen}>
                  <Icon as={Feather} name="sliders" size={5} color="gray.300" />
                </Pressable>
              </>
            }
          />

          <Filter isOpen={isOpen} onClose={onClose} />
        </VStack>

        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AdCard item={item} onPress={() => handleOpenDetails(item.id)} />
          )}
          numColumns={2}
          columnWrapperStyle={{ flexShrink: 1 }}
          _contentContainerStyle={{
            paddingBottom: 270
          }}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </VStack>
  )
}

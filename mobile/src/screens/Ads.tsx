import { useState } from 'react'
import {
  FlatList,
  HStack,
  Icon,
  Pressable,
  Select,
  Text,
  VStack
} from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AntDesign, Feather } from '@expo/vector-icons'

import { AppStackNavigationRoutesProps } from '@routes/appStack.routes'

import { AdCard } from '@components/AdCard'

export function Ads() {
  const [ads, setAds] = useState(['Bicicleta', 'Sofá', 'Tênis', 'Roupa'])

  const navigation = useNavigation<AppStackNavigationRoutesProps>()

  function handleNewAd() {
    navigation.navigate('new')
  }

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
          9 anúncios
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

      <FlatList
        data={ads}
        keyExtractor={item => item}
        renderItem={() => <AdCard />}
        numColumns={2}
        columnWrapperStyle={{ flexShrink: 1 }}
        _contentContainerStyle={{
          paddingBottom: 270
        }}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}

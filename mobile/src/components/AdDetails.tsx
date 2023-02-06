import { HStack, VStack, Text } from 'native-base'

import { api } from '@services/api'
import { ProductDetails } from '@dtos/productResponseDTO'

import userDefaultPhoto from '@assets/userDefault.png'

import { UserPhoto } from '@components/UserPhoto'
import { Payment } from '@components/Payment'
import { Badge } from '@components/Badge'

type Props = {
  data: ProductDetails
}

export function AdDetails({ data }: Props) {
  const {
    user,
    is_new,
    name,
    price,
    description,
    accept_trade,
    payment_methods
  } = data

  return (
    <>
      <HStack mb={6}>
        <UserPhoto
          source={
            user.avatar
              ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
              : userDefaultPhoto
          }
          size={6}
          borderSize={2}
          alt="Foto do usuário"
        />
        <Text ml={2} color="gray.100" fontSize="sm" fontFamily="body">
          {user.name}
        </Text>
      </HStack>

      <Badge title={is_new ? 'novo' : 'usado'} mb={2} />

      <HStack justifyContent="space-between" mb={2}>
        <Text color="gray.100" fontSize="lg" fontFamily="heading">
          {name}
        </Text>

        <Text color="blue.500" fontSize="lg" fontFamily="heading">
          <Text fontSize="sm">R$ </Text>
          {(price / 100).toFixed(2).replace('.', ',')}
        </Text>
      </HStack>

      <Text color="gray.200" fontSize="sm" fontFamily="body" mb={6}>
        {description}
      </Text>

      <HStack mb={3}>
        <Text mr={2} color="gray.200" fontSize="sm" fontFamily="heading">
          Aceita troca?
        </Text>
        <Text color="gray.200" fontSize="sm" fontFamily="body">
          {accept_trade ? 'Sim' : 'Não'}
        </Text>
      </HStack>

      <VStack pb={8}>
        <Text mb={2} color="gray.200" fontSize="sm" fontFamily="heading">
          Meios de pagamento:
        </Text>

        {payment_methods.map(item => (
          <Payment key={item.key} name={item.name} value={item.key} />
        ))}
      </VStack>
    </>
  )
}

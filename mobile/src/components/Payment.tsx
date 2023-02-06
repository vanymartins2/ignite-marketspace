import { HStack, Icon, Text } from 'native-base'

import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  name: string
  value: string
}

export function Payment({ name, value }: Props) {
  return (
    <HStack alignItems="center">
      <Icon
        as={MaterialCommunityIcons}
        name={
          value === 'pix'
            ? 'qrcode'
            : value === 'card'
            ? 'credit-card-outline'
            : value === 'boleto'
            ? 'barcode'
            : value === 'cash'
            ? 'cash'
            : value === 'deposit'
            ? 'bank'
            : ''
        }
        size={4}
        opacity={0.8}
      />
      <Text ml={2} color="gray.200" fontSize="sm" fontFamily="body">
        {name}
      </Text>
    </HStack>
  )
}

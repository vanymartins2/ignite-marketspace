import { HStack, Icon, Pressable, Text, IPressableProps } from 'native-base'

import { Octicons } from '@expo/vector-icons'

type Props = IPressableProps & {
  color?: string
  value: string
  isActive: boolean
}

export function Tag({ color, value, isActive, ...rest }: Props) {
  return (
    <Pressable
      bg={color ? color : 'gray.500'}
      rounded="2xl"
      w={20}
      px={3}
      py={1}
      isPressed={isActive}
      _pressed={{
        backgroundColor: 'blue.500'
      }}
      {...rest}
    >
      <HStack alignItems="center" justifyContent="center">
        <Text
          mr={1}
          fontSize="xs"
          fontFamily="heading"
          textTransform="uppercase"
          color={isActive ? 'white' : 'gray.300'}
        >
          {value}
        </Text>

        {isActive && (
          <Icon as={Octicons} name="x-circle-fill" size={4} color="gray.600" />
        )}
      </HStack>
    </Pressable>
  )
}

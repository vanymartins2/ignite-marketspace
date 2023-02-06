import { Icon, IPressableProps, Pressable } from 'native-base'

import { AntDesign } from '@expo/vector-icons'

export function BackButton({ ...rest }: IPressableProps) {
  return (
    <Pressable {...rest}>
      <Icon as={AntDesign} name="arrowleft" size={6} color="gray.100" />
    </Pressable>
  )
}

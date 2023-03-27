import { Pressable, Image, Icon, IPressableProps } from 'native-base'

import { AntDesign } from '@expo/vector-icons'
import { api } from '@services/api'

type Props = IPressableProps & {
  uri?: string
  hasImage?: boolean
  onRemove?: () => void
}

export function PickerImg({ uri, hasImage = false, onRemove, ...rest }: Props) {
  return (
    <>
      {hasImage ? (
        <Pressable mr={2} borderRadius="md" overflow="hidden" {...rest}>
          <Image
            source={{ uri: uri }}
            w={24}
            h={24}
            alt="Foto selecionada do produto"
          />

          <Pressable
            mt={1}
            mr={1}
            position="absolute"
            right={0}
            onPress={onRemove}
          >
            <Icon
              as={AntDesign}
              name="closecircle"
              size={6}
              color="gray.200"
              bgColor="gray.600"
              rounded="full"
            />
          </Pressable>
        </Pressable>
      ) : (
        <Pressable
          bgColor="gray.500"
          w={24}
          h={24}
          borderRadius="md"
          justifyContent="center"
          alignItems="center"
          {...rest}
        >
          <Icon as={AntDesign} name="plus" size={6} color="gray.400" />
        </Pressable>
      )}
    </>
  )
}

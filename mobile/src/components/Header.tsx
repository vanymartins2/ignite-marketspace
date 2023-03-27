import { TouchableOpacity } from 'react-native'
import { HStack, Icon, Text } from 'native-base'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { BackButton } from '@components/BackButton'

type Props = {
  title?: string
  hasIcon?: boolean
  onPressEditButton?: () => void
  onPressBackButton: () => void
}

export function Header({
  title,
  hasIcon = false,
  onPressEditButton,
  onPressBackButton
}: Props) {
  return (
    <HStack
      justifyContent={!hasIcon ? 'center' : 'space-between'}
      alignItems="center"
    >
      <BackButton position="absolute" left={0} onPress={onPressBackButton} />

      {hasIcon ? (
        <TouchableOpacity onPress={onPressEditButton}>
          <Icon
            as={MaterialCommunityIcons}
            name="pencil-outline"
            size={6}
            color="gray.100"
          />
        </TouchableOpacity>
      ) : (
        <Text color="gray.100" fontSize="lg" fontFamily="heading">
          {title}
        </Text>
      )}
    </HStack>
  )
}

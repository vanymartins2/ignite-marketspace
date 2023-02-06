import { Badge as NativeBaseBadge, IBadgeProps } from 'native-base'

type Props = IBadgeProps & {
  title: string
}

export function Badge({ title }: Props) {
  return (
    <NativeBaseBadge
      bgColor="gray.500"
      borderRadius="2xl"
      w={16}
      mb={2}
      _text={{
        fontSize: 'xs',
        fontFamily: 'heading',
        color: 'gray.200',
        textTransform: 'uppercase'
      }}
    >
      {title}
    </NativeBaseBadge>
  )
}

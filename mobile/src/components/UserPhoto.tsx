import { Image, IImageProps } from 'native-base'

type Props = IImageProps & {
  size: number
  borderSize?: number
  color?: string
}

export function UserPhoto({ size, borderSize, color, ...rest }: Props) {
  return (
    <Image
      w={size}
      h={size}
      rounded="full"
      borderWidth={borderSize ? borderSize : 3}
      borderColor={color ? color : 'blue.500'}
      {...rest}
    />
  )
}

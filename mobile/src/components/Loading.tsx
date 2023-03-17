import { Spinner, Center, ICenterProps } from 'native-base'

type Props = ICenterProps & {}

export function Loading({ ...rest }: Props) {
  return (
    <Center flex={1} bg="gray.600" {...rest}>
      <Spinner color="blue.700" />
    </Center>
  )
}

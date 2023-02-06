import {
  FormControl,
  IRadioProps,
  Radio as NativeBaseRadio,
  Text
} from 'native-base'

type Props = IRadioProps & {
  value: string
  title: string
}

export function Radio({ value, title, ...rest }: Props) {
  return (
    <NativeBaseRadio
      bgColor="gray.600"
      _checked={{ borderColor: 'blue.500' }}
      _icon={{ color: 'blue.500' }}
      _invalid={{ borderColor: 'red.500' }}
      value={value}
      {...rest}
    >
      <Text color="gray.200" fontSize="md" fontFamily="body">
        {title}
      </Text>
    </NativeBaseRadio>
  )
}

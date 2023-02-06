import {
  Checkbox as NativeBaseCheckbox,
  ICheckboxProps,
  Text
} from 'native-base'

type Props = ICheckboxProps & {
  value: string
  label: string
}

export function Checkbox({ value, label, ...rest }: Props) {
  return (
    <NativeBaseCheckbox
      value={value}
      mb={2}
      size="md"
      bgColor="gray.600"
      _checked={{
        bg: 'blue.500',
        borderColor: 'blue.500'
      }}
      _invalid={{
        borderColor: 'red.500'
      }}
      {...rest}
    >
      <Text
        fontSize="md"
        fontFamily="body"
        color="gray.200"
        textTransform="capitalize"
      >
        {label}
      </Text>
    </NativeBaseCheckbox>
  )
}

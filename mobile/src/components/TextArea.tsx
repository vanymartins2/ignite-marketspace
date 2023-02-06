import {
  FormControl,
  ITextAreaProps,
  TextArea as NativeBaseTextArea
} from 'native-base'

type Props = ITextAreaProps & {
  errorMessage?: string | null
}

export function TextArea({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl>
      <NativeBaseTextArea
        bg="gray.700"
        h={40}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="gray.200"
        fontFamily="body"
        autoCompleteType="text"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500'
        }}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'gray.300'
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}

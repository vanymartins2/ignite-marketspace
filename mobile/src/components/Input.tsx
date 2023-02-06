import { useState } from 'react'
import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
  Pressable,
  Icon
} from 'native-base'

import { Ionicons } from '@expo/vector-icons'

type Props = IInputProps & {
  errorMessage?: string | null
  isPassword?: boolean
}

export function Input({
  errorMessage = null,
  isPassword,
  isInvalid,
  ...rest
}: Props) {
  const [show, setShow] = useState(false)

  const invalid = !!errorMessage || isInvalid

  const ShowPasswordButton = () => {
    return (
      <Pressable onPress={() => setShow(!show)}>
        <Icon
          as={Ionicons}
          name={show ? 'eye-off' : 'eye-outline'}
          size={5}
          mr={4}
          color="gray.300"
        />
      </Pressable>
    )
  }

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={12}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="gray.200"
        fontFamily="body"
        placeholderTextColor="gray.400"
        isInvalid={invalid}
        type={isPassword && !show ? 'password' : 'text'}
        InputRightElement={isPassword ? <ShowPasswordButton /> : undefined}
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

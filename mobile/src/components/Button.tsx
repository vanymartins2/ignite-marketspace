import React from 'react'

import {
  Button as NativeBaseButton,
  IButtonProps,
  Icon,
  Text
} from 'native-base'

type Props = IButtonProps & {
  title: string
  hasIcon?: boolean
  iconType?: typeof React.Component
  iconName?: string
  variant?: 'black' | 'blue' | 'gray'
}

export function Button({
  title,
  hasIcon = false,
  iconType,
  iconName,
  variant = 'blue',
  ...rest
}: Props) {
  return (
    <NativeBaseButton
      w="full"
      h={12}
      bgColor={
        variant === 'blue'
          ? 'blue.500'
          : variant === 'black'
          ? 'gray.100'
          : 'gray.500'
      }
      leftIcon={
        hasIcon ? (
          <Icon
            as={iconType}
            name={iconName}
            size={4}
            color={
              variant === 'blue'
                ? 'gray.600'
                : variant === 'black'
                ? 'gray.600'
                : 'gray.300'
            }
          />
        ) : undefined
      }
      _pressed={{ opacity: 0.5 }}
      {...rest}
    >
      <Text
        color={variant === 'gray' ? 'gray.200' : 'gray.700'}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}

import { useState } from 'react'
import {
  Actionsheet,
  Box,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  VStack,
  Checkbox as NativeBaseCheckbox,
  FlatList
} from 'native-base'

import { AntDesign } from '@expo/vector-icons'

import { Tag } from '@components/Tag'
import { Button } from '@components/Button'
import { Checkbox } from '@components/Checkbox'

type Props = {
  isOpen: boolean
  onClose: () => any
}

export function Filter({ isOpen, onClose }: Props) {
  const [optionSelected, setOptionSelected] = useState('')
  const [paymentMethods, setPaymentMethods] = useState([
    'boleto',
    'pix',
    'dinheiro',
    'cartão de crédito',
    'depósito bancário'
  ])

  function handleSelected(value: string) {
    setOptionSelected(value)
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} disableOverlay>
      <Actionsheet.Content bgColor="gray.600" pb={6}>
        <Box w="full" h="full" py={6} px={6}>
          <HStack alignItems="center" mb={6}>
            <Text fontSize="lg" fontFamily="heading" color="gray.100" flex={1}>
              Filtrar anúncios
            </Text>

            <Pressable onPress={onClose}>
              <Icon as={AntDesign} name="close" size={6} color="gray.400" />
            </Pressable>
          </HStack>

          <VStack mb={6}>
            <Text fontSize="sm" fontFamily="heading" color="gray.200" mb={3}>
              Condição
            </Text>

            <HStack>
              <Tag
                value="novo"
                isActive={optionSelected === 'novo' ? true : false}
                onPress={() => handleSelected('novo')}
                mr={2}
              />
              <Tag
                value="usado"
                isActive={optionSelected === 'usado' ? true : false}
                onPress={() => handleSelected('usado')}
              />
            </HStack>
          </VStack>

          <VStack alignItems="flex-start" mb={4}>
            <Text fontSize="sm" fontFamily="heading" color="gray.200">
              Aceita troca?
            </Text>
            <Switch
              size="lg"
              onTrackColor="blue.500"
              offTrackColor="gray.500"
            />
          </VStack>

          <Text color="gray.200" fontSize="sm" fontFamily="heading" mb={2}>
            Meios de pagamento aceitos
          </Text>
          {paymentMethods.map(item => (
            <Checkbox key={item} value={item} label={item} />
          ))}

          <HStack mt="auto">
            <Button title="Resetar filtros" flex={1} variant="gray" mr={3} />
            <Button title="Aplicar filtros" flex={1} variant="black" />
          </HStack>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  )
}

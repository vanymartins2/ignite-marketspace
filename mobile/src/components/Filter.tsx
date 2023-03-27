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
  Checkbox as NativeBaseCheckbox
} from 'native-base'

import { AntDesign } from '@expo/vector-icons'

import { useProduct } from '@hooks/useProduct'

import { Checkbox } from '@components/Checkbox'
import { Button } from '@components/Button'
import { Tag } from '@components/Tag'

type Props = {
  isOpen: boolean
  onClose: () => any
}

export function Filter({ isOpen, onClose }: Props) {
  const [productCondition, setProductCondition] = useState('')
  const [trade, setTrade] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])

  const { addFilterOptions, removeFilterOptions, appliedFilterOptions } =
    useProduct()

  function handleSelected(value: string) {
    setProductCondition(value)
  }

  function handleApplyFilter() {
    const data = {
      is_new: productCondition === 'usado' ? false : true,
      accept_trade: trade,
      payment_methods: paymentMethods
    }

    addFilterOptions(data)

    onClose()
  }

  function handleResetFilter() {
    setProductCondition('')
    setTrade(false)
    setPaymentMethods([])

    removeFilterOptions()
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
                isActive={productCondition === 'novo' ? true : false}
                onPress={() => handleSelected('novo')}
                mr={2}
              />
              <Tag
                value="usado"
                isActive={productCondition === 'usado' ? true : false}
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
              isChecked={trade}
              onChange={() => setTrade(!trade)}
            />
          </VStack>

          <Text color="gray.200" fontSize="sm" fontFamily="heading" mb={2}>
            Meios de pagamento aceitos
          </Text>

          <NativeBaseCheckbox.Group
            value={paymentMethods}
            onChange={values => setPaymentMethods(values || [])}
          >
            <Checkbox value="pix" label="Pix" />
            <Checkbox value="card" label="Cartão de crédito" />
            <Checkbox value="boleto" label="Boleto" />
            <Checkbox value="cash" label="Dinheiro" />
            <Checkbox value="deposit" label="Depósito bancário" />
          </NativeBaseCheckbox.Group>

          <HStack mt="auto">
            <Button
              title="Resetar filtros"
              flex={1}
              variant="gray"
              mr={3}
              onPress={handleResetFilter}
            />
            <Button
              title="Aplicar filtros"
              flex={1}
              variant="black"
              onPress={handleApplyFilter}
            />
          </HStack>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  )
}

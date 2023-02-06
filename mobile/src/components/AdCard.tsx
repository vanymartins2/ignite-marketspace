import { Box, HStack, Image, Pressable, Text, VStack } from 'native-base'

import { UserPhoto } from '@components/UserPhoto'

import userImg from '@assets/userDefault.png'
import bicicleImg from '@assets/bicicle.png'

type Props = {
  onPress: () => void
}

export function AdCard({ onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <VStack mr={5} mt={6}>
        <Box>
          <Image
            source={bicicleImg}
            alt="Imagem do anúncio"
            resizeMode="contain"
            borderRadius="md"
          />

          <HStack position="absolute" px={1} py={1}>
            <Box flex={1}>
              <UserPhoto
                source={userImg}
                size={6}
                alt="Foto do usuário"
                borderSize={1}
                color="gray.700"
              />
            </Box>

            <Box bgColor="gray.200" px={4} py={1} borderRadius="2xl">
              <Text fontSize="xs" fontFamily="heading" color="white">
                NOVO
              </Text>
            </Box>
          </HStack>
        </Box>

        <Text fontSize="sm" fontFamily="body" color="gray.200">
          Bicicleta
        </Text>

        <HStack alignItems="center">
          <Text fontSize="xs" fontFamily="heading" color="gray.100" mr={1}>
            R$
          </Text>
          <Text fontSize="md" fontFamily="heading" color="gray.100">
            59,90
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  )
}

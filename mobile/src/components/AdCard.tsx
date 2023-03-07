import {
  Box,
  HStack,
  Image,
  IPressableProps,
  Pressable,
  Text,
  VStack,
  useTheme
} from 'native-base'

import { ProductDetails } from '@dtos/productResponseDTO'

import userImg from '@assets/userDefault.png'
import bicicleImg from '@assets/bicicle.png'

import { UserPhoto } from '@components/UserPhoto'
import { api } from '@services/api'

type Props = IPressableProps & {
  item: ProductDetails
  hasUserPhoto?: boolean
  is_active?: boolean
}

export function AdCard({
  item,
  hasUserPhoto = true,
  is_active = true,
  ...rest
}: Props) {
  const { colors } = useTheme()
  return (
    <Pressable {...rest}>
      <VStack mr={5} mt={6}>
        <Box flexShrink={1}>
          <Image
            source={{
              uri: `${api.defaults.baseURL}/images/${item.product_images[0].path}`
            }}
            width={153}
            height={100}
            alt="Imagem do anúncio"
            resizeMode="contain"
            borderRadius="md"
            opacity={!is_active ? 0.45 : 1}
            bgColor={!is_active ? 'gray.100' : undefined}
          />

          {!is_active && (
            <Text
              color="gray.700"
              fontSize="xs"
              fontFamily="heading"
              textTransform="uppercase"
              position="absolute"
              bottom={0}
              px={2}
              py={2}
            >
              Anúncio desativado
            </Text>
          )}

          <HStack position="absolute" px={1} py={1}>
            <Box flex={1}>
              {hasUserPhoto && (
                <UserPhoto
                  source={
                    !item.user.avatar
                      ? userImg
                      : {
                          uri: `${api.defaults.baseURL}/images/${item.user.avatar}`
                        }
                  }
                  size={6}
                  alt="Foto do usuário"
                  borderSize={1}
                  color="gray.700"
                />
              )}
            </Box>

            <Box
              bgColor={item.is_new ? 'blue.700' : 'gray.200'}
              px={4}
              py={1}
              borderRadius="2xl"
              opacity={!is_active ? 0.45 : 1}
            >
              <Text
                fontSize="xs"
                fontFamily="heading"
                color="white"
                textTransform="uppercase"
              >
                {item.is_new ? 'novo' : 'usado'}
              </Text>
            </Box>
          </HStack>
        </Box>

        <Box opacity={!is_active ? 0.45 : 1}>
          <Text
            fontSize="sm"
            fontFamily="body"
            color={is_active ? 'gray.200' : 'gray.400'}
          >
            {item?.name}
          </Text>

          <HStack alignItems="center">
            <Text
              fontSize="xs"
              fontFamily="heading"
              color={is_active ? 'gray.100' : 'gray.400'}
              mr={1}
            >
              R$
            </Text>
            <Text
              fontSize="md"
              fontFamily="heading"
              color={is_active ? 'gray.100' : 'gray.400'}
            >
              {(item?.price / 100).toFixed(2).replace('.', ',')}
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Pressable>
  )
}

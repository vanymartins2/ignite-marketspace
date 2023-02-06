import { api } from '@services/api'
import { Box, FlatList, Image, Text } from 'native-base'
import { Dimensions } from 'react-native'

type Props = {
  data: {
    path: string
    id: string
  }[]
  disabledAd?: boolean
}

export function Swiper({ data, disabledAd = false }: Props) {
  const dimensions = Dimensions.get('window')
  const imageWidth = dimensions.width

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Image
            source={{
              uri: `${api.defaults.baseURL}/images/${item.path}`
            }}
            w={imageWidth}
            h={72}
            resizeMode="cover"
            opacity={disabledAd ? 0.6 : 1}
            bgColor={disabledAd ? 'gray.100' : undefined}
            alt="Foto do produto anunciado"
          />
          {disabledAd && (
            <Text
              color="gray.700"
              fontSize="sm"
              fontFamily="heading"
              textTransform="uppercase"
              position="absolute"
            >
              Anúncio desativado
            </Text>
          )}
        </Box>
      )}
      horizontal
    />
  )
}

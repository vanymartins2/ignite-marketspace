import { Dimensions } from 'react-native'
import { Box, Image, Text, useTheme } from 'native-base'

import Swiper from 'react-native-swiper'

import { api } from '@services/api'

type Props = {
  data: {
    path: string
    id: string
  }[]
  disabledAd?: boolean
}

export function RNSwiper({ data, disabledAd = false }: Props) {
  const dimensions = Dimensions.get('window')
  const imageWidth = dimensions.width

  const { colors } = useTheme()

  return (
    <Swiper
      containerStyle={{ height: 280 }}
      paginationStyle={{ position: 'absolute', bottom: 0 }}
      activeDotStyle={{
        flex: 1,
        height: 3,
        backgroundColor: colors.gray[700],
        opacity: 0.75
      }}
      dotStyle={{
        flex: 1,
        height: 3,
        backgroundColor: colors.gray[700],
        opacity: 0.5
      }}
    >
      {data.map(item => (
        <Box key={item.id} flex={1} justifyContent="center" alignItems="center">
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
      ))}
    </Swiper>
  )
}

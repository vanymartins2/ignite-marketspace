import { LogBox, StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'

import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold
} from '@expo-google-fonts/karla'

import { Routes } from '@routes/index'

import { AuthContextProvider } from '@contexts/AuthContext'
import { ProductContextProvider } from '@contexts/ProductContext'

import { THEME } from './src/theme'
import { Loading } from '@components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold })

  LogBox.ignoreLogs(['We can not support a function callback.'])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        <ProductContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </ProductContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}

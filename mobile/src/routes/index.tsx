import { Box, useTheme } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth'

import { AuthRoutes } from '@routes/auth.routes'
import { AppStackRoutes } from '@routes/appStack.routes'

import { Loading } from '@components/Loading'

export function Routes() {
  const { colors } = useTheme()
  const { user, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[600]

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.600">
      <NavigationContainer theme={theme}>
        {user.id ? <AppStackRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}

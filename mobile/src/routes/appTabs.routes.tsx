import { Platform } from 'react-native'
import { Icon, Pressable, useTheme } from 'native-base'

import {
  createBottomTabNavigator,
  BottomTabNavigationProp
} from '@react-navigation/bottom-tabs'

import { Octicons, Feather, MaterialIcons } from '@expo/vector-icons'

import { Ads } from '@screens/Ads'
import { Home } from '@screens/Home'
import { LogOut } from '@screens/LogOut'
import { useAuth } from '@hooks/useAuth'

type AppTabsRoutes = {
  'home-tabs': undefined
  'my-ads': undefined
  logout: undefined
}

export type AppTabsNavigationRoutesProps =
  BottomTabNavigationProp<AppTabsRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppTabsRoutes>()

export function AppTabsRoutes() {
  const { sizes, colors } = useTheme()

  const { signOut } = useAuth()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[200],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[700],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 72,
          paddingTop: sizes[7],
          paddingBottom: sizes[7]
        }
      }}
    >
      <Screen
        name="home-tabs"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Octicons} name="home" size={6} color={color} />
          )
        }}
      />

      <Screen
        name="my-ads"
        component={Ads}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="tag" size={6} color={color} />
          )
        }}
      />

      <Screen
        name="logout"
        component={LogOut}
        options={{
          tabBarIcon: () => (
            <Icon
              as={MaterialIcons}
              name="logout"
              size={6}
              color={colors.red[500]}
              onPress={signOut}
            />
          )
        }}
      />
    </Navigator>
  )
}

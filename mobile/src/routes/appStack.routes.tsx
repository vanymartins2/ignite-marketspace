import {
  createNativeStackNavigator,
  NativeStackNavigationProp
} from '@react-navigation/native-stack'

import { AppTabsRoutes } from '@routes/appTabs.routes'

import { NewAd } from '@screens/NewAd'
import { EditAd } from '@screens/EditAd'
import { Details } from '@screens/Details'
import { PreviewAd } from '@screens/PreviewAd'
import { MyAdDetails } from '@screens/MyAdDetails'

type AppStackRoutes = {
  home: undefined
  new: { id?: string }
  edit: { id: string }
  details: { id: string }
  preview: { productId: string }
  'my-ad-details': { productId: string }
}

export type AppStackNavigationRoutesProps =
  NativeStackNavigationProp<AppStackRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AppStackRoutes>()

export function AppStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={AppTabsRoutes} />

      <Screen name="new" component={NewAd} />

      <Screen name="edit" component={EditAd} />

      <Screen name="details" component={Details} />

      <Screen name="preview" component={PreviewAd} />

      <Screen name="my-ad-details" component={MyAdDetails} />
    </Navigator>
  )
}

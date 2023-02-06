import {
  createNativeStackNavigator,
  NativeStackNavigationProp
} from '@react-navigation/native-stack'

import { NewAd } from '@screens/NewAd'
import { EditAd } from '@screens/EditAd'
import { Details } from '@screens/Details'
import { PreviewAd } from '@screens/PreviewAd'
import { MyAdDetails } from '@screens/MyAdDetails'
import { AppTabsRoutes } from '@routes/appTabs.routes'
import { ProductDetails } from '@dtos/productResponseDTO'

type AppStackRoutes = {
  home: undefined
  new: undefined
  edit: undefined
  details: undefined
  preview: { productId: string }
  'my-ad-details': {
    productId: string
    product: ProductDetails
  }
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

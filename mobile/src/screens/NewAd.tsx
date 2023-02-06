import { Box, ScrollView } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'

import { Header } from '@components/Header'
import { AddEditForm } from '@components/AddEditForm'

export function NewAd() {
  const defaultValues = {
    name: '',
    description: '',
    is_new: false,
    price: 0,
    accept_trade: false,
    payment_methods: []
  }

  const navigation = useNavigation<AppTabsNavigationRoutesProps>()

  function handleGoBack() {
    navigation.navigate('my-ads')
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box pt={12} pb={6} px={8}>
        <Header title="Criar anúncio" onPressBackButton={handleGoBack} />
      </Box>

      <AddEditForm />
    </ScrollView>
  )
}

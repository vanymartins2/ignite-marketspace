import { Box, ScrollView } from 'native-base'

import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'
import { useNavigation } from '@react-navigation/native'

import { AddEditForm } from '@components/AddEditForm'
import { Header } from '@components/Header'

export function NewAd() {
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

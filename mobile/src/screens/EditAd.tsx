import { Box, ScrollView, Text } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AppTabsNavigationRoutesProps } from '@routes/appTabs.routes'

import { AddEditForm } from '@components/AddEditForm'
import { Header } from '@components/Header'

export function EditAd() {
  const navigation = useNavigation<AppTabsNavigationRoutesProps>()

  function handleGoBack() {
    navigation.navigate('my-ads')
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box pt={12} pb={6} px={8}>
        <Header title="Editar anúncio" onPressBackButton={handleGoBack} />
      </Box>

      <AddEditForm />
    </ScrollView>
  )
}

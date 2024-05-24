import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Page = () => {

  const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View style={styles.container}>
          <Text>Item Details</Text>
        </View>
      )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
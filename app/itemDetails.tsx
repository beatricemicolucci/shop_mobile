import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Page = () => {
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
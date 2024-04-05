import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/authContext'

export default function Home() {
  const {logout, user} = useAuth();

  const handleLogout = async () => {
    await logout();
  }

  console.log('userData: ' , user);

  return (
    <View>
      <Text>Home</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}
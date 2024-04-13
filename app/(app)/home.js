import { View, Text, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import {StatusBar} from 'expo-status-bar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import { getDocs, query, where } from 'firebase/firestore';
import { usersRef } from '../../firebaseConfig';

export default function Home() {
  const {logout, user} = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(user?.userId || user?.uid) getUsers();
  }, [user])
  
  const getUsers = async () => {
    //fetch users
    const q = query(usersRef, where('userId', '!=', user?.userId || user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({...doc.data()});
    });

    setUsers(data);
  }

  // console.log('userData: ' , user);

  return (
    <View className="bg-white flex-1">
      <StatusBar style="light" />
      {
        users.length > 0 ? (
          <ChatList currentUser={user} users={users}/>
        ) : (
          <View className="flex items-center" style={{top:hp(30)}}>
            <Loading size={hp(10)}/>
          </View>
        )
      }
    </View>
  )
}
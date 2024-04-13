import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import {blurhash, getRoomId} from "../utils/common";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ChatItem({ item, index, noBorder, router, currentUser }) {
  const [lastMessage, setLastMessage] = useState(undefined);

  const openChatRoom = () => {
    router.push({pathname: '/chatRoom', params:item});
  };

  useEffect(() => {

    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(docRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      
      });
      setLastMessage(allMessages[0]? allMessages[0] : null);
    });

    return unsub;
  }, []);

  const renderTime = () => { 
    return 'Time'
  }

  const renderLastMessage = () => {
    if (typeof lastMessage === 'undefined') return 'Loading...';
    if (lastMessage){
      if (currentUser?.userId === lastMessage.senderId) return 'You: '+lastMessage?.text;
      return lastMessage?.text;
    } else {
      return 'Say Hi!'
    }
  }

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      style={[noBorder ? {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 16,
        paddingBottom: 8,
        gap: 12,
      } :{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 16,
        paddingBottom: 8,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgb(229 229 229)",
      }]}
    //   className="justify-between mx-4 
    // items-center gap-3 mb-4 pb-2 border-b border-b-neutral-200"
    >
      {/* profile image */}

      <Image 
        source={{ uri: item?.profileUrl }}
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
        placeholder={blurhash}
        transition={500}
      />

      {/* name and last message */}
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            {item?.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-semibold text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

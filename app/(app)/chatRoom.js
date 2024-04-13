import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { useAuth } from "../../context/authContext";
import { getRoomId } from "../../utils/common";
import { collection, doc, setDoc, Timestamp, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const item = useLocalSearchParams(); // second user
  const {user} = useAuth();
  const router = useRouter();
  const textRef = useRef('');
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    createRoomIfNotExist();

    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(docRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      
      });
      setMessages([...allMessages]);
    });

    return unsub;
  }, []);

  const createRoomIfNotExist = async () => {
    // room id
    const roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    })
  };

  const handleSendMessage = async () => {
    let meesage = textRef.current.trim();
    if (!meesage) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, 'rooms', roomId);
      const messagesRef = collection(docRef, 'messages');
      textRef.current = '';
      if (inputRef) inputRef.current?.clear();
      const newDoc = await addDoc(messagesRef, {
        text: meesage,
        senderId: user?.userId,
        senderName: user?.username,
        profileUrl : user?.profileUrl,
        receiverId: item?.userId,
        receiverName: item?.username,
        receiverProfileUrl: item?.profileUrl,
        createdAt: Timestamp.fromDate(new Date())
      });
      textRef.current = '';
      // console.log("newDoc: ", newDoc.id);
    } catch (err) {
      Alert.alert("Message", "Failed to send message");
    }
  }

  // console.log("messages: ", messages);
  return (
    <CustomKeyboardView inChat>
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ChatRoomHeader user={item} router={router} />
      <View className="h-3 border-b border-neutral-200" />
      <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
        <View className="flex-1">
          <MessageList messages={messages} currentUser={user} scrollViewRef={scrollViewRef}/>
        </View>
        <View style={{ marginBottom: hp(1.7) }} className="pt-2">
          <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5">
            <TextInput
              ref={inputRef}
              onChangeText={value=> textRef.current = value}
              placeholder="Type message..."
              className="flex-1 mr-2"
              style={{ fontSize: hp(2) }}
            />
            <View className="bg-neutral-200 p-2 mr-[1px] rounded-full">
              <TouchableOpacity onPress={handleSendMessage}>
                <Feather name="send" size={hp(2.7)} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
    </CustomKeyboardView>
  );
}

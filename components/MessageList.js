import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'

export default function MessageList({ messages, currentUser, scrollViewRef }) {
  return (
    <ScrollView
    ref={scrollViewRef}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{padding: 10}}
    >
      {
        messages.map((message, index) => {
          return (
            <MessageItem message={message} index={index} currentUser={currentUser} key={index}/>
          )
        })
      }
    </ScrollView>
  )
}
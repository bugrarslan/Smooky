import { View, Text, Platform } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useAuth } from "../context/authContext";
import { blurhash } from "../utils/common";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { MenuItem } from "./CustomMenuItem";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const ios = Platform.OS == "ios";
export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleProfile = () => {
    console.log("Profile");
  }

    const handleLogout = async () => {
        await logout();
    }

  return (
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row justify-between px-5 bg-indigo-400 pb-6 rounded-b-3xl shadow"
    >
      <View>
        <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
          Chats
        </Text>
      </View>

      <View>
        <Menu>
          <MenuTrigger
          customStyles={{
            triggerWrapper: {
                //trigger Wrapped styles
            }
        }}>
            <Image
            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
            source={user?.profileUrl}
            placeholder={blurhash}
            contentFit="cover"
            transition={500}
            />
          </MenuTrigger>
          <MenuOptions customStyles={{
            optionsContainer: {
                //Options container style
                borderRadius: 10,
                borderCurve:'continuous',
                marginTop:40,
                marginLeft:-30,
                backgroundColor:'white',
                shadowOpacity:0.2,
                shadowOffset: {width: 0, height: 0},
                width:160
            }
          }}>
            <MenuItem
                text={"Profile"}
                action={handleProfile}
                value={null}
                icon={<Feather name="user" size={hp(2.5)} color="#737373"/>}
            />
            <Divider/>
            <MenuItem
                text={"Logout"}
                action={handleLogout}
                value={null}
                icon={<AntDesign name="logout" size={hp(2.5)} color="#737373"/>}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}

const Divider = () => {
    return(
        <View className="p-[1px] w-full bg-neutral-200"/>
    )
}
import React, { useEffect, useState } from "react";
import { Keyboard, View, Image, Text, TouchableOpacity, Modal, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Home from "../screens/Home";
import AllJobs from "../screens/AllJobs";
import MyJobs from "../screens/MyJobs";
import Me from "../screens/Me";
import PostJob from "../screens/PostJob";


const Tabs = createBottomTabNavigator();

const Tab = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handlePostJobTabPress = () => {
    setModalVisible(true); // Show modal when "Post Job" is pressed
  };

  const handlePostJob = () => {
    setModalVisible(false);
    navigation.navigate("PostJob"); // Navigate to PostJob screen
  };

  const handlePostService = () => {
    setModalVisible(false);
    navigation.navigate("PostService"); // Navigate to PostService screen
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <>
      <Tabs.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: isKeyboardVisible ? 0 : 50,
          },
        }}
      >
        <Tabs.Screen
          name="Homes"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={require("../../assests/icons/home.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 30,
                    tintColor: focused ? "#6ab04c" : "#616C6F",
                  }}
                />
                <Text style={{ textAlign: "center", fontSize: 8, color: focused ? "#6ab04c" : "black" }}>Home</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="AllJobs"
          component={AllJobs}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={require("../../assests/icons/suitcase.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 30,
                    tintColor: focused ? "#6ab04c" : "#616C6F",
                  }}
                />
                <Text style={{ textAlign: "center", fontSize: 8, color: focused ? "#6ab04c" : "black" }}>AllJobs</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="PostJob"
          component={PostJob}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={require("../../assests/icons/plus.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 30,
                    tintColor: focused ? "#6ab04c" : "#616C6F",
                  }}
                />
                <Text style={{ textAlign: "center", fontSize: 8, color: focused ? "#6ab04c" : "black" }}>PostJob</Text>
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={handlePostJobTabPress} />
            ),
          }}
        />
        <Tabs.Screen
          name="MyJobs"
          component={MyJobs}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={require("../../assests/icons/Myjob.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 30,
                    tintColor: focused ? "#6ab04c" : "#616C6F",
                  }}
                />
                <Text style={{ textAlign: "center", fontSize: 8, color: focused ? "#6ab04c" : "black" }}>MyJobs</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Me"
          component={Me}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={require("../../assests/icons/user.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 30,
                    tintColor: focused ? "#6ab04c" : "#616C6F",
                  }}
                />
                <Text style={{ textAlign: "center", fontSize: 8, color: focused ? "#6ab04c" : "black" }}>Me</Text>
              </View>
            ),
          }}
        />
      </Tabs.Navigator>

      {/* Modal Component */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>Select an Option</Text>
            <Button title="Post a Job" onPress={handlePostJob} />
            <Button title="Post a Service" onPress={handlePostService} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Tab;

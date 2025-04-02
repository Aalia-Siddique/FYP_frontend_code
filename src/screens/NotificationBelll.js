import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const NotificationBell = () => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken"); // ✅ Properly await AsyncStorage.getItem
        if (!token) {
          console.error("User token not found.");
          return;
        }

        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.Id); // ✅ Set userId properly
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `http://192.168.100.22:5074/api/Notifications/GetUnreadCount/${userId}`
      );
      const count = await response.json();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch(
        `http://192.168.100.22:5074/api/Notifications/MarkAsRead/${userId}`,
        { method: "POST" }
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Home</Text>

      {/* 🔔 Bell Icon with Badge */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("notificationsPage");
          markNotificationsAsRead();
        }}
        style={{ position: "relative", padding: 5 }}
      >
        <Ionicons name="notifications-outline" size={28} color="black" />
        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "red",
              borderRadius: 10,
              width: 18,
              height: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
              {unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NotificationBell;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons ke liye

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://192.168.100.22:5074/api/Notifications/GetAllNotifications");
      const data = await response.json();
      console.log(data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Time Formatting Function
  const formatTime = (createdDate) => {
    const createdAt = new Date(createdDate);
    const now = new Date();
    const differenceInSeconds = Math.floor((now - createdAt) / 1000);
    const differenceInHours = Math.floor(differenceInSeconds / 3600);

    if (differenceInHours >= 24) {
      return createdDate.split("T")[0]; // Agar 24 ghante ya usse zyada ho gaya to sirf date show karega
    } else if (differenceInSeconds < 60) {
      return "Now"; // Agar 1 minute se kam ho
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} min ago`; // Agar 1 ghante se kam ho
    } else {
      return `${differenceInHours} hours ago`; // Agar 24 ghante se kam ho
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>Announcements</Text>
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const timeOrDate = formatTime(item.createdDate);
            return (
              <TouchableOpacity style={styles.card}>
                <Ionicons name="bulb-outline" size={24} color="green" />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.senderName} {item.jobStatus} your application</Text>
                </View>
                <Text style={styles.date}>{timeOrDate}</Text> 
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  tabs: { flexDirection: "row", backgroundColor: "#E5E5E5", padding: 5, borderRadius: 10, margin: 10, justifyContent: "center" },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10 },
  activeTab: { backgroundColor: "white" },
  activeTabText: { color: "green", fontWeight: "bold" },
  card: { flexDirection: "row", backgroundColor: "white", padding: 15, marginHorizontal: 10, marginVertical: 5, borderRadius: 10, alignItems: "center" },
  textContainer: { flex: 1, marginLeft: 10 },
  title: { fontSize: 12, fontWeight: "bold", color: "#333" },
  date: { fontSize: 12, color: "gray" },
});

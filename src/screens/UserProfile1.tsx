import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // For Chat Icon

const UserProfile1 = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchUserRating();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://192.168.100.22:5165/api/Users/GetUsersById/${userId}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      setUser(result);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };
  const fetchUserRating = async () => {
    try {
      const response = await fetch(`http://192.168.100.22:5209/api/Feedback/GetUserRating/${userId}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      setRating(result.averageRating);
    } catch (error) {
      console.error("Error fetching user rating:", error.message);
    }
  };

  if (!user) return <Text style={styles.errorText}>User not found</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: `http://192.168.100.22:5165/${user.userImageName}` }} style={styles.userImage} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.job}>{user.job}</Text>
        <Text style={styles.city}>{user.city}</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating:⭐ {rating !== null ? rating : "Loading..."}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>User Information</Text>
        {renderInfoBlock("CNIC", user.cnic)}
        {renderInfoBlock("Gender", user.gender)}
        {renderInfoBlock("Experience", user.experience)}
        {renderInfoBlock("Address", user.address)}
        {renderInfoBlock("Date of Birth", user.dateofBirth)}
      </View>
      {/* Contact with Chat Button with Icon */}
      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("ChatScreen", { userId })}>
        <FontAwesome name="comments" size={20} color="white" style={styles.chatIcon} />
        <Text style={styles.chatButtonText}>Contact with Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.commentsButton} onPress={() => navigation.navigate("FeedbackScreen", { userId })}>
        <Text style={styles.commentsButtonText}>View Comments</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("AllUsers")}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const renderInfoBlock = (label, value) => (
  <View style={styles.infoBlock}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f3f3f3", alignItems: "center" },
  profileHeader: { alignItems: "center", marginBottom: 20 },
  userImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: "#0073b1" },
  name: { fontSize: 26, fontWeight: "bold", color: "#333", marginTop: 10 },
  job: { fontSize: 18, color: "#0073b1" },
  city: { fontSize: 16, color: "#666", marginBottom: 10 },
  ratingContainer: { marginTop: 10, padding: 5, borderRadius: 5, backgroundColor: 'white' },
  ratingText: { fontSize: 18, fontWeight: "bold", color: "red" },
  detailsContainer: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0073b1", marginBottom: 10, textAlign: "center" },
  infoBlock: { marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  label: { fontWeight: "bold", fontSize: 16, color: "#444", marginBottom: 3 },
  value: { fontSize: 16, color: "#666" },
  
  // Contact Button Styling
  chatButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#0073b1", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    shadowColor: "#000", 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 5, 
    marginTop: 20 
  },
  chatIcon: { marginRight: 10 },
  chatButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  commentsButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, alignItems: "center", marginTop: 20 },
  commentsButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  backButton: { backgroundColor: "#ff4d4d", padding: 12, borderRadius: 5, alignItems: "center", marginTop: 10 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default UserProfile1;

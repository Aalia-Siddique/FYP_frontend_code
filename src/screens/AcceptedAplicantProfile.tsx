import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";

const AcceptedAppplicantProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://192.168.100.22:5165/api/users/GetUsersById/${userId}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const result = await response.json();
      if (!result || Object.keys(result).length === 0) throw new Error("User data is empty or invalid");
      
      setUser(result);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
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
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>User Information</Text>
        {renderInfoBlock("CNIC", user.cnic)}
        {renderInfoBlock("Gender", user.gender)}
        {renderInfoBlock("Experience", user.experience)}
        {renderInfoBlock("Address", user.address)}
        {renderInfoBlock("Date of Birth", user.dateofBirth)}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>CNIC Image</Text>
        <Image source={{ uri: `http://192.168.100.22:5165/${user.cnicImageName}` }} style={styles.extraImage1} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>License and Certificate</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`http://192.168.100.22:5165/${user.certificateImageName}`)}>
          <Image source={{ uri: `http://192.168.100.22:5165/${user.certificateImageName}` }} style={styles.extraImage} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={() => Linking.openURL(`http://192.168.100.22:5165/${user.certificateImageName}`)}
        >
          <Text style={styles.downloadButtonText}>Download Certificate</Text>
        </TouchableOpacity>
      </View>

      {/* View Comments Button */}
      <TouchableOpacity 
        style={styles.commentsButton} 
        onPress={() => navigation.navigate("FeedbackScreen", { userId })}>
        <Text style={styles.commentsButtonText}>View Comments</Text>
      </TouchableOpacity>
      <TouchableOpacity 
  style={styles.reportButton} 
  onPress={() => navigation.navigate("SafetyScreen", { userId })}>
  <Text style={styles.reportButtonText}>Report User</Text>
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
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f3f3f3", alignItems: "center" ,marginTop:40},
  profileHeader: { alignItems: "center", marginBottom: 20 },
  userImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: "#0073b1" },
  name: { fontSize: 26, fontWeight: "bold", color: "#333", marginTop: 10 },
  job: { fontSize: 18, color: "#0073b1" },
  city: { fontSize: 16, color: "#666", marginBottom: 10 },
  detailsContainer: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0073b1", marginBottom: 10, textAlign: "center" },
  infoBlock: { marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  label: { fontWeight: "bold", fontSize: 16, color: "#444", marginBottom: 3 },
  value: { fontSize: 16, color: "#666" },
  extraImage: { width: 230, height: 200, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, alignSelf: "center" },
  extraImage1: { width: 180, height: 180, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, alignSelf: "flex-start" },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
  downloadButton: { backgroundColor: "#0073b1", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  downloadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  commentsButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, alignItems: "center", margin: 20 },
  commentsButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  reportButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  reportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

export default AcceptedAppplicantProfile;

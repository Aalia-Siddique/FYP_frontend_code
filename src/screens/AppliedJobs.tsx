import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppliedJobsScreen = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const formatDate = (utcDate) => {
    const date = new Date(utcDate); // Convert UTC date string to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear(); // Get full year
    return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
};
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAppliedJobs(userId);
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      console.log("Fetching User ID...");
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        console.error("User token not found.");
        return;
      }
      const decodedToken: any = jwtDecode(token);
      setUserId(decodedToken.Id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const fetchAppliedJobs = async (userId: string) => {
    try {
      console.log("Fetching Applied Jobs for User:", userId);
      const API_URL = `http://192.168.100.22:5140/api/UserJob/GetUserAppliedJobs?UserId=${userId}`;
      const response = await axios.get(API_URL);

      console.log("API Response:", response.data);

      const jobList = response.data?.$values || [];
      setJobs(jobList);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Applied Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}

        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Job Header */}
            <View style={styles.header}>
              <Image
                source={
                  item.userImage
                    ? { uri: item.userImage }
                    : require("../../Images/Homeimages/m1.jpeg")
                }
                resizeMode="cover"
                style={styles.Postimage}
              />
              <View style={styles.jobtitleContainer}>
                <Text style={styles.Jobtitle}>{item.name}</Text>
                <Text style={styles.companyName}>{item.companyName}</Text>
              </View>
              <View
                style={[
                  styles.jobTypeBadge,
                  item.jobType === "Full-time" ? styles.fullTime : styles.partTime,
                ]}
              >
                <Text style={styles.jobTypeText}>{item.jobType}</Text>
              </View>
            </View>

            {/* Salary & Workplace Type */}
            <Text style={styles.price}>
              Rs. {item.minSalary} - {item.maxSalary} ({item.workplaceType})
            </Text>

            {/* Footer Details */}
            <View style={styles.footer}>
              <View style={styles.location}>
                <Image
                  source={require("../../assests/icons/maps-and-flags.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
                <Text style={styles.footerText}>{item.location}</Text>
              </View>
              <View style={styles.location}>
                <Image
                  source={require("../../assests/icons/clock.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
                <Text style={styles.footerText}>{formatDate(item.datePosted)}</Text>
              </View>
            </View>

            <View style={styles.line} />

            {/* Apply & Save Buttons */}
            <View style={styles.Buttons}>
            <Text style={styles.footerText1}>Applied {item.appliedDate}</Text>
              <TouchableOpacity>
                <Image
                  source={require("../../assests/icons/share.png")}
                  resizeMode="contain"
                  style={styles.ShareBtn}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require("../../assests/icons/bookmark.png")}
                  resizeMode="contain"
                  style={styles.ShareBtn}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, marginVertical: 8, borderRadius: 8, elevation: 3,borderWidth:2, borderColor: '#6AE87B' },
  jobTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to start
    position: 'relative', // Needed for absolute positioning
},
jobTypeBadge: {
    position: 'absolute',
    right: 3, // Move it to the top right
    top: 5,  // Slightly down from the top
   // backgroundColor: '#6AE87B', // Example color for visibility
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
},
  Jobtitle: { fontWeight: "bold", fontSize: 17, color: "#333", marginLeft: 3 },
  companyName: { fontSize: 14, color: "#666", marginTop: 2 },
 // jobTypeBadge: { borderRadius: 5, alignSelf:"auto",right:5},
  fullTime: { color: "green" },
  partTime: { color: "red" },
  jobTypeText: { fontSize: 14, fontWeight: "bold", color: "green" },
  price: { fontSize: 14, marginVertical: 5, marginTop: 7 },
  footer: { flexDirection: "row", justifyContent: "space-between", margin: 5 },
  location: { flexDirection: "row", alignItems: "center", fontSize: 12 },
  footerText: { fontSize: 10, color: "#999" },
  footerText1: { fontSize: 11, color: "red" ,fontWeight:"bold"},
  image: { width: 20, height: 20, tintColor: "#616C6F" },
  Postimage: { width: 50, height: 50, borderRadius: 45, borderWidth: 2, borderColor: "#BA2F16" },
  line: { height: 1, backgroundColor: "#999", width: "100%", marginVertical: 5 },
  Buttons: { flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" },
  applyButton: { backgroundColor: "rgba(255, 0, 0, 0.6)", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  applyButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  ShareBtn: { height: 20, width: 20, tintColor: "#6ab04c" },
});

export default AppliedJobsScreen;

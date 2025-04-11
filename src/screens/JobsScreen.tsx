import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = 'http://192.168.100.22:5140/api';
import { useFocusEffect } from '@react-navigation/native';
const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [userImage, setUserImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Listen to the 'refreshJobs' event to trigger fetching of jobs
  useFocusEffect(
    React.useCallback(() => {
      fetchJobs(); // Re-fetch the jobs every time the screen comes into focus
    }, []) // Empty array means it will run when screen focuses, without any dependency
  );

  const formatDate = (utcDate) => {
    const date = new Date(utcDate); // Convert UTC date string to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear(); // Get full year
    return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
};
  const fetchJobs = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.Id;

      const response = await axios.get(`${API_BASE_URL}/JobPost/user/${userId}`);
      setUserImage(`http://192.168.100.22:5165/${response.data.userImage}`);

      if (response.data && response.data.jobs && response.data.jobs.$values) {
        setJobs(response.data.jobs.$values);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Jobs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0073b1" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <Image
                  source={{ uri: userImage}}
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

              <Text style={styles.price}>
                Rs. {item.minSalary} - {item.maxSalary} ({item.workplaceType})
              </Text>

              <View style={styles.footer}>
                <View style={styles.location}>
                  <Image
                    source={require('../../assests/icons/maps-and-flags.png')}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  <Text style={styles.footerText}>{item.location}</Text>
                </View>
                <View style={styles.location}>
                  <Image
                    source={require('../../assests/icons/clock.png')}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  <Text style={styles.footerText}>{formatDate(item.datePosted)}</Text>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.Buttons}>
                {/* <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </TouchableOpacity> */}
                <TouchableOpacity>
                  <Image
                    source={require('../../assests/icons/share.png')}
                    resizeMode="contain"
                    style={styles.ShareBtn}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../../assests/icons/bookmark.png')}
                    resizeMode="contain"
                    style={styles.ShareBtn}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f3f3f3" ,marginTop:40},
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, elevation: 3,borderRadius: 8,borderWidth:2, borderColor: '#6AE87B', marginVertical: 5 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
  jobTypeBadge: {
    position: 'absolute',
    right: -14, // Move it to the top right
    top: 12,  // Slightly down from the top
   // backgroundColor: '#6AE87B', // Example color for visibility
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
},
fullTime: { color: "red" },
partTime: { color: "red" },
jobTypeText: { fontSize: 14, fontWeight: "bold", color: "red" },
  Jobtitle: { fontWeight: "bold", fontSize: 17, color: "#333", marginLeft: 3 },
  companyName: { fontSize: 14, color: "#666", marginTop: 2 },
  price: { fontSize: 14, marginVertical: 5, marginTop: 7 },
  footer: { flexDirection: "row", justifyContent: "space-between", margin: 5 },
  location: { flexDirection: "row", alignItems: "center", fontSize: 12 },
  footerText: { fontSize: 10, color: "#999" },
  image: { width: 20, height: 20, tintColor: "#616C6F" },
  Postimage: { width: 50, height: 50, borderRadius: 45, borderWidth: 2, borderColor: "#BA2F16" },
  line: { height: 1, backgroundColor: "#999", width: "100%", marginVertical: 5 },
  Buttons: { flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" },
  applyButton: { backgroundColor: "rgba(255, 0, 0, 0.6)", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  applyButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  ShareBtn: { height: 20, width: 20, tintColor: "#6ab04c" },
});

export default JobsScreen;

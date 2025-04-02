import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image,TouchableOpacity,Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native'; 
import { jwtDecode } from "jwt-decode";
type RootStackParamList = {
  Me: undefined;
  UpdateProfile: { userData: any }
};

type MeScreenProp = StackScreenProps<RootStackParamList, 'Me'>;

const API_BASE_URL = 'http://192.168.100.22:5165/api';

const Me: React.FC<MeScreenProp> = ({ navigation, route }) => {
  const { userData } = route.params || { userData: {} };
  const [activeTab, setActiveTab] = useState("JobsScreen");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("Jobs");
  const [data, setData] = useState({
    Name: '',
    PhoneNumber: '',
    Password: '',
    Address: '',
    Cnic: '',
    Gender: '',
    City: '',
    CnicImageName: '',
    UserImageName: '',
    CertificateImageName: '',
    Experience: '',
    Job: '',
    DateofBirth: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const Id = decodedToken.Id;
console.log(decodedToken)
console.log(Id)
setUserId(Id);
      const response = await axios.get(`${API_BASE_URL}/Users/GetUsersById/${Id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatDate = (dateString: string) => {
        if (!dateString) return ''; 
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      };

      setData({
        Name: response.data.name || '',
        PhoneNumber: response.data.phoneNumber || '',
        Password: response.data.password || '',
        Address: response.data.address || '',
        Cnic: response.data.cnic || '',
        Gender: response.data.gender || '',
        City: response.data.city || '',
        CnicImageName: response.data.cnicImageName || '',
        UserImageName: response.data.userImageName || '',
        CertificateImageName: response.data.certificateImageName || '',
        Experience: response.data.experience || '',
        Job: response.data.job || '',
        DateofBirth: formatDate(response.data.dateofBirth) || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
   // Default selected tab

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: `http://192.168.100.22:5165/${data.UserImageName}` }} style={styles.userImage} />
            <Text style={styles.name}>{data.Name}</Text>
            <Text style={styles.job}>{data.Job}</Text>
            <Text style={styles.city}>{data.City}</Text>
          </View>
          <View style={styles.tabsContainer}>
      <TouchableOpacity
        onPress={() => {
          setActiveTab("JobsScreen");
          navigation.navigate("JobsScreen");
        }}
        style={[
          styles.tab,
          activeTab === "JobsScreen" && styles.activeTab, // Change color if active
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "JobsScreen" && styles.activeTabText, // Change text color
          ]}
        >
          Jobs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setActiveTab("ServicesScreen");
          navigation.navigate("ServicesScreen");
        }}
        style={[
          styles.tab,
          activeTab === "ServicesScreen" && styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "ServicesScreen" && styles.activeTabText,
          ]}
        >
          Services
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  onPress={() => {
    setActiveTab("ReviewsScreen");
    navigation.navigate("ReviewsScreen", { userId }); // Corrected navigation
  }}
        style={[
          styles.tab,
          activeTab === "ReviewsScreen" && styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "ReviewsScreen" && styles.activeTabText,
          ]}
        >
          Reviews
        </Text>
      </TouchableOpacity>
    </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>User Information</Text>
            {renderInfoBlock("CNIC", data.Cnic)}
            {renderInfoBlock("Gender", data.Gender)}
            {renderInfoBlock("Experience", data.Experience)}
            {renderInfoBlock("Address", data.Address)}
            {renderInfoBlock("Date of Birth", data.DateofBirth)}
          </View>
    
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>CNIC Image</Text>
            <Image source={{ uri: `http://192.168.100.22:5165/${data.CnicImageName}` }} style={styles.extraImage1} />
          </View>
    
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>License and Certificate</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`http://192.168.100.22:5165/${data.CertificateImageName}`)}>
              <Image source={{ uri: `http://192.168.100.22:5165/${data.CertificateImageName}` }} style={styles.extraImage} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={() => Linking.openURL(`http://192.168.100.22:5165/${data.CertificateImageName}`)}
            >
              <Text style={styles.downloadButtonText}>Download Certificate</Text>
            </TouchableOpacity>
          </View>
    
          {/* View Comments Button */}
          <Button title="Update Profile" onPress={() => navigation.navigate('UpdateProfile', { userData: data })} />
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
      detailsContainer: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, margin: 20 },
      sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0073b1", marginBottom: 10, textAlign: "center" },
      infoBlock: { marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
      label: { fontWeight: "bold", fontSize: 16, color: "#444", marginBottom: 3 },
      value: { fontSize: 16, color: "#666" },
      extraImage: { width: 230, height: 200, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, alignSelf: "center" },
      extraImage1: { width: 180, height: 180, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, alignSelf: "flex-start" },
      errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
      downloadButton: { backgroundColor: "#0073b1", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
      downloadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
      commentsButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, alignItems: "center", marginTop: 20 },
      commentsButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
      tabsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly", // Equal spacing
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 5,
      },
      tab: {
        flex: 1, // Full width for even spacing
        alignItems: "center",
      },
      tabText: {
        fontSize: 16,
        color: "#555",
      },
      activeTab: {
        fontWeight: "bold",
        color: "#007bff",
        borderBottomWidth: 2,
        borderBottomColor: "#007bff",
      },
      activeTabText: {
        color: "#007bff", // Active text color
      },
      // detailsContainer: {
      //   marginTop: 10,
      // },
      // sectionTitle: {
      //   fontSize: 16,
      //   fontWeight: "bold",
      //   marginBottom: 8,
      // },
    });
    export default Me;
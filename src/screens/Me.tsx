import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Me: undefined;
  UpdateProfile: { userData: any };
};

type MeScreenProp = StackScreenProps<RootStackParamList, 'Me'>;

const API_BASE_URL = 'http://192.168.0.101:5165/api';

const Me: React.FC<MeScreenProp> = ({ navigation, route }) => {
  const { userData } = route.params || { userData: {} };
  
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
    DateofBirth:'',
  });

  useEffect(() => {
    handleLogin();
  }, []);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const checkLogin = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('jwtToken');
      if (!savedToken) {
        console.error('JWT Token not found, please login.');
        return;
      }
      setToken(savedToken);
      fetchData(savedToken);
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {  
        PhoneNumber: '03174130828',
        Password: '123@abcd',
      });
  
      if (response.status === 200) {
        const newToken = response.data.accessToken;
        await AsyncStorage.setItem('jwtToken', newToken);
         fetchData(newToken);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  const fetchData = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Users/GetUserData`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      // Date formatting function
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
        DateofBirth: formatDate(response.data.dateofBirth) || '', // Format Date
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* <View style={styles.profileHeader}>
        <Image source={require('../../assests/icons/user.png')} style={styles.profileImage} />
      </View> */}

      {Object.keys(data).map((key) => (

        
  <View key={key} style={styles.detailContainer}>
    {
       key === "UserImageName" && data.UserImageName ? (
        <View  style={styles.profileHeader}>
          <Image
            source={{ uri: `http://192.168.0.101:5165/${data.UserImageName}` } } 
            style={styles.profileImage}
          />
         </View>
   
    ) :
    key === "CertificateImageName" && data.CertificateImageName ? (
      <Image
        source={{ uri: `http://192.168.0.101:5165/${data.CertificateImageName}` }}
        style={styles.image}
      />
    ) :
     key === "CnicImageName" && data.CnicImageName ? (
      <Image
        source={{ uri: `http://192.168.0.101:5165/${data.CnicImageName}` }}
        style={styles.image}
      />
    ) : (
      <>
        <Text style={styles.detailText}>{key}</Text>
        <Text>{data[key as keyof typeof data]}</Text>
      </>
    )}
  </View>
       ))}

      <Button title="Update Profile" onPress={() => navigation.navigate('UpdateProfile', { userData: data })} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  contentContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  detailContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Me;

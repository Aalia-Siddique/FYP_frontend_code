import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const UpdateProfile = ({ route, navigation }) => {
  const { userData } = route.params;
  const [updatedData, setUpdatedData] = useState({
    Job: userData.Job || '',
    City: userData.City || '',
    Cnic: userData.Cnic || '',
    Name: userData.Name || '',
    Gender: userData.Gender || '',
    Address: userData.Address || '',
    Password: userData.Password || '',
    Experience: userData.Experience || '',
    PhoneNumber: userData.PhoneNumber || '',
    CnicImageName: userData.CnicImageName || '',
    UserImageName: userData.UserImageName || '',
    CertificateImageName: userData.CertificateImageName || '',
    DateofBirth: userData.DateofBirth || '',
  });

  const [selectedImages, setSelectedImages] = useState({
    CertificateImageName: null,
    UserImageName: null,
    CnicImageName: null,
  });

  const pickImage = async (field) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages({ ...selectedImages, [field]: result.assets[0].uri });
    }
  };


  const validateDateOfBirth = (dob) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!datePattern.test(dob)) {
        Alert.alert("❌ Invalid Format", "Date of Birth must be in dd/mm/yyyy format.");
        return false;
    }

    // Convert string date to Date object
    const [day, month, year] = dob.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    // Check if user is at least 18 years old
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeBirthday = (today.getMonth() < birthDate.getMonth()) ||
                            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

    if (age < 18 || (age === 18 && isBeforeBirthday)) {
        Alert.alert("🚫 Age Restriction", "You must be at least 18 years old.");
        return false;
    }

    return true;
};


 const handleUpdate = async () => {
    if (!validateDateOfBirth(updatedData.DateofBirth)) {
        return;
    }

    try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
            console.error('User token not found.');
            return;
        }
        const decodedToken = jwtDecode(token);
        const Id = decodedToken.Id;

        const updateUrl = `http://192.168.108.30:5165/api/Users/UpdateUser/${Id}`;
        const formData = new FormData();

        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key]) {
                formData.append(key, updatedData[key]);
            }
        });

        ["CnicImageName", "CertificateImageName", "UserImageName"].forEach((key) => {
            if (selectedImages[key]) {
                formData.append(key, {
                    uri: selectedImages[key],
                    name: `${key}.jpg`,
                    type: "image/jpeg",
                });
            }
        });

        console.log("📤 Sending FormData:", formData);

        const response = await fetch(updateUrl, {
            method: "PUT",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if (!response.ok) {
            const responseData = await response.text();
            console.error(`❌ API Error (${response.status}):`, responseData);
            return;
        }

        alert("✅ Profile updated successfully!");
       navigation.goBack();
      //  navigation.navigate('Me', { refresh: true });
    } catch (error) {
        console.error("❌ Error updating profile:", error);
    }
};

  
  return (
   
    <ScrollView style={styles.container}>
  <Text style={styles.title}>Update Profile</Text>

  {Object.keys(updatedData).map((key) => (
    <View key={key} style={styles.inputContainer}>
      {["CertificateImageName", "UserImageName", "CnicImageName"].includes(key) ? (
        <>
          <Text style={styles.label}>{key}</Text>
          <Image
            source={{ uri: selectedImages[key] || `http://192.168.108.30:5165/${updatedData[key]}` }}
            style={styles.image}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(key)}>
            <Text style={styles.imagePickerText}>
              {selectedImages[key] ? 'Change Image' : 'Pick an Image'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={updatedData[key]}
            placeholder={key === "DateofBirth" ? "dd/mm/yyyy" : ""}
            onChangeText={(text) => setUpdatedData({ ...updatedData, [key]: text })}
          />
          {key === "DateofBirth" && (
            <Text style={{ color: "gray", fontSize: 12 }}>Format: dd/mm/yyyy</Text>
          )}
        </>
      )}
    </View>
  ))}

  <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
    <Text style={styles.updateButtonText}>Save Changes</Text>
  </TouchableOpacity>
</ScrollView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F8F8' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  inputContainer: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: '#EFEFEF', padding: 10, borderRadius: 5 },
  image: { width: 100, height: 100, borderRadius: 10, marginTop: 10 },
  imagePicker: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 5, alignItems: 'center' },
  imagePickerText: { color: '#fff', fontSize: 16 },
  updateButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  updateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default UpdateProfile;

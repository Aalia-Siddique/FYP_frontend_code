import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

import { jwtDecode } from "jwt-decode";

export default function SafetyScreen() {
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
 
  const route = useRoute();
  const { userId } = route.params || {};
  const ReportingUserId = userId;

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.Id;
  
      const formData = new FormData();
      formData.append('UserId', userId);
      formData.append('Message', description);
      formData.append('ReportingUserId', ReportingUserId);
  
      if (photo) {
        const filename = photo.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;
  
        formData.append('Image', {
          uri: photo,
          name: filename,
          type,
        });
      }
      
      // Log form data to check what is being sent
     console.log(formData)
      // Send the request with multipart/form-data for both image and no image cases
      const response = await axios.post(
        'http://192.168.100.22:5182/api/UserIssue/createuserissue',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',  // Always use multipart/form-data
          },
        }
      );
  
      console.log(response.status);
      if (response.status === 200) {
        alert('Issue submitted successfully!');
        setDescription('');
        setPhoto(null);
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Error submitting issue.');
    }
  };
  
  return (
    <View style={styles.container}>
    <View style={styles.heading}>
        
    <Text style={styles.headingText}> Issues</Text>
    </View>
      <Text style={styles.label}>Tell us about any issue</Text>
      <TextInput
        style={styles.input}
        placeholder="Write Here..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

<Text style={styles.label}>Picture </Text>

<View style={styles.buttonRow}>
  <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
    <Text style={styles.photoButtonText}> Take Picture</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
    <Text style={styles.submitButtonText}>SUBMIT</Text>
  </TouchableOpacity>
</View>

{photo && (
  <Image source={{ uri: photo }} style={styles.previewImage} />
)}


    </View>
  );
}

const styles = StyleSheet.create({
 previewImage: {
  width: '100%',
  height: 200,
  borderRadius: 12,
  marginTop: 10,
  marginBottom: 20,
  resizeMode: 'cover',
},

  heading:{
    alignItems: 'center',
 

 },
 headingText:{
    color: 'black',
    fontSize:20,
    fontWeight: 'bold',
    padding:10,
marginBottom:5,
 },
 
    container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f3fc',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    height: 80,
  },
  photoButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius:20,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoName: {
    marginBottom: 20,
    color: '#333',
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 20,
},

photoButton: {
  backgroundColor: 'green',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 30,
  alignItems: 'center',
  flex: 1,
},

submitButton: {
  backgroundColor: '#007BFF',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 30,
  alignItems: 'center',
  flex: 1,
},

photoButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},

submitButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},

});

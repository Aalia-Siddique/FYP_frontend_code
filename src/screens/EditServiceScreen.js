import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const EditServiceScreen = ({ route, navigation }) => {
  const { servicePost, setServicePosts } = route.params; 
  console.log(servicePost); // Check if timing is present
// Get servicePost and setServicePosts from navigation params
  const [serviceData, setServiceData] = useState({
    name: servicePost.name,
    description: servicePost.description,
    location: servicePost.location,
    address: servicePost.address,
    phoneNumber: servicePost.phoneNumber,
    email: servicePost.email,
    maxSalary: servicePost.maxSalary,
    minSalary: servicePost.minSalary,
    timing:servicePost.timing,
    experience:servicePost.experience,
    preferredDate:servicePost.preferredDate
    // serviceType: servicePost.serviceType,
    // workplaceType: servicePost.workplaceType,
  
  });

  useEffect(() => {
    setServiceData({
      name: servicePost.name,
      description: servicePost.description,
      location: servicePost.location,
      address: servicePost.address,
      phoneNumber: servicePost.phoneNumber,
      email: servicePost.email,
      maxSalary: servicePost.maxSalary,
      minSalary: servicePost.minSalary,
      timing:servicePost.timing,
      experience:servicePost.experience,
      preferredDate:servicePost.preferredDate

    //   serviceType: servicePost.serviceType,
    //   workplaceType: servicePost.workplaceType,
      
    });
  }, [servicePost]); // Only update when servicePost changes

  const handleUpdate = async () => {
    try {
      const formattedServiceData = {
        ...serviceData,
       
      };
  
      const response = await fetch(`http://192.168.100.22:5140/api/ServicePost/${servicePost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedServiceData),
      });
  
      if (response.ok) {
        const updatedServicePost = await response.json();
        setServicePosts(prevPosts => prevPosts.map(service => service.id === servicePost.id ? updatedServicePost : service));
        Alert.alert('Success', 'Service post updated successfully!');
        navigation.goBack();
      } else {
        const errorText = await response.text();
        Alert.alert("❌ Update Failed", errorText);
      }
    } catch (error) {
      Alert.alert("❌ An error occurred while updating the service.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>✏️ Update Service</Text>

      {Object.keys(serviceData).map((key, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <TextInput
            style={styles.input}
            value={String(serviceData[key])}
            onChangeText={(text) => setServiceData({ ...serviceData, [key]: text })}
            placeholder={`Enter ${key}`}
            multiline={key === 'description' || key === 'skills'}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginTop:40
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: 'green',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditServiceScreen;

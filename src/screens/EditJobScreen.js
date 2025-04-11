import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const EditJobScreen = ({ route, navigation }) => {
  const { jobPost, setJobPosts } = route.params; // Get jobPost and setJobPosts from navigation params
  const [jobData, setJobData] = useState({
    name: jobPost.name,
    description: jobPost.description,
    location: jobPost.location,
    address: jobPost.address,
    phoneNumber: jobPost.phoneNumber,
    email: jobPost.email,
    maxSalary: jobPost.maxSalary,
    minSalary: jobPost.minSalary,
    jobType: jobPost.jobType,
    workplaceType: jobPost.workplaceType,
    skills: Array.isArray(jobPost.skills)
      ? jobPost.skills
      : jobPost.skills.split(',').map(skill => skill.trim()),
    companyName: jobPost.companyName,
  });

  useEffect(() => {
    setJobData({
      name: jobPost.name,
      description: jobPost.description,
      location: jobPost.location,
      address: jobPost.address,
      phoneNumber: jobPost.phoneNumber,
      email: jobPost.email,
      maxSalary: jobPost.maxSalary,
      minSalary: jobPost.minSalary,
      jobType: jobPost.jobType,
      workplaceType: jobPost.workplaceType,
      skills: Array.isArray(jobPost.skills)
        ? jobPost.skills
        : jobPost.skills.split(',').map(skill => skill.trim()),
      companyName: jobPost.companyName,
    });
  }, [jobPost]); // Only update when jobPost changes

  const handleUpdate = async () => {
    try {
      // Create the formatted data for the PUT request
      const formattedJobData = {
        ...jobData, 
        skills: Array.isArray(jobData.skills) 
        ? jobData.skills  // If it's already an array, leave it as is
        : jobData.skills 
          ? jobData.skills.split(',').map(skill => skill.trim())  // If it's a string, split and trim
          : []  // If skills is undefined, set it to an empty array
  
      };

      console.log("📤 Sending Job Data to Backend:", JSON.stringify(formattedJobData, null, 2));

      // Send the PUT request
      const response = await fetch(`http://192.168.100.22:5140/api/JobPos/${jobPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedJobData), // Make sure you're sending formattedJobData
      });

      // Check if the response is OK
      if (response.ok) {
        console.log("Job updated successfully", await response.json());
        setJobPosts(prevPosts => prevPosts.map(job => job.id === jobPost.id ? { ...job, ...formattedJobData } : job));
        Alert.alert('Success', 'Job post updated successfully!');
        navigation.goBack();
      } else {
        const errorText = await response.text();
        console.error("Error in updating job:", errorText);
        Alert.alert("❌ Update Failed", errorText);  // Display the error message
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("❌ An error occurred while updating the job.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>✏️ Update Job</Text>

      {Object.keys(jobData).map((key, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <TextInput
            style={styles.input}
            value={String(jobData[key])}
            onChangeText={(text) => setJobData({ ...jobData, [key]: text })}
            placeholder={`Enter ${key}`}
            multiline={key === 'description' || key === 'skills'}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Job</Text>
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

export default EditJobScreen;

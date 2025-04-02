import React,{useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,Alert,Modal} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this installed
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { jwtDecode } from "jwt-decode";

import Icon from 'react-native-vector-icons/FontAwesome';
interface Job {
  id: number;
  name: string;
  companyName: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  workplaceType: string;
  jobType: string;
  datePosted: string;
  userImage?: string;
  description: string;
  skills?: { $values?: string[] }; // Fixed Skills Data Structure
}

type JobDetailsRouteProp = RouteProp<{ 
    params: { 
      job?: Job, 
      service?: Job,  // 👈 Yeh add kiya
      type?: string 
    } 
  }, 'params'>;
  
  interface JobDetailsProps {
    route: JobDetailsRouteProp;
  }
  
  const JobDetails: React.FC<JobDetailsProps> = ({ route }) => {
      const navigation = useNavigation();
      const [successModal, setSuccessModal] = useState(false);
      // Fix: Now `service` is part of the type
      const job = route.params?.job || route.params?.service;
      
      console.log('Job:', job);

    console.log('Route Params:', job);
    console.log('Route Params:', route.params);
    console.log('Keys in route.params:', Object.keys(route.params));



    const type = route.params?.type ?? 'Job'; 
    const skillsArray = job?.skills?.$values ?? [];
    const isService = type === 'Service'; 
  
    if (!job) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Job details not available</Text>
        </View>
      );
    }
   
    const handleApplyJob = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.Id;
      const endpoint = isService 
          ? 'http://192.168.100.22:5140/api/UserJob/CreateUserService'
          : 'http://192.168.100.22:5140/api/UserJob/CreateUserjob';
  
      
      const requestBody = isService 
          ? JSON.stringify({ serviceId: job.id,userId})  // Service case
          : JSON.stringify({ jobId: job.id,userId });    // Job case
  
      console.log('Sending request to:', endpoint);
      console.log('Request Body:', requestBody);
  
      try {
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody
          });
  
          // Check response status
          if (!response.ok) {
              const errorText = await response.text();  // Get error message from server
              throw new Error(`Request failed with status ${response.status}: ${errorText}`);
          }
  
          const responseData = await response.json();
          console.log('Response Data:', responseData);
          setSuccessModal(true); 
         // alert(`You applied for the ${isService ? 'service' : 'job'} successfully!`);
      } catch (error) {
          console.error(`Error applying for ${isService ? 'service' : 'job'}:`, error);
          alert(`Failed to apply for ${isService ? 'service' : 'job'}. Error: ${error.message}`);
      }
  };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Image & Icons */}
        <View style={styles.headerContainer}>
          <Image
            source={job.userImage ? { uri: job.userImage } : require('../../Images/Homeimages/m1.jpeg')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.iconShare}>
            <Ionicons name="share-social-outline" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSave}>
            <Ionicons name="bookmark-outline" size={24} color="green" />
          </TouchableOpacity>
        </View>
  
        {/* Job Info */}
        <Text style={styles.title}>{job.name}</Text>
  
        {/* Agar Job hai to company name, salary, etc dikhayenge */}
        {!isService && (
          <>
            <Text style={styles.company}>{job.companyName}</Text>
            <Text style={styles.salary}>Rs. {job.minSalary} - {job.maxSalary} ({job.workplaceType})</Text>
            <Text style={styles.jobType}>{job.jobType}</Text>
          </>
        )}
  
        {/* About Job */}
        <Text style={styles.sectionTitle}>{isService ? 'About Service' : 'About Job'}</Text>
        <Text style={styles.description}>{job.description.replace(/\n+/g,'').trim()}</Text>
  
        {/* Skills Section (Only for Jobs) */}
        {!isService && skillsArray.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Skills Required</Text>
            <View style={styles.skillsContainer}>
              {skillsArray.map((skill, index) => (
                <Text key={index} style={styles.skill}>{skill}</Text>
              ))}
            </View>
          </>
        )}
  
        {/* Experience Section */}
        <Text style={styles.sectionTitle}>Experience Required</Text>
        <Text style={styles.experience}>{job.experience ?? 'Not specified'} experience required for this job</Text>
  
        {/* Timing & Address */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="green" />
            <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Timing: </Text>{job.timing}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="green" />
            <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Address: </Text> {job.address}</Text>
          </View>
        </View>
  
        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyJob}>
          <Text style={styles.applyButtonText}>Apply for {isService ? 'Service' : 'Job'}</Text>
        </TouchableOpacity>
        <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={50} color="green" />
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Text style={styles.successText}>
              You successfully applied for the {isService ? 'service' : 'job'}.
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ScrollView>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  headerContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'green',
  },
  iconShare: {
    position: 'absolute',
    top: 10,
    right: 50,
  },
  iconSave: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  company: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
  },
  salary: {
    fontSize: 15,
    color: '#28a745',
    textAlign: 'center',
    marginTop: 5,
  },
  jobType: {
    fontSize: 15,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skill: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 5,
    margin: 5,
    fontSize: 14,
    color: '#333',
  },
  applyButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  experience: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  congratsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  successText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  okButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default JobDetails;

// Home.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,ScrollView } from 'react-native';

import { SafeAreaView, } from 'react-native-safe-area-context'; 
import Headers from '../components/Header';
const JobCard = () => {
    return (
      <View style={styles.card}>
        {/* Company Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>B.</Text>
        </View>
  
        {/* Job Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.jobTitle}>UI Designer</Text>
          <Text style={styles.companyName}>BrioSoft Solutions</Text>
          <Text style={styles.location}>New York, USA</Text>
  
          {/* Job Tags */}
          <View style={styles.tagsContainer}>
            <Text style={styles.tag}>Full-Time</Text>
            <Text style={styles.tag}>Remote</Text>
            <Text style={styles.tag}>Internship</Text>
          </View>
  
          {/* Bottom Section */}
          <View style={styles.bottomContainer}>
            {/* Applicants */}
            <View style={styles.applicantsContainer}>
              <Image
                style={styles.applicantImage}
                source={{ uri: 'https://via.placeholder.com/40' }}
              />
              <Image
                style={styles.applicantImage}
                source={{ uri: 'https://via.placeholder.com/40' }}
              />
              <Image
                style={styles.applicantImage}
                source={{ uri: 'https://via.placeholder.com/40' }}
              />
              <Text style={styles.moreApplicants}>+ 322 Applicants</Text>
            </View>
  
            {/* Salary */}
            <Text style={styles.salary}>$42k - $48k /month</Text>
          </View>
        </View>
  
        {/* Bookmark Icon */}
        <TouchableOpacity style={styles.bookmarkContainer}>
          <View style={styles.bookmarkIcon}></View>
        </TouchableOpacity>
      </View>
    );
  };

const AllApplications = () => {
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
       
       <ScrollView style={{ flex: 1 }}>
       <Headers />
            <JobCard />
       </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    ShareBtn: {
        height: 20,
        width: 20,
        tintColor: '#6ab04c', 
    },   
    Buttons:{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'space-evenly',
        gap: 5, 
    },
    line:{
        height: 1,
        backgroundColor: '#999', 
        width: '100%',
        marginVertical: 5,
    },
    jobtitleDifference: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', // Ensures vertical alignment
    },
    
    textCircle: {
        flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    gap: 5, 
    },
      Postimage: {
        width: 50,
        height: 50,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#BA2F16',
    },
    image: {
        width: 10,
        height: 10,
        tintColor: '#616C6F',
        padding: 0,
        margin: 0,

    },
    container: {
        borderWidth: 1,
        borderColor: '#6AE87B',
        borderRadius: 10,
        padding: 7,
        margin: 4,
        backgroundColor: '#fff',
        shadowColor: '#888',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',

        alignItems: 'center',
    },
    Jobtitle:{
        fontWeight: 'bold',
        fontSize: 23,
        color: '#333',
        marginLeft:3,
    },
    title: {
        
        fontSize: 18,
        color: '#333',
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#00CFCF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    circle1: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        marginRight:15,
        borderColor: '#6AE87B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleText1: {
        color: '#333',
        fontSize: 20,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1A8917',
        marginVertical: 5,
    },
    description: {
        fontSize: 11,
        color: '#555',
        marginBottom: 3,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#999',
    },
   

    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 5,
      flexDirection: 'row',
    },
    logoContainer: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: '#E6EAF9',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    logoText: {
      color: '#3B56F0',
      fontWeight: 'bold',
      fontSize: 20,
    },
    infoContainer: {
      flex: 1,
    },
    jobTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
    },
    companyName: {
      color: '#6c757d',
      fontSize: 14,
    },

    tagsContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    tag: {
      backgroundColor: '#f1f3f6',
      color: '#6c757d',
      fontSize: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5,
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    applicantsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    applicantImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: -8,
      borderWidth: 1,
      borderColor: '#fff',
    },
    moreApplicants: {
      marginLeft: 10,
      fontSize: 12,
      color: '#6c757d',
    },
    salary: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#3B56F0',
    },
    bookmarkContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
    },
    bookmarkIcon: {
      width: 12,
      height: 16,
      backgroundColor: '#3B56F0',
      borderRadius: 2,
    },
  });
  
export default AllApplications;
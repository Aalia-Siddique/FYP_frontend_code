import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView ,Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../screens/LanguageContext';
import LanguageSwitcher from '../screens/LanguageSwitcher';
import { jwtDecode } from "jwt-decode";
import { useNavigation } from '@react-navigation/native';
const HomePost = () => {
  const navigation=useNavigation();
  const { lang } = useLanguage();
  const [jobs, setJobs] = useState([]);
    const [servicePosts, setServicePosts] = useState([]);
    const [jobPosts, setJobPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('jobs'); // Default tab is 'jobs'
const [userId, setUserId] = useState<string | null>(null);
const [visibleMenuIndex, setVisibleMenuIndex] = useState<number | null>(null);

const toggleMenu = (index: number) => {
  if (visibleMenuIndex === index) {
    setVisibleMenuIndex(null);
  } else {
    setVisibleMenuIndex(index);
  }
};


useEffect(() => {
    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                console.error('User token not found.');
                return;
            }
            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken.Id;
            setUserId(userId);

            const [jobsResponse, servicesResponse] = await Promise.all([
                axios.get(`http://192.168.0.106:5140/api/JobPost?lang=${lang}`),
                axios.get(`http://192.168.0.106:5140/api/ServicePost?lang=${lang}`)
            ]);

            setJobPosts(jobsResponse.data.$values || []);
            setServicePosts(servicesResponse.data.$values || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchPosts();
}, [lang]);


 

    const formatDate = (utcDate) => {
        const date = new Date(utcDate);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    const handleDeletePost = async (postId) => {
        // Show confirmation dialog
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this post?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                console.log('Deleting post with ID:', postId);  // Debugging line
                try {
                  const response = await axios.delete(`http://192.168.0.106:5140/api/JobPost/${postId}`);
                  console.log('Delete Response:', response);  // Check the response
      
                  if (response.status === 204) {
                    // Show success confirmation alert
                    Alert.alert('Success', 'The job has been successfully deleted!', [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Remove the deleted post from the state
                          setJobPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
                        },
                      },
                    ]);
                  } else {
                    Alert.alert('Error', 'There was an issue deleting the job.');
                  }
                } catch (error) {
                  console.error('Error deleting post:', error);
                  Alert.alert('Error', 'An error occurred while deleting the post.');
                }
              },
            },
          ],
          { cancelable: false }
        );
      };
      
      const handleDeleteService = async (servicePostId) => {
        // Show confirmation dialog
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this service post?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                console.log('Deleting service post with ID:', servicePostId);  // Debugging line
                try {
                  const response = await axios.delete(`http://192.168.0.106:5140/api/ServicePost/${servicePostId}`);
                  console.log('Delete Response:', response);  // Check the response
      
                  if (response.status === 204) {
                    // Show success confirmation alert
                    Alert.alert('Success', 'The service post has been successfully deleted!', [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Remove the deleted post from the state
                          setServicePosts((prevPosts) => prevPosts.filter((post) => post.id !== servicePostId));
                        },
                      },
                    ]);
                  } else {
                    Alert.alert('Error', 'There was an issue deleting the service post.');
                  }
                } catch (error) {
                  console.error('Error deleting service post:', error);
                  Alert.alert('Error', 'An error occurred while deleting the service post.');
                }
              },
            },
          ],
          { cancelable: false }
        );
      };
      
    return (
        <View style={styles.container}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <LanguageSwitcher />

                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'jobs' && styles.activeTab]} 
                    onPress={() => setActiveTab('jobs')}
                >
                   <Text style={[styles.tabText, activeTab === 'jobs' && { color: '#fff' }]}>Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'services' && styles.activeTab]} 
                    onPress={() => setActiveTab('services')}
                >
                    <Text style={styles.tabText}>Services</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {activeTab === 'jobs' ? (
                    jobPosts.length > 0 ? (
                        jobPosts.map((jobPost, index) => (
                            <View key={`job-${index}`} style={styles.postContainer}>
                                <View style={styles.header}>
                                    <Image source={{ uri: `http://192.168.0.106:5165/${jobPost.userImage}` }} resizeMode="cover" style={styles.Postimage} />
                                    <View style={styles.jobtitleDifference}>
                                        <Text style={styles.Jobtitle}>{jobPost.name}</Text>
   {jobPost.userId === userId ? (
  <View style={styles.iconButtonsContainer}>
    <TouchableOpacity
  style={styles.iconButton}
  onPress={() => navigation.navigate('EditJobScreen', { jobPost, setJobPosts })}  // Pass data
>
  <Image source={require('../../assests/icons/edit.png')} style={styles.icon} />
</TouchableOpacity>
    <TouchableOpacity
      onPress={() => handleDeletePost(jobPost.id)}
      style={styles.iconButton}
    >
      <Image
        source={require('../../assests/icons/delete.png')}
        style={styles.icon1}
      />
    </TouchableOpacity>
  </View>
) : (
  <Text></Text>
)}

    </View>
  </View>

                                <Text style={styles.price}>Rs. {jobPost.minSalary} - {jobPost.maxSalary}</Text>
                                <Text style={styles.description}
                                  numberOfLines={2}>
                                    {jobPost.description}</Text>
                                <View style={styles.footer}>
                                    <View style={styles.location}>
                                        <Image source={require('../../assests/icons/maps-and-flags.png')} resizeMode="contain" style={styles.image} />
                                        <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 12, color: 'red' }]}>{jobPost.location}</Text>
                                    </View>
                                    <View style={styles.location}>
                                        <Image source={require('../../assests/icons/clock.png')} resizeMode="contain" style={styles.image} />
                                        <Text style={styles.footerText}>{formatDate(jobPost.datePosted)}</Text>
                                    </View>
                                </View>
                               

                                <View style={styles.line} />
                                
                                <View style={styles.Buttons}>
                                    <TouchableOpacity>
                                        <Image source={require('../../assests/icons/share.png')} resizeMode="contain" style={styles.ShareBtn} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={require('../../assests/icons/bookmark.png')} resizeMode="contain" style={styles.ShareBtn} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>Loading Jobs...</Text>
                    )
                ) : (
                  servicePosts.length > 0 ? (
                    servicePosts.map((servicePost, index) => (
                      <View key={`service-${index}`} style={styles.postContainer}>
                        <View style={styles.header}>
                          <Image 
                            source={{ uri: `http://192.168.0.106:5165/${servicePost.userImage}` }} 
                            resizeMode="cover" 
                            style={styles.Postimage} 
                            cache="reload"
                          />
                          <View style={styles.jobtitleDifference}>
                            <Text style={styles.Jobtitle}>{servicePost.name}</Text>
                            
                            {servicePost.userId === userId ? (
                              <View style={styles.iconButtonsContainer}>
                                <TouchableOpacity
                                  style={styles.iconButton}
                                  onPress={() => navigation.navigate('EditServiceScreen', { servicePost, setServicePosts })}  // Pass data
                                >
                                  <Image source={require('../../assests/icons/edit.png')} style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleDeleteService(servicePost.id)}
                                  style={styles.iconButton}
                                >
                                  <Image
                                    source={require('../../assests/icons/delete.png')}
                                    style={styles.icon1}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <Text></Text>
                            )}
                  
                            {/* <View style={styles.circle1}>
                              <Text style={styles.circleText1}>10</Text>
                            </View> */}
                          </View>
                        </View>
                  
                        <Text style={styles.price}>Rs. {servicePost.minSalary} - {servicePost.maxSalary}</Text>
                        <Text style={styles.description}
                         numberOfLines={2}>{servicePost.description}</Text>
                  
                        <View style={styles.footer}>
                          <View style={styles.location}>
                            <Image 
                              source={require('../../assests/icons/maps-and-flags.png')} 
                              resizeMode="contain" 
                              style={styles.image} 
                              cache="reload"
                            />
                            <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 12, color: 'red' }]}>
                              {servicePost.location}
                            </Text>
                          </View>
                  
                          <View style={styles.location}>
                            <Image 
                              source={require('../../assests/icons/clock.png')} 
                              resizeMode="contain" 
                              style={styles.image} 
                            />
                            <Text style={styles.footerText}>{formatDate(servicePost.datePosted)}</Text>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text>Loading Services...</Text>
                  )
                )}
                </ScrollView>
            </View>
        );
    }                  
const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    ShareBtn: {
        height: 20,
        width: 20,
        tintColor: '#6ab04c',
    },
    Buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 5,
    },
    line: {
        height: 1,
        backgroundColor: '#999',
        width: '100%',
        marginVertical: 5,
    },
    jobtitleDifference: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        padding: 10,
        margin: 10,
        marginTop:0
    },
    postContainer: {
        borderWidth: 1,
        borderColor: '#6AE87B',
        borderRadius: 10,
        padding: 7,
        marginBottom: 15,
        backgroundColor: '#fff',
        shadowColor: '#888',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Jobtitle: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#333',
        marginLeft: 3,
    },
    circle1: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        marginRight: 5,
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
        fontWeight: 'bold',
        margin: 5,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    location1: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop:3,
        
        // flexDirection: 'row',
        // alignItems: 'center',
       
    },
    footerText: {
        fontSize: 10,
        color: '#999',
    },
    footerText1: {
        fontSize: 12,
        color: '#999',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#E5F9E0',
        padding: 6,
        borderRadius: 20,
        marginBottom: 15,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#fff',
    },
    
    activeTab: {
        backgroundColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 6,
    },
    
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    
    dotsIcon: {
        width: 20,
        height: 20,
        marginLeft: 10,
      },
      
    //   editButtons: {
    //     flexDirection: 'row',
    //     justifyContent: 'flex-end',
    //     marginTop: 10,
    //   },
      
    //   editBtn: {
    //     backgroundColor: '#4CAF50',
    //     padding: 5,
    //     marginHorizontal: 5,
    //     borderRadius: 5,
    //   },
      
    //   deleteBtn: {
    //     backgroundColor: '#f44336',
    //     padding: 5,
    //     marginHorizontal: 5,
    //     borderRadius: 5,
    //   },
      
    //   editText: {
    //     color: '#fff',
    //     fontSize: 12,
    //   },
      
    //   deleteText: {
    //     color: '#fff',
    //     fontSize: 12,
    //   },
      dropdownMenu: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginVertical: 5,
        marginLeft: 'auto',
        marginRight: 10,
        width: 130,  // Adjusted width for side-by-side buttons
        position: 'absolute',
        top: 40,
        right: 10,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
    
      buttonContainer: {
        flexDirection: 'row',  // Align buttons horizontally
        justifyContent: 'space-between',  // Add space between buttons
      },
    
      dropdownText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
      },
    
      // Updated button styles for Update and Delete
      editBtn: {
        backgroundColor: '#4CAF50',  // Green color for Update button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin:7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,  // Space between buttons
      },
    
      deleteBtn: {
        backgroundColor: '#F44336',  // Red color for Delete button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      // Optional: If you want hover-like effect for web
      editBtnHovered: {
        backgroundColor: '#45a049', // Slightly darker green for hover
      },
    
      deleteBtnHovered: {
        backgroundColor: '#d32f2f', // Slightly darker red for hover
      },
    
      iconButtonsContainer: {
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
},

iconButton: {
  padding: 5,
  color:'red'
},

icon: {
  width: 20,
  height: 20,
  tintColor: '#444',
},
icon1: {
  width: 20,
  height: 20,
  tintColor: 'green',
},

      
});

export default HomePost;

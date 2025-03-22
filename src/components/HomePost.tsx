import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
const imageMap = {
    "service1.jpg": require('../../Images/Homeimages/m1.jpeg'),
    "service2.jpg": require('../../Images/Homeimages/m2.jpeg'),
    "service3.jpg": require('../../Images/Homeimages/m3.jpeg'),
    // Add other images here as needed
};


const HomePost = () => {
    // const [servicePosts, setServicePosts] = useState([]); // State to store multiple posts

    // useEffect(() => {
    //     // Make API call to fetch all service posts
    //     axios.get('http://192.168.108.30:5229/api/ServicePost') // Update with your actual API URL
    //         .then((response) => {
    //             setServicePosts(response.data); // Store all posts
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching service posts:', error);
    //         });
    // }, []);
    const [servicePosts, setServicePosts] = useState([]); // State for service posts
    const [jobPosts, setJobPosts] = useState([]); // State for job posts


useEffect(() => {
    const fetchServicePosts = axios.get('http://192.168.108.30:5140/api/ServicePost');
    const fetchJobPosts = axios.get('http://192.168.108.30:5140/api/JobPost');

    Promise.all([fetchServicePosts, fetchJobPosts])
        .then(([servicesResponse, jobsResponse]) => {
            console.log("Full Service Response:", servicesResponse);
            console.log("Full Job Response:", jobsResponse);

            // Extract actual array from "$values"
            setServicePosts(servicesResponse.data.$values || []);
            setJobPosts(jobsResponse.data.$values || []);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);

    if (servicePosts.length === 0) {
        return <Text>Loading...</Text>;
    }
    const formatDate = (utcDate) => {
        const date = new Date(utcDate); // Convert UTC date string to Date object
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
        const year = date.getFullYear(); // Get full year
        return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
    };
    return (
        <ScrollView style={styles.container}>
            {/* Section for Service Posts */}
            <Text style={styles.sectionHeader}>Services</Text>
            {servicePosts.length > 0 ? (
                servicePosts.map((servicePost, index) => (
                    <View key={`service-${index}`} style={styles.postContainer}>
                        {/* Same layout for services */}
                        <View style={styles.header}>
                            <Image
                                source={imageMap[servicePost.imageName] || require('../../Images/Homeimages/m1.jpeg')}
                                resizeMode="cover"
                                style={styles.Postimage}
                            />
                            <View style={styles.jobtitleDifference}>
                                <Text style={styles.Jobtitle}>{servicePost.name}</Text>
                                <View style={styles.circle1}>
                                    <Text style={styles.circleText1}>10</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.price}>Rs. {servicePost.minSalary} - {servicePost.maxSalary}</Text>
                        <Text style={styles.description}>{servicePost.description}</Text>
                        
                       <View style={styles.footer}>
                                                   <View style={styles.location}>
                                                       <Image
                                                           source={require('../../assests/icons/maps-and-flags.png')}
                                                           resizeMode="contain"
                                                           style={styles.image}
                                                       />
                                                       <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 12, color: 'red' }]}>{servicePost.location}</Text>
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
                                               
                        {/* <View style={styles.location1}>
                            <Image
                                source={require('../../assests/icons/clock.png')}
                                resizeMode="contain"
                                style={styles.image}
                            />
                            <Text style={styles.footerText}>{formatDate(servicePost.datePosted)}</Text>
                        </View> */}
                    
                    <View style={styles.line} />

                    <View style={styles.Buttons}>
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
                ))
            ) : (
                <Text>Loading services...</Text>
            )}

            {/* Section for Job Posts */}
            <Text style={styles.sectionHeader}>Jobs</Text>
            {jobPosts.length > 0 ? (
                jobPosts.map((jobPost, index) => (
                    <View key={`job-${index}`} style={styles.postContainer}>
                        {/* Same layout for jobs */}
                        <View style={styles.header}>
                       
                            <Image
                                source={imageMap[jobPost.imageName] || require('../../Images/Homeimages/m1.jpeg')}
                                resizeMode="cover"
                                style={styles.Postimage}
                            />
                            <View style={styles.jobtitleDifference}>
                                <Text style={styles.Jobtitle}>{jobPost.name}</Text>
                                <View style={styles.circle1}>
                                    <Text style={styles.circleText1}>5</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.price}>Rs. {jobPost.minSalary} - {jobPost.maxSalary}</Text>
                        <Text style={styles.description}>{jobPost.description}</Text>
                        <View style={styles.footer}>
                        <View style={styles.location}>
                            <Image
                                source={require('../../assests/icons/maps-and-flags.png')}
                                resizeMode="contain"
                                style={styles.image}
                            />
                            <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 12, color: 'red' }]}>{jobPost.address}</Text>
                        </View>
                        <View style={styles.location1}>
                        <Text style={styles.footerText}>Posted on:</Text>
                            <Image
                                source={require('../../assests/icons/clock.png')}
                                resizeMode="contain"
                                style={styles.image}
                            />
                            <Text style={styles.footerText}>{formatDate(jobPost.datePosted)}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.line} />

                    <View style={styles.Buttons}>
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
                ))
            ) : (
                <Text>Loading jobs...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
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
        padding: 7,
        margin: 15,
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
});

export default HomePost;

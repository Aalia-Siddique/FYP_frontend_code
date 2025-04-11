import React, { useEffect, useState ,useCallback} from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image,Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native'; // Import the hook
const initialLayout = { width: Dimensions.get("window").width };

const JobsScreen = ({ jobs }) => {
    const navigation = useNavigation(); // ✅ Add navigation hook

    return (
        <View>
           
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.salary}>Rs. {item.minSalary} - {item.maxSalary}</Text>
                        <Text style={styles.location}>📍 {item.location}</Text>
                        <Text style={styles.date}>📅 {new Date(item.datePosted).toDateString()}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("ApplicantsScreen", { jobId: item.id, jobType: item.type })}
                        >
                            <Text style={styles.buttonText}>View Applicants</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const ServicesScreen = ({ services }) => {
    const navigation = useNavigation();

    return (
        <View>
            {/* <Text style={styles.heading}>Services</Text> */}
            <FlatList
                data={services}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                        {/* <Text>{item.description}</Text> */}
                        <Text style={styles.salary}>Rs. {item.minSalary} - {item.maxSalary}</Text>
                        <Text style={styles.location}>📍 {item.location}</Text>
                        <Text style={styles.date}>📅 {new Date(item.datePosted).toDateString()}</Text>

                        {/* ✅ View Applicants Button Added */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("ApplicantsScreen", { jobId: item.id, jobType: item.type })}
                        >
                            <Text style={styles.buttonText}>View Applicants</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};
const AppliedJobs= () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const formatDate = (utcDate) => {
      const date = new Date(utcDate); // Convert UTC date string to Date object
      const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
      const year = date.getFullYear(); // Get full year
      return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
  };
    useEffect(() => {
      fetchUserId();
    }, []);
  
    useEffect(() => {
      if (userId) {
        fetchAppliedJobs(userId);
      }
    }, [userId]);


    useFocusEffect(
      useCallback(() => {
        if (userId) {
          fetchAppliedJobs(userId); // Refresh applied jobs when screen focuses
        }
      }, [userId]) // Re-run this when the userId changes
    );
  
    const fetchUserId = async () => {
      try {
        console.log("Fetching User ID...");
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          console.error("User token not found.");
          return;
        }
        const decodedToken: any = jwtDecode(token);
        setUserId(decodedToken.Id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
  
    const fetchAppliedJobs = async (userId: string) => {
      try {
        console.log("Fetching Applied Jobs for User:", userId);
        const API_URL = `http://192.168.100.22:5140/api/UserJob/GetUserAppliedJobs?UserId=${userId}`;
        const response = await axios.get(API_URL);
    
        console.log("API Response:", response.data);
    
        // ✅ Extract User Image & Jobs from API response
       
        const userImage = response.data?.userImage || ""; 
        console.log("img",userImage);// Default empty string if not found
        const jobList = response.data?.appliedJobs?.$values || [];

        // ✅ Map jobs to include User Image (so it can be used in UI)
        const jobsWithImages = jobList.map(job => ({
          ...job,
          userImage: userImage,  // Attach user image to each job
        }));
    
        setJobs(jobsWithImages);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
  
    if (loading) {
      return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
    }
  
    return (
      <View style={styles.container1}>
     
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.card1}>
            {/* Job Header */}
            <View style={styles.header}>
            <Image
  source={{ uri: `http://192.168.100.22:5165/${item.userImage}` }} // ✅ "/" already included in API response
  resizeMode="cover"
  style={styles.Postimage}
/>

              <View style={styles.jobtitleContainer}>
                <Text style={styles.Jobtitle}>{item.name}</Text>
              </View>
            </View>

            {/* Salary & Workplace Type */}
            <Text style={styles.price}>
              Rs. {item.minSalary} - {item.maxSalary}
            </Text>

            {/* Footer Details */}
            <View style={styles.footer}>
              <View style={styles.location}>
                <Image source={require("../../assests/icons/maps-and-flags.png")} resizeMode="contain" style={styles.image} />
                <Text style={styles.footerText}>{item.location}</Text>
              </View>
              <View style={styles.location}>
                <Image source={require("../../assests/icons/clock.png")} resizeMode="contain" style={styles.image} />
                <Text style={styles.footerText}>{formatDate(item.datePosted)}</Text>
              </View>
            </View>

            <View style={styles.line} />

            {/* Apply & Save Buttons */}
            <View style={styles.Buttons}>
              <Text style={styles.footerText1}>Applied {item.appliedDate}</Text>
              <TouchableOpacity>
                <Image source={require("../../assests/icons/share.png")} resizeMode="contain" style={styles.ShareBtn} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require("../../assests/icons/bookmark.png")} resizeMode="contain" style={styles.ShareBtn} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};


  const AppliedServices = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const formatDate = (utcDate) => {
      const date = new Date(utcDate); // Convert UTC date string to Date object
      const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
      const year = date.getFullYear(); // Get full year
      return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
  };
    useEffect(() => {
      fetchUserId();
    }, []);
  
    useEffect(() => {
      if (userId) {
        fetchAppliedJobs(userId);
      }
    }, [userId]);
  
    useFocusEffect(
      useCallback(() => {
        if (userId) {
          fetchAppliedJobs(userId); // Refresh applied jobs when screen focuses
        }
      }, [userId]) // Re-run this when the userId changes
    );
    const fetchUserId = async () => {
      try {
        console.log("Fetching User ID...");
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          console.error("User token not found.");
          return;
        }
        const decodedToken: any = jwtDecode(token);
        setUserId(decodedToken.Id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
  
    const fetchAppliedJobs = async (userId: string) => {
        try {
          console.log("Fetching Applied Jobs for User:", userId);
          const API_URL = `http://192.168.100.22:5140/api/UserJob/GetUserAppliedService?UserId=${userId}`;
          const response = await axios.get(API_URL);
      
          console.log("API Response:", response.data);
      
          // ✅ Extract User Image & Jobs from API response
          const userImage = response.data?.userImage || ""; // Default empty string if not found
          const serviceList = response.data?.appliedServices.$values|| [];
      
          // ✅ Map jobs to include User Image (so it can be used in UI)
          const servicesWithImages = serviceList.map(service => ({
            ...service,
            userImage: userImage,  // Attach user image to each job
          }));
      
          setJobs(servicesWithImages);
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
        } finally {
          setLoading(false);
        }
      };
      
  
    if (loading) {
      return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
    }
  
    return (
      <View style={styles.container1}>
       
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
  
          renderItem={({ item }) => (
            <View style={styles.card1}>
              {/* Job Header */}
              <View style={styles.header}>
                <Image source={{ uri: `http://192.168.100.22:5165/${item.userImage}` }} resizeMode="cover" style={styles.Postimage} />
                <View style={styles.jobtitleContainer}>
                  <Text style={styles.Jobtitle}>{item.name}</Text>
                  
                  {/* <View style={styles.circle1}>
                      <Text style={styles.circleText1}>5</Text>
                      </View> */}
                  {/* <Text style={styles.companyName}>{item.companyName}</Text> */}
                </View>
                {/* <View
                  style={[
                    styles.jobTypeBadge,
                    item.jobType === "Full-time" ? styles.fullTime : styles.partTime,
                  ]}
                >
                  <Text style={styles.jobTypeText}>{item.jobType}</Text>
                </View> */}
              </View>
  
              {/* Salary & Workplace Type */}
              <Text style={styles.price}>
                Rs. {item.minSalary} - {item.maxSalary} 
              </Text>
  
              {/* Footer Details */}
              <View style={styles.footer}>
                <View style={styles.location}>
                  <Image
                    source={require("../../assests/icons/maps-and-flags.png")}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  <Text style={styles.footerText}>{item.location}</Text>
                </View>
                <View style={styles.location}>
                  <Image
                    source={require("../../assests/icons/clock.png")}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  <Text style={styles.footerText}>{formatDate(item.datePosted)}</Text>
                </View>
              </View>
  
              <View style={styles.line} />
  
              {/* Apply & Save Buttons */}
              <View style={styles.Buttons}>
              <Text style={styles.footerText1}>Applied {item.appliedDate}</Text>
                <TouchableOpacity>
                  <Image
                    source={require("../../assests/icons/share.png")}
                    resizeMode="contain"
                    style={styles.ShareBtn}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require("../../assests/icons/bookmark.png")}
                    resizeMode="contain"
                    style={styles.ShareBtn}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  };
  const MyJobsScreen: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0); 
    const [userId, setUserId] = useState<string | null>(null);
    const navigation = useNavigation();
    const initialLayout = { width: Dimensions.get('window').width };
    const [routes] = useState([
      { key: "jobs", title: "Jobs" },
      { key: "services", title: "Services" },
      { key: "appliedJobs", title: "Applied Jobs" },
      { key: "appliedServices", title: "Applied Services" },
    ]);
  
    useEffect(() => {
      fetchUserId();
    }, []);
  
    useEffect(() => {
      if (userId) {
        fetchJobsAndServices(userId);
      }
    }, [userId]);
  //   useFocusEffect(
  //     useCallback(() => {
  //       if (userId) {
  //         fetchJobsAndServices(userId); // Refresh jobs when screen focuses
  //       }
  //     }, [userId]) // Re-run this when the userId changes
  //   );
  // // 
    const fetchUserId = async () => {
      try {
        console.log("Fetching User ID...");
        const token = await AsyncStorage.getItem("jwtToken");
  
        if (!token) {
          console.error("User token not found.");
          return;
        }
  
        const decodedToken: any = jwtDecode(token);
        setUserId(decodedToken.Id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
  
    const fetchJobsAndServices = async (userId: string) => {
      try {
        console.log("Fetching Jobs & Services for User:", userId);
    
        // Fetching data from API
        const API_URL = `http://192.168.100.22:5140/api/Category/GetAllJobsAndServices?UserId=${userId}`;
        const response = await fetch(API_URL);
    
        if (!response.ok) {
          throw new Error("Failed to fetch jobs and services");
        }
    
        const result = await response.json();
        console.log("API Response 1:", JSON.stringify(result, null, 2)); // Use JSON.stringify to log the entire response
    
        // Check if Jobs and Services are nested in `$values`
        const jobs = result.jobs?.$values ?? [];
        const services = result.services?.$values ?? [];
    
        // Log out the values if you need to inspect them
        console.log("Jobs Array:", JSON.stringify(jobs, null, 2));
        console.log("Services Array:", JSON.stringify(services, null, 2));
    
        // Set state for jobs and services
        setJobs(jobs);
        setServices(services);
    
      } catch (error) {
        console.error("Error fetching jobs and services:", error);
      } finally {
        setLoading(false);
      }
    };
    useFocusEffect(
      useCallback(() => {
        if (userId) {
          fetchJobsAndServices(userId); // Refresh jobs when screen focuses
        }
      }, [userId]) // Re-run this when the userId changes
    );
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderScene = ({ route }) => {
    switch (route.key) {
        case 'jobs':
            return <JobsScreen jobs={jobs} />;
        case 'services':
            return <ServicesScreen services={services} />;
        case 'appliedJobs':
            return <AppliedJobs />; // Change with actual component
        case 'appliedServices':
            return <AppliedServices/>; // Change with actual component
        default:
            return null;
    }
};


  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'green' }}  // Tab indicator color
          style={{ backgroundColor: 'white' }}  // Tab bar background color
          activeColor="green"  // Color for active tab text
          inactiveColor="gray"  // Color for inactive tab text
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    card: { backgroundColor: "#fff", padding: 15, margin: 12, borderRadius: 8, elevation: 3 },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },
    salary: { fontSize: 16, fontWeight: "bold", color: "green" },
    location: { fontSize: 14, color: "blue", marginTop: 5 },
    date: { fontSize: 14, color: "gray", marginTop: 3 },
    button: {
      backgroundColor: "#007bff",
      padding: 10,
      marginTop: 5,
      borderRadius: 5,
      alignItems: "center",
  },
  buttonText: {
      color: "#fff",
      fontWeight: "bold",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholder: { padding: 20, fontSize: 18, textAlign: "center", color: "gray" },
  jobTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to start
    position: 'relative', // Needed for absolute positioning
},
jobTypeBadge: {
    position: 'absolute',
    right: 3, // Move it to the top right
    top: 5,  // Slightly down from the top
   // backgroundColor: '#6AE87B', // Example color for visibility
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
},
  Jobtitle: { fontWeight: "bold", fontSize: 17, color: "#333", marginLeft: 3 },
  companyName: { fontSize: 14, color: "#666", marginTop: 2 },
 // jobTypeBadge: { borderRadius: 5, alignSelf:"auto",right:5},
  fullTime: { color: "green" },
  partTime: { color: "red" },
  jobTypeText: { fontSize: 14, fontWeight: "bold", color: "green" },
  price: { fontSize: 14, marginVertical: 5, marginTop: 7 },
  footer: { flexDirection: "row", justifyContent: "space-between", margin: 5 },
  location: { flexDirection: "row", alignItems: "center", fontSize: 12 },
  footerText: { fontSize: 10, color: "#999" },
  footerText1: { fontSize: 11, color: "red" ,fontWeight:"bold"},
  image: { width: 20, height: 20, tintColor: "#616C6F" },
  Postimage: { width: 50, height: 50, borderRadius: 45, borderWidth: 2, borderColor: "#BA2F16" },
  line: { height: 1, backgroundColor: "#999", width: "100%", marginVertical: 5 },
  Buttons: { flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" },
  applyButton: { backgroundColor: "rgba(255, 0, 0, 0.6)", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  applyButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  ShareBtn: { height: 20, width: 20, tintColor: "#6ab04c" },
  container1: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  heading1: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card1: { backgroundColor: "#fff", padding: 15, marginVertical: 8, borderRadius: 8, elevation: 3,borderWidth:2, borderColor: '#6AE87B' },
});

export default MyJobsScreen;

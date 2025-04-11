import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For icons
const defaultImage = require("../../Images/Homeimages/m1.jpeg");

import { jwtDecode } from "jwt-decode";
interface UserJob {
  id: string;
  name: string;
  phoneNumber: string;
  userImage: string;
}

interface ApiResponse {
  $id: string;
  $values: (UserJob | null)[];
}
const AcceptedApplicants: React.FC<{
  route: { params: { jobId: number; jobType: string } };
}> = ({ route }) => {
  const { jobId, jobType } = route.params;
  const [applicants, setApplicants] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAcceptedApplicants(); // Call function to fetch applicants again
    });
  
    return unsubscribe; // Cleanup listener when screen is not in focus
  }, [navigation, jobId, jobType]);
  

  const fetchAcceptedApplicants = async (): Promise<void> => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }
      const decodedToken: any = jwtDecode(token);
       const userId = decodedToken.Id;

      let apiUrl =
        jobType.toLowerCase() === "job"
          ? `http://192.168.100.22:5140/api/UserJob/GetAcceptedApplicantsByJob/${jobId}`
          : `http://192.168.100.22:5140/api/UserJob/GetAcceptedApplicantsByService/${jobId}`;

      const response = await fetch(apiUrl);
      const result: ApiResponse = await response.json();

      if (result?.$values) {
        setApplicants(result.$values.filter((item) => item !== null) as UserJob[]);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error("Error fetching accepted applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Accepted Applicants</Text>

      {applicants.length > 0 ? (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.profileSection}>
                <Image
                                  source={{ 
                                    uri: item.userImage 
                                      ? `http://192.168.100.22:5165/${item.userImage}` 
                                      : Image.resolveAssetSource(defaultImage).uri
                                  }} 
                                  style={styles.userImage}
                                  resizeMode="cover"
                                />
                <Text style={styles.name}>{item.name}</Text>
              </View>

              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() =>
                  navigation.navigate("AcceptedAppplicantProfile", { userId: item.id })
                }
              >
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noApplicants}>No Accepted Applicants Found</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
    },
    card: {
      backgroundColor: "#f9f9f9",
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
    },
    viewProfileButton: {
      backgroundColor: "#3498db",
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    viewProfileText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    noApplicants: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 20,
    },
  });
  
export default AcceptedApplicants;

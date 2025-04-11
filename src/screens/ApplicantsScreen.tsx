import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
const defaultImage = require("../../Images/Homeimages/m1.jpeg");
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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

const ApplicantsScreen: React.FC<{ route: { params: { jobId: number; jobType: string } } }> = ({ route }) => {
  const { jobId, jobType } = route.params;
  const [applicants, setApplicants] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptedApplicants, setAcceptedApplicants] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<UserJob | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      fetchApplicants();
      fetchAcceptedApplicants(); // ✅ every time screen comes into focus
    }, [jobId, jobType])
  );

  const fetchApplicants = async (): Promise<void> => {
    try {
      setLoading(true);
      let apiUrl = jobType.toLowerCase() === "job" 
        ? `http://192.168.100.22:5140/api/UserJob/GetApplicantsByJob/${jobId}` 
        : `http://192.168.100.22:5140/api/UserJob/GetApplicantsByService/${jobId}`;

      const response = await fetch(apiUrl);
      const result: ApiResponse = await response.json();

      if (result?.$values) {
        setApplicants(result.$values.filter((item) => item !== null) as UserJob[]);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedApplicants = async () => {
    const storedApplicants = await AsyncStorage.getItem('acceptedApplicants');
    if (storedApplicants) {
      setAcceptedApplicants(JSON.parse(storedApplicants));
    }
  };

  const handleAcceptApplicant = async (applicant: UserJob) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }
  
      const apiUrl = jobType.toLowerCase() === "job"
        ? "http://192.168.100.22:5140/api/UserJob/AcceptedJobApplication"
        : "http://192.168.100.22:5140/api/UserJob/AcceptedServiceApplication";
  
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.Id;
      const bodyData = jobType.toLowerCase() === "job" 
        ? { jobId, applicantId: applicant.id, userId, jobsStatus: "Accepted" } 
        : { serviceId: jobId, applicantId: applicant.id, userId, serviceStatus: "Accepted" };
  
      console.log("Request body:", JSON.stringify(bodyData));
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
  
      const responseText = await response.text();
  
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error("Failed to parse response:", responseText);
        alert(`Error: ${responseText}`);
        return;
      }
  
      if (response.ok) {
        // Store the accepted applicant in AsyncStorage
        const key = `${jobType}-${jobId}-${applicant.id}`;
        const storedApplicants = await AsyncStorage.getItem('acceptedApplicants');
        let updatedApplicants = storedApplicants ? JSON.parse(storedApplicants) : [];
  
        updatedApplicants.push(key);
        await AsyncStorage.setItem('acceptedApplicants', JSON.stringify(updatedApplicants));
  
        setAcceptedApplicants(updatedApplicants);  // Update local state
        setSelectedApplicant(applicant);
        setModalVisible(true);
      } else {
        console.error("Failed to accept applicant:", responseData);
        alert(`Error: ${responseData.message || "Failed to accept applicant"}`);
      }
    } catch (error) {
      console.error("Error accepting applicant:", error);
      alert(`Error: ${error.message || "Something went wrong!"}`);
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Applicants</Text>

      <TouchableOpacity 
        style={styles.acceptedBtn} 
        onPress={() => navigation.navigate('AcceptedApplicants', { jobId, jobType })}
      >
        <Text style={styles.acceptedBtnText}>View Accepted Applicants</Text>
      </TouchableOpacity>

      {applicants.length > 0 ? (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isAccepted = acceptedApplicants.includes(`${jobType}-${jobId}-${item.id}`);
            return (
              <View style={styles.card}>
                <View style={styles.profileSection}>
                  <Image
                    source={{
                      uri: item.userImage
                        ? `http://192.168.100.22:5165/${item.userImage}`
                        : Image.resolveAssetSource(defaultImage).uri,
                    }}
                    style={styles.userImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.name}>{item.name}</Text>

                  <View style={styles.actionButtons}>
                  <TouchableOpacity
                      style={[
                        styles.acceptButton,
                        { backgroundColor: isAccepted ? '#4CAF50' : '#008CBA' } // Conditional color change
                      ]}
                      onPress={() => handleAcceptApplicant(item)}
                      disabled={isAccepted}
                    >
                      <Text style={styles.acceptButtonText}>
                        {isAccepted ? "Accepted" : "Accept"}
                      </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => alert("Decline functionality pending")}
                    >
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
                  >
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noApplicants}>No Applicants Found</Text>
      )}

      {/* Modal for Success Message */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
              <Text style={styles.modalTitle}>Application Accepted</Text>
            </View>

            <Text style={styles.modalText}>
              You have accepted {selectedApplicant?.name}'s application. 
              You can contact them via chat or call at {selectedApplicant?.phoneNumber}.
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => navigation.navigate("ChatScreen", { userId: selectedApplicant?.id })}
              >
                <Ionicons name="chatbubble" size={16} color="white" />
                <Text style={styles.modalButtonText}> Start Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" ,marginTop:30},
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "space-between",
  },
  acceptedBtn: {
    backgroundColor: "#4CAF50", // Green color
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  acceptedBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileSection: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1, 
  },

  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

 
  viewProfileButton: {
    backgroundColor: "#1E90FF",  // Solid blue color for the background
    borderRadius: 25,  // Rounded corners
    paddingVertical: 10,  // Adequate vertical padding
    paddingHorizontal: 20,  // Adequate horizontal padding
    marginTop: 20,  // Slightly increased top margin
    width: 220,  // A comfortable button width
    alignItems: 'center',  // Center the text horizontally
    justifyContent: 'center',  // Center the text vertically
  },
  
  viewProfileText: {
    fontSize: 13,  // Slightly larger font size for readability
    fontWeight: "bold",
    color: "#fff",  // White text for contrast
    textAlign: 'center',  // Center the text inside the button
    textTransform: 'uppercase',  // Optional: Make text uppercase for a more modern look
  },
  
  acceptButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  acceptedButton: {
    backgroundColor: "#28A745",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  modalContainer: {
    
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },

  closeButton: {
    position: "absolute",
    top: 6,
    right: 6,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5, // Space after the checkmark icon
  },

  modalText: {
    textAlign: "center",
    marginBottom: 20,
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  modalButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  
  declineButton: {
    backgroundColor: "#dc3545",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  
  declineButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  
});

export default ApplicantsScreen;

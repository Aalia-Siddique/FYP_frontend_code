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
  

  useEffect(() => {
    fetchApplicants();
  }, [jobId, jobType]);

  const fetchApplicants = async (): Promise<void> => {
    try {
      setLoading(true);
      let apiUrl = jobType.toLowerCase() === "job" 
        ? `http://192.168.108.30:5140/api/UserJob/GetApplicantsByJob/${jobId}` 
        : `http://192.168.108.30:5140/api/UserJob/GetApplicantsByService/${jobId}`;

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

  const handleAcceptApplicant = async (applicant: UserJob) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }
  
      const apiUrl = jobType.toLowerCase() === "job"
        ? "http://192.168.108.30:5140/api/UserJob/AcceptedJobApplication"
        : "http://192.168.108.30:5140/api/UserJob/AcceptedServiceApplication";
  
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.Id;
      const bodyData = jobType.toLowerCase() === "job" 
        ? { jobId, applicantId: applicant.id, userId, jobsStatus: "Accepted" } 
        : { serviceId: jobId, applicantId: applicant.id, userId, jobsStatus: "Accepted" };
  
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
        setAcceptedApplicants((prev) => [...prev, applicant.id]);
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
                      ? `http://192.168.108.30:5165/${item.userImage}` 
                      : Image.resolveAssetSource(defaultImage).uri
                  }} 
                  style={styles.userImage}
                  resizeMode="cover"
                />
                <Text style={styles.name}>{item.name}</Text>
              </View>
      
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.viewProfileButton} 
                  onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
      
                <TouchableOpacity
                  style={acceptedApplicants.includes(item.id) ? styles.acceptedButton : styles.acceptButton}
                  onPress={() => handleAcceptApplicant(item)}
                  disabled={acceptedApplicants.includes(item.id)}
                >
                  <Text style={styles.acceptButtonText}>
                    {acceptedApplicants.includes(item.id) ? "Accepted" : "Accept"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noApplicants}>No Applicants Found</Text>
      )}

      {/* Modal for Success Message */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            {/* Close Button on Top Right */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            {/* Title with Checkmark Icon */}
            <View style={styles.titleContainer}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
              <Text style={styles.modalTitle}>Application Accepted</Text>
            </View>

            {/* Message */}
            <Text style={styles.modalText}>
              You have accepted {selectedApplicant?.name}'s application. 
              You can contact them via chat or call at {selectedApplicant?.phoneNumber}.
            </Text>

            {/* Buttons */}
            <View style={styles.modalButtonContainer}>
              
              {/* Start Chat Button with Chat Icon */}
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
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
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
    backgroundColor: "#EAF1FF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 5,
  },

  viewProfileText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
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

});

export default ApplicantsScreen;

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from "react-native";

const defaultImage = require("../../Images/Homeimages/m1.jpeg");

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
    const navigation=useNavigation();
  useEffect(() => {
    fetchApplicants();
  }, [jobId, jobType]);

  const fetchApplicants = async (): Promise<void> => {
    try {
      setLoading(true);

      // API URL ko job ya service type k mutabiq set karna
      let apiUrl = "";
      if (jobType.toLowerCase() === "job") {
        apiUrl = `http://192.168.100.22:5140/api/UserJob/GetApplicantsByJob/${jobId}`;
      } else if (jobType.toLowerCase() === "service") {
        apiUrl = `http://192.168.100.22:5140/api/UserJob/GetApplicantsByService/${jobId}`;
      } else {
        console.error("Invalid job type:", jobType);
        setApplicants([]);
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl);
      const result: ApiResponse = await response.json();
      console.log("Applicants Response:", result);

      if (result && result.$values) {
        const filteredApplicants = result.$values.filter((item) => item !== null) as UserJob[];
        setApplicants(filteredApplicants);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
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
          keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()} 
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ 
                  uri: item.userImage 
                    ? `http://192.168.100.22:5165/${item.userImage}` 
                    : Image.resolveAssetSource(defaultImage).uri
                }} 
                style={styles.userImage}
                resizeMode="cover" 
                onError={() => console.log(`Failed to load: ${item.userImage}`)}
              />
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
              </View>
              <TouchableOpacity 
  style={styles.viewProfileButton} 
  onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
>
  <Text style={styles.viewProfileText}>View Profile</Text>
</TouchableOpacity>

            </View>
          )}
        />
      ) : (
        <Text style={styles.noApplicants}>No Applicants Found</Text>
      )}
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
  },

  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  userInfo: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  phoneNumber: {
    fontSize: 14,
    color: "#555",
  },

  viewProfileButton: {
    backgroundColor: "#EAF1FF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },

  viewProfileText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  noApplicants: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});

export default ApplicantsScreen;

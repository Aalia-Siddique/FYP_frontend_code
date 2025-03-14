import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet,TouchableOpacity} from "react-native";

// ✅ Corrected Types
type JobPost = {
    id: number;
    title: string;
    description: string;
    location: string;
    datePosted: string;
    minSalary: number;
    maxSalary: number;
    type:string;
};

type ServicePost = {
    id: number;
    name: string;
    description: string;
    location: string;
    datePosted: string;
    minSalary: number;
    maxSalary: number;
    type:string;
};


const MyJobsScreen: React.FC = () => {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [services, setServices] = useState<ServicePost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation=useNavigation();
    useEffect(() => {
        fetchJobsAndServices();
    }, []);

    const fetchJobsAndServices = async () => {
        try {
            const response = await fetch("http://192.168.100.22:5140/api/Category/GetAllJobsAndServices");
            const result = await response.json();

            console.log("API Response:", result); // DebuggingY

            // ✅ Extracting `$values` properly
            setJobs(result.jobs?.$values || []);
            setServices(result.services?.$values || []);
        } catch (error) {
            console.error("Error fetching jobs and services:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Jobs</Text>
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                       
                        {/* <Text>{item.description}</Text> */}
                        <Text style={styles.salary}>Rs. {item.minSalary} - {item.maxSalary}</Text>
                        <Text style={styles.location}>📍 {item.location}</Text>
                        <Text style={styles.date}>📅 {new Date(item.datePosted).toDateString()}</Text>
                        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ApplicantsScreen", { jobId: item.id, jobType: item.type })}
    >
        <Text style={styles.buttonText}>View Applicants</Text>
    </TouchableOpacity>
  {/* <Text style={styles.buttonText}>View Applicants</Text>
</TouchableOpacity> */}
                    </View>
                )}
            />

            <Text style={styles.heading}>Services</Text>
            <FlatList
                data={services}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text>{item.description}</Text>
                        <Text style={styles.salary}>Rs. {item.minSalary} - {item.maxSalary}</Text>
                        <Text style={styles.location}>📍 {item.location}</Text>
                        <Text style={styles.date}>📅 {new Date(item.datePosted).toLocaleDateString()}</Text>
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

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 8, elevation: 3 },
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
});

export default MyJobsScreen;

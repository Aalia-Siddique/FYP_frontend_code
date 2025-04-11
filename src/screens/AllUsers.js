import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";

const AllUsers = () => {
  const [searchText, setSearchText] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("5"); // Default: 5km
  const navigation = useNavigation();

  // API Call Function
  const fetchApplicants = async (query, distance) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('User token not found.');
        setLoading(false);
        return;
      }
      console.log(query,distance);
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.Id;

      // API call with distance filter
      const response = await fetch(`http://192.168.100.22:5191/api/location/GetUsersFromJob/${query}/${userId}?MaxDistance=${distance}`);

      console.log("Query:", query);
      console.log("User ID:", userId);
      console.log("Selected Distance:", distance);

      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }

      const data = await response.json();
      setApplicants(data.$values || []);
      setFilteredApplicants(data.$values || []);

      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants("", selectedDistance); // Load all data initially
  }, [selectedDistance]);

  return (
    <View style={styles.container}>
      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="green" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {/* Distance Filter */}
      <View style={styles.filterContainer}>
  <Text style={styles.filterLabel}>Filter by Distance:</Text>
  <Picker
    selectedValue={selectedDistance}
    style={styles.picker}
    onValueChange={(itemValue) => setSelectedDistance(itemValue)}
  >
    <Picker.Item label="1 km" value="1" />
    <Picker.Item label="2 km" value="2" />
    <Picker.Item label="5 km" value="5" />
    <Picker.Item label="10 km" value="10" />
  </Picker>
  <Text style={styles.selectedDistanceText}>{selectedDistance} km</Text> 
</View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={() => fetchApplicants(searchText, selectedDistance)}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="green" style={{ marginVertical: 20 }} />}

      {/* No Data Found Message */}
      {!loading && filteredApplicants.length === 0 && (
        <Text style={styles.notFoundText}>No users found!</Text>
      )}

      {/* Applicants List */}
      <FlatList
        data={filteredApplicants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: `http://192.168.100.22:5165/${item.userImage}` }} 
              style={styles.image} 
            />         
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phoneNumber}</Text>
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('UserProfile1', { userId: item.id })}
            >
              <Text style={styles.buttonText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20,marginTop:25},
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 40 },

  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 5,
  },
  filterLabel: { fontSize: 16, fontWeight: "bold" },
  picker: { flex: 1, height: 40 },

  searchButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  image: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  phone: { fontSize: 14, color: "gray" },
  button: {
    backgroundColor: "green",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  notFoundText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginTop: 20,
  },
  selectedDistanceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginLeft: 10,
  },
});

export default AllUsers;

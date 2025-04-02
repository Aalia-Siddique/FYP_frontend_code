


import React, { useEffect, useState } from 'react';
import {TouchableOpacity,StyleSheet,ScrollView, View, Text, Image } from 'react-native';
import Headers from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CategoryDetails from './CategoryDetails';
// Define types for Category
interface Category {
  id: number;
  name: string;
  categoryJobs: number;
  categoryImageName: string; // Image file name (like 'image1.png')
}

const AllJobs = () => {
 
  const navigation=useNavigation();
  const [jobCategories, setJobCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories from the backend API
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('http://192.168.0.101:5140/api/Category/AllCategories');
        setJobCategories(response.data.$values || []);
        // setJobCategories(response.data); // Update state with the fetched categories
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Job Categories</Text>
      <View style={styles.mainBox}>
        {jobCategories.map((category) => {
          // Construct the image URL dynamically
          const imageUrl = `http://192.168.0.101:5140/CategoryImages/${category.categoryImageName}`;
      console.log(imageUrl)

          return (
            <TouchableOpacity
            key={category.id}
            style={styles.boxStyle}
            onPress={() => navigation.navigate('CategoryDetails', { categoryId: category.id, categoryName: category.name })}
          >
            <Image
    source={{ uri: imageUrl }}
    style={styles.icon}
    resizeMode="cover" // Ensure image fits properly
  />

            <Text style={styles.jobName}>{category.name}</Text>
            <Text>{category.categoryJobs} jobs</Text>
          </TouchableOpacity>
          
          );
        })}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 20,
    textAlign: 'center',
  },
  mainBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  boxStyle: {
    height: 180,
    width: '48%',
    borderWidth: 2,
    borderColor: '#65a765',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },
  icon: {
    width: 80,
    height: 70,
    marginBottom: 10,
  },
});
export default AllJobs;

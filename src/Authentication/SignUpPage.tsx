import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute ,RouteProp} from "@react-navigation/native";

import * as ImagePicker from 'expo-image-picker';
// interface SignUpPageProps {
//   navigation: StackNavigationProp<any>;
// }



type City = {
  id: number;
  name: string;
  status: string;
  createdDate: string;
  modifiedDate: string | null;
};
interface Job {
  id: number;
  name: string;
  categoryImageName: string | null;
  categoryJobs: number;
  status: string;
  createdDate: string;
  categoryImage: string | null;
}

type FormDataProps = {
  name: string;
  phoneNumber: string;
  password: string;
  city:string;
  cnic: string;
  dateofbirth:string;
  job: string;
  selectedImage: string | null;
  filename: string;
  fileType: string;
}


type RootStackParamList = {
  SignUpPage: { latitude?: number; longitude?: number };
};

type SignUpPageProps = {
  navigation: StackNavigationProp<RootStackParamList, "SignUpPage">;
};

const SignUpPage: React.FC<SignUpPageProps> = ({ navigation }) => {
  const [manualDate, setManualDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [city, setCity] = useState<City[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [isJobPickerVisible, setIsJobPickerVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const route = useRoute<RouteProp<RootStackParamList, "SignUpPage">>();

  useEffect(() => {
    if (route.params && route.params.latitude !== undefined && route.params.longitude !== undefined) {
      setSelectedLocation({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
      });
    }
  }, [route.params]);
useEffect(() => {
  GetCity();
  GetJobs();
}, []);

useEffect(() => {
  if (city.length > 0) {
    setSelectedCity(city[0].name); // API se pehli city set karna
    setFormData((prevState) => ({
      ...prevState,
      city: city[0].name, // formData me bhi update karna
    }));
  }
}, [city]);

useEffect(() => {
  if (jobs.length > 0) {
    setSelectedJob(jobs[0].name);
    setFormData((prevState) => ({
      ...prevState,
      job: jobs[0].name,
    }));
  }
}, [jobs]);
  const [formData, setFormData] = useState<FormDataProps>({
    name: '',
    phoneNumber: '',
    password: '',
    city:'',
    cnic: '',
    dateofbirth:'',
    job: '',
    selectedImage: null,
    filename: '',
    fileType: '',

  });
  const [showPassword, setShowPassword] = useState(false);
  const _pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0]; // Extract the URI from the first asset
        const filename = uri.split('/').pop() || '';
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : 'image';

        setFormData((prevState) => ({
          ...prevState, // Fix: Retains existing fields
          selectedImage: uri,
          filename,
          fileType,
        }));
      } else {
        Alert.alert('Cancelled', 'No image was selected.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open image picker');
    }
  };
  console.log(formData)
  const handleSignUp = async () => {
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.city ||
      !formData.cnic ||
      !formData.dateofbirth ||
      !formData.job ||
      !formData.selectedImage 
    ) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    const dataToPost = new FormData();
    dataToPost.append('Name', formData.name);
    dataToPost.append('PhoneNumber', formData.phoneNumber);
    dataToPost.append('Password', formData.password);
    dataToPost.append('City', formData.city); 
    dataToPost.append('Cnic', formData.cnic);
    dataToPost.append('Job', formData.job);
    dataToPost.append('DateofBirth', formData.dateofbirth);
    dataToPost.append('UserImage', {
      uri: formData.selectedImage,
      name: formData.filename,
      type: formData.fileType,
    } as any);
  
    try {
      console.log('Data to post:', dataToPost);
  
      const response = await fetch('http://192.168.100.22:5165/api/Auth/signup', {
        method: 'POST',
        headers: {
          "Accept": "application/json",
        },
        body: dataToPost,
      });
  
      console.log('Response status:', response.status);
  
      const text = await response.text();
      console.log('Raw response text:', text);
  
      const result = text ? JSON.parse(text) : null;
  
      if (response.ok && result) {
        const userId = result.userId;  // Get the userId from sign-up response
        Alert.alert('Success', 'Account created successfully!');

        // Call save location API
        saveUserLocation(userId);
      } else {
        Alert.alert('Error', 'Failed to sign up.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const saveUserLocation = async (userId: string) => {
    if (!selectedLocation) {
      Alert.alert("Error", "Please select a location before signing up.");
      return;
    }
  
    try {
      console.log("Saving location: ", selectedLocation.latitude, selectedLocation.longitude);
      const response = await fetch('http://192.168.100.22:5191/api/Location/save', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }),
      });
  
      if (response.ok) {
        Alert.alert("Success", "Location saved successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Failed to Save Location", "Error in saving user location.");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Network Error", "Something went wrong.");
    }
  };
  
  const GetCity = async () => {
    try {
      const response = await axios.get<City[]>(
        'http://192.168.100.22:5165/api/City/GetAllCity'
      );
      console.log('API Response:', response.data);
      setCity(response.data); // Correct way
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  const GetJobs = async () => {
    try {
      const response = await axios.get<{ $values: Job[] }>('http://192.168.100.22:5140/api/Category/AllCategories');
      setJobs(response.data.$values);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };



  function validateAge(dateStr: string) {
    const dateParts = dateStr.split("/");
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const year = parseInt(dateParts[2]);

      const enteredDate = new Date(year, month, day);
      if (!isNaN(enteredDate.getTime())) {
        const today = new Date();
        const age = today.getFullYear() - enteredDate.getFullYear();
        const isBirthdayPassed =
          today.getMonth() > enteredDate.getMonth() ||
          (today.getMonth() === enteredDate.getMonth() && today.getDate() >= enteredDate.getDate());

        const finalAge = isBirthdayPassed ? age : age - 1;

        if (finalAge < 18) {
          setError("User must be 18 years or older.");
        } else {
          setError("");
        }
      } else {
        setError("Invalid date format.");
      }
    } else {
      setError("Enter date in DD/MM/YYYY format.");
    }
  }

  const handleManualDateChange = (text: string) => {
    setManualDate(text);
    validateAge(text);
    setFormData((prevState) => ({
      ...prevState,
      dateofbirth: text, // Ensure date is updated in formData
    }));
  };
  


  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setFormData((prevState) => ({
      ...prevState,
      city: city, 
    }));
  };
  const handleJobSelect = (job: string) => {
    setSelectedJob(job);
    setFormData((prevState) => ({
      ...prevState,
      job: job,
    }));
  };
  const handleInputChange = (field: string, value: string) => {
   // console.log(`Field: ${field}, Value: ${value}`); // Debugging ke liye console log
    setFormData((prevState) => ({
      ...prevState,
      [field]: value, 
    }));
  };
  
  


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Image
        source={require('../../Images/Designer1.png')}
        style={styles.image}
      />

      <Text style={styles.label}>Full Name</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/user1.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#aaa"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
      </View>

      <Text style={styles.label}>Phone Number*</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/telephone.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
        />
      </View>
      <Text style={styles.label}>Password*</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/padlock.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? require('../../assests/icons/hide.png')
                : require('../../assests/icons/hide.png')
            }
            style={[styles.icon, { tintColor: '#00A86B' }]}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>City</Text>
<TouchableOpacity
  style={styles.inputContainer}
  onPress={() => setIsPickerVisible(!isPickerVisible)}
>
  <TextInput
    style={styles.input}
    placeholder="Select your city"
    placeholderTextColor="#888"
    value={selectedCity} // Yeh ab API se pehli city set karega
    editable={false}
  />
  <Image
    source={require('../../assests/icons/drop_down.png')}
    style={styles.icon}
  />
</TouchableOpacity>

{isPickerVisible && (
  <Picker
    selectedValue={selectedCity}
    onValueChange={(itemValue) => handleCitySelect(itemValue)}
  >
    {city.map((c) => (
      <Picker.Item key={c.id} label={c.name} value={c.name} />
    ))}
  </Picker>
)}

   

      <Text style={styles.label}>CNIC*</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/cnic.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your CNIC"
          placeholderTextColor="#aaa"
          value={formData.cnic}
          onChangeText={(value) => handleInputChange('cnic', value)}
        />
      </View>
      <Text style={styles.label}>Date of Birth</Text>
      <View>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: error ? "red" : "gray",
            padding: 8,
            marginTop: 10,
            borderRadius: 5,
          }}
          placeholder="DD/MM/YYYY"
          value={formData.dateofbirth}
          onChangeText={handleManualDateChange}
          keyboardType="phone-pad"
        />
        {error ? <Text style={{ color: "red", marginTop: 5 }}>{error}</Text> : null}
      </View>
      <Text style={styles.label}>Select your Location</Text>
      <TouchableOpacity
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, backgroundColor: "#ddd" }}
        onPress={() => {
          console.log("Navigating to SelectLocationScreen");
          navigation.navigate("SelectLocationScreen");
        }}
      >
        <Text>{selectedLocation ? `Lat: ${selectedLocation.latitude}, Lng: ${selectedLocation.longitude}` : "Select Location"}</Text>
      </TouchableOpacity>

      {/* <Text style={styles.label}>Location</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Select your location"
       //   value={location}
          editable={false} // User manually edit nahi kar sakta
        />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Location")}>
          <Text style={styles.buttonText}>📍</Text>
        </TouchableOpacity>
      </View> */}
      <Text style={styles.label}>Job</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setIsJobPickerVisible(!isJobPickerVisible)}
      >
        <TextInput
          style={styles.input}
          placeholder="Select your job"
          placeholderTextColor="#888"
          value={selectedJob}
          editable={false}
        />
      </TouchableOpacity>
      {isJobPickerVisible && (
        <Picker selectedValue={selectedJob} onValueChange={handleJobSelect}>
          {jobs.map((j) => (
            <Picker.Item key={j.id} label={j.name} value={j.name} />
          ))}
        </Picker>
      )}
      <Text style={styles.label}>Your Profile Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={_pickImage}>
              <Text style={styles.imagePickerText}>
                {formData.selectedImage ? 'Change Image' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>
            {formData.selectedImage && (
              <Image source={{ uri: formData.selectedImage }} style={styles.imagePreview} />
            )}
            
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpText}>Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#555',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // footerText: {
  //   fontSize: 16,
  //   color: '#555',
  // },
  footerText: {
    fontSize: 14,
    color: 'black',
    marginTop: 15,
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    marginTop:20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',

    marginLeft: 70,
    marginTop: 10
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,

  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    padding: 10
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: '#00A86B',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginBottom: 40
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',
  },

  signUpText: {
    color: '#00A86B',
    fontWeight: 'bold',
  },
});
export default SignUpPage;









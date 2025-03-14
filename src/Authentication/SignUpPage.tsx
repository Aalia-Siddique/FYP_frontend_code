import React, { useState } from 'react';
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


import { StackNavigationProp } from '@react-navigation/stack';
interface SignUpPageProps {
  navigation: StackNavigationProp<any>; // Add the navigation prop type here
}

const SignUp : React.FC<SignUpPageProps> = ({navigation }) => {
 
  const [selectedCity, setSelectedCity] = useState('');
    const [formData, setFormData] = useState({
      firstname: '',
      lastname: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      address: '',
      cnic: '',
    });
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.address ||
      !formData.cnic
    ) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    const dataToPost = {
      FirstName: formData.firstname,
      LastName: formData.lastname,
      PhoneNumber: formData.phoneNumber,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
      Address: formData.address,
      Cnic: formData.cnic,
    };
  
    try {
      console.log('Data to post:', JSON.stringify(dataToPost));
  
      const response = await fetch('http://192.168.36.30:5165/api/User/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToPost),
      });
  
      console.log('Response status:', response.status);
  
      const text = await response.text();
      console.log('Raw response text:', text);
  
      const result = text ? JSON.parse(text) : null;
  
      if (response.ok && result) {
        Alert.alert('Success', 'Account created successfully!');
       
      } else {
        console.log('Error Details:', result);
        throw new Error(result?.message || 'Failed to sign up.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };
  

  const handleCitySelect = (city:string) => {
    setSelectedCity(city);
    setIsPickerVisible(false);
  };

  const handleInputChange = (field:string, value:string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Image 
        source={require('../../Images/Designer1.png')} 
        style={styles.image}
      />

      <Text style={styles.label}>First Name</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/user1.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#aaa"
          value={formData.firstname}
          onChangeText={(value) => handleInputChange('firstname', value)}
        />
      </View>

      <Text style={styles.label}>Last Name*</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/user1.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor="#aaa"
          value={formData.lastname}
          onChangeText={(value) => handleInputChange('lastname', value)}
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

      <Text style={styles.label}>Confirm Password*</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/padlock.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showConfirmPassword}
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={
              showConfirmPassword
                ? require('../../assests/icons/hide.png')
                : require('../../assests/icons/hide.png')
            }
            style={[styles.icon, { tintColor: '#00A86B' }]}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Address*</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/maps-and-flags.png')}
          style={[styles.icon, { tintColor: '#00A86B' }]}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Address"
          placeholderTextColor="#aaa"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />
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
          value={selectedCity}
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
          style={styles.picker}
        >
          <Picker.Item label="Select your city" value="" />
          <Picker.Item label="Karachi" value="Karachi" />
          <Picker.Item label="Lahore" value="Lahore" />
          <Picker.Item label="Islamabad" value="Islamabad" />
          <Picker.Item label="Rawalpindi" value="Rawalpindi" />
          <Picker.Item label="Faisalabad" value="Faisalabad" />
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop:5,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    
    marginLeft:70,
    marginTop:10
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
    padding:10
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor:  '#00A86B',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin:20,
    marginBottom:40
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


export default SignUp;









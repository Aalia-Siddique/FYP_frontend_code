import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
interface LoginPageProps {
  onLogin: () => void; 
}
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });

  const [token, setToken] = useState<string | null>(null);
type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined; 
  Drawer: undefined;
};
const checkLogin = async () => {
  try {
    const savedToken = await AsyncStorage.getItem('jwtToken');
    if (!savedToken) {
      console.error('JWT Token not found, please login.');
      return;
    }
    setToken(savedToken);
    fetchData(savedToken);
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};
useEffect(() => {
  checkLogin();
}, []);
const fetchData = async (authToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Users/GetUserData`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
   
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
const API_BASE_URL = 'http://192.168.0.106:5165/api';
type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

 
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const handleInputChange = (field:string, value:string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogIn = async () => {
    // if (!formData.phoneNumber || !formData.password) {
    //   Alert.alert('Validation Error', 'Both fields are required!');
    //   return;
    // }

    // const dataToPost = {
    //   PhoneNumber: formData.phoneNumber,
    //   Password: formData.password,
    // }
     const dataToPost = {
      PhoneNumber: '03208510477',
      Password: 'qwer123!',
    }
    onLogin();
    try {
      console.log('Data to post:', JSON.stringify(dataToPost));
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {  
        PhoneNumber: formData.phoneNumber,
        Password: formData.password,
      });
    //  const result = await response.json();

      console.log('Response status:', response.status);
      if (response.status === 200) {
        const newToken = response.data.accessToken;
        await AsyncStorage.setItem('jwtToken', newToken);
        console.log(newToken); 
        fetchData(newToken);
      }
      if (response.status === 200) {
        Alert.alert('Login Successful', 'Welcome back!');
        onLogin();
      } else {
        Alert.alert('Login Failed Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
      console.error('Login Error:', error);
    }
  };
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Image
        source={require('../../Images/Designer1.png')}
        style={styles.image}
      />

      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/telephone.png')}
          style={styles.icon}
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

      <View style={styles.inputContainer}>
        <Image
          source={require('../../assests/icons/padlock.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry={!isPasswordVisible}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        <TouchableOpacity onPress={() => setPasswordVisibility(!isPasswordVisible)}>
          <Image
            source={require('../../assests/icons/hide.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogIn}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </Text>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require('../../assests/icons/google.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#00A86B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 5,
    marginTop: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
    marginTop: 15,
    textAlign: 'center',
  },
  signUpText: {
    color: '#00A86B',
    fontWeight: 'bold',
    marginTop: 9,
  },
  orText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default LoginPage;

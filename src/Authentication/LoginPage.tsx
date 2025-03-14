import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';

interface LoginPageProps {
  onLogin: () => void; // Function type with no arguments and no return value
}
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const handleInputChange = (field:string, value:string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogIn = async () => {
    if (!formData.phoneNumber || !formData.password) {
      Alert.alert('Validation Error', 'Both fields are required!');
      return;
    }

    const dataToPost = {
      PhoneNumber: formData.phoneNumber,
      Password: formData.password,
    }

    try {
      console.log('Data to post:', JSON.stringify(dataToPost));
      const response = await fetch('http://192.168.100.22:5165/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToPost),
      });

      const result = await response.json();

      console.log('Response status:', response.status);
  

  
      if (response.ok) {
        Alert.alert('Login Successful', 'Welcome back!');
        onLogin();
      } else {
        Alert.alert('Login Failed', result.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
      console.error('Login Error:', error);
    }
  };

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
        {/* <TouchableOpacity onPress={() => navigation.navigate('SignUpPage')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity> */}
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

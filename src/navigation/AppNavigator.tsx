import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import SignUpPage from '../Authentication/SignUpPage';
import SignUpPage from '../Authentication/SignUpPage';

import LoginPage from '../Authentication/LoginPage';
import Tab from './Tab';
import AllApplications from '../components/AllApplications';
import CategoryForm from '../components/CategoryForm';
//import Notifications from '../components/notifications';
import PostService from '../screens/PostService';
import PostJob from '../screens/PostJob';
import CategoryDetails from '../screens/CategoryDetails';
import JobDetails from '../screens/JobDetails';
import ApplicantsScreen from '../screens/ApplicantsScreen';
import UserProfileScreen from '../screens/UserProfile';
import UpdateProfile from '../screens/UpdateProfile';
import AppliedJobsScreen from '../screens/AppliedJobs';
import FeedbackScreen from '../screens/FeedbackScreen';
import AppliedServicesScreen from '../screens/AppliedServices';
import NotificationList from '../screens/notificationsPage';
import JobsScreen from '../screens/JobsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import SelectLocationScreen from '../screens/SelectLocationScreen';
import AllUsers from '../screens/AllUsers';
import UserProfile1 from '../screens/UserProfile1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewsScreen from '../screens/ReviewsScreen';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login handler
  const handleLogin = () => setIsLoggedIn(true);
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // Token delete karein
      setIsLoggedIn(false); // Logout karein
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      {isLoggedIn ? (
  <Stack.Screen name="Drawer" options={{ headerShown: false }}>
    {() => (
      <Drawer.Navigator>
        <Drawer.Screen name="HomeTabs" component={Tab} />
       {/* // <Drawer.Screen name="Notifications" component={Notifications} /> */}
        <Drawer.Screen name="CategoryForm" component={CategoryForm} />
        <Drawer.Screen name="SignUpPage" component={SignUpPage} />
        <Drawer.Screen name="PostJob" component={PostJob} /> 
        <Drawer.Screen name="PostService" component={PostService} /> 
        <Drawer.Screen name="CategoryDetails" component={CategoryDetails} /> 
        <Drawer.Screen name="JobDetails" component={JobDetails} /> 
        <Drawer.Screen name="UserProfile" component={UserProfileScreen} /> 
         <Drawer.Screen name="UpdateProfile" component={UpdateProfile} /> 
         <Drawer.Screen name="FeedbackScreen" component={FeedbackScreen} /> 
         <Drawer.Screen name="JobsScreen" component={JobsScreen} /> 
         <Drawer.Screen name="ServicesScreen" component={ServicesScreen} />
         <Drawer.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
         <Drawer.Screen name="ApplicantsScreen" component={ApplicantsScreen} 
        
        /> 
           <Drawer.Screen name="notificationsPage" component={NotificationList} />

         {/* {/* <Drawer.Screen name="ReviewsScreen" component={} />  */}
         <Drawer.Screen name="ReviewsScreen" component={ReviewsScreen} />
  
       
         <Drawer.Screen name="AppliedJobs" component={AppliedJobsScreen} />
         <Drawer.Screen name="UserProfile1" component={UserProfile1} />
         <Drawer.Screen name="AllUsers" component={AllUsers} />
      
       <Drawer.Screen name="AppliedServices" component={AppliedServicesScreen}/>

      {/* //  <Drawer.Screen name="UpdateProfile " component={UpdateProfile} />  */}
        
      <Drawer.Screen 
                  name="Logout" 
                  component={() => {
                    logout();
                    return null;
                  }} 
                  options={{ drawerLabel: 'Logout', title: 'Logout' }}
                />
      </Drawer.Navigator>
    )}
  </Stack.Screen>
) : (
  <>
    <Stack.Screen name="SignUp">
      {({ navigation }) => <SignUpPage navigation={navigation} />}
    </Stack.Screen>
    <Stack.Screen name="PostJob" component={PostJob} options={{ headerShown: false }} />
    <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
    <Stack.Screen name="JobDetails" component={JobDetails} />
    <Stack.Screen name="SignUpPage" component={SignUpPage} />
    <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />

    <Stack.Screen name="PostService" component={PostService} options={{ headerShown: false }} />
    <Stack.Screen name="Login">
      {() => <LoginPage onLogin={handleLogin} />}
    </Stack.Screen>
  </>
)}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

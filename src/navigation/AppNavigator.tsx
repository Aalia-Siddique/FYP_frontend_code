import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
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
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login handler
  const handleLogin = () => setIsLoggedIn(true);

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
        <Drawer.Screen name="Singup" component={SignUpPage} />
        <Drawer.Screen name="PostJob" component={PostJob} /> 
        <Drawer.Screen name="PostService" component={PostService} /> 
        <Drawer.Screen name="CategoryDetails" component={CategoryDetails} /> 
        <Drawer.Screen name="JobDetails" component={JobDetails} /> 
        <Drawer.Screen name="UserProfile" component={UserProfileScreen} /> 
         <Drawer.Screen name="UpdateProfile" component={UpdateProfile} /> 
         <Drawer.Screen name="FeedbackScreen" component={FeedbackScreen} /> 
        <Drawer.Screen name="ApplicantsScreen" component={ApplicantsScreen} 
        
        /> 
         <Drawer.Screen name="AppliedJobs" component={AppliedJobsScreen} />
         <Drawer.Screen name="notificationsPage" component={NotificationList} />
         <Drawer.Screen name="AppliedServices" component={AppliedServicesScreen}/>

      {/* //  <Drawer.Screen name="UpdateProfile " component={UpdateProfile} />  */}
        
      
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

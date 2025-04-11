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
import AppliedJobs from '../screens/AppliedJobs';
import FeedbackScreen from '../screens/FeedbackScreen';
import AppliedServices from '../screens/AppliedServices';
import NotificationList from '../screens/notificationsPage';
import JobsScreen from '../screens/JobsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import SelectLocationScreen from '../screens/SelectLocationScreen';
import AllUsers from '../screens/AllUsers';
import UserProfile1 from '../screens/UserProfile1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewsScreen from '../screens/ReviewsScreen';
import updateLocation from '../screens/updateLocation';
import AllJobs from '../screens/AllJobs';
import EditJobScreen from '../screens/EditJobScreen';
import EditServiceScreen from '../screens/EditServiceScreen';

import AcceptedApplicants from '../screens/AcceptedApplicants';
import AcceptedAppplicantProfile from '../screens/AcceptedAplicantProfile';
import SafetyScreen from '../screens/SafetyScreen';

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
      <Drawer.Navigator >
        <Drawer.Screen 
    name="Home" 
    component={Tab} 
    options={({ route }) => ({
      drawerLabel: route.name === "Home" ? "HomeTabs" : "Home", // Sirf HomeTabs screen pe label show hoga
      headerShown: true
    })} 
  />
       {/* // <Drawer.Screen name="Notifications" component={Notifications} /> */}
      
        <Drawer.Screen name="SignUpPage" component={SignUpPage}
        options={{ headerShown: false }}
         />
        <Drawer.Screen name="PostJob" component={PostJob}
         options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }}  /> 
        <Drawer.Screen 
  name="PostService" 
  component={PostService}
  options={{ 
    headerShown: false,  // Yeh header ko hide karega
    drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
  }}  
/>

        <Drawer.Screen name="CategoryDetails" component={CategoryDetails}
        options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }}  /> 
        <Drawer.Screen name="JobDetails" component={JobDetails} 
        options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }}  /> 
        <Drawer.Screen name="UserProfile" component={UserProfileScreen} 
         options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }}  /> 
         <Drawer.Screen name="Login" component={LoginPage}
         options={{ drawerItemStyle: { display: 'none' } }} /> 
         <Drawer.Screen name="UpdateProfile" component={UpdateProfile} 
          options={{ drawerItemStyle: { display: 'none' } }} /> 
         <Drawer.Screen name="FeedbackScreen" component={FeedbackScreen} 
         options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }}  /> 
         <Drawer.Screen name="JobsScreen" component={JobsScreen} 
         options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }} /> 
         <Drawer.Screen name="updateLocation" component={updateLocation}
          options={{ drawerItemStyle: { display: 'none' } }}  />
         <Drawer.Screen name="ServicesScreen" component={ServicesScreen} 
         options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }} />
         <Drawer.Screen name="SelectLocationScreen" component={SelectLocationScreen}
         options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }}   />
         <Drawer.Screen name="ApplicantsScreen" component={ApplicantsScreen} 
        options={{ 
          headerShown: false,  // Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }} 
        
        /> 
           <Drawer.Screen name="AllJobs" component={AllJobs} 
        options={{ 
          headerShown: false, 
          drawerLabel:"all" ,// Yeh header ko hide karega
          drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
        }} 
        
        /> 
           <Drawer.Screen name="notificationsPage" component={NotificationList} 
            options={{ drawerItemStyle: { display: 'none' } }} />

         {/* {/* <Drawer.Screen name="ReviewsScreen" component={} />  */}
         <Drawer.Screen name="ReviewsScreen" component={ReviewsScreen}
          options={{ 
            headerShown: false,  // Yeh header ko hide karega
            drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
          }}   />
  
       
         <Drawer.Screen 
    name="AppliedJobs" 
    component={AppliedJobs} 
    options={{ drawerItemStyle: { display: 'none' } }} 
  />
         <Drawer.Screen name="UserProfile1" component={UserProfile1}
          options={{ 
            headerShown: false,  // Yeh header ko hide karega
            drawerItemStyle: { display: 'none' } // Yeh item ko drawer se hide karega
          }}   />
         <Drawer.Screen name="AllUsers" component={AllUsers}  options={{ headerShown: false }} />
      
       <Drawer.Screen name="AppliedServices"
        component={AppliedServices}
        options={{ drawerItemStyle: { display: 'none' } }} 
        />
          <Drawer.Screen name="EditJobScreen" component={EditJobScreen}
        options={{ headerShown: false }}
         />
        
        <Drawer.Screen name="EditServiceScreen" component={EditServiceScreen}
        options={{ headerShown: false }}
        
         />
         <Drawer.Screen name="AcceptedApplicants"
        component={AcceptedApplicants}
        options={{ drawerItemStyle: { display: 'none' } }} 
        />
         <Drawer.Screen name="AcceptedAppplicantProfile"
        component={AcceptedAppplicantProfile}
        options={{ drawerItemStyle: { display: 'none' } }} 
        />
         <Drawer.Screen name="SafetyScreen"
        component={SafetyScreen}
        options={{ drawerItemStyle: { display: 'none' } }} 
        />
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
    <Stack.Screen name="CategoryDetails" component={CategoryDetails} options={{ headerShown: false }} />
    <Stack.Screen name="JobDetails" component={JobDetails} options={{ headerShown: false }} />
    <Stack.Screen name="SignUpPage" component={SignUpPage} options={{ headerShown: false }} />
    <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen}  options={{ headerShown: false }} />
    <Stack.Screen name="AppliedJobs" component={AppliedJobs} />
      <Stack.Screen name="AppliedServices" component={AppliedServices} />
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

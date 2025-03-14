
import React, { useEffect, useState } from 'react';
import {TouchableOpacity,StyleSheet,ScrollView, View, Text, Image } from 'react-native';
import Headers from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
const Notifications=()=>{
  return(
    <ScrollView>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m1.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Umar Shahid posted a new post</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
        <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
        />
      </TouchableOpacity>
      </View>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m2.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Khalida Farooq gave feedback</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m3.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Naemm ul Haq viewed your profile</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m4.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Zumar Mohib Accepted your request</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View>
      <View style={styles.div}>
       
       <View>
       <Image
          source={require('../../Images/Homeimages/m5.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Umar Shahid posted a new post</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m6.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Umar Shahid posted a new post</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m7.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Umar Shahid posted a new post</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View>
      <View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m8.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Umar Shahid posted a new post</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}
              />
      </TouchableOpacity>
      </View><View style={styles.div} >
       <View>
       <Image
          source={require('../../Images/Homeimages/m10.jpeg')}
          resizeMode="cover"
          style={styles.horiimage}
        />
       </View>
       <View>
        <Text style={styles.horitext}>Umar Shahid posted a new post</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.BtnText}>View</Text>
        </TouchableOpacity>
       </View>
      <TouchableOpacity>
      <Text style={styles.NotifiText}>2 min</Text>
      <Image
                source={require('../../assests/icons/delete.png')}
                resizeMode="contain"
                style={styles.dotsIcon}/>
      </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  NotifiText:{
    fontSize:10,
  },
  BtnText:{
    fontSize:16,
    color:'#6ab04c',
    marginStart:18,
    marginTop:3,
  },
  btn:{
    width:70,
    height:30,
    marginTop:4,
    borderWidth:1,
    borderColor:"#6ab04c",
    borderRadius:60,
    marginStart:5,
  },
 
  item: {
    alignItems: 'center',
    marginRight: 2,
  },
  horiimage: {
    width: 60,
    height: 60,
    borderRadius: 45,
  },
  horitext: {
    marginTop: 10,
    marginStart:5,
    fontSize: 15,
    color: '#000',
  },
 div:{
  flex: 1,
  height: 80,
  borderWidth: 1,
  borderBottomColor: '#99AAAB',
  borderTopColor: 'white',
  borderStartColor: 'white',
  borderEndColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Ensures space between elements
  paddingHorizontal: 10, // Adds spacing around the content
  marginTop:3,
 },
 dotsIcon: {
  width: 25,
  height: 20,
  tintColor: '#616C6F', // Optional: style the dots
},
 
});
export default Notifications;
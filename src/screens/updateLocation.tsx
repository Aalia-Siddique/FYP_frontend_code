import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SignUpPage: { latitude: number; longitude: number };
};

const updateLocation: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "SignUpPage">>();
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log("Location Selected:", latitude, longitude);
    setSelectedLocation({ latitude, longitude });
  };

  const saveLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("Error", "Please select a location first.");
      return;
    }
    
    // Send API request to update location in backend
    try {
      const response = await fetch("http://192.168.100.22:5191/api/location/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "123", // Pass user ID dynamically
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Location updated successfully!");
        
        console.log("Location Updated:", result);
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update location.");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert("Error", "Failed to update location.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 31.5497,
          longitude: 74.3436,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} title="Selected Location" />}
      </MapView>

      <Button title="update Location" onPress={saveLocation} />
    </View>
  );
};

export default updateLocation;

import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SignUpPage: { latitude: number; longitude: number };
};

const SelectLocationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "SignUpPage">>();
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log("Location Selected:", latitude, longitude);
    setSelectedLocation({ latitude, longitude });
  };

  const saveLocation = () => {
    if (!selectedLocation) {
      Alert.alert("Error", "Please select a location first.");
      return;
    }

    console.log("Saving selected location:", selectedLocation);

    // ✅ Correct way to send location data
    navigation.navigate("SignUpPage", {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
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

      <Button title="Confirm Location" onPress={saveLocation} />
    </View>
  );
};

export default SelectLocationScreen;

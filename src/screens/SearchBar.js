import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button
} from 'react-native';

const SearchBar = () => {
    const [recording, setRecording] = useState(null);
   const [transcript, setTranscript] = useState('');
 const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      console.log('Recording stopped and stored at', uri);

      // Upload the recorded audio file URI to backend for speech to text conversion
     const response = await uploadAudioAsync(uri);
 setTranscript(response?.text || '');

    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

async function uploadAudioAsync(uri) {
  let apiUrl = 'http://192.168.0.106:5140/api/Category/speech'; // <-- Aapka backend endpoint

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', {
    uri,
    name: `recording.${fileType}`,
    type: `audio/${fileType}`,
  });

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
  const response = await fetch(apiUrl, options);
const responseText = await response.text();

let parsedResponse;
try {
  parsedResponse = JSON.parse(responseText); // proper JSON mila
} catch (error) {
  console.error('Failed to parse JSON:', responseText);
  parsedResponse = { text: responseText }; // plain text fallback
}
return parsedResponse;
  } 
  catch
   (error) 
   {
    console.error(error);
    return { text: '' };
  }
}
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.iconButton}>
        <Image
          source={require('../../assests/icons/bell.png')}
          style={[styles.icon, { tintColor: 'green' }]}
        />
      </TouchableOpacity>

      <View style={styles.container}>
       <TextInput
        value={transcript}
        onChangeText={setTranscript}
        placeholder="Search here..."
      
      />

        <TouchableOpacity>
          <Image
            source={require('../../assests/icons/search.png')}
            style={[styles.icon, { tintColor: 'green' }]}
          />
        </TouchableOpacity>
      </View>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <TouchableOpacity style={styles.iconButton}>
        <Image
          source={require('../../assests/icons/world.png')}
          style={[styles.icon, { tintColor: 'green' }]}
        />
      </TouchableOpacity>   
    </View>
  );
};


const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: 'black',
  },
  iconButton: {
    padding: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default SearchBar;

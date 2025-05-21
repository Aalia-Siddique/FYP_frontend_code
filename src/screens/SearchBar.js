import { Audio } from 'expo-av';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function TabTwoScreen() {
  
      const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState('');

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
      setTranscript(response.text);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  // Function to upload audio file to your backend
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

    try {
      return JSON.parse(responseText); // proper JSON mila
    } catch (error) {
      console.error('Failed to parse JSON:', responseText);
      return { text: responseText }; // plain text fallback
    }
  } catch (error) {
    console.error(error);
    return { text: '' };
  }
}

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text style={{ marginTop: 20, fontSize: 18 }}>{transcript}</Text>
    </View>
    
  );
}



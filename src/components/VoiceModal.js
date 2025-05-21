import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';

const categories = ['plumber', 'doctor', 'software developer', 'teacher'];

const VoiceModal = ({ visible, onClose, onKeywordDetected }) => {
  const [lastResult, setLastResult] = useState('');
  const webViewRef = useRef(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
const htmlContent = `
<!DOCTYPE html>
<html>
  <body>
    <script>
      let finalResult = "";
      let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = function(event) {
        finalResult = event.results[0][0].transcript;
      };

      recognition.onerror = function(event) {
        window.ReactNativeWebView.postMessage("ERROR: " + event.error);
      };

      window.addEventListener("message", function(event) {
        if (event.data === "START_RECORDING") {
          finalResult = "";
          recognition.start();
        } else if (event.data === "STOP_AND_SEND") {
          recognition.stop();
          setTimeout(() => {
            window.ReactNativeWebView.postMessage(finalResult);
          }, 500);
        }
      });

      // auto-start when WebView loads
      window.ReactNativeWebView.postMessage("READY");
    </script>
  </body>
</html>
`;


  const handleMessage = (event) => {
    const result = event.nativeEvent.data;

    if (result === "READY") {
      setIsWebViewReady(true);
      webViewRef.current.postMessage("START_RECORDING");
      return;
    }

    if (result.startsWith("ERROR")) {
      alert("Speech Error: " + result);
      onClose();
      return;
    }

    setLastResult(result); // show what was spoken
    onKeywordDetected(result); // send spoken result back to SearchBar
    onClose();
  };


 const handleOkPress = () => {
    webViewRef.current.postMessage("STOP_AND_SEND");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🎙️ Listening...</Text>
          <Text style={styles.result}>{lastResult}</Text>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            onMessage={handleMessage}
            style={{ height: 0, width: 0 }}
            javaScriptEnabled
            originWhitelist={['*']}
          />
          <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: 'green',
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VoiceModal;

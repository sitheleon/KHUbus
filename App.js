import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Platform, Vibration, AccessibilityInfo } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Speech from 'expo-speech';

const App = () => {
  const webViewRef = useRef(null);

  useEffect(() => {
    requestPermissions();
    announceForAccessibility('오른쪽 상단에 "버스 정보 읽기" 버튼이 있습니다.');
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status !== 'granted') {
        console.log('오디오 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('권한 요청 중 오류 발생:', error);
    }
  };

  const announceForAccessibility = (message) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handleMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message) {
      Speech.stop(); // 이전 음성을 중단합니다
      Speech.speak(message, { language: 'ko-KR' }); // 새로운 음성을 재생합니다
      Vibration.vibrate(500); // 진동 피드백을 추가합니다
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'kaleidoscopic-cranachan-3f003f.netlify.app' }}
        onMessage={handleMessage}
        javaScriptEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
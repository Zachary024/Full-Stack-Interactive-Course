// React Native (Expo) wrapper for iOS & Android.
// Online  -> loads the hosted course (progress/accounts sync with the Express API).
// Offline -> loads the bundled single-file edition (run `npm run sync-offline` first).
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, View, Text, StyleSheet, Platform, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const COURSE_URL = 'https://course.example.com';   // <- your deployed URL

export default function App() {
  const [online, setOnline] = useState(null);
  const [offlineHtml, setOfflineHtml] = useState(null);
  const webRef = React.useRef(null);

  useEffect(() => NetInfo.addEventListener(s => setOnline(!!s.isConnected && s.isInternetReachable !== false)), []);
  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(require('./assets/course-offline.html'));
        await asset.downloadAsync();
        setOfflineHtml(await FileSystem.readAsStringAsync(asset.localUri));
      } catch (e) { console.warn('offline bundle missing', e); }
    })();
  }, []);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const h = BackHandler.addEventListener('hardwareBackPress', () => { webRef.current?.goBack(); return true; });
    return () => h.remove();
  }, []);

  if (online === null) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  const source = online ? { uri: COURSE_URL } : offlineHtml ? { html: offlineHtml, baseUrl: '' } : null;
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" backgroundColor="#0b1220" />
      {source ? (
        <WebView ref={webRef} key={online ? 'on' : 'off'} source={source} originWhitelist={['*']}
          javaScriptEnabled domStorageEnabled startInLoadingState allowsBackForwardNavigationGestures />
      ) : (
        <View style={styles.center}><Text>Offline and no bundled copy found.</Text></View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#0b1220' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });

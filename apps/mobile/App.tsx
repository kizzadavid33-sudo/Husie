import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

const HUSIE_URL = process.env.EXPO_PUBLIC_HUSIE_WEB_URL || process.env.EXPO_PUBLIC_MIRROR_GRAM_WEB_URL || 'http://localhost:3000'

// Independent mobile shell; point it at the independently hosted Husie web client.
export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: HUSIE_URL }}
        style={styles.webview}
        originWhitelist={['https://*', 'http://*']}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        startInLoadingState
      />
    </>
  )
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
})

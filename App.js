import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  BackHandler,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';

const WEBSITE_URL = 'https://jrcashncarry.com';

const App = () => {
  const webViewRef = useRef(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = navState => {
    setCanGoBack(navState.canGoBack);
  };

  const handleShouldStartLoadWithRequest = request => {
    const url = request.url;

    // Allow main website inside app
    if (
      url.startsWith('https://jrcashncarry.com') ||
      url.startsWith('http://jrcashncarry.com')
    ) {
      return true;
    }

    // Allow payment, phone, mail, whatsapp, etc. outside app
    if (
      url.startsWith('tel:') ||
      url.startsWith('mailto:') ||
      url.startsWith('whatsapp:') ||
      url.includes('wa.me') ||
      url.includes('api.whatsapp.com')
    ) {
      Linking.openURL(url).catch(() => {});
      return false;
    }

    // Open other external links in browser
    Linking.openURL(url).catch(() => {});
    return false;
  };

  const reloadWebsite = () => {
    setHasError(false);
    setLoading(true);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0f172a" barStyle="light-content" />

      <View style={styles.container}>
        {hasError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Unable to load website</Text>
            <Text style={styles.errorText}>
              Please check your internet connection and try again.
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={reloadWebsite}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <WebView
              ref={webViewRef}
              source={{ uri: WEBSITE_URL }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              mixedContentMode="always"
              allowsBackForwardNavigationGestures={true}
              pullToRefreshEnabled={true}
              cacheEnabled={true}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              onNavigationStateChange={handleNavigationStateChange}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              onLoadStart={() => {
                setLoading(true);
                setHasError(false);
              }}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setHasError(true);
              }}
              onHttpError={() => {
                setLoading(false);
              }}
              userAgent={
                Platform.OS === 'android'
                  ? 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'
                  : undefined
              }
            />

            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0f172a" />
                <Text style={styles.loadingText}>Loading JR Cash N Carry...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loader: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity, Alert } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  const downloadAndOpen = async (fileType = 'docx') => {
    try {
      let remoteUrl, localPath, fileName;
      
      if (fileType === 'pdf') {
        remoteUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        fileName = 'dummy.pdf';
        localPath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
      } else {
        remoteUrl = 'https://calibre-ebook.com/downloads/demos/demo.docx';
        fileName = 'demo.docx';
        localPath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
      }

      Alert.alert('Download Started', `Starting ${fileType.toUpperCase()} download...`);

      // Download file
      await RNFS.downloadFile({ fromUrl: remoteUrl, toFile: localPath }).promise;

      Alert.alert('Download Complete', 'File downloaded successfully! Opening file...');

      // Try to open file with dialog first (shows app picker)
      try {
        await FileViewer.open(localPath, { showAppsSuggestions: true, });
      } catch (openError: any) {
        // If no app can handle the file, show helpful message
        if (openError.message && openError.message.includes('No app associated')) {
          Alert.alert(
            'No App Found',
            `No app is installed to open ${fileType.toUpperCase()} files. You can:\n\n` +
            '• Install Microsoft Word/Google Docs (for DOCX)\n' +
            '• Install Adobe Reader/PDF Viewer (for PDF)\n' +
            '• Install a file manager app\n' +
            '• Use a web browser to open the file\n\n' +
            'File saved to: ' + localPath,
            [
              { text: 'OK', style: 'default' },
              { 
                text: 'Try Again', 
                onPress: () => downloadAndOpen(fileType) 
              }
            ]
          );
        } else {
          throw openError;
        }
      }
    } catch (error: any) {
      console.error('Error downloading or opening file:', error);
      Alert.alert('Error', `Failed to download or open file: ${error.message || JSON.stringify(error)}`);
    }
  };

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
      <View style={styles.testContainer}>
        <Text style={styles.testTitle}>File Download Test</Text>
        <TouchableOpacity style={styles.testButton} onPress={() => downloadAndOpen('docx')}>
          <Text style={styles.testButtonText}>Download & Open DOCX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.testButton, styles.secondButton]} onPress={() => downloadAndOpen('pdf')}>
          <Text style={styles.testButtonText}>Download & Open PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  testContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  testTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondButton: {
    backgroundColor: '#34C759',
    marginTop: 10,
  },
});

export default App;

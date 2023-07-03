import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import Androidprompt from './Androidprompt';

function Test(props) {
  const [start, setStart] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const androidPromptRef = React.useRef();

  React.useEffect(() => {
    let count = 1;
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.warn(JSON.stringify("TAG FOUND",tag));
      
      count--;

      if (Platform.OS === 'android') {
        androidPromptRef.current.setHintText(`${count}...`);
      } else {
        NfcManager.setAlertMessageIOS(`${count}...`);
      }

      if (count <= 0) {
        NfcManager.unregisterTagEvent().catch(() => 0);
        setDuration(new Date().getTime() - start.getTime());

        if (Platform.OS === 'android') {
          androidPromptRef.current.setVisible(false);
        }
      }
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, [start]);

  async function scanTag() {
    await NfcManager.registerTagEvent();
    if (Platform.OS === 'android') {
      androidPromptRef.current.setVisible(true);
    }
    setStart(new Date());
    setDuration(0);
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView />

    

      {/* <View style={styles.content}>
        {(duration > 0 && (
          <Text style={styles.minLabel}>{duration} ms</Text>
        )) || <Text style={styles.minLabel}>Let's go!</Text>}
      </View> */}

      <TouchableOpacity onPress={scanTag}>
        <View style={styles.btn}>
          <Text style={styles.playLabel}>Scan NFC Tag!</Text>
        </View>
      </TouchableOpacity>

      <Androidprompt
        ref={androidPromptRef}
        onCancelPress={() => {
          NfcManager.unregisterTagEvent().catch(() => 0);
        }}
      />

      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  
  minLabel: {
    fontSize: 32,
    color: '#ccc',
    textAlign: 'center',
  },
  playLabel: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btn: {
    width: 200,
    height: 50,
    borderRadius: 50,
    borderColor: 'white',
    backgroundColor: '#503E9D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Test;

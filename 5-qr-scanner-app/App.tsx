import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isProbablyUrl = (text: string) =>
  /^https?:\/\/\S+/i.test(text.trim());

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState("");
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const lastScannedRef = useRef("");

  const onScanned = async (data: string) => {
    if (!isScanningEnabled) return;
    if (lastScannedRef.current === data) return;

    lastScannedRef.current = data;
    setIsScanningEnabled(false);
    setScannedValue(data);
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  };

  const resetScan = () => {
    setIsScanningEnabled(true);
    setScannedValue("");
    lastScannedRef.current = "";
  };

  const openIfUrl = async () => {
    if (!isProbablyUrl(scannedValue)) {
      Alert.alert("ไม่ใช่ลิงก์");
      return;
    }
    await Linking.openURL(scannedValue);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>QR Scanner</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>QR Scanner</Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(event) => onScanned(event.data)}
        />
      </View>

      <Text style={styles.result}>
        {scannedValue || "Scan something..."}
      </Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable style={styles.button} onPress={openIfUrl}>
          <Text style={styles.buttonText}>Open</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={resetScan}>
          <Text style={styles.buttonText}>Scan Again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cameraContainer: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  result: {
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

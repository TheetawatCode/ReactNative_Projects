import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";


const STORAGE_KEY = "qr_scan_history_v1";

const isProbablyUrl = (text: string) => {
  return /^https?:\/\/\S+/i.test(text.trim());
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string>("");
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const lastScannedRef = useRef<string>("");

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const addToHistory = async (value: string) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const prev = raw ? JSON.parse(raw) : [];

      const item = {
        id: Date.now().toString(),
        value,
        scannedAt: Date.now(),
      };

      const next = [item, ...prev].slice(0, 30);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const onScanned = async (data: string) => {
    if (!isScanningEnabled) return;
    if (data === lastScannedRef.current) return;

    lastScannedRef.current = data;
    setIsScanningEnabled(false);
    setScannedValue(data);

    await addToHistory(data);
  };

  const resetScan = () => {
    lastScannedRef.current = "";
    setScannedValue("");
    setIsScanningEnabled(true);
  };

  const openLink = async () => {
    if (!isProbablyUrl(scannedValue)) return;
    const ok = await Linking.canOpenURL(scannedValue);
    if (!ok) return Alert.alert("Cannot open link");
    Linking.openURL(scannedValue);
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.text}>Waiting for camera permission...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>QR Code Scanner</Text>

      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(result) => onScanned(result.data)}
        />
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <Text style={styles.overlayText}>
            {isScanningEnabled ? "Align QR inside frame" : "Scanned"}
          </Text>
        </View>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Result</Text>
        <Text style={styles.resultText}>
          {scannedValue || "No result yet"}
        </Text>

        <View style={styles.row}>
          <Pressable style={styles.button} onPress={resetScan}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </Pressable>

          {isProbablyUrl(scannedValue) && (
            <Pressable style={styles.button} onPress={openLink}>
              <Text style={styles.buttonText}>Open Link</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b0f18",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0f18",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    marginBottom: 12,
  },
  text: {
    color: "#ccc",
  },
  cameraWrap: {
    height: 300,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 16,
  },
  overlayText: {
    marginTop: 12,
    color: "white",
    fontWeight: "600",
  },
  resultBox: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
  },
  resultLabel: {
    color: "white",
    fontWeight: "700",
    marginBottom: 6,
  },
  resultText: {
    color: "#ddd",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});

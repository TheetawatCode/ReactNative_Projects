import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import React, { useMemo, useRef, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addHistory } from "../../lib/scanHistory";

const isProbablyUrl = (text: string) => /^https?:\/\/\S+/i.test(text.trim());

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState("");
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const lastScannedRef = useRef("");

  const canUseCamera = useMemo(() => permission?.granted === true, [permission]);

  const onScanned = async (data: string) => {
    const value = (data ?? "").trim();
    if (!value) return;

    // กันสแกนซ้ำถี่ๆ
    if (!isScanningEnabled) return;
    if (lastScannedRef.current === value) return;

    lastScannedRef.current = value;
    setIsScanningEnabled(false);
    setScannedValue(value);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // บันทึกประวัติ
    await addHistory(value);
  };

  const openIfUrl = async () => {
    if (!isProbablyUrl(scannedValue)) {
      Alert.alert("ไม่ใช่ลิงก์", "QR นี้ไม่ใช่ URL ที่เปิดได้");
      return;
    }
    try {
      await Linking.openURL(scannedValue.trim());
    } catch {
      Alert.alert("เปิดลิงก์ไม่สำเร็จ", "ลองคัดลอกไปเปิดในเบราว์เซอร์แทน");
    }
  };

  const copyValue = async () => {
    // ไม่ใช้ Clipboard เพื่อลด dependency (ถ้าจะใช้ เดี๋ยวเพิ่ม expo-clipboard ได้)
    Alert.alert("คัดลอก", "ถ้าต้องการปุ่มคัดลอกจริงๆ เดี๋ยวผมเพิ่ม expo-clipboard ให้");
  };

  const resetScan = () => {
    setIsScanningEnabled(true);
    lastScannedRef.current = "";
    setScannedValue("");
  };

  const pickImageAndScan = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("ต้องอนุญาตเข้าถึงรูป", "ไปที่ Settings แล้วอนุญาต Photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled) return;

    // หมายเหตุ: การสแกนจากรูปแบบ “จริงจัง” ต้องมีตัวอ่าน barcode จากภาพ
    // เพื่อให้เดินงานไว: ให้คุณส่งรูป/ผลลัพธ์ที่ต้องการ แล้วผมจะเลือกวิธีที่เสถียรให้ (2 ทางหลัก: expo-barcode-scanner หรือ lib เพิ่ม)
    Alert.alert(
      "สแกนจากรูป",
      "ตอนนี้เราเลือกภาพได้แล้ว ขั้นต่อไปคืออ่าน QR จากภาพ — เดี๋ยวผมใส่ให้ใน Step ถัดไป"
    );
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.text}>กำลังตรวจสอบสิทธิ์กล้อง…</Text>
      </SafeAreaView>
    );
  }

  if (!canUseCamera) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.text}>
          ต้องอนุญาตกล้องเพื่อสแกน QR
        </Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryText}>ขอสิทธิ์กล้อง</Text>
        </Pressable>

        <View style={{ height: 12 }} />

        <Pressable style={styles.secondaryBtn} onPress={pickImageAndScan}>
          <Text style={styles.secondaryText}>สแกนจากรูปในเครื่อง</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>QR Scanner</Text>

      <View style={styles.cameraWrap}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(event) => onScanned(event.data)}
        />
        <View pointerEvents="none" style={styles.frame} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>ผลลัพธ์</Text>
        <Text style={styles.result} numberOfLines={2}>
          {scannedValue || "ยังไม่ได้สแกน"}
        </Text>

        <View style={styles.row}>
          <Pressable
            style={[styles.primaryBtn, !scannedValue && styles.disabledBtn]}
            disabled={!scannedValue}
            onPress={openIfUrl}
          >
            <Text style={styles.primaryText}>เปิดลิงก์</Text>
          </Pressable>

          <View style={{ width: 10 }} />

          <Pressable style={styles.secondaryBtn} onPress={resetScan}>
            <Text style={styles.secondaryText}>สแกนใหม่</Text>
          </Pressable>
        </View>

        <View style={{ height: 10 }} />

        <Pressable style={styles.secondaryBtn} onPress={pickImageAndScan}>
          <Text style={styles.secondaryText}>สแกนจากรูปในเครื่อง</Text>
        </Pressable>

        <View style={{ height: 10 }} />

        <Pressable style={styles.ghostBtn} onPress={copyValue} disabled={!scannedValue}>
          <Text style={styles.ghostText}>คัดลอก (เพิ่มใน Step ต่อไป)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0b1220", paddingHorizontal: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "700", marginTop: 8, marginBottom: 12 },
  text: { color: "#cbd5e1", fontSize: 14, lineHeight: 20 },
  cameraWrap: { height: 360, borderRadius: 18, overflow: "hidden", position: "relative" },
  camera: { flex: 1 },
  frame: {
    position: "absolute",
    left: 26,
    right: 26,
    top: 36,
    bottom: 36,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  panel: { marginTop: 14, padding: 14, backgroundColor: "#101a33", borderRadius: 18 },
  label: { color: "#93c5fd", fontWeight: "700", marginBottom: 6 },
  result: { color: "white", fontSize: 14, marginBottom: 10 },
  row: { flexDirection: "row" },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: "white", fontWeight: "700" },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  secondaryText: { color: "#e5e7eb", fontWeight: "600" },
  ghostBtn: { paddingVertical: 10, alignItems: "center" },
  ghostText: { color: "#94a3b8" },
  disabledBtn: { opacity: 0.4 },
});

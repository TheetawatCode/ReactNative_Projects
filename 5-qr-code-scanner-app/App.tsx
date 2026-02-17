import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import type { ScanItem } from "./src/types/history";
import { addHistory, clearHistory, loadHistory } from "./src/lib/scanHistory";

const isProbablyUrl = (text: string) => /^https?:\/\/\S+/i.test(text.trim());

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const lastScannedRef = useRef<string>("");

  const [latest, setLatest] = useState("");
  const [history, setHistory] = useState<ScanItem[]>([]);

  // ✅ Flash
  const [flash, setFlash] = useState(false);

  // ✅ Scan line animation
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const items = await loadHistory();
      setHistory(items);
    })();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1700,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  const cameraReady = useMemo(() => permission?.granted === true, [permission]);

  const handleScannedValue = async (valueRaw: string) => {
    const value = valueRaw?.trim?.() ?? "";
    if (!value) return;

    // กันยิงซ้ำ
    if (lastScannedRef.current === value) return;
    lastScannedRef.current = value;

    // ✅ Haptic
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    setLatest(value);
    const next = await addHistory(value);
    setHistory(next);

    // ถ้าเป็น URL ให้ถามเปิด
    if (isProbablyUrl(value)) {
      Alert.alert("Open link?", value, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open",
          onPress: async () => {
            const can = await Linking.canOpenURL(value);
            if (can) Linking.openURL(value);
            else Alert.alert("Cannot open this URL");
          },
        },
      ]);
    }
  };

  const onBarcodeScanned = ({ data }: { data: string }) => {
    if (!isScanningEnabled) return;
    setIsScanningEnabled(false);
    handleScannedValue(data).finally(() => {
      // หน่วงนิดนึงกันยิงรัว
      setTimeout(() => setIsScanningEnabled(true), 800);
    });
  };

  const pickAndScanImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo access.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    if (!uri) return;

    try {
      const results = await Camera.scanFromURLAsync(uri, ["qr"]);

      if (!results?.length) {
        Alert.alert("Not found", "No QR code detected in this image.");
        return;
      }

      await handleScannedValue(results[0].data);
    } catch (e) {
      Alert.alert("Scan failed", "Cannot scan from this image.");
    }
  };

  const resetLast = () => {
    lastScannedRef.current = "";
  };

  const onClearHistory = async () => {
    Alert.alert("Clear history?", "This will remove all scan history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          setHistory([]);
          setLatest("");
          resetLast();
        },
      },
    ]);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading permissions…</Text>
      </SafeAreaView>
    );
  }

  if (!cameraReady) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.muted}>
          Camera permission is required to scan QR codes.
        </Text>

        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Allow Camera</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnGhost]}
          onPress={pickAndScanImage}
        >
          <Text style={[styles.btnText, styles.btnGhostText]}>
            Scan from Gallery
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Scanner</Text>

        <View style={styles.row}>
          {/* ✅ Flash */}
          <Pressable
            style={[
              styles.btnSmall,
              flash ? styles.btnPrimary : styles.btnGhost,
            ]}
            onPress={() => setFlash((v) => !v)}
          >
            <Text
              style={[
                styles.btnSmallText,
                flash ? styles.btnSmallTextOn : styles.btnGhostText,
              ]}
            >
              {flash ? "Flash On" : "Flash Off"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.btnSmall, styles.btnGhost]}
            onPress={pickAndScanImage}
          >
            <Text style={[styles.btnSmallText, styles.btnGhostText]}>
              Gallery
            </Text>
          </Pressable>

          <Pressable
            style={[styles.btnSmall, styles.btnDanger]}
            onPress={onClearHistory}
          >
            <Text style={styles.btnSmallText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          enableTorch={flash} // ✅ เปิดไฟ
        />

        <View style={styles.overlay}>
          <View style={styles.scanBox} />

          {/* ✅ เส้นสแกนวิ่ง */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-95, 95],
                    }),
                  },
                ],
              },
            ]}
          />

          <Text style={styles.overlayText}>Point the camera at a QR code</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Latest</Text>
        <View style={styles.latestBox}>
          <Text numberOfLines={2} style={styles.latestText}>
            {latest || "—"}
          </Text>

          {isProbablyUrl(latest) ? (
            <Pressable
              style={[styles.btnSmall, styles.btnPrimary]}
              onPress={async () => {
                const can = await Linking.canOpenURL(latest);
                if (can) Linking.openURL(latest);
                else Alert.alert("Cannot open this URL");
              }}
            >
              <Text style={styles.btnSmallText}>Open</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>History</Text>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() => {
                setLatest(item.value);
                resetLast();
              }}
              onLongPress={() => {
                if (!isProbablyUrl(item.value)) return;
                Alert.alert("Open link?", item.value, [
                  { text: "Cancel", style: "cancel" },
                  { text: "Open", onPress: () => Linking.openURL(item.value) },
                ]);
              }}
            >
              <Text numberOfLines={1} style={styles.itemText}>
                {item.value}
              </Text>
              <Text style={styles.itemTime}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.muted}>No history yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: "700" },
  muted: { marginTop: 8, color: "#666", textAlign: "center" },

  row: { flexDirection: "row", gap: 10 },

  cameraWrap: {
    height: 320,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
  },
  scanBox: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  scanLine: {
    position: "absolute",
    width: 200,
    height: 2,
    backgroundColor: "rgba(0,255,136,0.95)",
    borderRadius: 2,
  },
  overlayText: {
    marginTop: 12,
    color: "#fff",
    fontWeight: "600",
  },

  panel: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#111" },

  latestBox: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  latestText: { flex: 1, fontSize: 14 },

  item: { paddingVertical: 10 },
  itemText: { fontSize: 14, color: "#111" },
  itemTime: { fontSize: 12, color: "#777", marginTop: 2 },
  sep: { height: 1, backgroundColor: "#f1f1f1" },

  btn: {
    marginTop: 12,
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontWeight: "700" },

  btnSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  btnSmallText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  btnSmallTextOn: { color: "#fff" },

  btnPrimary: { backgroundColor: "#111" },
  btnGhost: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  btnGhostText: { color: "#111" },

  btnDanger: { backgroundColor: "#d11" },
});

import { SymbolView } from "expo-symbols";
import { StatusBar } from "expo-status-bar";
import { Text, View, useWindowDimensions } from "react-native";

const COLORS = {
  water: "#D9E0FF",
  leaf: "#008B69",
};

/** The branded app-start screen shown after Expo's native splash fades out. */
export default function SplashScreen() {
  const { width, height } = useWindowDimensions();
  const widthScale = width / 738;
  const logoSize = width * 0.314;

  return (
    <View className="flex-1 items-center bg-[#0D49A2]">
      <StatusBar hidden />

      <View className="items-center" style={{ marginTop: height * 0.369 }}>
        <View
          className="items-center justify-center rounded-full bg-[#0F59D2]"
          style={{ width: logoSize, height: logoSize }}
        >
          <SymbolView
            name={{ ios: "drop", android: "water_drop", web: "water_drop" }}
            size={logoSize * 0.42}
            tintColor={COLORS.water}
            style={{ marginTop: 2 }}
          />
          <SymbolView
            name={{ ios: "leaf", android: "eco", web: "eco" }}
            size={logoSize * 0.25}
            tintColor={COLORS.leaf}
            style={{ position: "absolute", right: "15%", bottom: "13%" }}
          />
        </View>

        <Text
          className="font-bold text-white"
          style={{ marginTop: 61 * widthScale, fontSize: 52 * widthScale, lineHeight: 62 * widthScale }}
        >
          Jal Seva
        </Text>
        <Text
          className="text-center font-normal text-[#BCCBFF]"
          style={{ marginTop: 14 * widthScale, fontSize: 34 * widthScale, lineHeight: 42 * widthScale }}
        >
          Municipal Council Water &amp; Sanitation
        </Text>
      </View>

      <View className="absolute items-center" style={{ bottom: height * 0.056 }}>
        <View
          className="overflow-hidden bg-[#4A75CD]"
          style={{ width: 88 * widthScale, height: 8 * widthScale, borderRadius: 4 * widthScale }}
        >
          <View
            className="h-full bg-[#008B69]"
            style={{ width: 30 * widthScale, borderRadius: 4 * widthScale }}
          />
        </View>
        <Text
          className="font-normal text-[#BCCBFF]"
          style={{ marginTop: 23 * widthScale, fontSize: 22 * widthScale, letterSpacing: 4.5 * widthScale }}
        >
          LOADING...
        </Text>
      </View>
    </View>
  );
}

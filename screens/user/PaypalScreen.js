import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";

export default function PaypalScreenn() {
  const [showGateway, setShowGateway] = useState(false);
  return (
    <View style={styles.btnCon}>
      <TouchableOpacity style={styles.btn} onPress={() => setShowGateway(true)}>
        <Text style={styles.btnTxt}>Pay Using PayPal</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  btnCon: {
    height: 45,
    width: "70%",
    elevation: 1,
    backgroundColor: "#00457C",
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    color: "#fff",
    fontSize: 18,
  },
});

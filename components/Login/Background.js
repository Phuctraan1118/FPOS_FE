import React from "react";
import {
  ImageBackground,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";

// const image = require("./assets/images/background.png");
const height = Dimensions.get("window").height;
const overlayHeight = height / 3;
const IgBackground = () => {
  return (
    <ImageBackground
      source={require("../../assets/image/background.png")}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { height: overlayHeight }]}>
        <Image style={styles.images} source={require("../../assets/image/F3.png")} />
        <Text style={styles.text}>FPOS</Text>
        <Text style={styles.subText}>Fast-Simple-Convinient</Text>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  overlay: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  images: {
    marginVertical: 15,
  },
  text: {
    color: "#09051C",
    fontSize: 40,
    fontWeight: "900",
  },
  subText: {
    color: "#09051C",
    fontSize: 20,
    fontWeight: "700",
  },
});
export default IgBackground;

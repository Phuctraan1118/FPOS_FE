import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const InputBox = (props) => {
  const [isPasswordVisible, setPasswordVisiblity] = useState(false);

  const { email, password, handleChange, handleSubmit } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>Login to Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <View style={styles.input}>
        <TextInput
          style={styles.inputContainer}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <View>
          <TouchableWithoutFeedback
            onPress={() => setPasswordVisiblity((prevState) => !prevState)}
          >
            <FontAwesome
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={24}
              color="black"
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
     
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    fontSize: 20,
    textAlign: "center",
    paddingTop: 30,
  },
  body: {
    flex: 1,
    backgroundColor: "#e9ebee",
  },
  input: {
    flexDirection: "row",
    marginVertical: 24,
    justifyContent: "center",
    width: "84%",
    height: 56,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  inputContainer: {
    width: 300,
  },
  loginButton: {
    width: "30%",
    backgroundColor: "#0A1C2A",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-around",
    marginTop: 15,
    alignSelf: "center", // added this line
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
});
export default InputBox;

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import CodePushDialog from "rn-codepush-dialog";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu"
});

const isIOS = Platform.OS === "ios";
const productionKey_iOS = "U_Xbg7oGM9CuxvJUFJQKfzAsb4LKBywfc0054";
const stagingKey_iOS = "nkXEfEa2S1t-NojVVzL2UHNDe_Q6rkGVqCA5N";

const productionKey_android = "gOCsmKHfjk4uAeO7ZkZJqcI3pcZmHkdOqAR5E";
const stagingKey_android = "4jOGwfkJ3ubO7ki8PBXZVfdWjEhkHJKH9RR94";

const stagingKey = isIOS ? stagingKey_iOS : stagingKey_android;
const productionKey = isIOS ? productionKey_iOS : productionKey_android;

const deploymentKey = __DEV__ ? stagingKey : productionKey;

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CodePushDialog isCheckOnResume deploymentKey={deploymentKey} />
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

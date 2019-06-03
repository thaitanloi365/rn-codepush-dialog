import React, { Component } from "react";
import { Platform, Text, View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import CodePushDialog from "rn-codepush-dialog";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu"
});

const isIOS = Platform.OS === "ios";
const productionKey_iOS = "Wr7cgCTDbWfOzv1yTWwAghrPZxrXSk58Wfin4";
const stagingKey_iOS = "nkXEfEa2S1t-NojVVzL2UHNDe_Q6rkGVqCA5N";

const productionKey_android = "gOCsmKHfjk4uAeO7ZkZJqcI3pcZmHkdOqAR5E";
const stagingKey_android = "4jOGwfkJ3ubO7ki8PBXZVfdWjEhkHJKH9RR94";

const stagingKey = isIOS ? stagingKey_iOS : stagingKey_android;
const productionKey = isIOS ? productionKey_iOS : productionKey_android;

const deploymentKey = __DEV__ ? stagingKey : productionKey;

export default class App extends Component {
  state = {
    packageVersion: "",
    packageInfo: null
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native 9!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        {this.state.packageInfo !== null && (
          <Text style={styles.instructions}>{JSON.stringify(this.state.packageInfo)}</Text>
        )}
        <Text style={styles.instructions}>{"version: " + this.state.packageVersion}</Text>
        <CodePushDialog
          isCheckOnResume
          deploymentKey={deploymentKey}
          onGetPackageInfo={(packageVersion, packageInfo) => {
            console.log({ packageVersion }, packageInfo);
            this.setState({ packageVersion });
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (this.state.packageInfo) {
              Alert.alert("Package info", JSON.stringify(this.state.packageInfo));
            }
          }}
        >
          <Text>show package information</Text>
        </TouchableOpacity>
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

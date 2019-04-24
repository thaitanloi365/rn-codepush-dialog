import React from "react";
import { Modal, Animated, StyleSheet, Platform } from "react-native";
import CodePush from "react-native-code-push";

const primaryColor = "#007aff";
const textDarkColor = "#efeff4";
const textLightColor = "#ffffff";

/**
 * @typedef {import("rn-codepush-dialog").CodePushDialogProps} Props
 * @typedef {import("rn-codepush-dialog").CodePushDialogState} State
 * @extends {React.Component<Props, State>}
 */

class CodePushDialog extends React.Component {
  /**
   * @type {Props}
   */
  static defaultProps = {};

  /**
   * @type {State}
   */
  state = {
    updateInfo: null,
    isMandatory: false,
    currentProgress: 0,
    syncMessage: "",
    state: "None",
    animatedProgressValue: new Animated.Value(0),
    animatedOpacityValue: new Animated.Value(0),
    animatedScaleValue: new Animated.Value(0)
  };

  _renderHeader = () => {};
  _renderDescription = () => {};
  _renderBottom = () => {};

  render() {
    const {} = this.props;
    return (
      <Modal>
        <Animated.View>
          <Animated.View>
            {this._renderHeader()}
            {this._renderDescription()}
            {this._renderBottom()}
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(35,36,38,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
    width: dialogWidth,
    overflow: "hidden",
    backgroundColor: "white",
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
      }
    }),
    borderRadius: 14
  },
  bottom: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 20,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.primary
  },
  header: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  content: {
    alignSelf: "flex-start",
    marginHorizontal: 20,
    marginTop: 10
  },
  description: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  activeButton: {
    marginHorizontal: 15,
    backgroundColor: Assets.colors.primary,
    height: 46,
    borderRadius: 23
  },
  activeButtonText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: "white",
    marginHorizontal: 20,
    padding: 0
  },
  deactiveButton: {
    marginHorizontal: 15,
    backgroundColor: Assets.colors.lightBlueGrey,
    height: 46,
    borderRadius: 23
  },
  deactiveButtonText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate,
    marginHorizontal: 20,
    padding: 0
  },
  progressBar: {
    width: progressBarWidth,
    height: 16,
    borderRadius: 8,
    backgroundColor: Assets.colors.lightBlueGrey,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Assets.colors.primary
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  msg: {
    marginTop: 8,
    fontSize: 16,
    color: Assets.colors.slate
  },
  progress: {
    fontSize: 12,
    color: Assets.colors.slate
  },
  version: {
    marginTop: 4,
    fontSize: 14,
    color: Assets.colors.slate
  },
  confirmText: {
    fontSize: 18,
    color: "black",
    marginTop: 10,
    marginBottom: 20
  }
});

/**
 * @type {import("react-native-code-push").CodePushOptions}
 */
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: undefined
};

export default CodePush(codePushOptions)(CodePushUpdate);

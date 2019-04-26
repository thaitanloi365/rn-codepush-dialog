import React from "react";
import {
  Modal,
  Animated,
  StyleSheet,
  Platform,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  AppState
} from "react-native";
import CodePush from "react-native-code-push";

const { width, height } = Dimensions.get("window");
const dialogWidth = width - 20;
const dialogHeight = height * 0.8;
const progressBarWidth = dialogWidth - 40;
const isIOS = Platform.OS === "ios";
const primaryColor = "#007aff";
const lightBlueGrey = "#dae4f2";
const slateColor = "#474f61";

const fontMedium = isIOS ? { fontFamily: "Avenir-Medium" } : { fontFamily: "sans-serif" };
const fontBold = isIOS
  ? { fontFamily: "Avenir-Heavy" }
  : { fontFamily: "sans-serif", fontWeight: "bold" };
const fontLight = isIOS ? { fontFamily: "Avenir-Light" } : { fontFamily: "sans-serif-light" };

const TitleStates = {
  None: "Update Available !",
  Syncing: "Update In Progress !",
  Update: "Update Available !",
  Updated: "Update Installed !"
};

const OptionTexts = {
  UpdateConfirmText: "Do you want to update now ?",
  UpdateMandantoryText: "Please update to the newest version.",
  UpdatedText:
    "The latest version of Rent My Wardrobe is installed. Restart the app for updates to take effect.",
  RestartConfirmText: "Do you want to restart now ?",
  RestartMandantoryText: ""
};

const DownloadStatus = {
  CheckingForUpdate: "Checking for update.",
  DownloadingPackage: "Downloading package.",
  AwaitingUserAction: "Awaiting user action.",
  InstallingUpdate: "Installing update.",
  UpToDate: "App up to date.",
  UpdateIgnored: "Update cancelled by user.",
  UpdateInstalled: "Update installed and will be applied on restart.",
  UnknowError: "An unknown error occurred."
};
/**
 * @typedef {import("rn-codepush-dialog").CodePushDialogProps} Props
 * @typedef {import("rn-codepush-dialog").CodePushDialogState} State
 * @extends {React.Component<Props, State>}
 */

class CodePushDialog extends React.Component {
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
    animatedScaleValue: new Animated.Value(0),
    descriptionTextScrollEnable: false,
    showContent: true
  };

  /**
   * @type {Props}
   */
  static defaultProps = {
    titleStates: TitleStates,
    optionTexts: OptionTexts,
    downloadStatus: DownloadStatus,
    modalBackgroundColor: "rgba(35,36,38,0.8)",
    animationType: "scale",
    descriptionContentMaxHeight: 220
  };

  componentWillMount() {
    CodePush.disallowRestart();
    CodePush.getUpdateMetadata().then(packageInfo => {
      console.log(packageInfo);
      if (packageInfo) {
        const { label, appVersion } = packageInfo;
        const buildNumber = label.substring(1);
        const version = `${appVersion} (${buildNumber})`;
        const { onNewVersionDetected } = this.props;
        if (onNewVersionDetected) {
          onNewVersionDetected(version);
        }
      }
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }
  componentDidMount() {
    CodePush.allowRestart();
    this._syncImmediate();
    if (this.props.isCheckOnResume) {
      AppState.addEventListener("change", this._handleAppStateChange);
    }
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === "active" && this.state.state === "None") {
      this._syncImmediate();
    }
  };

  _restartNow = () => {
    this.setState({ state: "None" }, () => {
      CodePush.restartApp();
    });
  };

  _show = () => {
    const { animatedOpacityValue, animatedScaleValue } = this.state;
    Animated.sequence([
      Animated.timing(animatedOpacityValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(animatedScaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  _hide = () => {
    const { animatedOpacityValue, animatedScaleValue } = this.state;
    Animated.sequence([
      Animated.timing(animatedScaleValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(animatedOpacityValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start(() => this.setState({ showContent: false }, () => this.setState({ state: "None" })));
  };

  _syncImmediate = () => {
    const { deploymentKey } = this.props;
    CodePush.checkForUpdate(deploymentKey).then(update => {
      if (update) {
        const isMandatory = update.isMandatory;
        this.setState(
          {
            isMandatory,
            updateInfo: update,
            state: "Update",
            showContent: true
          },
          this._show
        );
      }
    });
  };

  _immediateUpdate = () => {
    const { state } = this.state;
    const { deploymentKey } = this.props;
    if (state !== "Syncing") {
      this.setState({ state: "Syncing" }, () => {
        const codePushOptions = {
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
          mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
          deploymentKey: deploymentKey
        };
        CodePush.sync(
          codePushOptions,
          this._codePushStatusDidChange,
          this._codePushDownloadDidProgress
        );
      });
    }
  };
  /**
   *
   * @param {import("rn-codepush-dialog").DownloadStatus} state
   */
  _getDownloadStatusFromState(state) {
    const { downloadStatus } = this.props;
    // @ts-ignore
    return downloadStatus[state] || DownloadStatus[state];
  }
  _codePushStatusDidChange = syncStatus => {
    let syncMessage = "";
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        syncMessage = this._getDownloadStatusFromState("CheckingForUpdate");
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        syncMessage = this._getDownloadStatusFromState("DownloadingPackage");
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        syncMessage = this._getDownloadStatusFromState("AwaitingUserAction");
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        syncMessage = this._getDownloadStatusFromState("InstallingUpdate");
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        syncMessage = this._getDownloadStatusFromState("UpToDate");
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        syncMessage = this._getDownloadStatusFromState("UpdateIgnored");
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        syncMessage = this._getDownloadStatusFromState("UpdateInstalled");
        CodePush.notifyAppReady();
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        syncMessage = this._getDownloadStatusFromState("UnknowError");
        this._hide();
        return;
    }
    this.setState({ syncMessage });
  };

  _codePushDownloadDidProgress = progress => {
    const { state, animatedProgressValue } = this.state;
    if (state === "Syncing") {
      const { receivedBytes, totalBytes } = progress;
      let temp = receivedBytes / totalBytes;
      this.setState({ currentProgress: temp }, () => {
        if (temp >= 1) {
          this.setState({ state: "Updated" });
        } else {
          animatedProgressValue.setValue(temp);
        }
      });
    }
  };

  _renderUpdateButtonOptions = isMandatory => {
    const {
      updateLaterButtonStyle,
      updateLaterButtonText = "Update later",
      updateLaterButtonTextStyle,
      updateNowButtonStyle,
      updateNowButtonText = "Update now",
      updateNowButtonTextStyle
    } = this.props;

    return (
      <View style={styles.row}>
        {!isMandatory && (
          <TouchableOpacity
            style={[styles.deactiveButton, updateLaterButtonStyle]}
            onPress={this._hide}
          >
            <Text style={[styles.deactiveButtonText, updateLaterButtonTextStyle]}>
              {updateLaterButtonText}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.activeButton, updateNowButtonStyle]}
          onPress={this._immediateUpdate}
        >
          <Text style={[styles.activeButtonText, updateNowButtonTextStyle]}>
            {updateNowButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderRestartButtonOptions = isMandatory => {
    const {
      restartLaterButtonStyle,
      restartLaterButtonText = "Later",
      restartLaterButtonTextStyle,
      restartNowButtonStyle,
      restartNowButtonText = "Restart now",
      restartNowButtonTextStyle
    } = this.props;

    return (
      <View style={styles.row}>
        {!isMandatory && (
          <TouchableOpacity
            style={[styles.deactiveButton, restartLaterButtonStyle]}
            onPress={this._hide}
          >
            <Text style={[styles.deactiveButtonText, restartLaterButtonTextStyle]}>
              {restartLaterButtonText}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.activeButton, restartNowButtonStyle]}
          onPress={this._restartNow}
        >
          <Text style={[styles.activeButtonText, restartNowButtonTextStyle]}>
            {restartNowButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderProgressBar = () => {
    const {
      progressBarContainerStyle,
      progressBarStyle,
      progressTextStyle,
      progressStatusStyle,
      progressBarColor = primaryColor,
      progressBarThickness = 16
    } = this.props;
    const { animatedProgressValue, syncMessage, currentProgress } = this.state;
    const translateX = animatedProgressValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-progressBarWidth, 0]
    });
    const animationStyle = {
      transform: [{ translateX }]
    };
    const color = animatedProgressValue.interpolate({
      inputRange: [0, 0.4, 0.6, 1],
      outputRange: [slateColor, slateColor, "white", "white"]
    });

    const roundedValue = (currentProgress * 100).toFixed(2);
    const progress = `${roundedValue}%`;

    return (
      <View style={[{ alignItems: "center" }, progressBarContainerStyle]}>
        <View style={[styles.progressBar]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                height: progressBarThickness,
                borderRadius: progressBarThickness / 2,
                backgroundColor: progressBarColor
              },
              progressBarStyle,
              animationStyle
            ]}
          />
          <Animated.Text style={[styles.progress, progressTextStyle, { color }]}>
            {progress}
          </Animated.Text>
        </View>
        <Text style={[styles.syncMessage, progressStatusStyle]}>{syncMessage}</Text>
      </View>
    );
  };

  _renderHeader = () => {
    const {
      headerContainerStyle,
      imageHeaderSource,
      imageHeaderStyle,
      imageHeaderContainerStyle,
      titleStates,
      titleStyle,
      versionTextStyle,
      versionTextContainerStyle
    } = this.props;
    const { state } = this.state;
    const title = titleStates[state] || TitleStates[state];
    const version = this._getVersion();
    return (
      <View style={[headerContainerStyle]}>
        {imageHeaderSource && (
          <View style={imageHeaderContainerStyle}>
            <Image style={imageHeaderStyle} source={imageHeaderSource} />
          </View>
        )}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {version && (
          <TouchableOpacity
            style={[styles.versionContainer, versionTextContainerStyle]}
            activeOpacity={0.7}
          >
            <Text style={[styles.version, versionTextStyle]}>{versionTextStyle}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _getTextFromState(state) {
    const { optionTexts } = this.props;
    //@ts-ignore
    return optionTexts[state] || OptionTexts[state];
  }
  _renderBody = () => {
    const { state, isMandatory } = this.state;

    if (state === "Updated") {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionTitle}>{this._getTextFromState("UpdatedText")}</Text>
          <Text style={styles.confirmRestartText}>
            {isMandatory
              ? this._getTextFromState("RestartMandantoryText")
              : this._getTextFromState("RestartConfirmText")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {this._renderDescription()}
        <Text style={styles.confirmText}>
          {isMandatory
            ? this._getTextFromState("UpdateMandantoryText")
            : this._getTextFromState("UpdateConfirmText")}
        </Text>
      </View>
    );
  };

  _onTextDescriptionLayout = ({ nativeEvent }) => {
    if (nativeEvent && nativeEvent.contentSize) {
      const { descriptionContentMaxHeight } = this.props;
      const { descriptionTextScrollEnable } = this.state;
      const scrollEnabled = nativeEvent.contentSize.height > descriptionContentMaxHeight;
      if (scrollEnabled !== descriptionTextScrollEnable) {
        this.setState({ descriptionTextScrollEnable: scrollEnabled });
      }
    }
  };
  _renderDescription = () => {
    const {
      bodyContainerStyle,
      descriptionTextStyle,
      descriptionTitle = "What's new",
      descriptionTitleStyle,
      isHiddenDescription,
      descriptionContentMaxHeight
    } = this.props;

    const { updateInfo, descriptionTextScrollEnable } = this.state;
    if (isHiddenDescription || !updateInfo || !updateInfo.description) return null;

    return (
      <View style={[{ marginBottom: 20 }, bodyContainerStyle]}>
        <Text style={[styles.descriptionTitle, descriptionTitleStyle]}>{descriptionTitle}</Text>
        <TextInput
          scrollEnabled={descriptionTextScrollEnable}
          editable={false}
          underlineColorAndroid="transparent"
          onContentSizeChange={this._onTextDescriptionLayout}
          style={[
            styles.description,
            descriptionTextStyle,
            { maxHeight: descriptionContentMaxHeight }
          ]}
          multiline
        >
          {updateInfo.description}
        </TextInput>
      </View>
    );
  };

  _renderBottom = () => {
    const { state, isMandatory } = this.state;
    const { bottomContainerStyle } = this.props;
    let bottomView = this._renderUpdateButtonOptions(isMandatory);
    if (state === "Updated") {
      bottomView = this._renderRestartButtonOptions(isMandatory);
    }
    if (state === "Syncing") {
      bottomView = this._renderProgressBar();
    }

    return <View style={[styles.bottomContainer, bottomContainerStyle]}>{bottomView}</View>;
  };

  _getVersion = () => {
    const { updateInfo } = this.state;
    if (updateInfo) {
      const { label, appVersion } = updateInfo;
      const buildNumber = label.substring(1);
      const version = `Code Push Version: ${appVersion} (${buildNumber})`;
      return version;
    }
    return null;
  };

  _getAnimation = () => {
    const { animatedScaleValue } = this.state;
    const { animationType } = this.props;
    if (animationType === "scale") {
      const scale = animatedScaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      });

      const opacity = animatedScaleValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.7, 1],
        extrapolate: "clamp"
      });

      const scaleStyle = {
        transform: [{ scale }],
        opacity
      };

      return scaleStyle;
    }

    const translateY = animatedScaleValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-height, -height / 4, 0],
      extrapolate: "clamp"
    });
    const opacity = animatedScaleValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1],
      extrapolate: "clamp"
    });
    const slideAnimationStyle = {
      opacity,
      transform: [{ translateY }]
    };
    return slideAnimationStyle;
  };
  render() {
    const { animatedOpacityValue, animatedScaleValue, state, showContent } = this.state;
    const { modalBackgroundColor } = this.props;
    const visible = state !== "None";

    const opacity = animatedOpacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1]
    });

    const opacityStyle = {
      opacity
    };

    const animationType = this._getAnimation();
    return (
      <Modal transparent visible={visible}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: showContent ? modalBackgroundColor : "transparent"
            },
            opacityStyle
          ]}
        >
          {showContent && (
            <Animated.View style={[styles.container, animationType]}>
              {this._renderHeader()}
              {this._renderBody()}
              {this._renderBottom()}
            </Animated.View>
          )}
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center"
  },
  syncMessage: {
    marginTop: 6,
    fontSize: 14,
    color: slateColor,
    ...fontLight
  },
  progressBar: {
    width: progressBarWidth,
    height: 16,
    borderRadius: 8,
    backgroundColor: lightBlueGrey,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
    width: dialogWidth,
    maxHeight: dialogHeight,
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
  bottomContainer: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 20,
    color: primaryColor,
    ...fontBold
  },
  contentContainer: {
    alignSelf: "stretch",
    marginHorizontal: 20
  },
  descriptionTitle: {
    fontSize: 18,
    color: slateColor,
    ...fontMedium
  },
  description: {
    fontSize: 16,
    color: slateColor,
    paddingVertical: 0,
    ...fontLight
  },
  activeButton: {
    flex: 0.5,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
    borderRadius: 4
  },
  activeButtonText: {
    fontSize: 18,
    color: "white",
    marginHorizontal: 20,
    marginVertical: 10,
    ...fontMedium
  },
  deactiveButton: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: lightBlueGrey,
    borderRadius: 4
  },
  deactiveButtonText: {
    fontSize: 18,
    color: slateColor,
    marginHorizontal: 20,
    marginVertical: 10,
    ...fontMedium
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  versionContainer: {
    marginTop: 4
  },
  version: {
    marginHorizontal: 20,
    fontSize: 14,
    color: slateColor,
    ...fontLight
  },
  confirmRestartText: {
    fontSize: 18,
    color: slateColor,
    marginBottom: 10,
    ...fontMedium
  },
  confirmText: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 18,
    color: slateColor,
    marginBottom: 10,
    ...fontMedium
  },
  progress: {
    fontSize: 12,
    ...fontMedium
  }
});

/**
 * @type {import("react-native-code-push").CodePushOptions}
 */
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: undefined
};

export default CodePush(codePushOptions)(CodePushDialog);

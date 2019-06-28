declare module "rn-codepush-dialog" {
  import * as React from "react";
  import {
    ViewProps,
    StyleProp,
    TextStyle,
    ImageSourcePropType,
    ViewStyle,
    ImageProps,
    Animated,
    ImageStyle
  } from "react-native";
  import { RemotePackage, LocalPackage } from "react-native-code-push";

  interface ProgressBarProps extends ViewProps {
    progressBarContainerStyle?: StyleProp<ViewStyle>;
    progressBarStyle?: StyleProp<ViewStyle>;
    progressBarColor?: string;
    progressBarThickness?: number;
    progressTextStyle?: StyleProp<TextStyle>;
    progressStatusStyle?: StyleProp<TextStyle>;
    isHiddenProgressText?: boolean;
    progress: number;
  }

  interface CodePushDialogState {
    isMandatory: boolean;
    updateInfo: RemotePackage | null;
    currentProgress: number;
    syncMessage: string;
    state: "None" | "Updated" | "Syncing" | "Update" | "NeedStoreUpdate";
    animatedProgressValue: Animated.Value;
    animatedOpacityValue: Animated.Value;
    animatedScaleValue: Animated.Value;
    descriptionTextScrollEnable: boolean;
    showContent: boolean;
    updateLater: boolean;
    storeUrl: string;
  }

  type TitleStates = "None" | "Syncing" | "Update" | "Updated";
  type OptionTexts =
    | "UpdateConfirmText"
    | "UpdatedText"
    | "UpdateMandantoryText"
    | "RestartConfirmText"
    | "RestartMandantoryText";

  type DownloadStatus =
    | "CheckingForUpdate"
    | "DownloadingPackage"
    | "AwaitingUserAction"
    | "InstallingUpdate"
    | "UpToDate"
    | "UpdateIgnored"
    | "UpdateInstalled"
    | "UnknowError";

  type StoreInfo = {
    isNeeded: boolean;
    currentVersion: string;
    latestVersion: string;
  };

  interface CodePushDialogProps {
    modalBackgroundColor?: string;
    deploymentKey?: string;
    animationType?: "scale" | "slide";
    titleStyle?: StyleProp<TextStyle>;
    headerContainerStyle?: StyleProp<ViewStyle>;
    bodyContainerStyle?: StyleProp<ViewStyle>;
    bottomContainerStyle?: StyleProp<ViewStyle>;
    imageHeaderSource?: ImageSourcePropType;
    imageHeaderStyle?: StyleProp<ImageStyle>;
    imageHeaderContainerStyle?: StyleProp<ViewStyle>;
    versionTextStyle?: StyleProp<TextStyle>;
    versionTextContainerStyle?: StyleProp<ViewStyle>;
    isHiddenDescription?: boolean;
    descriptionContentMaxHeight?: number;
    descriptionTitle?: string;
    descriptionTitleStyle?: StyleProp<TextStyle>;
    descriptionTextStyle?: StyleProp<TextStyle>;
    progressBarContainerStyle?: StyleProp<ViewStyle>;
    progressBarStyle?: StyleProp<ViewStyle>;
    progressBarColor?: string;
    progressBarThickness?: number;
    progressTextStyle?: StyleProp<TextStyle>;
    progressStatusStyle?: StyleProp<TextStyle>;
    updateLaterButtonStyle?: StyleProp<ViewStyle>;
    updateLaterButtonText?: string;
    updateLaterButtonTextStyle?: StyleProp<TextStyle>;
    updateNowButtonStyle?: StyleProp<ViewStyle>;
    updateNowButtonText?: string;
    updateNowButtonTextStyle?: StyleProp<TextStyle>;
    restartNowButtonStyle?: StyleProp<ViewStyle>;
    restartNowButtonText?: string;
    restartNowButtonTextStyle?: StyleProp<TextStyle>;
    restartLaterButtonStyle?: StyleProp<ViewStyle>;
    restartLaterButtonText?: string;
    restartLaterButtonTextStyle?: StyleProp<TextStyle>;
    isHiddenProgressText?: boolean;
    optionTexts?: { [key in OptionTexts]?: string };
    titleStates?: { [key in TitleStates]?: string };
    downloadStatus?: { [key in DownloadStatus]?: string };
    isCheckOnResume?: boolean;
    allowStoreCheck?: boolean;
    storeAppID?: string;
    storeAppName?: string;
    storeIgnoreErrors?: boolean;
    onGetStoreInfo?: (info: StoreInfo) => void;
    onStatusDidChange?: (status) => void;
    onGetCurrentPackageInfo?: (version: string, packgeInfo?: LocalPackage) => void;
    onGetRemotePackageInfo?: (version: string, packgeInfo?: RemotePackage) => void;
  }

  export default class CodePushDialog extends React.Component<CodePushDialogProps, any> {}
}

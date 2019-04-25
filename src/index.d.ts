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
  import { RemotePackage } from "react-native-code-push";

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
    state: "None" | "Updated" | "Syncing" | "Update";
    animatedProgressValue: Animated.Value;
    animatedOpacityValue: Animated.Value;
    animatedScaleValue: Animated.Value;
  }

  type TitleStates = "None" | "Syncing" | "Update" | "Updated";
  type OptionTexts =
    | "UpdateConfirmText"
    | "UpdatedText"
    | "UpdateMandantoryText"
    | "RestartConfirmText";

  interface CodePushDialogProps extends ViewProps {
    modalBackgroundColor?: string;
    deploymentKey?: string;
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
    descriptionTitle?: string;
    descriptionTitleStyle?: StyleProp<TextStyle>;
    descriptionContainerStyle?: StyleProp<ViewStyle>;
    descriptionTextStyle?: StyleProp<TextStyle>;
    progressBarContainerStyle?: StyleProp<ViewStyle>;
    progressBarStyle?: StyleProp<ViewStyle>;
    progressBarColor?: string;
    progressBarThickness?: number;
    progressTextStyle?: StyleProp<TextStyle>;
    progressStatusStyle?: StyleProp<TextStyle>;
    updateLaterButtonStyle?: StyleProp<ViewStyle>;
    updateLaterButtonText?: string;
    updateLaterButtonTextStyle?: string;
    updateNowButtonStyle?: StyleProp<ViewStyle>;
    updateNowButtonText?: string;
    updateNowButtonTextStyle?: string;
    restartNowButtonStyle?: StyleProp<ViewStyle>;
    restartNowButtonText?: string;
    restartNowButtonTextStyle?: string;
    restartLaterButtonStyle?: StyleProp<ViewStyle>;
    restartLaterButtonText?: string;
    restartLaterButtonTextStyle?: string;
    isHiddenProgressText?: boolean;
    onNewVersionDetected?: (version: string) => void;
    optionTexts?: { [key: OptionTexts]: string };
    titleStates?: { [key: TitleStates]: string };
  }

  export default class CodePushDialog extends React.Component<
    CodePushDialogProps,
    any
  > {}
}

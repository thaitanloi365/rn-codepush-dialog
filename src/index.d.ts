declare module "rn-codepush-dialog" {
  import * as React from "react";
  import {
    ViewProps,
    StyleProp,
    TextStyle,
    ImageSourcePropType,
    ViewStyle,
    ImageProps,
    Animated
  } from "react-native";
  import { RemotePackage } from "react-native-code-push";

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

  interface CodePushDialogProps extends ViewProps {
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
    imageHeaderSource?: ImageSourcePropType;
    imageHeaderStyle?: StyleProp<ViewStyle>;
    imageHeaderProps?: ImageProps;
    versionTextStyle?: StyleProp<TextStyle>;
    descriptionTitle?: string;
    descriptionTitleStyle?: StyleProp<TextStyle>;
    descriptionContainerStyle?: StyleProp<ViewStyle>;
    descriptionTextStyle?: StyleProp<TextStyle>;
    progressBarColor?: string;
    progressBarStyle?: StyleProp<ViewStyle>;
    progressTextStyle?: StyleProp<TextStyle>;
  }

  export class CodePushDialog extends React.Component<
    CodePushDialogProps,
    any
  > {}
}

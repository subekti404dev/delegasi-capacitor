import { Capacitor, Plugins } from "@capacitor/core";
import type { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Button, Container, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Link, useNavigate } from "react-router-dom";
import AppUrlListener from "~/components/appUrlListener";

const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
const selectedTheme = "light";

export default function Index() {
  // Date Picker
  const openPicker = () => {
    DatePicker.present({
      mode: "date",
      locale: "pt_BR",
      format: "dd/MM/yyyy",
      date: "13/07/2019",
      theme: selectedTheme,
    }).then((date) => alert(date.value));
  };

  // Share
  const shareSomething = async () => {
    await Share.share({
      title: "See cool stuff",
      text: "Really awesome thing you need to see right meow",
      url: "http://ionicframework.com/",
      dialogTitle: "Share with buddies",
    });
  };

  // Splash Screen
  const showSplashScreen = async () => {
    // Hide the splash (you should do this on app launch)
    await SplashScreen.hide();

    // Show the splash for an indefinite amount of time:
    await SplashScreen.show({
      autoHide: false,
    });

    // Show the splash for two seconds and then automatically hide it:
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  };

  const showActions = async () => {
    const result = await ActionSheet.showActions({
      title: "Photo Options",
      message: "Select an option to perform",
      options: [
        {
          title: "Upload",
        },
        {
          title: "Share",
        },
        {
          title: "Remove",
          style: ActionSheetButtonStyle.Destructive,
        },
      ],
    });

    console.log("Action Sheet result:", result);
  };

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;

    // Can be set to the src of an image now
    // imageRef.cur.src = imageUrl;
  };

  useEffect(() => {
    // showSplashScreen();
    // registerNotifications();
  }, []);

  const navigate = useNavigate();

  return (
    <AppUrlListener>
      <Container
        py={10}
        h={"100vh"}
        color={"#c5c7c8"}
        backgroundColor={"#141919"}
      >
        <Flex direction={"column"}>
          <Button onClick={openPicker} mb={2}>
            Open Picker
          </Button>
          <Button onClick={shareSomething} mb={2}>
            Share Something
          </Button>
          <Button onClick={showActions} mb={2}>
            Show Actions
          </Button>
          <Button onClick={takePicture} mb={2}>
            Take Picture
          </Button>
          <Button onClick={() => navigate("/push-notification")} mb={2}>
            Notification
          </Button>
          <Button onClick={() => navigate("/deeplink")} mb={2}>
            Deeplink Page
          </Button>
        </Flex>
        <div>{Capacitor.isNativePlatform() ? "Native" : "Bukan Native"}</div>
      </Container>
    </AppUrlListener>
  );
}

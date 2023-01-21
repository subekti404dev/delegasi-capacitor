import { Capacitor, Plugins } from "@capacitor/core";
import type { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Button, Container, Flex, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useNavigate, createSearchParams } from "react-router-dom";
import AppUrlListener from "~/components/appUrlListener";
import axios from "axios";

const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
const selectedTheme = "light";
declare var cordova: any;

export default function Index() {
  const [bgColor, setBgColor] = useState("#141919");

  useEffect(() => {
    getBgColorFromApi();
  }, []);

  const getBgColorFromApi = async () => {
    try {
      const resp = await axios.get("/api/bg-color");
      // console.log(resp.data);
      setBgColor(resp.data.bgColor);
    } catch (err) {
      console.error(err);
    }
  };

  const setBgColorToApi = async (bgColor: string) => {
    try {
      const resp = await axios.post("/api/bg-color", {
        bgColor,
      });
      // console.log(resp.data);
      setBgColor(resp.data.bgColor);
    } catch (err) {
      console.error(err);
    }
  };

  const setupOpenwith = () => {
    const initSuccess = () => {
      console.log("init success!");
    };
    const initError = (err: any) => {
      console.log("init failed: " + err);
    };
    cordova.openwith.reset();
    cordova.openwith.init(initSuccess, initError);

    // Define your file handler

    const getBase64FromItem = async (item: any) => {
      return new Promise((resolve, _) => {
        return cordova.openwith.load(item, (_: any, obj: any) => {
          resolve(`data:${obj.type};base64,${obj.base64}`);
        });
      });
    };

    const myHandler = async (intent: any) => {
      console.log("intent received");

      console.log("  action: " + intent.action); // type of action requested by the user
      console.log("  exit: " + intent.exit); // if true, you should exit the app after processing

      const data = [];
      for (const item of intent.items || []) {
        const base64 = await getBase64FromItem(item);
        data.push(base64);
      }

      console.log(data);

      navigate({
        pathname: "/import",
        search: createSearchParams({
          data: JSON.stringify(data),
        }).toString(),
      });

      if (intent.exit) {
        cordova.openwith.exit();
      }
    };
    cordova.openwith.addHandler(myHandler);
  };
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

  useEffect(() => {
    Capacitor.isNativePlatform() && setupOpenwith();
  });

  const changeBgColor = async () => {
    if (bgColor === "#141919") {
      setBgColor("#276666");
      await setBgColorToApi("#276666");
    } else {
      setBgColor("#141919");
      await setBgColorToApi("#141919");
    }
  };

  return (
    <AppUrlListener>
      <Container
        py={10}
        h={"100vh"}
        color={"#c5c7c8"}
        backgroundColor={bgColor}
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
            Push Notification
          </Button>
          <Button onClick={() => navigate("/inapp-notification")} mb={2}>
            InApp Notification
          </Button>
          <Button onClick={() => navigate("/deeplink")} mb={2}>
            Deeplink Page
          </Button>
          <Button onClick={() => navigate("/import")} mb={2}>
            Import Page
          </Button>
          <Button onClick={changeBgColor} mb={2}>
            Change BgColor
          </Button>
          <Button onClick={() => navigate(0)} mb={2}>
            Refresh
          </Button>
        </Flex>
        <div>{Capacitor.isNativePlatform() ? "Native" : "Bukan Native"}</div>
      </Container>
    </AppUrlListener>
  );
}

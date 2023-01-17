import { Button, Flex, Input, useClipboard } from '@chakra-ui/react';
import axios from 'axios';
import { PushNotifications } from '@capacitor/push-notifications';
import { useEffect, useState } from 'react';

const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
};

export default function PushNotification() {
  const { onCopy, value, setValue, hasCopied } = useClipboard('');
  const [titleContent, setTitle] = useState('');
  const [messageContent, setMessage] = useState('');

  //   const getDeliveredNotifications = async () => {
  //     const notificationList =
  //       await PushNotifications.getDeliveredNotifications();
  //     console.log('delivered notifications', notificationList);
  //   };

  const sendNotifications = async () => {
    try {
      const resp = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        {
          name: 'test',
          to: value,
          notification: {
            body: messageContent,
            title: titleContent,
          },
        },
        {
          headers: {
            Authorization:
              'key=AAAAR9dLMI4:APA91bFLnNPXFinsH6CYSW75DjBgFEtLQU_iHi0yYJWE_jEuCWTSYOkdOBT3g0Eh_gB7QvslFAvM2DGudIxN4ClnjeWOvuiSlcr2L5cCYAk-o3V_x_7ow9YkkkCXRT2Cz-zLvwAECGrW',
          },
        }
      );
      console.log(resp, 'resp');
    } catch (err) {
      console.error(err);
    }
  };

  const addListeners = async () => {
    await PushNotifications.addListener('registration', (token) => {
      setValue(token.value);
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue
        );
      }
    );
  };

  useEffect(() => {
    addListeners();
    registerNotifications();
  }, []);

  return (
    <div>
      <Flex mb={2}>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          readOnly
          mr={2}
        />
        <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
      </Flex>
      <Input
        value={titleContent}
        placeholder="Title Notifikasi"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Message Notifikasi"
        value={messageContent}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={sendNotifications}>Send Notification</Button>
    </div>
  );
}

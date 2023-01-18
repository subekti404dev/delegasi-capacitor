import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App, URLOpenListenerEvent } from "@capacitor/app";

const AppUrlListener: React.FC<any> = ({ children }) => {
  let navigate = useNavigate();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      // Example url: https://test-delegasi.urip13.duckdns.org/deeplink
      // slug = /deeplink
      const slug = event.url.split(".duckdns.org").pop();
      if (slug) {
        navigate(slug);
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, []);

  return <div>{children}</div>;
};

export default AppUrlListener;

import React, { useEffect, useRef, useState } from "react";
import { observeWindow, openWindow } from "./Services/window";

function InstagramLogin(props) {
  const [isCompleted, setIsCompleted] = useState(false);
  const popupRef = useRef(null);

  const buildCodeRequestURL = () => {
    const { clientId, redirectUri } = props;
    const uri = encodeURIComponent(redirectUri || window.location.href);
    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${uri}&scope=user_profile,user_media&response_type=code`;
  };

  const handleLoginClick = () => {
    const popup = openWindow({
      url: buildCodeRequestURL(),
      name: "Log in with Instagram",
    });
    if (popup) {
      observeWindow({ popup, onClose: handleClosingPopup });
      popupRef.current = popup;
    }
  };

  const handleClosingPopup = () => {
    const { authCallback } = props;
    if (!isCompleted) {
      authCallback && authCallback("User closed OAuth popup");
    }
  };

  const sendTokenRequest = (code) => {
    const { clientId, clientSecret, redirectUri } = props;
    const uri = redirectUri || window.location.href;
    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
    formData.append("redirect_uri", uri);
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    console.log("Hello", code);

    return fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      body: formData,
    });
  };

  const initializeProcess = () => {
    if (window.opener) {
      const [match, code] =
        window.location.search.match(/.*code=([^&|\n|\t\s]+)/) || [];
      console.log("yuo", match, code);
      window.opener.postMessage(
        {
          type: "code",
          data: code,
        },
        window.origin
      );
    } else {
      window.onmessage = ({ data: { type, data } }) => {
        if (type === "code") {
          sendTokenRequest(data)
            .then((res) => res.json())
            .then((data) => {
              setIsCompleted(true);
              const { authCallback } = props;
              authCallback && authCallback(undefined, data);
              popupRef.current && popupRef.current.close();
            });
        }
      };
    }
  };

  useEffect(() => {
    initializeProcess();
  }, []);

  return <button onClick={handleLoginClick}>Login To Instagram</button>;
}

export default InstagramLogin;

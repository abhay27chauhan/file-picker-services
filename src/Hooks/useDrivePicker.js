/* global google */
import { useEffect, useState } from "react";
import { defaultConfiguration } from "./constants";
import useInjectScript from "./useInjectScript";

function useDrivePicker() {
  const defaultScopes = ["https://www.googleapis.com/auth/drive.readonly"];
  const [loaded, error] = useInjectScript();
  const [pickerApiLoaded, setpickerApiLoaded] = useState(false);
  const [config, setConfig] = useState(defaultConfiguration);
  const [authWindowVisible, setAuthWindowVisible] = useState(false);
  const [authRes, setAuthRes] = useState(null);
  const [openAfterAuth, setOpenAfterAuth] = useState(false);
  const [callBackInfo, setCallBackInfo] = useState();
  let picker;

  const pickerCallback = (data) => {
    if (data.action === google.picker.Action.PICKED) {
      setCallBackInfo(data);
    }
  };

  const createPicker = ({
    token,
    appId = "",
    supportDrives = false,
    developerKey,
    viewId = "DOCS",
    disabled,
    multiselect,
    showUploadView = false,
    showUploadFolders,
    setParentFolder = "",
    viewMimeTypes,
    customViews,
    locale = "en",
    setIncludeFolders,
    setSelectFolderEnabled,
    disableDefaultView = false,
  }) => {
    if (disabled) return false;

    const view = new google.picker.DocsView(google.picker.ViewId[viewId]);
    if (viewMimeTypes) view.setMimeTypes(viewMimeTypes);
    if (setIncludeFolders) view.setSelectFolderEnabled(true);
    if (setSelectFolderEnabled) view.setSelectFolderEnabled(true);

    const uploadView = new google.picker.DocsUploadView();
    if (showUploadFolders) uploadView.setIncludeFolders(true);
    if (setParentFolder) uploadView.setParent(setParentFolder);

    picker = new google.picker.PickerBuilder()
      .setAppId(appId)
      .setOAuthToken(token)
      .setDeveloperKey(developerKey)
      .setCallback(pickerCallback)
      .setLocale(locale);

    if (!disableDefaultView) {
      picker.addView(view);
    }

    if (customViews) {
      customViews.map((view) => picker.addView(view));
    }

    if (multiselect) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (showUploadView) picker.addView(uploadView);

    if (supportDrives) {
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    picker.build().setVisible(true);
    return true;
  };

  const handleAuthResult = (authResult) => {
    setAuthWindowVisible(false);
    if (authResult && !authResult.error) {
      setAuthRes(authResult);
      setConfig((prev) => ({ ...prev, token: authResult.access_token }));
      setOpenAfterAuth(true);
    }
  };

  const openPicker = (config) => {
    setConfig(config);

    if (!config.token) {
      setAuthWindowVisible(true);
    }

    if (config.token && loaded && !error && pickerApiLoaded) {
      return createPicker(config);
    }
  };

  const onPickerApiLoad = () => {
    setpickerApiLoaded(true);
  };

  const loadApis = () => {
    window.gapi.load("auth");
    window.gapi.load("picker", { callback: onPickerApiLoad });
  };

  useEffect(() => {
    if (loaded && !error && !pickerApiLoaded) {
      loadApis();
    }
  }, [loaded, error, pickerApiLoaded]);

  useEffect(() => {
    if (authWindowVisible) {
      window.gapi.auth.authorize(
        {
          client_id: config.clientId,
          scope: config.customScopes
            ? [...defaultScopes, ...config.customScopes]
            : defaultScopes,
          immediate: false,
        },
        handleAuthResult
      );
    }
  }, [authWindowVisible]);

  useEffect(() => {
    if (openAfterAuth && config.token && loaded && !error && pickerApiLoaded) {
      createPicker(config);
      setOpenAfterAuth(false);
    }
  }, [openAfterAuth, config.token, loaded, error, pickerApiLoaded]);

  return [openPicker, callBackInfo, authRes];
}

export default useDrivePicker;

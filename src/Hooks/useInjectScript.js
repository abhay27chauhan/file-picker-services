import { useEffect, useState } from "react";

const URL = "https://apis.google.com/js/api.js";
const queue = [];
let injector = "init";
let script = null;

function useInjectScript() {
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    if (injector === "loaded") {
      if (!state.loaded || state.error) {
        setState({
          loaded: true,
          error: false,
        });
      }
      return;
    }

    if (injector === "error") {
      if (!state.loaded || !state.error) {
        setState({
          loaded: true,
          error: true,
        });
      }
      return;
    }

    const onScriptEvent = (error) => {
      if (error) console.log("error loading the script");
      queue.forEach((job) => job(error));

      if (error && script !== null) {
        script.remove();
        injector = "error";
      } else injector = "loaded";
      script = null;
    };

    const job = (error) => {
      setState({
        loaded: true,
        error,
      });
    };

    if (script === null) {
      script = document.createElement("script");
      script.src = URL;
      script.async = true;

      document.body.appendChild(script);
      script.addEventListener("load", () => onScriptEvent(false));
      script.addEventListener("error", () => onScriptEvent(true));
      injector = "loading";
    }

    queue.push(job);

    return () => {
      if (!script) return;
      script.removeEventListener("load", onScriptEvent);
      script.removeEventListener("error", onScriptEvent);
    };
  }, []);

  return [state.loaded, state.error];
}

export default useInjectScript;

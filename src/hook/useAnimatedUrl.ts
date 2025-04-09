import { useEffect } from "react";

export const useAnimatedUrl = () => {
  const emojis = ["🌑", "🌒", "🌓", "🌔", "🌝", "🌖", "🌗", "🌘"];

  useEffect(() => {
    const loop = () => {
      const emoji = emojis[Math.floor((Date.now() / 100) % emojis.length)];
      const url = new URL(window.location.href);
      url.hash = emoji;
      history.replaceState(null, "", url.toString());
    };

    const intervalId = setInterval(loop, 150);
    return () => clearInterval(intervalId);
  }, []);
};

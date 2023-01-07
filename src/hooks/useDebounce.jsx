import { useState } from "react";

export const useDebounce = (delay = 500) => {
  const [timer, setTimer] = useState("");
  function debounce(callback) {
    clearTimeout(timer);
    const _timer = setTimeout(() => callback(), delay);
    setTimer(_timer);
  }
  return debounce;
};

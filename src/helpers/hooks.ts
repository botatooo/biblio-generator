import { useEffect, useState } from "react";

export const useCheckMobileScreen = (setInitialized: (state: boolean) => void) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };
    handleWindowSizeChange();
    setInitialized(true);
  
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [setInitialized]);

  return (width <= 1024);
};

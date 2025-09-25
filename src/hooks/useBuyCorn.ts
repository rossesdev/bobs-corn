import { useCorn } from "@/context/CornContext";
import { useAuth } from "@/context/useAuth";
import { purchaseCorn } from "@/services/corn";
import { useEffect, useState } from "react";

export const useBuyCorn = () => {
  const { user } = useAuth();
  const { purchases } = useCorn();

  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBuyingCorn, setIsBuyingCorn] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        localStorage.setItem("timeLeft", timeLeft.toString());
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      localStorage.removeItem("timeLeft");
      clearInterval(timer);
      setIsRunning(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const getTimer = localStorage.getItem("timeLeft");
    if (getTimer) {
      setTimeLeft(parseInt(getTimer, 10));
      setIsRunning(true);
    }
  }, []);

  const handleBuyCorn = async () => {
    try {
      if (!user) return;
      setIsBuyingCorn(true);
      await purchaseCorn(user.uid);
      setIsRunning(true);
      setIsBuyingCorn(false);
    } catch (error) {
      console.error("Error purchasing corn:", error);
    }
  };

  return { user, purchases, timeLeft, isRunning, isBuyingCorn, handleBuyCorn };
};

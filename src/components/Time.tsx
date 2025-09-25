import React from "react";

const Box = ({ time, label }: { time: string; label: string }) => (
  <div>
    <div className="flex items-center justify-center w-20 h-20 bg-background-light border border-stone-200  rounded-lg">
      <span className="text-3xl font-bold text-stone-900 ">{time}</span>
    </div>
    <span className="mt-2 text-sm text-stone-500 ">{label}</span>
  </div>
);

export default function Time({ timeLeft }: { timeLeft: number }) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: remainingSeconds.toString().padStart(2, "0"),
    };
  };

  const { minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="flex gap-4 items-center">
      <Box time={minutes} label="Minutes" />
      <div className="text-2xl font-bold text-yellow-600">:</div>
      <Box time={seconds} label="Seconds" />
    </div>
  );
}

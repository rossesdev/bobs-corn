import Image from "next/image";
import React from "react";
import Time from "./Time";
import { useBuyCorn } from "@/hooks/useBuyCorn";
import { useAuth } from "@/context/useAuth";

export default function Corn() {
  const { user, purchases, timeLeft, isRunning, isBuyingCorn, handleBuyCorn } =
    useBuyCorn();
  const { logout } = useAuth();

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
        <div className="flex gap-2 items-center">
          <div className="bg-yellow-400 w-fit px-1 rounded-full">
            <Image src="/logo.png" alt="Corn icon" width={20} height={20} />
          </div>
          <p>CornBob</p>
        </div>
        <div onClick={logout} className="cursor-pointer">
          <Image
            src="/user-circle.svg"
            alt="User icon"
            width={30}
            height={30}
          />
        </div>
      </header>
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <h2 className="text-3xl font-medium text-stone-900 mb-2">
          Welcome back, {user?.displayName}
        </h2>
        <span className="text-stone-600">
          {purchases.length === 0
            ? "You haven't purchased any corn yet. "
            : `You've purchased ${purchases.length} corns with us. Ready for
          more?`}
        </span>

        <button
          disabled={isBuyingCorn || isRunning}
          className="btn-corn my-6"
          onClick={handleBuyCorn}
        >
          <Image src="/logo.png" alt="Corn icon" width={15} height={15} />
          Buy Corn
        </button>
        {isBuyingCorn ? <p>Is purchasing corn...</p> : null}
        {isRunning && (
          <>
            <Time timeLeft={timeLeft} />
            <p className="mt-4 text-sm text-red-700">
              Time until next purchase
            </p>
          </>
        )}
      </section>
    </>
  );
}

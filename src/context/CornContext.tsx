"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { db } from "@/lib/firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";

interface CornPurchase {
  id: string;
  timestamp: Date;
  quantity: number;
}

interface CornContextType {
  purchases: CornPurchase[];
  error: string | null;
}

const CornContext = createContext<CornContextType | undefined>(undefined);

export const useCorn = () => {
  const context = useContext(CornContext);
  if (context === undefined) {
    throw new Error("useCorn must be used within a CornProvider");
  }
  return context;
};

export const CornProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<CornPurchase[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setPurchases([]);
      return;
    }

    setError(null);

    const q = query(collection(db, "corns"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const purchasesData = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as CornPurchase)
        );

        setPurchases(purchasesData);
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const value: CornContextType = {
    purchases,
    error,
  };

  return <CornContext.Provider value={value}>{children}</CornContext.Provider>;
};

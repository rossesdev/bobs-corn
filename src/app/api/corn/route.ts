import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    const cornsRef = collection(db, "corns");

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const recentPurchaseQuery = query(
      cornsRef,
      where("userId", "==", userId.trim()),
      where("timestamp", ">=", Timestamp.fromDate(oneMinuteAgo)),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const recentPurchases = await getDocs(recentPurchaseQuery);

    if (!recentPurchases.empty) {
      const lastPurchase = recentPurchases.docs[0].data();
      const timeSinceLastPurchase =
        Date.now() - lastPurchase.timestamp.toDate().getTime();

      const timeUntilNextPurchase = Math.ceil(
        (60000 - timeSinceLastPurchase) / 1000
      );

      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: `You can buy corn again in ${timeUntilNextPurchase} seconds`,
          retryAfter: timeUntilNextPurchase,
        },
        {
          status: 429,
          headers: {
            "Retry-After": timeUntilNextPurchase.toString(),
          },
        }
      );
    }

    const cornPurchase = {
      userId: userId,
      timestamp: Timestamp.now(),
      quantity: 1,
    };

    const docRef = await addDoc(cornsRef, cornPurchase);

    return NextResponse.json(
      {
        success: true,
        message: "Corn purchased successfully",
        purchase: {
          id: docRef.id,
          quantity: cornPurchase.quantity,
          timestamp: cornPurchase.timestamp.toDate().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    const cornsRef = collection(db, "corns");

    const cornPurchase = {
      userId: userId.trim(),
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

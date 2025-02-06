import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const { event, data } = body;

    if (event === 'payment.received' && data?.createdAt) {
      const createdAtDate = new Date(data.createdAt);
      const endDate = new Date(createdAtDate.setFullYear(createdAtDate.getFullYear() + 1));
      
      // Save to MongoDB
      await db.collection('transactions').insertOne({
        userId: data.merchantId,
        transactionId: data.id,
        amount: data.amount,
        createdAt: createdAtDate,
        endDate: endDate,
        status: data.status
      });
      
      return NextResponse.json({ success: true, endDate });
    } else {
        await db.collection('transactions').insertOne({
            userId: data.merchantId,
            transactionId:data.id,
            amount: data.amount,
            createdAt: createdAtDate,
            status: data.status,
        })
    }

    return NextResponse.json({ success: false, message: 'Event not handled or missing data' }, { status: 400 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

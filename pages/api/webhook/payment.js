import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { event, data } = body;

    const client = await clientPromise;
    const db = client.db('cvku');
    const collection = db.collection('transaction');  

    if (event === 'payment.received' && data?.createdAt) {
      const createdAtDate = new Date(data.createdAt);
      const endDate = new Date(createdAtDate.setFullYear(createdAtDate.getFullYear() + 1));
      
      await collection.insertOne({
        userId: data.merchantId,
        transactionId: data.id,
        amount: data.amount,
        createdAt: createdAtDate,
        endDate: endDate,
        status: data.status
      });
      
      return NextResponse.json({ success: true, endDate });
    } else {
      await collection.insertOne({ event, data });
      return NextResponse.json({ success: true, message: 'Event logged' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
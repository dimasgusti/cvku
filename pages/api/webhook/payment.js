import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
  try {
    const { body } = req

    const client = await clientPromise;
    const db = client.db('cvku');
    const collection = db.collection('transaction');  

    const result = await collection.insertOne(body);

    return res.status(200).json({ message: 'Data saved successfully', result });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
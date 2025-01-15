import { NextResponse } from 'next/server';

export default async function handler(request) {
  try {
    const body = await request.json();
    console.log('Data webhook diterima:', body);

    if (body.status === 'success') {
      console.log(`Pembayaran berhasil untuk transaksi ${body.transactionId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error dalam menangani webhook:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
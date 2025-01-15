import { NextResponse } from 'next/server';

export default async function handler(request) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);

    console.log('Data webhook diterima:', body);

    const { event, data } = body;
    const { status, id, amount, customerName } = data;

    if (status === 'SUCCESS') {
      console.log(`Pembayaran berhasil untuk transaksi ${id}`);
      console.log(`Jumlah: ${amount}, Customer: ${customerName}`);
    }

    // Bisa menambahkan logika untuk memproses event lainnya
    if (event === 'testing') {
      console.log('Event: testing diterima');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error dalam menangani webhook:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json(); // Data dari Mayar
    console.log('Data webhook diterima:', body);

    // Contoh struktur data yang dikirim oleh Mayar
    // {
    //   "transactionId": "12345",
    //   "status": "success",
    //   "userId": "67890",
    //   "amount": 50000
    // }

    // Verifikasi status transaksi
    if (body.status === 'success') {
      console.log(`Pembayaran berhasil untuk transaksi ${body.transactionId}`);

      // Update status subscription user di database
      await updateSubscription(body.userId);
    }

    // Beri respons sukses ke Mayar
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error dalam menangani webhook:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

// Fungsi untuk memperbarui status subscription user di database
async function updateSubscription(userId) {
  console.log(`Mengupdate status subscription untuk user ${userId}`);
  // Contoh: Update ke MongoDB
  // const db = await getMongoClient();
  // await db.collection('users').updateOne({ _id: userId }, { $set: { subscriptionStatus: 'active' } });
}
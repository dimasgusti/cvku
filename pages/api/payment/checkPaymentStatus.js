import { NextResponse } from 'next/server';
import axios from 'axios';

async function checkPaymentStatus(transactionId) {
  const API_URL = 'https://api.mayar.id/hl/v1/payment/status';  
  const MAYAR_API_KEY = process.env.MAYAR_API_KEY;  

  try {
    const response = await axios.get(API_URL, {
      params: { transactionId },
      headers: {
        Authorization: `Bearer ${MAYAR_API_KEY}`,  
      }
    });
    return response.data;  
  } catch (error) {
    console.error('Error checking payment status:', error);
    return null;  
  }
}


export async function GET(request) {
  const { transactionId } = request.nextUrl.searchParams;

  const statusData = await checkPaymentStatus(transactionId);
  
  if (statusData) {
    return NextResponse.json(statusData);
  } else {
    return NextResponse.json({ success: false, message: 'Error fetching payment status' });
  }
}
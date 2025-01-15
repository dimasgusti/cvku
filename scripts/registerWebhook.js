const axios = require('axios');

async function registerWebhook() {
  const API_URL = 'https://api.mayar.id/hl/v1/webhook/register';
  const MAYAR_API_KEY = process.env.API_KEY; 
  const WEBHOOK_URL = 'https://https://cvku.vercel.app/api/webhook/mayar';

  try {
    const response = await axios.post(
      API_URL,
      { url: WEBHOOK_URL },
      {
        headers: {
          Authorization: `Bearer ${MAYAR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Webhook berhasil didaftarkan:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error mendaftarkan webhook:', error.response.data);
    } else {
      console.error('Error mendaftarkan webhook:', error.message);
    }
  }
}

registerWebhook();
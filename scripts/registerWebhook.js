const axios = require('axios');

async function registerWebhook() {
  const API_URL = 'https://api.mayar.id/hl/v1/webhook/register';
  const API_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MWU2OGQ0NS02MGQ4LTRkZDEtODAxOC1jN2ViNTQzMDU1OTEiLCJhY2NvdW50SWQiOiJiOGQ2N2Y2Yi1hYTAwLTQ2YjQtYTU0Mi0zYzk1NjI0Y2Q3ZGUiLCJjcmVhdGVkQXQiOiIxNzM2OTQ3NTk1NjAzIiwicm9sZSI6ImRldmVsb3BlciIsInN1YiI6ImRpbWFzZ3VzdGl3b3JrQGdtYWlsLmNvbSIsIm5hbWUiOiJDVktVIiwibGluayI6ImN2LWt1IiwiaXNTZWxmRG9tYWluIjpmYWxzZSwiaWF0IjoxNzM2OTQ3NTk1fQ.VWcpD2vUTCAhZNY_u4j5_gzyiPc4OBudKJOWUfihuGbizbbCyaK5FGdcqLUWylRXhm0fdR1dKeMdWBR_DzSSbsaglGks3cycBmhn81vPeth-Ou_TnQ7XpIm8blgWAkMMt4-6AlIq1IlgP7df4bbOjFUXQ1EBnrAC5gInPf8q5TvCG8KsI_5D1awjefnAdz0S9d5B0qoAqiVqMxi6UwvwZ0VedDMIak4RIwMUVrG3vE-w8H0TU2nG8NkqShwd0isukmTmvsUYlm_Gjz4_vxqlbGUvSu6SJv1wJcafZbYLO1y6LSHUxogXkdrv-GhrisT8QBmEG40ZnhfD3jyQRiPbsA'; // Ganti dengan API Key Anda
  const WEBHOOK_URL = 'https://a93d-2001-448a-6102-7f35-485b-8e91-bdaf-3113.ngrok-free.app/api/webhook/mayar';

  try {
    const response = await axios.post(
      API_URL,
      { url: WEBHOOK_URL },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
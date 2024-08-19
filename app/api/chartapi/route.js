import { google } from 'googleapis';

export async function GET(req) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1aAd_GYpeLXbyW0NC5pqs_MjdBE8LyAlv6-RKX6mcZzk'; // 스프레드시트 ID
    const range = '예측가격!A1:F'; // 데이터 범위 설정

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const data = response.data.values;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);  // 여기서 에러를 상세히 출력합니다.
    return new Response(JSON.stringify({ error: 'Failed to fetch data from Google Sheets', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

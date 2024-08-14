import { google } from 'googleapis';

export async function GET(req) {
  const url = new URL(req.url);
  const sheetName = url.searchParams.get('sheetName'); // 쿼리 파라미터에서 시트 이름을 가져옴

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
    const range = `${sheetName}!A1:B`; // 선택한 시트의 A, B 열 가져오기

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
    console.error('Error fetching data from Google Sheets:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data from Google Sheets', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

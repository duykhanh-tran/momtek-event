import { NextResponse } from 'next/server';

// Bắt buộc: Ngăn Next.js cache response, đảm bảo luôn lấy token mới
export const dynamic = 'force-dynamic';

export async function POST() {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    return NextResponse.json(
      { error: 'Chưa cấu hình Azure Speech Key/Region trong .env.local' },
      { status: 500 }
    );
  }

  try {
    // Gọi sang Azure để lấy token (Token này chỉ sống 10 phút)
    const response = await fetch(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': speechKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Azure từ chối cấp token. Kiểm tra lại Key/Region.' }, 
        { status: 401 }
      );
    }

    const token = await response.text();
    return NextResponse.json({ token, region: speechRegion });
    
  } catch (err) {
    console.error("Lỗi Server lấy token:", err);
    return NextResponse.json({ error: 'Lỗi kết nối Server' }, { status: 500 });
  }
}
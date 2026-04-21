export default async function handler(req, res) {
    // Chỉ chấp nhận POST để giấu dữ liệu khỏi thanh địa chỉ (URL)
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // 1. Giải mã dữ liệu Base64 từ body
        const payload = JSON.parse(Buffer.from(req.body, 'base64').toString());
        const { a: action, t: durationMs } = payload;

        // 2. Lấy thông tin thiết bị thầm lặng từ Headers
        const ua = req.headers['user-agent'] || "";
        const sec = Math.round(durationMs / 1000);
        
        let device = "Máy tính 💻";
        if (/iPhone/.test(ua)) device = "iPhone 📱";
        else if (/iPad/.test(ua)) device = "iPad 🍎";
        else if (/Android/.test(ua)) device = "Điện thoại Android 🤖";

        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.CHAT_ID;

        // 3. Phân loại tin nhắn gửi về Telegram
        let icon = action === 'exit' ? "🚪" : "📩";
        let status = action === 'exit' ? "ĐÃ ĐÓNG TAB" : `Bấm nút: ${action.toUpperCase()}`;

        const message = `
${icon} **THÔNG BÁO HỆ THỐNG**
──────────────────
📍 ${status}
⏱️ Thời gian ở lại: ${sec} giây
📱 Thiết bị: ${device}
──────────────────
        `;

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        res.status(200).json({ s: 1 });
    } catch (e) {
        res.status(200).json({ s: 0 }); // Luôn trả về 200 để ngụy trang như không có lỗi
    }
}

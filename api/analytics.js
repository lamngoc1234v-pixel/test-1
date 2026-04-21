export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // Giải mã dữ liệu Base64 từ HTML gửi lên
        const payload = JSON.parse(Buffer.from(req.body, 'base64').toString());
        const { a: action, t: durationMs } = payload;
        const sec = Math.round(durationMs / 1000);

        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.CHAT_ID;

        let message = "";

        // KIỂM TRA ĐIỀU KIỆN TẠI ĐÂY
        if (action === 'exit') {
            // Kịch bản 1: Chỉ báo thời gian khi đóng Tab
            message = `🚪 **THOÁT TRANG**\n⏱️ Tổng thời gian ở lại:${sec/60} phút ${sec} giây`;
        } else {
            // Kịch bản 2: Báo đầy đủ thông tin khi bấm nút
            const ua = req.headers['user-agent'] || "";
            let device = "Máy tính 💻";
            if (/iPhone/.test(ua)) device = "iPhone 📱";
            else if (/iPad/.test(ua)) device = "iPad 🍎";
            else if (/Android/.test(ua)) device = "Điện thoại Android 🤖";

            message = `
📩 **HÀNH ĐỘNG MỚI**
──────────────────
📍 Bấm nút: **${action.toUpperCase()}**
⏱️ Sau: ${sec} giây
📱 Thiết bị: ${device}`;
        }

        // Gửi lệnh tới Telegram
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
        // Trả về lỗi im lặng để không lộ thông tin ở F12
        res.status(200).json({ s: 0 });
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // 1. Giải mã dữ liệu từ HTML
        const payload = JSON.parse(Buffer.from(req.body, 'base64').toString());
        const { a: action, t: durationMs } = payload;
        const sec = Math.round(durationMs / 1000);

        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.CHAT_ID;

        let message = "";

        // 2. Kiểm tra loại hành động để soạn tin nhắn
        if (action === 'exit') {
            // Nếu thoát trang: Chỉ báo thời gian
            message = `🚪 **THOÁT TRANG**\n⏱️ Tổng thời gian ở lại: ${sec} giây`;
        } else {
            // Nếu bấm nút: Báo đầy đủ thông tin
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
📱 Thiết bị: ${device}
──────────────────
            `;
        }

        // 3. Gửi tới Telegram
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
        res.status(200).json({ s: 0 });
    }
}

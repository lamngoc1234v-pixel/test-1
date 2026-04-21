export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // Giải mã dữ liệu từ HTML gửi lên
        const payload = JSON.parse(Buffer.from(req.body, 'base64').toString());
        const { a: action, t: durationMs } = payload;
        
        // --- LOGIC TÍNH PHÚT VÀ GIÂY ---
        const totalSeconds = Math.round(durationMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        // Định dạng hiển thị: "1 phút 15 giây" hoặc "45 giây"
        let timeString = minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;

        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.CHAT_ID;

        let message = "";

        if (action === 'exit') {
            // Chỉ báo thời gian khi thoát tab
            message = `🚪 **THOÁT TRANG**\n⏱️ Tổng thời gian: ${timeString}`;
        } else {
            // Báo đầy đủ khi bấm nút
            const ua = req.headers['user-agent'] || "";
            let device = "Máy tính 💻";
            if (/iPhone/.test(ua)) device = "iPhone 📱";
            else if (/iPad/.test(ua)) device = "iPad 🍎";
            else if (/Android/.test(ua)) device = "Điện thoại Android 🤖";

            message = `
📩 **HÀNH ĐỘNG MỚI**
──────────────────
📍 Bấm nút: **${action.toUpperCase()}**
⏱️ Thời gian xem: ${timeString}
📱 Thiết bị: ${device}
──────────────────`;
        }

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

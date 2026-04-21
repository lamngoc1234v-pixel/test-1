export default async function handler(req, res) {
    const { type, time, ua, plat } = req.query;
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    let deviceType = "Thiết bị lạ ❓";

    // Phân loại thiết bị
    if (/iPad|Macintosh/.test(ua) && 'ontouchend' in req.headers === false && plat.includes('Mac')) {
        // iPad đời mới dùng chip M1/M2 thường hiện là Macintosh, nhưng có cảm ứng
        deviceType = "iPad 🍎";
    } 
    if (/iPhone/.test(ua)) {
        deviceType = "iPhone 📱";
    } else if (/Android/.test(ua)) {
        deviceType = "Điện thoại Android 🤖";
    } else if (/Win|Mac|Linux/.test(plat) && !/Android|iPhone|iPad/.test(ua)) {
        deviceType = "Máy tính (Laptop/PC) 💻";
    }

    const message = `
🌟 **MẬT BÁO MỚI** 🌟
──────────────────
💌 **Cảm xúc:** ${type.toUpperCase()}
⏱️ **Xem trong:** ${time} giây
🛠️ **Loại máy:** ${deviceType}
──────────────────
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    try {
        await fetch(url);
        res.status(200).json({ status: "ok" });
    } catch (e) {
        res.status(500).json({ status: "error" });
    }
}

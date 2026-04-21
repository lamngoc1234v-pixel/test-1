export default async function handler(req, res) {
    // 1. Lấy dữ liệu gửi từ HTML
    const { p, d } = req.query;
    
    // 2. Tự động lấy thông tin máy mà không cần HTML gửi lên (F12 không thấy dòng này)
    const ua = req.headers['user-agent'] || "";
    const sec = Math.round(d / 1000);

    // 3. Phân loại thiết bị
    let device = "Máy tính 💻";
    if (/iPhone/.test(ua)) device = "iPhone 📱";
    else if (/iPad/.test(ua)) device = "iPad 🍎";
    else if (/Android/.test(ua)) device = "Điện thoại Android 🤖";

    // 4. Lấy chìa khóa trong két sắt Environment Variables
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    // 5. Nội dung tin nhắn Telegram
    const message = `
📩 **THÔNG BÁO MỚI**
──────────────────
📍 **Hành động:** ${p.toUpperCase()}
⏱️ **Thời gian chờ:** ${sec} giây
📱 **Thiết bị:** ${device}
──────────────────
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    try {
        await fetch(url);
        // Trả về kết quả giả vờ như một hệ thống analytics thành công
        res.status(200).json({ status: "success", code: 200 });
    } catch (e) {
        res.status(500).json({ status: "error" });
    }
}

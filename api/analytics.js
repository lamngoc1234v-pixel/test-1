export default async function handler(req, res) {
    // 1. Chỉ chấp nhận phương thức POST để bảo mật (F12 không thấy dữ liệu trên URL)
    if (req.method !== 'POST') {
        return res.status(405).json({ s: 'Method Not Allowed' });
    }

    try {
        // 2. Giải mã chuỗi ngụy trang gửi từ trình duyệt (Base64)
        // Dữ liệu từ HTML gửi lên sẽ là một chuỗi ký tự lạ kiểu: eyJhIjoibmhvIiwidCI6NTAwMH0=
        const payload = req.body;
        const decodedData = JSON.parse(Buffer.from(payload, 'base64').toString());
        
        const action = decodedData.a; // Loại hành động (nho, tired, exit...)
        const timeMs = decodedData.t; // Thời gian tính bằng miligiây

        // 3. Tự động lấy thông tin thiết bị từ Header hệ thống (Tuyệt đối an toàn)
        const ua = req.headers['user-agent'] || "";
        const sec = Math.round(timeMs / 1000);

        let device = "Máy tính 💻";
        if (/iPhone/.test(ua)) device = "iPhone 📱";
        else if (/iPad/.test(ua)) device = "iPad 🍎";
        else if (/Android/.test(ua)) device = "Điện thoại Android 🤖";

        // 4. Lấy cấu hình Bot từ Environment Variables (Két sắt Vercel)
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.CHAT_ID;

        // 5. Soạn tin nhắn dựa trên loại hành động
        let title = "📩 **HÀNH ĐỘNG MỚI**";
        let status = `Bấm nút: **${action.toUpperCase()}**`;

        if (action === 'exit') {
            title = "🚪 **THOÁT TRANG**";
            status = "Trạng thái: **Vừa đóng Tab**";
        }

        const message = `
${title}
──────────────────
📍 ${status}
⏱️ Thời gian ở lại: ${sec} giây
📱 Thiết bị: ${device}
──────────────────
        `;

        // 6. Gửi lệnh tới Telegram
        const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        // 7. Trả về kết quả thành công giả (để ngụy trang)
        res.status(200).json({ status: "success", timestamp: Date.now() });

    } catch (error) {
        console.error(error);
        res.status(200).json({ status: "ok" }); // Luôn trả về 200 để người dùng không nghi ngờ lỗi
    }
}

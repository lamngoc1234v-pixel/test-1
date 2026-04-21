export default async function handler(req, res) {
    const { type } = req.query;
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent("Bí mật: Người ấy vừa chọn " + type)}`;

    try {
        await fetch(url);
        res.status(200).json({ status: "xong" });
    } catch (e) {
        res.status(500).json({ status: "lỗi" });
    }
} 

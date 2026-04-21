export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { feeling, info } = req.body;
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    const message = `
🔔 **THÔNG BÁO MỚI**
----------------------------
🎭 **Cảm xúc:** ${feeling.toUpperCase()}
📱 **Loại máy:** ${info.device}
🌐 **Trình duyệt:** ${info.browser}
⏱️ **Thời gian ở lại:** ${info.duration} giây
⏰ **Lúc nhấn:** ${new Date(info.time).toLocaleString('vi-VN')}
----------------------------`;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });
        return res.status(200).json({ status: "ok" });
    } catch (e) {
        return res.status(500).json({ status: "error" });
    }
}

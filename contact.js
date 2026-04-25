module.exports = async function(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Bot not configured" });
  }

  const text =
    "📬 *New Portfolio Message*\n\n" +
    "👤 *Name:* " + name + "\n" +
    "📧 *Email:* " + email + "\n" +
    "📌 *Subject:* " + (subject || "No subject") + "\n\n" +
    "💬 *Message:*\n" + message;

  try {
    const response = await fetch(
      "https://api.telegram.org/bot" + TOKEN + "/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown"
        })
      }
    );
    const data = await response.json();
    if (data.ok) {
      return res.status(200).json({ success: true });
    }
    throw new Error(data.description || "Telegram error");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

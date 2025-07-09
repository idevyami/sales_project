export default function handler(req, res) {
  try {
    res.status(200).json({ success: true, message: "API سالمه 👌🏻" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
export default async function handler(req, res) {
  try {
    const response = await fetch('https://webhook.site/4c231f3f-2e42-4ce0-924e-4eb52a591928', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: '✅ درخواست تست از Vercel با موفقیت ارسال شد!',
        timestamp: new Date().toISOString(),
        device: 'mobile',
        source: 'sales-project-v16'
      })
    });

    // اگر وبهوک موفق بود
    if (response.ok) {
      res.status(200).json({
        success: true,
        message: 'ارسال موفق به Webhook 🎉'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'وبهوک پاسخ موفق نداد ❌',
        status: response.status
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال به Webhook 🚨',
      error: error.message
    });
  }
}

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = "https://toinqwlrdadbflrccefg.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaW5xd2xyZGFkYmZscmNjZWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzQ0NjksImV4cCI6MjA2NzU1MDQ2OX0.GSqWWlOGvAVFfeszf_M8-a9Rb6iJxedwGvQtr6jWlq4";

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    let body;
    try {
      body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid JSON' });
    }

    const { name, phone } = body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, phone }]);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Customer added!', data });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'خطا: ' + err.message });
  }
}

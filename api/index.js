import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://toinqwlrdadbflrccefg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaW5xd2xyZGFkYmZscmNjZWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzQ0NjksImV4cCI6MjA2NzU1MDQ2OX0.GSqWWlOGvAVFfeszf_M8-a9Rb6iJxedwGvQtr6jWlq4';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST requests are allowed' });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'name و phone الزامی هستند' });
    }

    const { data, error } = await supabase.from('customers').insert([
      { name, phone }
    ]);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'مشتری با موفقیت ثبت شد', data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا: ' + err.message });
  }
}

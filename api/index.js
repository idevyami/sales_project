// api/index.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  try {
    // درخواست فقط باید POST باشه
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Only POST method allowed' })
    }

    const { name, phone, address, visitorId, products, price, notes } = req.body || {}

    // بررسی داده‌های ضروری
    if (!name || !phone || !products || !price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    // اضافه‌کردن مشتری
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([{ name, phone, address, visitor_id: visitorId, notes }])
      .select()
      .single()

    if (customerError) throw customerError

    // اضافه‌کردن سفارش
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customer.id,
        products,
        price,
        notes,
        visitor_id: visitorId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (orderError) throw orderError

    res.status(200).json({
      success: true,
      message: 'Order successfully registered',
      customer,
      order
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    })
  }
}

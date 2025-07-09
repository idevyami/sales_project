import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'فقط POST مجاز است' });
  }

  try {
    const data = req.body;

    // ساخت یا ثبت مشتری
    let customerId = data.customerId;
    if (!customerId) {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          address: data.address,
          phone: data.phone,
          visitor_id: data.visitorId,
          notes: data.customerNotes || ''
        })
        .select()
        .single();

      if (error) throw error;
      customerId = customer.id;
    }

    // ثبت سفارش
    if (data.products && data.price) {
      const { error: orderError, data: orderData } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          products: JSON.stringify(data.products),
          price: data.price,
          visitor_id: data.visitorId,
          notes: data.orderNotes || '',
          created_at: new Date().toISOString()
        });

      if (orderError) throw orderError;

      return res.status(200).json({
        success: true,
        message: 'سفارش ثبت شد ✅',
        customerId: customerId
      });
    }

    return res.status(200).json({
      success: true,
      message: 'مشتری بدون سفارش ثبت شد!',
      customerId: customerId
    });

  } catch (err) {
    console.error('[ERROR]', err.message || err);
    return res.status(500).json({ success: false, message: err.message || 'خطای ناشناخته' });
  }
}

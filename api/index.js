import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'فقط POST مجاز است' });
  }

  try {
    const data = req.body || {};
    console.log('دیتای دریافتی:', data);

    if (!data.name || !data.phone) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقصه' });
    }

    // ایجاد مشتری
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([{
        name: data.name,
        phone: data.phone,
        address: data.address,
        notes: data.customerNotes || '',
        visitor_id: data.visitorId
      }])
      .select()
      .single();

    if (customerError) throw customerError;

    // ایجاد سفارش
    if (data.products && data.price) {
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: customer.id,
          products: JSON.stringify(data.products),
          price: data.price,
          visitor_id: data.visitorId,
          notes: data.orderNotes || ''
        }]);

      if (orderError) throw orderError;
    }

    res.status(200).json({
      success: true,
      message: 'ثبت موفق ✅',
      customerId: customer.id
    });
  } catch (err) {
    console.error('⚠️ خطا:', err.message);
    res.status(500).json({
      success: false,
      message: 'خطا: ' + err.message
    });
  }
}

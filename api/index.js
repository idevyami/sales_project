import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://toinqwlrdadbflrccefg.supabase.co',
  'YOUR_SUPABASE_SECRET_KEY'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const payload = req.body;

  try {
    // 1. ایجاد مشتری جدید اگر customerId نبود
    let customerId = payload.customerId;

    if (!customerId) {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            name: payload.name,
            address: payload.address,
            phone: payload.phone,
            visitor_id: payload.visitorId,
            notes: payload.customerNotes || ''
          }
        ])
        .select()
        .single();

      if (customerError) throw customerError;
      customerId = customer.id;
    }

    // 2. ثبت سفارش اگر products و price بود
    if (payload.products && payload.price) {
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([
          {
            customer_id: customerId,
            products: payload.products, // array
            price: payload.price,
            visitor_id: payload.visitorId,
            notes: payload.orderNotes || ''
          }
        ]);

      if (invoiceError) throw invoiceError;

      return res.status(200).json({
        success: true,
        message: 'سفارش ثبت شد!',
        customerId: customerId
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'مشتری بدون سفارش ثبت شد!',
        customerId: customerId
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطا: ' + error.message
    });
  }
}

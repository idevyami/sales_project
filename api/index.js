import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'فقط POST مجازه.' });
  }

  try {
    const payload = req.body;

    // ایجاد مشتری
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([{
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        visitor_id: payload.visitorId,
        notes: payload.customerNotes || '',
      }])
      .select()
      .single();

    if (customerError) throw customerError;

    // ایجاد فاکتور (در صورت وجود محصول)
    if (payload.products && payload.price) {
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([{
          customer_id: customer.id,
          products: JSON.stringify(payload.products),
          price: payload.price,
          visitor_id: payload.visitorId,
          date: new Date().toISOString(),
          notes: payload.orderNotes || ''
        }]);

      if (invoiceError) throw invoiceError;

      return res.status(200).json({
        success: true,
        message: 'سفارش ثبت شد!',
        customerId: customer.id
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'مشتری بدون سفارش ثبت شد!',
        customerId: customer.id
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطا: ' + error.message
    });
  }
}

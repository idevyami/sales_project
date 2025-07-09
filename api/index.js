import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST allowed' });
  }

  try {
    const payload = req.body;

    let customerId = payload.customerId;

    if (!customerId) {
      const { data: customer, error: customerErr } = await supabase
        .from('customers')
        .insert([{
          name: payload.name,
          address: payload.address,
          phone: payload.phone,
          visitor_id: payload.visitorId,
          notes: payload.customerNotes || ''
        }])
        .select()
        .single();

      if (customerErr) throw customerErr;
      customerId = customer.id;
    }

    const { error: invoiceErr } = await supabase
      .from('invoices')
      .insert([{
        customer_id: customerId,
        products: JSON.stringify(payload.products),
        price: payload.price,
        visitor_id: payload.visitorId,
        created_at: new Date().toISOString(),
        notes: payload.orderNotes || ''
      }]);

    if (invoiceErr) throw invoiceErr;

    return res.status(200).json({
      success: true,
      message: 'سفارش ثبت شد!',
      customerId
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `خطا: ${err.message}`
    });
  }
}
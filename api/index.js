import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = req.body

  // ثبت مشتری
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert([{
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      visitorId: payload.visitorId,
      notes: payload.customerNotes || ''
    }])
    .select()
    .single()

  if (customerError) {
    return res.status(500).json({ error: 'خطا در ذخیره مشتری', detail: customerError.message })
  }

  // اگر سفارش هم وجود داره
  if (payload.products && payload.price) {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        customer_id: customer.id,
        products: payload.products,
        price: payload.price,
        visitorId: payload.visitorId,
        date: new Date().toISOString(),
        notes: payload.orderNotes || ''
      }])
      .select()
      .single()

    if (invoiceError) {
      return res.status(500).json({ error: 'خطا در ثبت سفارش', detail: invoiceError.message })
    }

    return res.status(200).json({
      success: true,
      message: 'سفارش ثبت شد!',
      customer,
      invoice
    })
  }

  return res.status(200).json({
    success: true,
    message: 'مشتری بدون سفارش ثبت شد!',
    customer
  })
}

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  try {
    const body = req.method === 'POST'
      ? JSON.parse(req.body || '{}')
      : {}

    const {
      name,
      phone,
      address,
      visitorId,
      customerNotes,
      products,
      price,
      orderNotes
    } = body

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'نام و شماره تماس الزامی هستند.'
      })
    }

    // ثبت مشتری
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([{
        name,
        phone,
        address,
        visitorId,
        notes: customerNotes || ''
      }])
      .select()
      .single()

    if (customerError) throw customerError

    // اگر سفارش ثبت شده
    if (products && price) {
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([{
          customer_id: customer.id,
          visitorId,
          products: JSON.stringify(products),
          price,
          date: new Date().toISOString(),
          notes: orderNotes || ''
        }])

      if (invoiceError) throw invoiceError
    }

    return res.status(200).json({
      success: true,
      message: 'مشتری و سفارش با موفقیت ثبت شدند.',
      customerId: customer.id
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'خطا: ' + err.message
    })
  }
}

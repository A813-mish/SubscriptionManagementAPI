import 'dotenv/config'
import { sendReminderEmail } from './utils/send-email.js'

console.log("🚀 Sending test email...")

sendReminderEmail({
  to: 'mishraaakriti684@gmail.com',
  type: '7 days before reminder', // <-- must exactly match
  subscription: {
    user: { name: 'Aakriti' },
    name: 'Netflix Premium',
    renewalDate: '2025-08-15',
    currency: 'USD',
    price: 15.99,
    frequency: 'monthly',
    paymentMethod: 'Credit Card',
    accountSettingsLink: 'https://yourapp.com/account',
    supportLink: 'https://yourapp.com/support'
  }
}).then(() => {
  console.log('✅ Test email sent!')
}).catch((err) => {
  console.error('❌ Failed to send test email:', err.message)
})

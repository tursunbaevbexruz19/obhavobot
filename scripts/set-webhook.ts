// script to register webhook
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.argv[2]; // pass your vercel url

if (!TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not found in env');
    process.exit(1);
}

if (!WEBHOOK_URL) {
    console.error('Please profound a webhook url. \nUsage: npx ts-node scripts/set-webhook.ts https://your-domain.vercel.app/api/webhook');
    process.exit(1);
}

async function setWebhook() {
    try {
        const res = await axios.post(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
            url: WEBHOOK_URL,
        });
        console.log('Webhook configured:', res.data);
    } catch (error: any) {
        console.error('Error setting webhook:', error.response?.data || error.message);
    }
}

setWebhook();

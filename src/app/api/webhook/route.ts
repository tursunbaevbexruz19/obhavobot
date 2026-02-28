import { Telegraf, Markup, Context } from 'telegraf';
import { getCurrentWeatherByCity, getCurrentWeatherByCoords, getForecast } from '@/lib/weather';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

// State management for language (in a real app, store in DB)
// For vercel serverless, this is ephemeral, but okay for a simple demo
const userLangs: Record<number, string> = {};

const getLang = (ctx: Context): string => {
    return userLangs[ctx.from?.id || 0] || 'uz';
}

bot.start((ctx) => {
    const lang = getLang(ctx);
    const welcome = lang === 'uz'
        ? `Salom, ${ctx.from.first_name}! 🌤️ Men Ob-havo botiman.\n\nShahar nomini yozing yoki lokatsiyangizni yuboring.`
        : `Hello, ${ctx.from.first_name}! 🌤️ I'm a Weather bot.\n\nSend a city name or your location.`;

    ctx.reply(welcome, Markup.keyboard([
        Markup.button.locationRequest(lang === 'uz' ? '📍 Lokatsiyani yuborish' : '📍 Send Location'),
        [lang === 'uz' ? '🇷🇺 RU' : '🇺🇿 UZ', lang === 'en' ? '🇺🇿 UZ' : '🇬🇧 EN']
    ]).resize());
});

bot.hears('🇷🇺 RU', (ctx) => { userLangs[ctx.from.id] = 'ru'; ctx.reply('Язык изменен на Русский 🇷🇺.\nОтправьте название города или локацию.', Markup.keyboard([Markup.button.locationRequest('📍 Отправить локацию'), ['🇺🇿 UZ', '🇬🇧 EN']]).resize()); });
bot.hears('🇺🇿 UZ', (ctx) => { userLangs[ctx.from.id] = 'uz'; ctx.reply('Til O\'zbek tiliga o\'zgardi 🇺🇿.\nShahar nomini yoki lokatsiyani yuboring.', Markup.keyboard([Markup.button.locationRequest('📍 Lokatsiyani yuborish'), ['🇷🇺 RU', '🇬🇧 EN']]).resize()); });
bot.hears('🇬🇧 EN', (ctx) => { userLangs[ctx.from.id] = 'en'; ctx.reply('Language changed to English 🇬🇧.\nSend a city name or location.', Markup.keyboard([Markup.button.locationRequest('📍 Send Location'), ['🇷🇺 RU', '🇺🇿 UZ']]).resize()); });


bot.on('location', async (ctx) => {
    const { latitude, longitude } = ctx.message.location;
    const lang = getLang(ctx);

    // Send "Typing..." action
    await ctx.sendChatAction('typing');

    const weather = await getCurrentWeatherByCoords(latitude, longitude, lang);

    if (weather) {
        const msg = lang === 'uz'
            ? `📍 <b>${weather.city}</b>\n\n${weather.icon} Harorat: <b>${Math.round(weather.temp)}°C</b>\n☁️ Holat: ${weather.condition}\n💧 Namlik: ${weather.humidity}%\n💨 Shamol tezligi: ${weather.windSpeed} m/s`
            : `📍 <b>${weather.city}</b>\n\n${weather.icon} Temp: <b>${Math.round(weather.temp)}°C</b>\n☁️ Condition: ${weather.condition}\n💧 Humidity: ${weather.humidity}%\n💨 Wind: ${weather.windSpeed} m/s`;

        await ctx.replyWithHTML(msg, Markup.inlineKeyboard([
            Markup.button.callback(lang === 'uz' ? '📅 3 kunlik prognoz' : '📅 3-day forecast', `forecast_${latitude}_${longitude}`)
        ]));
    } else {
        ctx.reply(lang === 'uz' ? '❌ Ob-havo ma\'lumotlarini olishda xatolik yuz berdi.' : '❌ Error fetching weather.');
    }
});

bot.on('text', async (ctx) => {
    const city = ctx.message.text;
    const lang = getLang(ctx);

    if (city.startsWith('/') || ['🇷🇺 RU', '🇺🇿 UZ', '🇬🇧 EN'].includes(city)) return;

    await ctx.sendChatAction('typing');
    const weather = await getCurrentWeatherByCity(city, lang);

    if (weather) {
        const msg = lang === 'uz'
            ? `📍 <b>${weather.city}</b>\n\n${weather.icon} Harorat: <b>${Math.round(weather.temp)}°C</b>\n☁️ Holat: ${weather.condition}\n💧 Namlik: ${weather.humidity}%\n💨 Shamol tezligi: ${weather.windSpeed} m/s`
            : (lang === 'ru'
                ? `📍 <b>${weather.city}</b>\n\n${weather.icon} Температура: <b>${Math.round(weather.temp)}°C</b>\n☁️ Состояние: ${weather.condition}\n💧 Влажность: ${weather.humidity}%\n💨 Ветер: ${weather.windSpeed} м/с`
                : `📍 <b>${weather.city}</b>\n\n${weather.icon} Temp: <b>${Math.round(weather.temp)}°C</b>\n☁️ Condition: ${weather.condition}\n💧 Humidity: ${weather.humidity}%\n💨 Wind: ${weather.windSpeed} m/s`);

        await ctx.replyWithHTML(msg);
    } else {
        const errorMsg = lang === 'uz' ? "❌ Bunday shahar topilmadi. Qaytadan urinib ko'ring." : "❌ City not found. Please try again.";
        ctx.reply(errorMsg);
    }
});

bot.action(/forecast_(.+)_(.+)/, async (ctx) => {
    const lat = parseFloat(ctx.match[1]);
    const lon = parseFloat(ctx.match[2]);
    const lang = getLang(ctx);

    const forecast = await getForecast(lat, lon, lang);
    if (forecast) {
        await ctx.replyWithHTML(forecast);
        await ctx.answerCbQuery();
    } else {
        await ctx.answerCbQuery(lang === 'uz' ? 'Xatolik yuz berdi' : 'Error');
    }
});


export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Pass the request body natively to Telegraf webhook integration
        await bot.handleUpdate(body);
        return new Response('OK', { status: 200 });
    } catch (err) {
        console.error("Webhook Error:", err);
        return new Response('Error', { status: 500 });
    }
}

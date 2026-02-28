import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 sm:p-20 font-[family-name:var(--font-geist-sans)] selection:bg-blue-500 selection:text-white">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center gap-8 max-w-2xl text-center">

        {/* Animated Weather Icon Container */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-bounce-slow">
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
          <div className="text-8xl md:text-[140px] drop-shadow-lg flex items-center justify-center h-full w-full">
            🌤️
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Weather Bot Pro
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed max-w-xl">
          Sizning shaxsiy ob-havo yordamchingiz. Aniq, tezkor va qulay — to'g'ridan-to'g'ri Telegramda. O'zbek, Rus va Ingliz tillarida.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <a
            className="group rounded-full border border-solid border-transparent transition-all flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 hover:scale-105 active:scale-95 text-lg h-14 px-8 font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            href="https://t.me/Youtube_Test_uchun12_bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
            </svg>
            Botga o'tish
          </a>
          <a
            className="rounded-full border border-gray-700 transition-all flex items-center justify-center hover:bg-white/10 hover:border-transparent text-lg h-14 px-8 text-gray-300 font-medium"
            href="https://core.telegram.org/bots/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-12 border-t border-gray-800 pt-12">
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl mb-2">🌍</div>
            <h3 className="font-semibold text-gray-200">Global Data</h3>
            <p className="text-sm text-gray-500">Istalgan shaharning ob-havosi haqida aniq ma'lumot.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-200">Tezkor</h3>
            <p className="text-sm text-gray-500">Vercel va Next.js orqali cheksiz 24/7 tezlik.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-200">Prognoz</h3>
            <p className="text-sm text-gray-500">Kelgusi kunga batafsil 3 kunlik ob-havo ma'lumoti.</p>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-sm text-gray-600 flex gap-4">
        <span>© {new Date().getFullYear()} Weather Bot</span>
        <span className="text-gray-800">•</span>
        <span>Powered by OpenWeather</span>
      </footer>
    </div>
  );
}

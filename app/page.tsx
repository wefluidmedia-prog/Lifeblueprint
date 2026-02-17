export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold mb-6">
        Discover Your Personal Life Blueprint
      </h1>

      <p className="text-xl text-gray-300 max-w-xl mb-8">
        A structured AI-powered mindset analysis designed for ambitious
        Indian professionals who feel stuck between career pressure
        and personal expectations.
      </p>

      <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
        Join Early Access
      </button>
    </div>
  );
}
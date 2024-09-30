export default function HeroLanding() {
  return (
    <section className="space-y-6 py-32">
      <div className="container flex flex-col items-center text-center gap-6">
        <h1 className="text-balance font-bold text-4xl sm:text-5xl lg:text-7xl max-w-[800px]">
          Be available from anywhere, anytime.
        </h1>
        <h3 className="font-light text-center text-sm sm:text-lg lg:text-2xl max-w-[450px] sm:max-w-[600px] lg:max-w-[800px]">
          Personalized AI chatbot that acts as you and intelligently responds,
          while organizing all your important links in one place.
        </h3>
        <div className="border shadow-lg border-black px-4 p-2 rounded-full font-light text-md sm:text-xl cursor-pointer bg-blue-500 text-white">
          Get started for free
        </div>
      </div>
    </section>
  )
}

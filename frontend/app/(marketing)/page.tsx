import FAQsSection from "@/components/sections/FAQs"
import Features from "@/components/sections/Features"
import HeroLanding from "@/components/sections/HeroLanding"
import Pricing from "@/components/sections/Pricing"
import ProductLanding from "@/components/sections/ProductLanding"
// import Testimonials from "@/components/sections/Testimonials"

export const runtime = "edge"

export default function Home() {
  return (
    <>
      <HeroLanding />
      <ProductLanding />
      <Features />
      <FAQsSection />
      <Pricing />
      {/* <Testimonials /> */}
    </>
  )
}

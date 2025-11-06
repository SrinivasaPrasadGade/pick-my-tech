import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import HowItWorks from '@/components/home/HowItWorks'
import TrendingDevices from '@/components/home/TrendingDevices'
import Testimonials from '@/components/home/Testimonials'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <TrendingDevices />
      <Testimonials />
    </div>
  )
}


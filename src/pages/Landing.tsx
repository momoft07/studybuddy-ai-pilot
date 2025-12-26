import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated blue sky gradient background */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(135, 206, 250)"
        gradientBackgroundEnd="rgb(70, 130, 180)"
        firstColor="255, 255, 255"
        secondColor="173, 216, 230"
        thirdColor="135, 206, 235"
        fourthColor="176, 224, 230"
        fifthColor="240, 248, 255"
        pointerColor="200, 230, 255"
        size="100%"
        blendingValue="soft-light"
        interactive={true}
        containerClassName="!fixed !h-screen"
        className="absolute inset-0 z-0"
      />

      {/* Navigation with animated sky visible through glassmorphism */}
      <LandingNavbar />

      {/* Main Content - above gradient */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

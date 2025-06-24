import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import StatsSection from "../components/sections/StatsSection";
import FeaturedJobsSection from "../components/sections/FeaturedJobsSection";
import TestimonialsSection from "../components/sections/TestimonialSection";
import CTASection from "../components/sections/CTASection";
import CompaniesPricing from "../components/sections/CompaniesPricing";
import DownloadApp from "../components/sections/DownloadApp";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <FeaturedJobsSection />
      <TestimonialsSection />
      <CTASection />
      <CompaniesPricing />
      <DownloadApp />
    </div>
  );
};

export default LandingPage;

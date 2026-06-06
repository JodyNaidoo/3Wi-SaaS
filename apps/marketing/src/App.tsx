import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Features } from './components/Features';
import { AiSkills } from './components/AiSkills';
import { Pricing } from './components/Pricing';
import { DemoEmbed } from './components/DemoEmbed';
import { Onboarding } from './components/Onboarding';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <AiSkills />
      <Pricing />
      <DemoEmbed />
      <Onboarding />
      <Testimonials />
      <Footer />
    </>
  );
}

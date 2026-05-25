import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WorkSection from './components/WorkSection';
import AboutSection from './components/AboutSection';
import EducationSection from './components/EducationSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <EducationSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WorkSection from './components/WorkSection';
import AboutSection from './components/AboutSection';
import TechStackSection from './components/TechStackSection';
import EducationSection from './components/EducationSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-200px', left: '-200px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'rgba(56,189,248,0.06)',
          filter: 'blur(120px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', right: '-150px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(14,165,233,0.04)',
          filter: 'blur(100px)',
        }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <HeroSection />
          <WorkSection />
          <AboutSection />
          <TechStackSection />
          <EducationSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

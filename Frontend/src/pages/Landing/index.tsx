// import Navbar from './Navbar';
import Hero from './Hero';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative ambient lighting details (extremely subtle, low opacity) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FFB26B]/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFB26B]/1 blur-[100px] pointer-events-none" />

      {/* Navbar component */}
      {/* <Navbar /> */}

      {/* Hero component */}
      <Hero />
    </div>
  );
}

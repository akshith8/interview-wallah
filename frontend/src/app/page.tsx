import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import BuiltFor from "@/components/sections/BuiltFor";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import PracticeDemo from "@/components/practice/PracticeDemo";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <PracticeDemo />
        <BuiltFor />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

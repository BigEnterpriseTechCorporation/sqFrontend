import Navigation from "@/components/layout/Navigation";
import Header from "@/components/Home/header";
import Footer from "@/components/layout/Footer";
import AboutTrainer from "@/components/Home/AboutTrainer";
import DifficultyLevels from "@/components/Home/DifficultyLevels";
import HowItWorks from "@/components/Home/HowItWorks";

export default function Home() {
  return (
    <div>
      <Navigation/>
      <Header/>
      <AboutTrainer/>
      <DifficultyLevels/>
      <HowItWorks/>
      <Footer/>
    </div>
  ) 
}

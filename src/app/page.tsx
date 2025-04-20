import Navigation from "@/components/layout/Navigation";
import Header from "@/components/Home/header";
import Footer from "@/components/layout/Footer";
import AboutTrainer from "@/components/Home/AboutTrainer";
import DifficultyLevels from "@/components/Home/DifficultyLevels";
import HowItWorks from "@/components/Home/HowItWorks";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation/>
      <div className="flex-grow">
        <Header/>
        <AboutTrainer/>
        <DifficultyLevels/>
        <HowItWorks/>
      </div>
      <Footer/>
    </div>
  ) 
}

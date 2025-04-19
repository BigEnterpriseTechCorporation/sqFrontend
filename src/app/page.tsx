import Navigation from "@/components/navigation";
import Header from "@/components/Home/header";
import Footer from "@/components/footer";
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

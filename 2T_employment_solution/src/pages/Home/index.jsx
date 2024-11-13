import OfferSection from "~/components/Offersection";
import HeroSection from "~/components/Herosection";
import Step from "~/components/3StepSection";
import CategorySection from "~/components/Categorysection";
import JobCardSection from "~/components/Jobcardssection";
import TestimonialSection from "~/components/Testimonialsection";
import ConpaniesSection from "~/components/Companiessection";
import NotificationSection from "~/components/Notifitionsection";


function Home() {
    return (
        <>       
           <HeroSection />
           <OfferSection />
           <Step/>
           <CategorySection/>
           <JobCardSection/>
           <TestimonialSection/>
           <ConpaniesSection/>
           <NotificationSection/>
        </>    
    );
}

export default Home;

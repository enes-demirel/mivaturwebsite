import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { legalConfig } from "@/data/legal-config";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const organization={"@context":"https://schema.org","@type":"TravelAgency",name:"Mivatur",legalName:legalConfig.companyName,url:"https://www.mivatur.com",telephone:legalConfig.phone,email:legalConfig.email,address:{"@type":"PostalAddress",streetAddress:legalConfig.address,addressCountry:"TR"},identifier:`TÜRSAB ${legalConfig.tursabNumber}`};
  return (
    <div className="flex min-h-dvh flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization).replaceAll("<","\\u003c")}} />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Briefcase, HeartHandshake} from "lucide-react"
import Link from 'next/link'
import { getAllServices } from "@/data/services"

export function ServicesSection() {
//   const services = [
//     {
//       icon: GraduationCap,
//       title: "Academic Advising",
//       description:
//         "Personalized guidance to help you navigate your academic journey and achieve your educational goals.",
//       features: ["Course planning", "Degree requirements", "Academic support"],
//     },
//     {
//       icon: HeartHandshake,
//       title: "Counseling Services",
//       description: "Professional mental health support and wellness resources for your emotional wellbeing.",
//       features: ["Individual counseling", "Group therapy", "Crisis support"],
//     },
//     {
//       icon: Briefcase,
//       title: "Career Services",
//       description: "Comprehensive career development support from exploration to job placement.",
//       features: ["Resume building", "Interview prep", "Job placement"],
//     },
//     {
//       icon: Users,
//       title: "Student Life",
//       description: "Enriching campus experiences through activities, leadership, and community engagement.",
//       features: ["Campus activities", "Leadership programs", "Community service"],
//     },
//   ]

 

  const services = getAllServices()


  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive support services designed to help you succeed academically, personally, and professionally
            throughout your college experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center mb-4">
                {/* <service.icon className="h-12 w-12 text-primary mx-auto mb-4" /> */}
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    <Link href={`/services/${service.title}`} >
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

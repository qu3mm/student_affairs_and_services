
const services = [
  {
    id: 1,
    icon: "GraduationCap",
    title: "Academic Advising",
    description: "Personalized guidance to help you navigate your academic journey and achieve your educational goals.",
    features: ["Course planning", "Degree requirements", "Academic support"],
    overview:
      "Our academic advisors are here to help you make informed decisions about your educational path. Whether you're choosing majors, planning your course schedule, or navigating degree requirements, we provide personalized guidance every step of the way.",
    keyServices: [
      "Personalized academic planning and major selection",
      "Course scheduling and registration assistance",
      "Degree requirement tracking and audits",
      "Transfer credit evaluation",
      "Academic performance support and GPA management",
      "Study skills workshops and resources",
    ],
    contact: "Visit the Academic Advising Office in Building A, Room 201 or call (555) 123-4567",
    hours: "Monday - Friday: 9:00 AM - 5:00 PM",
  },
  {
    id: 2,
    icon: "HeartHandshake",
    title: "Counseling Services",
    description: "Professional mental health support and wellness resources for your emotional wellbeing.",
    features: ["Individual counseling", "Group therapy", "Crisis support"],
    overview:
      "Our licensed counselors and mental health professionals are committed to supporting your emotional wellbeing and personal growth. We offer confidential counseling services in a safe, non-judgmental environment.",
    keyServices: [
      "Individual counseling sessions",
      "Group therapy and support groups",
      "Crisis intervention and emergency support",
      "Stress management and coping strategies",
      "Relationship and communication counseling",
      "Mental health workshopxs and wellness programs",
    ],
    contact: "Counseling Center - Building B, Room 105 or call (555) 123-4568",
    hours: "Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 10:00 AM - 2:00 PM",
  },
  {
    id: 3,
    icon: "Briefcase",
    title: "Career Services",
    description: "Comprehensive career development support from exploration to job placement.",
    features: ["Resume building", "Interview prep", "Job placement"],
    overview:
      "Our career specialists work with you to explore career options, develop professional skills, and connect with employers. From your first year through graduation and beyond, we're invested in your career success.",
    keyServices: [
      "Resume and cover letter writing assistance",
      "Interview preparation and mock interviews",
      "Career exploration and assessment",
      "Internship and job placement support",
      "LinkedIn profile development",
      "Networking events and employer connections",
      "Professional development workshops",
    ],
    contact: "Career Services Office - Building C, Room 301 or call (555) 123-4569",
    hours: "Monday - Friday: 9:00 AM - 5:00 PM (appointments available until 6:00 PM)",
  },
  {
    id: 4,
    icon: "Users",
    title: "Student Life",
    description: "Enriching campus experiences through activities, leadership, and community engagement.",
    features: ["Campus activities", "Leadership programs", "Community service"],
    overview:
      "Get involved in campus life through clubs, organizations, events, and leadership opportunities. Build lasting friendships, develop leadership skills, and make a positive impact on our community.",
    keyServices: [
      "200+ student clubs and organizations",
      "Campus events and social activities",
      "Leadership development programs",
      "Service-learning and volunteer opportunities",
      "Intramural and recreational sports",
      "Multicultural programs and affinity groups",
      "Community service projects",
    ],
    contact: "Office of Student Life - Building A, Room 301 or call (555) 123-4570",
    hours: "Monday - Friday: 9:00 AM - 5:00 PM",
  },
]
export function getAllServices() {
    return services;
}
export function getServiceById(id: number) {
    return services.find((service) => service.id === id);
}
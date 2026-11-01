export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  period: string;
  location: string;
  highlights: string[];
  coursework: string[];
}

export const EDUCATION_LIST: EducationItem[] = [
  {
    id: "bachelors-cs",
    institution: "Tribhuvan University (IOE)",
    degree: "Bachelor of Engineering (B.E.)",
    fieldOfStudy: "Computer Engineering",
    period: "2019 — 2023",
    location: "Kathmandu, Nepal",
    highlights: [
      "Graduated with Distinction (Top 5% of cohort)",
      "Lead Developer for Department Student Council Portal",
      "Published Senior Capstone Research on Distributed Consensus in Low-Bandwidth Networks",
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Operating Systems & Kernel Programming",
      "Database Management Systems",
      "Computer Networks & Distributed Systems",
      "Computer Graphics & Image Processing",
      "Software Engineering & Architecture",
    ],
  },
  {
    id: "hs-science",
    institution: "St. Xavier's College",
    degree: "Higher Secondary (+2)",
    fieldOfStudy: "Physical Science & Mathematics",
    period: "2017 — 2019",
    location: "Kathmandu, Nepal",
    highlights: [
      "Merit Scholarship for Academic Excellence",
      "President of High School Computer Science Club",
      "Organized Interschool Hackathon with 120+ participants",
    ],
    coursework: ["Physics", "Calculus & Linear Algebra", "Chemistry", "Computer Science"],
  },
];


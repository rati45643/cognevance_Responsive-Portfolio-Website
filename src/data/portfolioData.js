export const personalInfo = {
  name: "Ratish Kannur",
  title: "Full Stack Developer & Software Engineer",
  subtitle: "Specializing in React, Node.js, Express, SQLite, Android (Kotlin), Generative AI, and Quality Automation",
  email: "ratishkannur@gmail.com",
  phone: "+91 9019542275",
  location: "Bengaluru, Karnataka, India",
  github: "https://github.com/ratishkannur",
  linkedin: "https://linkedin.com/in/ratishkannur",
  portfolio: "https://ratishkannur.dev",
  avatarImage: "/images/ratish.png",
  education: {
    institution: "APS College of Engineering, Bengaluru",
    degree: "B.E. in Information Science and Engineering",
    period: "Dec 2022 – May 2026",
    cgpa: "8.6 / 10.0"
  },
  bio: "Passionate Full Stack Software Engineer and B.E. Information Science graduate (CGPA 8.6) with hands-on experience in building modern web applications, mobile apps, AI-driven solutions, and robust automated test suites. Certified in MERN Full Stack, Gen AI Android Development, and Data Analytics."
};

export const skillsData = [
  {
    category: "Web & Fullstack",
    icon: "Code",
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", "Node.js", "Express.js", "REST APIs", "Vite"]
  },
  {
    category: "Mobile & Gen AI",
    icon: "Smartphone",
    skills: ["Kotlin", "Android Studio", "Jetpack Compose", "Generative AI Integration", "Mobile UI/UX Design"]
  },
  {
    category: "Databases & Cloud",
    icon: "Database",
    skills: ["MongoDB", "SQLite", "Firebase", "SQL"]
  },
  {
    category: "Testing & Automation",
    icon: "ShieldCheck",
    skills: ["Manual Testing", "Functional Testing", "Regression Testing", "Smoke Testing", "Playwright", "STLC", "SDLC", "Postman", "REST API Testing"]
  },
  {
    category: "Programming & ML",
    icon: "Cpu",
    skills: ["Python", "C++", "Java", "C", "Pandas", "Flask", "Spacy", "Scikit-learn", "Data Structures & Algorithms", "OOPs"]
  },
  {
    category: "Tools & Analytics",
    icon: "BarChart3",
    skills: ["Git", "GitHub", "GitHub Actions", "Tableau", "Power BI"]
  }
];

export const projectsData = [
  {
    id: "portfolio-website",
    title: "Responsive Portfolio Website",
    category: "Fullstack",
    badge: "Featured / New",
    description: "Designed and developed a responsive personal portfolio application with React frontend and Express backend. Integrated SQLite database for storing contact submissions via REST API, dark/light theme switching, glassmorphic UI, and dynamic project filtering.",
    technologies: ["React.js", "Node.js", "Express.js", "SQLite", "Vite", "REST API", "CSS Modules"],
    image: "/images/portfolio_website_preview.png",
    githubLink: "https://github.com/ratishkannur/responsive-portfolio",
    liveLink: "http://localhost:5000",
    credentialLink: "http://localhost:5000",
    highlights: [
      "Built responsive UI with customizable dark glassmorphic aesthetics",
      "Created Express.js REST API with input validation",
      "Stored contact form submissions persistently in SQLite database (portfolio.db)",
      "Implemented admin message drawer to inspect stored inquiries"
    ]
  },
  {
    id: "ai-customer-feedback",
    title: "AI Customer Feedback Platform (Project Loop)",
    category: "Fullstack",
    badge: "AI Dashboard",
    description: "Real-time executive customer feedback analytics dashboard for MSKR. Aggregates multi-channel user feedback, processes sentiment classification (Positive/Neutral/Negative), and extracts top theme categories.",
    technologies: ["React.js", "Node.js", "Express.js", "AI Analytics", "Vercel", "Dashboard UI"],
    image: "/images/ai_customer_feedback.png",
    githubLink: "https://github.com/ratishkannur/ai-customer-feedback",
    liveLink: "https://ai-customer-feedback-inky.vercel.app/dashboard",
    credentialLink: "https://ai-customer-feedback-inky.vercel.app/dashboard",
    highlights: [
      "Engineered real-time customer sentiment share visualization charts",
      "Categorized feedback themes for rapid customer support escalation",
      "Built responsive executive dashboard layout with secure authentication"
    ]
  },
  {
    id: "mskr-resort",
    title: "MSKR Resort Booking Platform",
    category: "Fullstack",
    badge: "Resort Web App",
    description: "Luxury resort booking and hospitality digital platform. Allows guests to book luxury rooms, order delicious food/dining, and access resort amenities with seamless mobile experience.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "CSS Modules"],
    image: "/images/mskr_resort.jpg",
    githubLink: "https://github.com/ratishkannur",
    liveLink: "https://github.com/ratishkannur",
    credentialLink: "https://github.com/ratishkannur",
    highlights: [
      "Built luxury room booking and reservation module",
      "Created in-room dining and food ordering API",
      "Designed tropical paradise responsive user interface"
    ]
  },
  {
    id: "interview-pro",
    title: "AI Mock Interview Platform (Interview Pro)",
    category: "AI & ML",
    badge: "AI Platform",
    description: "AI-driven practice platform designed for software engineers. Offers interactive practice zones including Group Discussion simulation, JAM (Just a Minute) spontaneous speaking, and AI Mock Interviews.",
    technologies: ["React.js", "TypeScript", "Node.js", "Gen AI API", "WebSockets"],
    image: "/images/interview_pro.png",
    githubLink: "https://github.com/ratishkannur/interview-pro-ai",
    liveLink: "https://github.com/ratishkannur/interview-pro-ai",
    credentialLink: "https://github.com/ratishkannur/interview-pro-ai",
    highlights: [
      "Simulated real-world technical interview scenarios with AI voice/text prompts",
      "Evaluated spontaneous speaking skills in JAM and Group Discussion modules",
      "Generated detailed performance breakdowns and improvement roadmaps"
    ]
  },
  {
    id: "nlp-summarizer",
    title: "NLP Based Text Summarization for Kannada",
    category: "AI & ML",
    badge: "NLP / Research",
    description: "Extractive text summarization system built for the Kannada language using MERN stack frontend and custom NLP algorithms (TextRank, frequency-based, hybrid algorithm).",
    technologies: ["MERN Stack", "TextRank", "Kannada Script", "NLP", "Python", "React.js"],
    image: "/images/kannada_summarizer.png",
    githubLink: "https://github.com/ratishkannur/kannada-text-summarizer",
    liveLink: "https://github.com/ratishkannur/kannada-text-summarizer",
    credentialLink: "https://github.com/ratishkannur/kannada-text-summarizer",
    highlights: [
      "Implemented TextRank, Advanced, Hybrid, and Simple extractive summarization algorithms for Kannada text",
      "Built clean yellow/red regional Kannada script UI with PDF/Word document import features"
    ]
  },
  {
    id: "ai-travel-planner",
    title: "MSKR AI Travel Planner Mobile App",
    category: "Mobile",
    badge: "Android / Kotlin",
    description: "Native Android application built with Kotlin and Jetpack Compose that allows users to select source, destination, budget, and travel preferences to generate AI-driven travel itineraries.",
    technologies: ["Kotlin", "Jetpack Compose", "Gen AI API", "Android Studio", "SQLite/Room"],
    image: "/images/mskr_travel_planner.jpg",
    githubLink: "https://github.com/ratishkannur/ai-travel-planner",
    liveLink: "https://github.com/ratishkannur/ai-travel-planner",
    credentialLink: "https://github.com/ratishkannur/ai-travel-planner",
    highlights: [
      "Generated personalized multi-day trip itineraries based on user constraints",
      "Allowed offline saving, trip editing, and deletion with persistent storage",
      "Integrated clean Material 3 design with Jetpack Compose animations"
    ]
  },
  {
    id: "santhe-connect",
    title: "Santhe-Connect Karnataka Marketplace",
    category: "Mobile",
    badge: "Android / Regional",
    description: "Regional Karnataka local eatery and heritage marketplace app. Connects users with local food hubs, weekly Santhe market schedules, review walls, and Karnataka specialty tags.",
    technologies: ["Kotlin", "Android Studio", "Firebase", "Jetpack Compose", "REST API"],
    image: "/images/santhe_connect.jpg",
    githubLink: "https://github.com/ratishkannur/santhe-connect",
    liveLink: "https://github.com/ratishkannur/santhe-connect",
    credentialLink: "https://github.com/ratishkannur/santhe-connect",
    highlights: [
      "Built Local Eatery Map & Heritage Stays discoverer",
      "Created Santhe Calendar for weekly market schedules across Karnataka",
      "Integrated voice notes & local review wall"
    ]
  }
];

export const experienceData = [
  {
    role: "Android App Development using Gen AI Intern",
    company: "Mind Matrix",
    period: "2 Feb 2026 – 18 May 2026",
    location: "Bengaluru, India",
    description: [
      "Worked on Android app development leveraging Generative AI to build intelligent, user-centric mobile applications.",
      "Developed and integrated AI-driven features for personalized recommendations and dynamic content generation.",
      "Gained practical experience with Kotlin, Jetpack Compose, Android Studio, UI/UX design, and AI APIs."
    ]
  }
];

export const certificatesData = [
  {
    title: "MERN FullStack Certification",
    issuer: "Certified in MERN Full Stack Development",
    details: "Proficiency in MongoDB, Express.js, React.js, and Node.js.",
    credentialLink: "https://github.com/ratishkannur"
  },
  {
    title: "Android App Development Using Gen AI",
    issuer: "Mind Matrix Certification",
    details: "Covered Android development fundamentals, AI integration, app design, testing, and deployment.",
    credentialLink: "https://github.com/ratishkannur"
  },
  {
    title: "Cyber Suraksha Certification",
    issuer: "TCS (Tata Consultancy Services)",
    details: "Essential cybersecurity practices, threat mitigation, and safe digital usage.",
    credentialLink: "https://github.com/ratishkannur"
  },
  {
    title: "CSRBOX Micro Internship on Data Analytics",
    issuer: "CSRBOX",
    details: "Hands-on experience in data processing, visual dashboard generation, and insights derivation.",
    credentialLink: "https://github.com/ratishkannur"
  },
  {
    title: "CDS Data for Public Good",
    issuer: "CDS Certification",
    details: "Focused on leveraging data-driven insights for social impact and public welfare.",
    credentialLink: "https://github.com/ratishkannur"
  }
];

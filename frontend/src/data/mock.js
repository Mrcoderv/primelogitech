import { Code, Smartphone, PenTool, Search, Cloud, BrainCircuit } from 'lucide-react';

export const services = [
  {
    title: "Web Development",
    description: "Custom, responsive, and high-performance websites built with modern frameworks like React and Next.js.",
    icon: Code,
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter.",
    icon: Smartphone,
  },
  {
    title: "UI/UX Design",
    description: "User-centric design solutions that enhance engagement and deliver intuitive digital experiences.",
    icon: PenTool,
  },
  {
    title: "SEO Optimization",
    description: "Data-driven SEO strategies to improve your search rankings and drive organic traffic.",
    icon: Search,
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure setup, migration, and management on AWS, Azure, or GCP.",
    icon: Cloud,
  },
  {
    title: "AI Automation",
    description: "Intelligent automation and AI integrations to streamline operations and boost productivity.",
    icon: BrainCircuit,
  }
];

export const projects = [
  {
    title: "FinTech Dashboard",
    category: "Web App",
    description: "A comprehensive financial dashboard for real-time analytics and portfolio management.",
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    image: null,
    link: "",
    isPinned: true,
  },
  {
    title: "HealthCare Platform",
    category: "Mobile App",
    description: "Telemedicine app connecting patients with doctors through secure video consultations.",
    techStack: ["React Native", "Node.js", "MongoDB"],
    image: null,
    link: "",
    isPinned: true,
  },
  {
    title: "E-Commerce Suite",
    category: "Web App",
    description: "Scalable e-commerce solution with advanced inventory management and AI recommendations.",
    techStack: ["Next.js", "Stripe", "Prisma"],
    image: null,
    link: "",
    isPinned: false,
  }
];

export const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CEO",
    company: "TechNova",
    content: "Prime Logic Tech transformed our legacy systems into a modern, lightning-fast platform. Their attention to detail and technical expertise is unmatched.",
    image: null,
  },
  {
    name: "David Chen",
    role: "Founder",
    company: "GrowthX",
    content: "The UI/UX design they delivered for our mobile app completely changed our user engagement metrics. Highly recommend their team.",
    image: null,
  },
  {
    name: "Elena Rodriguez",
    role: "CTO",
    company: "SecureNet",
    content: "Their cloud migration strategy saved us thousands in operational costs while improving system reliability. Truly professional service.",
    image: null,
  }
];

export const team = [
  {
    name: "Prasiddha Gyawali",
    role: "CEO & Founder",
    bio: "Visionary leader driving the strategic direction of Prime Logic Tech to deliver exceptional digital experiences.",
    image: null,
  },
  {
    name: "Pralhad Gyawali",
    role: "Co-Founder",
    bio: "Passionate about building scalable systems and establishing the core technical foundation of our enterprise solutions.",
    image: null,
  },
  {
    name: "Binit Raj Pandey",
    role: "Co-Founder",
    bio: "Dedicated to crafting intuitive products and driving innovation across all aspects of design and development.",
    image: null,
  },
  {
    name: "Raghav Panthi",
    role: "Junior Co-Founder",
    bio: "A rising talent focusing on modern development practices and bringing fresh perspectives to our technology stack.",
    image: null,
  },
  {
    name: "Ekata Pokherel",
    role: "Junior Co-Founder",
    bio: "Focused on collaborative product thinking, delivery quality, and keeping the team execution sharp.",
    image: null,
  }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fallbackHomeContent = {
  whyTitle: 'Why partner with Prime Logitech?',
  whyDescription:
    "We don't just write code; we build strategic digital assets. Our approach combines technical excellence with business acumen to deliver measurable results.",
  whyPoints: [
    'Agile development methodology for rapid delivery',
    'Enterprise-grade security and scalability',
    'Award-winning UI/UX design team',
    '24/7 dedicated support and maintenance',
  ],
  whyPanelTitle: 'Creative delivery, engineered to scale',
  whyPanelDescription:
    'The right side is a living visual panel that can be customized from the admin area. It is meant to reinforce the brand rather than display loading content.',
  clientSuccessTitle: 'Client Success',
  clientSuccessDescription:
    "Don't just take our word for it. Hear what our partners have to say about working with Prime Logitech.",
};

const fallbackServices = [
  {
    title: 'Web Development',
    description: 'Custom, responsive, and high-performance websites built with modern frameworks like React and Next.js.',
    icon: 'Code',
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android using React Native and Flutter.',
    icon: 'Smartphone',
  },
  {
    title: 'UI/UX Design',
    description: 'User-centric design solutions that enhance engagement and deliver intuitive digital experiences.',
    icon: 'PenTool',
  },
  {
    title: 'SEO Optimization',
    description: 'Data-driven SEO strategies to improve your search rankings and drive organic traffic.',
    icon: 'Search',
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure setup, migration, and management on AWS, Azure, or GCP.',
    icon: 'Cloud',
  },
  {
    title: 'AI Automation',
    description: 'Intelligent automation and AI integrations to streamline operations and boost productivity.',
    icon: 'BrainCircuit',
  },
];

const fallbackProjects = [
  {
    title: 'FinTech Dashboard',
    category: 'Web App',
    description: 'A comprehensive financial dashboard for real-time analytics and portfolio management.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    image: null,
    link: '',
    isPinned: true,
  },
  {
    title: 'HealthCare Platform',
    category: 'Mobile App',
    description: 'Telemedicine app connecting patients with doctors through secure video consultations.',
    techStack: ['React Native', 'Node.js', 'MongoDB'],
    image: null,
    link: '',
    isPinned: true,
  },
  {
    title: 'E-Commerce Suite',
    category: 'Web App',
    description: 'Scalable e-commerce solution with advanced inventory management and AI recommendations.',
    techStack: ['Next.js', 'Stripe', 'Prisma'],
    image: null,
    link: '',
    isPinned: false,
  },
];

const fallbackTeam = [
  {
    name: 'Prasiddha Gyawali',
    role: 'CEO & Founder',
    bio: 'Visionary leader driving the strategic direction of Prime Logitech to deliver exceptional digital experiences.',
    image: null,
    order: 0,
  },
  {
    name: 'Pralhad Gyawali',
    role: 'Co-Founder',
    bio: 'Passionate about building scalable systems and establishing the core technical foundation of our enterprise solutions.',
    image: null,
    order: 1,
  },
  {
    name: 'Binit Raj Pandey',
    role: 'Co-Founder',
    bio: 'Dedicated to crafting intuitive products and driving innovation across all aspects of design and development.',
    image: null,
    order: 2,
  },
  {
    name: 'Raghav Panthi',
    role: 'Junior Co-Founder',
    bio: 'A rising talent focusing on modern development practices and bringing fresh perspectives to our technology stack.',
    image: null,
    order: 3,
  },
  {
    name: 'Ekata Pokherel',
    role: 'Junior Co-Founder',
    bio: 'Focused on collaborative product thinking, delivery quality, and keeping the team execution sharp.',
    image: null,
    order: 4,
  },
];

const fallbackJobs = [];

function normalizeProject(project) {
  return {
    title: project.title,
    category: project.category || 'Project',
    description: project.description || '',
    image: project.image_url || null,
    link: project.link || '',
    techStack: Array.isArray(project.tech_stack)
      ? project.tech_stack
      : typeof project.tech_stack === 'string' && project.tech_stack.length > 0
        ? project.tech_stack.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    isPinned: Boolean(project.is_pinned),
  };
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function loadProjects() {
  try {
    const data = await fetchJson('/api/projects/');
    const projects = Array.isArray(data) ? data : [];
    return projects.map(normalizeProject);
  } catch (error) {
    return fallbackProjects;
  }
}

export async function fetchServices() {
  try {
    const data = await fetchJson('/api/services/');
    return Array.isArray(data) ? data : fallbackServices;
  } catch (error) {
    return fallbackServices;
  }
}

export async function loadHomeContent() {
  try {
    const data = await fetchJson('/api/home-content/');
    return {
      whyTitle: data.why_title,
      whyDescription: data.why_description,
      whyPoints: Array.isArray(data.why_points) ? data.why_points : [],
      whyPanelTitle: data.why_panel_title,
      whyPanelDescription: data.why_panel_description,
      clientSuccessTitle: data.client_success_title,
      clientSuccessDescription: data.client_success_description,
    };
  } catch (error) {
    return fallbackHomeContent;
  }
}

export async function loadTeam() {
  try {
    const data = await fetchJson('/api/team/');
    return Array.isArray(data) && data.length > 0
      ? data.map((member) => ({
          name: member.name,
          role: member.role,
          bio: member.bio,
          image: member.image_url || null,
          order: member.order,
        }))
      : fallbackTeam;
  } catch (error) {
    return fallbackTeam;
  }
}

export async function fetchJobs() {
  try {
    const data = await fetchJson('/api/jobs/');
    return Array.isArray(data) ? data : fallbackJobs;
  } catch (error) {
    return fallbackJobs;
  }
}

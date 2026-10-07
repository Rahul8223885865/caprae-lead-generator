export interface Lead {
  id: number;
  company: string;
  industry: string;
  location: string;
  employees: number;
  revenue: string;
  website: string;
  linkedin: string;
  decisionMaker: string;
  technologies: string[];
}

export const leads: Lead[] = [
  {
    id: 1,
    company: "CloudBridge",
    industry: "SaaS",
    location: "Canada",
    employees: 175,
    revenue: "$10M - $25M",
    website: "https://cloudbridge.com",
    linkedin:
      "https://www.linkedin.com/search/results/companies/?keywords=CloudBridge",
    decisionMaker: "VP of Sales",
    technologies: ["React", "AWS", "Docker"],
  },

  {
    id: 2,
    company: "FinEdge Solutions",
    industry: "Fintech",
    location: "United Kingdom",
    employees: 240,
    revenue: "$25M - $50M",
    website: "https://finedgesolutions.com",
    linkedin:
      "https://www.linkedin.com/search/results/companies/?keywords=FinEdge%20Solutions",
    decisionMaker: "Chief Technology Officer",
    technologies: ["React", "Node.js", "AWS"],
  },

  {
    id: 3,
    company: "Nova Technologies",
    industry: "SaaS",
    location: "United States",
    employees: 120,
    revenue: "$10M - $25M",
    website: "https://novatechnologies.com",
    linkedin:
      "https://www.linkedin.com/search/results/companies/?keywords=Nova%20Technologies",
    decisionMaker: "Head of Sales",
    technologies: ["React", "Node.js", "AI"],
  },

  {
    id: 4,
    company: "Vertex AI Labs",
    industry: "Artificial Intelligence",
    location: "United States",
    employees: 85,
    revenue: "$5M - $10M",
    website: "https://vertexailabs.com",
    linkedin:
      "https://www.linkedin.com/search/results/companies/?keywords=Vertex%20AI%20Labs",
    decisionMaker: "VP of Engineering",
    technologies: ["Python", "AI", "Machine Learning"],
  },
];
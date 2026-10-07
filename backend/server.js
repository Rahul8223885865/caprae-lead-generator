const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const leads = [
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

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Lead Generator API is running",
  });
});

// Get leads with filters
app.get("/api/leads", (req, res) => {
  const {
    industry,
    location,
    companySize,
    keyword,
  } = req.query;

  let filteredLeads = [...leads];

  // Industry filter
  if (industry) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.industry === industry
    );
  }

  // Location filter
  if (location) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.location === location
    );
  }

  // Company size filter
  if (companySize) {
    filteredLeads = filteredLeads.filter((lead) => {
      if (companySize === "1-50") {
        return lead.employees <= 50;
      }

      if (companySize === "51-200") {
        return (
          lead.employees >= 51 &&
          lead.employees <= 200
        );
      }

      if (companySize === "201-500") {
        return (
          lead.employees >= 201 &&
          lead.employees <= 500
        );
      }

      if (companySize === "500+") {
        return lead.employees > 500;
      }

      return true;
    });
  }

  // Keyword search
  if (keyword) {
    const searchKeyword =
      keyword.toLowerCase();

    filteredLeads = filteredLeads.filter(
      (lead) => {
        return (
          lead.company
            .toLowerCase()
            .includes(searchKeyword) ||
          lead.industry
            .toLowerCase()
            .includes(searchKeyword) ||
          lead.technologies.some((technology) =>
            technology
              .toLowerCase()
              .includes(searchKeyword)
          )
        );
      }
    );
  }

  res.json(filteredLeads);
});

app.listen(PORT, () => {
  console.log(
    `Lead Generator API running on http://localhost:${PORT}`
  );
});
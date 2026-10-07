import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { Lead } from "./lead";

function App() {
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [keyword, setKeyword] = useState("");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sortBy, setSortBy] = useState("score-desc");

  const fetchLeads = async (
    filters: {
      industry?: string;
      location?: string;
      companySize?: string;
      keyword?: string;
    } = {},
    isSearch = false
  ) => {
    try {
      if (isSearch) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = new URLSearchParams();

      if (filters.industry) {
        params.append("industry", filters.industry);
      }

      if (filters.location) {
        params.append("location", filters.location);
      }

      if (filters.companySize) {
        params.append("companySize", filters.companySize);
      }

      if (filters.keyword) {
        params.append("keyword", filters.keyword);
      }

      const query = params.toString();

      const url = query
        ? `http://localhost:5000/api/leads?${query}`
        : "http://localhost:5000/api/leads";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data: Lead[] = await response.json();

      setLeadsData(data);
    } catch (fetchError) {
      console.error("Error fetching leads:", fetchError);

      setError(
        "Unable to load leads. Please make sure the backend server is running."
      );

      setLeadsData([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const calculateScore = (lead: Lead) => {
    let score = 0;

    // Industry Match = 30
    if (industry && lead.industry === industry) {
      score += 30;
    }

    // Location Match = 20
    if (location && lead.location === location) {
      score += 20;
    }

    // Company Size Match = 20
    if (companySize) {
      const sizeMatches =
        (companySize === "1-50" && lead.employees <= 50) ||
        (companySize === "51-200" &&
          lead.employees >= 51 &&
          lead.employees <= 200) ||
        (companySize === "201-500" &&
          lead.employees >= 201 &&
          lead.employees <= 500) ||
        (companySize === "500+" && lead.employees > 500);

      if (sizeMatches) {
        score += 20;
      }
    }

    // Keyword Match = 20
    if (keyword) {
      const keywordLower = keyword.toLowerCase();

      const keywordMatches =
        lead.company.toLowerCase().includes(keywordLower) ||
        lead.industry.toLowerCase().includes(keywordLower) ||
        lead.technologies.some((technology) =>
          technology.toLowerCase().includes(keywordLower)
        );

      if (keywordMatches) {
        score += 20;
      }
    }

    // Complete Data = 10
    const hasCompleteData =
      Boolean(lead.company) &&
      Boolean(lead.industry) &&
      Boolean(lead.location) &&
      lead.employees > 0 &&
      Boolean(lead.revenue) &&
      Boolean(lead.website) &&
      Boolean(lead.linkedin) &&
      Boolean(lead.decisionMaker) &&
      lead.technologies.length > 0;

    if (hasCompleteData) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  const getPriority = (score: number) => {
    if (score >= 80) {
      return "High Priority";
    }

    if (score >= 60) {
      return "Medium Priority";
    }

    return "Low Priority";
  };

  const getPriorityColor = (
    score: number
  ): "success" | "warning" | "error" => {
    if (score >= 80) {
      return "success";
    }

    if (score >= 60) {
      return "warning";
    }

    return "error";
  };

  const getRecommendedAction = (lead: Lead) => {
    const score = calculateScore(lead);

    if (score >= 80) {
      return `Contact ${lead.decisionMaker} within 24 hours.`;
    }

    if (score >= 60) {
      return `Research ${lead.company} further and contact ${lead.decisionMaker}.`;
    }

    return `Keep ${lead.company} in a low-priority prospect list for future outreach.`;
  };

  const filteredLeads = useMemo(() => {
    const sortedLeads = [...leadsData];

    if (sortBy === "score-desc") {
      sortedLeads.sort(
        (a, b) => calculateScore(b) - calculateScore(a)
      );
    }

    if (sortBy === "score-asc") {
      sortedLeads.sort(
        (a, b) => calculateScore(a) - calculateScore(b)
      );
    }

    if (sortBy === "name-asc") {
      sortedLeads.sort((a, b) =>
        a.company.localeCompare(b.company)
      );
    }

    return sortedLeads;
  }, [
    leadsData,
    sortBy,
    industry,
    location,
    companySize,
    keyword,
  ]);

  const getScoreBreakdown = (lead: Lead) => {
    const keywordLower = keyword.toLowerCase();

    const sizeMatches =
      (companySize === "1-50" && lead.employees <= 50) ||
      (companySize === "51-200" &&
        lead.employees >= 51 &&
        lead.employees <= 200) ||
      (companySize === "201-500" &&
        lead.employees >= 201 &&
        lead.employees <= 500) ||
      (companySize === "500+" && lead.employees > 500);

    const keywordMatches =
      Boolean(keyword) &&
      (lead.company.toLowerCase().includes(keywordLower) ||
        lead.industry.toLowerCase().includes(keywordLower) ||
        lead.technologies.some((technology) =>
          technology.toLowerCase().includes(keywordLower)
        ));

    const completeData =
      Boolean(lead.company) &&
      Boolean(lead.industry) &&
      Boolean(lead.location) &&
      lead.employees > 0 &&
      Boolean(lead.revenue) &&
      Boolean(lead.website) &&
      Boolean(lead.linkedin) &&
      Boolean(lead.decisionMaker) &&
      lead.technologies.length > 0;

    return [
      {
        label: "Industry Match",
        points:
          industry && lead.industry === industry ? 30 : 0,
      },
      {
        label: "Location Match",
        points:
          location && lead.location === location ? 20 : 0,
      },
      {
        label: "Company Size Match",
        points:
          companySize && sizeMatches ? 20 : 0,
      },
      {
        label: "Keyword Match",
        points: keywordMatches ? 20 : 0,
      },
      {
        label: "Complete Data",
        points: completeData ? 10 : 0,
      },
    ];
  };

  const handleSearch = async () => {
    await fetchLeads(
      {
        industry,
        location,
        companySize,
        keyword,
      },
      true
    );
  };

  const handleReset = async () => {
    setIndustry("");
    setLocation("");
    setCompanySize("");
    setKeyword("");
    setSortBy("score-desc");

    await fetchLeads();
  };

  const handleExportCSV = () => {
    const headers = [
      "Company",
      "Industry",
      "Location",
      "Employees",
      "Revenue",
      "Website",
      "LinkedIn",
      "Decision Maker",
      "Technologies",
      "Lead Score",
      "Priority",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.company,
      lead.industry,
      lead.location,
      lead.employees,
      lead.revenue,
      lead.website,
      lead.linkedin,
      lead.decisionMaker,
      lead.technologies.join(", "),
      calculateScore(lead),
      getPriority(calculateScore(lead)),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "caprae-leads.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleResetFromEmptyState = () => {
    setIndustry("");
    setLocation("");
    setCompanySize("");
    setKeyword("");
    setSortBy("score-desc");
    setError("");

    fetchLeads();
  };

  const highPriorityCount = filteredLeads.filter(
    (lead) => calculateScore(lead) >= 80
  ).length;

  const mediumPriorityCount = filteredLeads.filter(
    (lead) => {
      const score = calculateScore(lead);
      return score >= 60 && score < 80;
    }
  ).length;

  const lowPriorityCount = filteredLeads.filter(
    (lead) => calculateScore(lead) < 60
  ).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f8fa",
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        {/* HEADER */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            B2B Lead Generator
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Find and prioritize high-quality business leads
          </Typography>
        </Box>

        {/* API ERROR */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* FILTER CARD */}

        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
              }}
            >
              Find Leads
            </Typography>

            <Grid container spacing={2}>
              {/* INDUSTRY */}

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    Industry
                  </InputLabel>

                  <Select
                    value={industry}
                    label="Industry"
                    onChange={(event) =>
                      setIndustry(event.target.value)
                    }
                  >
                    <MenuItem value="">
                      All Industries
                    </MenuItem>

                    <MenuItem value="SaaS">
                      SaaS
                    </MenuItem>

                    <MenuItem value="Fintech">
                      Fintech
                    </MenuItem>

                    <MenuItem value="Artificial Intelligence">
                      Artificial Intelligence
                    </MenuItem>

                    <MenuItem value="Healthcare">
                      Healthcare
                    </MenuItem>

                    <MenuItem value="Cybersecurity">
                      Cybersecurity
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* LOCATION */}

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    Location
                  </InputLabel>

                  <Select
                    value={location}
                    label="Location"
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                  >
                    <MenuItem value="">
                      All Locations
                    </MenuItem>

                    <MenuItem value="United States">
                      United States
                    </MenuItem>

                    <MenuItem value="United Kingdom">
                      United Kingdom
                    </MenuItem>

                    <MenuItem value="India">
                      India
                    </MenuItem>

                    <MenuItem value="Canada">
                      Canada
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* COMPANY SIZE */}

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    Company Size
                  </InputLabel>

                  <Select
                    value={companySize}
                    label="Company Size"
                    onChange={(event) =>
                      setCompanySize(event.target.value)
                    }
                  >
                    <MenuItem value="">
                      Any Size
                    </MenuItem>

                    <MenuItem value="1-50">
                      1–50
                    </MenuItem>

                    <MenuItem value="51-200">
                      51–200
                    </MenuItem>

                    <MenuItem value="201-500">
                      201–500
                    </MenuItem>

                    <MenuItem value="500+">
                      500+
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* KEYWORD */}

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Keyword"
                  placeholder="AI, React, AWS..."
                  value={keyword}
                  onChange={(event) =>
                    setKeyword(event.target.value)
                  }
                />
              </Grid>

              {/* SORT */}

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    Sort By
                  </InputLabel>

                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(event) =>
                      setSortBy(event.target.value)
                    }
                  >
                    <MenuItem value="score-desc">
                      Highest Score
                    </MenuItem>

                    <MenuItem value="score-asc">
                      Lowest Score
                    </MenuItem>

                    <MenuItem value="name-asc">
                      Company Name A–Z
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* BUTTONS */}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    searching ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  onClick={handleSearch}
                  disabled={searching}
                >
                  {searching
                    ? "Searching..."
                    : "Search Leads"}
                </Button>

                <Button
                  variant="text"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  disabled={loading || searching}
                  sx={{ ml: 1 }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* INITIAL LOADING */}

        {loading && leadsData.length === 0 && (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />

              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Loading leads...
              </Typography>
            </Box>
          </Box>
        )}

        {/* DASHBOARD + RESULTS */}

        {!loading || leadsData.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            {/* DASHBOARD SUMMARY */}

            <Grid
              container
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">
                      Total Leads
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mt: 1,
                      }}
                    >
                      {filteredLeads.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">
                      High Priority
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mt: 1,
                      }}
                      color="success.main"
                    >
                      {highPriorityCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">
                      Medium Priority
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mt: 1,
                      }}
                      color="warning.main"
                    >
                      {mediumPriorityCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">
                      Low Priority
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mt: 1,
                      }}
                      color="error.main"
                    >
                      {lowPriorityCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* RESULTS HEADER */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600 }}
                >
                  Lead Results
                </Typography>

                <Typography color="text.secondary">
                  {searching
                    ? "Updating results..."
                    : `${filteredLeads.length} leads found`}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={handleExportCSV}
                disabled={
                  loading ||
                  searching ||
                  filteredLeads.length === 0
                }
              >
                Export CSV
              </Button>
            </Box>

            {/* LEAD RESULTS */}

            {filteredLeads.length > 0 ? (
              <Grid container spacing={2}>
                {filteredLeads.map((lead) => {
                  const score = calculateScore(lead);
                  const priority = getPriority(score);
                  const priorityColor =
                    getPriorityColor(score);

                  return (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      key={lead.id}
                    >
                      <Card>
                        <CardContent>
                          {/* COMPANY + SCORE */}

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600 }}
                            >
                              {lead.company}
                            </Typography>

                            <Box
                              sx={{
                                textAlign: "right",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "1.4rem",
                                }}
                                color={
                                  score >= 80
                                    ? "success.main"
                                    : score >= 60
                                    ? "warning.main"
                                    : "error.main"
                                }
                              >
                                {score}/100
                              </Typography>

                              <Chip
                                size="small"
                                label={priority}
                                color={priorityColor}
                              />
                            </Box>
                          </Box>

                          {/* BASIC DETAILS */}

                          <Typography color="text.secondary">
                            {lead.industry}
                          </Typography>

                          <Typography color="text.secondary">
                            {lead.location}
                          </Typography>

                          <Typography color="text.secondary">
                            {lead.employees} employees
                          </Typography>

                          <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {lead.technologies.join(
                              " • "
                            )}
                          </Typography>

                          {/* WHY THIS LEAD */}

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 2,
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor:
                                "background.paper",
                            }}
                            color="text.secondary"
                          >
                            <strong>
                              Why this lead?
                            </strong>{" "}
                            {lead.industry} company in{" "}
                            {lead.location} with{" "}
                            {lead.employees} employees
                            and a relevant technology
                            stack.
                          </Typography>

                          {/* RECOMMENDED ACTION */}

                          <Box
                            sx={{
                              mt: 1.5,
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor:
                                "background.paper",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              Recommended Action
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {getRecommendedAction(
                                lead
                              )}
                            </Typography>
                          </Box>

                          {/* ACTION BUTTONS */}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              variant="text"
                              onClick={() =>
                                setSelectedLead(
                                  lead
                                )
                              }
                            >
                              View Details
                            </Button>

                            <Button
                              variant="outlined"
                              size="small"
                              component="a"
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Website ↗
                            </Button>

                            <Button
                              variant="outlined"
                              size="small"
                              component="a"
                              href={lead.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              LinkedIn ↗
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              /* EMPTY STATE */

              <Card>
                <CardContent
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >
                    No leads found
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      mb: 3,
                    }}
                  >
                    Try changing your filters or
                    search with different keywords.
                  </Typography>

                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleResetFromEmptyState}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        ) : null}
      </Container>

      {/* DETAILS DIALOG */}

      <Dialog
        open={selectedLead !== null}
        onClose={() =>
          setSelectedLead(null)
        }
        fullWidth
        maxWidth="sm"
      >
        {selectedLead && (
          <>
            <DialogTitle>
              {selectedLead.company}
            </DialogTitle>

            <DialogContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Lead Details
              </Typography>

              {/* INDUSTRY */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Industry
                </Typography>

                <Typography color="text.secondary">
                  {selectedLead.industry}
                </Typography>
              </Box>

              {/* LOCATION */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Location
                </Typography>

                <Typography color="text.secondary">
                  {selectedLead.location}
                </Typography>
              </Box>

              {/* EMPLOYEES */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Employees
                </Typography>

                <Typography color="text.secondary">
                  {selectedLead.employees}
                </Typography>
              </Box>

              {/* REVENUE */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Revenue
                </Typography>

                <Typography color="text.secondary">
                  {selectedLead.revenue}
                </Typography>
              </Box>

              {/* DECISION MAKER */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Decision Maker
                </Typography>

                <Typography color="text.secondary">
                  {selectedLead.decisionMaker}
                </Typography>
              </Box>

              {/* COMPANY LINKS */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Company Links
                </Typography>

                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={selectedLead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website ↗
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={selectedLead.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn ↗
                  </Button>
                </Box>
              </Box>

              {/* TECHNOLOGIES */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Technologies
                </Typography>

                <Box sx={{ mt: 1 }}>
                  {selectedLead.technologies.map(
                    (technology) => (
                      <Chip
                        key={technology}
                        label={technology}
                        sx={{
                          mr: 1,
                          mb: 1,
                        }}
                      />
                    )
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* RECOMMENDED ACTION */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700 }}
                >
                  Recommended Action
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {getRecommendedAction(
                    selectedLead
                  )}
                </Typography>
              </Box>

              {/* LEAD SCORE */}

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                Lead Score
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  mb: 1,
                }}
                color="primary"
              >
                {calculateScore(selectedLead)}/100
              </Typography>

              <Chip
                label={getPriority(
                  calculateScore(selectedLead)
                )}
                color={getPriorityColor(
                  calculateScore(selectedLead)
                )}
              />

              {/* SCORE BREAKDOWN */}

              <Box sx={{ mt: 3 }}>
                {getScoreBreakdown(
                  selectedLead
                ).map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      {item.label}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                      color={
                        item.points > 0
                          ? "success.main"
                          : "text.secondary"
                      }
                    >
                      {item.points > 0
                        ? `+${item.points}`
                        : "+0"}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* TOTAL */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <Typography
                  sx={{ fontWeight: 700 }}
                >
                  Total Score
                </Typography>

                <Typography
                  sx={{ fontWeight: 700 }}
                  color="primary"
                >
                  {calculateScore(selectedLead)}/100
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() =>
                  setSelectedLead(null)
                }
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default App;
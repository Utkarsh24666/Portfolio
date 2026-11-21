export const destinations = [
  { id: "arrival", number: "00", name: "The Arrival", short: "Home" },
  { id: "finance", number: "01", name: "The Financial District", short: "Finance" },
  { id: "data", number: "02", name: "The Data Lab", short: "Analytics" },
  { id: "strategy", number: "03", name: "The Strategy Boardroom", short: "Strategy" },
  { id: "creative", number: "04", name: "The Creative Studio", short: "Creative" },
  { id: "journey", number: "05", name: "The Journey", short: "Journey" },
  { id: "archive", number: "06", name: "The Archive", short: "Archive" },
  { id: "connection", number: "07", name: "The Connection", short: "Contact" },
];

export const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const projects = [
  {
    id: "smj-enterprise",
    number: "01",
    category: "Business website design",
    title: "SMJ Enterprise — Business Website Development",
    description:
      "Designed and developed a professional business website for SMJ Enterprise, organising content and visual presentation into a structured, user-friendly, accessible digital experience.",
    tags: ["Web Development", "HTML/CSS", "UI/UX Design"],
    destination: "strategy",
    externalUrl: "http://s-f-engineering.netlify.app/",
    linkLabel: "Business Website",
  },
  {
    id: "nse-insurance",
    number: "02",
    category: "Financial & market analytics",
    title: "NSE Stocks & NIFTY Insurance",
    description:
      "Excel and Power BI analysis of NSE stocks and NIFTY Insurance performance (2020–2026), returns, risk, and moving-average forecasts.",
    tags: ["NSE Data", "NIFTY Index", "Excel", "Power BI"],
    destination: "finance",
  },
  {
    id: "research-form",
    number: "03",
    category: "Workflow automation",
    title: "AI-based Research Form",
    description:
      "A research form workflow connecting a web form, Google Sheets, and email automation to simplify response collection and handling.",
    tags: ["Google Forms", "Sheets", "AI-assisted"],
    destination: "data",
    externalUrl: "https://utkarsh24666.github.io/Survey/",
    linkLabel: "Open live project",
  },
  {
    id: "ecommerce-dashboard",
    number: "04",
    category: "Data visualisation",
    title: "E-commerce Sales Dashboard",
    description:
      "An interactive Power BI dashboard designed to surface sales performance, product trends, and business KPIs through clear visual storytelling.",
    tags: ["Power BI", "Excel", "KPI design"],
    destination: "data",
  },
  {
    id: "market-analysis",
    number: "05",
    category: "Financial analysis",
    title: "Market & Index Analysis",
    description:
      "Research-led analysis of market movements, return patterns, volatility, and forecasting methods for academic finance work.",
    tags: ["Excel", "Returns", "Forecasting"],
    destination: "finance",
  },
  {
    id: "india-brazil",
    number: "06",
    category: "Economic research",
    title: "India × Brazil Economic Comparison",
    description:
      "A comparative view of macroeconomic indicators to explore growth, inflation, public finances, and economic conditions.",
    tags: ["Research", "Economics", "Data analysis"],
    destination: "strategy",
  },
  {
    id: "nmd-artistry",
    number: "07",
    category: "Business venture",
    title: "NMD ARTISTRY",
    description:
      "Built a handmade candle, resin art, and gifting brand, achieving 90% sell-through at Aarohan and winning first prize at Showmixer.",
    tags: ["Entrepreneurship", "Branding", "Sales"],
    destination: "creative",
  },
];

export const experiences = [
  {
    date: "2026 · 2 MONTHS · INTERNSHIP",
    role: "Finance Operations & Reconciliation",
    company: "Bajaj General Insurance",
    detail:
      "Supported bank and payment gateway reconciliations, transaction matching, BRS and MIS reporting, outstanding-entry analysis, discrepancy resolution, and cross-team coordination.",
  },
  {
    date: "2025 · COMPETITION",
    role: "Sales & Market Outreach (ShowMixer - First Price)",
    company: "MIT World Peace University · Campus activity",
    detail:
      "Participating in outreach and market-facing activities, supporting communication, coordination, and engagement.",
  },
  {
    date: "LEADERSHIP & CAMPUS",
    role: "Student Initiatives",
    company: "Bharatiya Chhatra Sansad · Leadership Lab · Spandan",
    detail:
      "Contributed to organising and campus initiatives and engaged in leadership-focused activities and events.",
  },
  {
    date: "3 MONTHS · INTERNSHIP",
    role: "Data Entry Intern",
    company: "Karwa Bhatia & Co. · Pune",
    detail:
      "Supported financial data entry and documentation using Excel and Tally, working with client-related records and maintaining data accuracy.",
  },
  {
    date: "2022 — 2024 · PART-TIME",
    role: "Stock Verification & Audit Support",
    company: "Karwa Bhatia & Co. · Client: L&T",
    detail:
      "Assisted with stock verification, audit support, and record checking in a structured client environment.",
  },
];

export const education = [
  {
    date: "2025 — 2027",
    name: "MBA — Finance & Business Analytics",
    institution: "MIT World Peace University, Pune · Ramcharan School of Leadership",
  },
  {
    date: "2022 — 2025",
    name: "Bachelor of Commerce (B.Com)",
    institution: "Modern College of Business Administration",
  },
  {
    date: "COURSEWORK",
    name: "Company Secretary — Executive-level studies",
    institution: "CS coursework through Executive Level · Unique Academy",
  },
];

export const skillGroups = [
  {
    title: "Analytics & productivity",
    skills: ["Microsoft Excel", "Power BI", "Microsoft Word", "PowerPoint", "Google Sheets", "Google Forms"],
  },
  {
    title: "Finance & operations",
    skills: ["Bank reconciliation", "Audit support", "Data documentation", "Tally", "Financial analysis", "MIS verification"],
  },
  {
    title: "Design & digital",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Graphic design", "Prompt engineering"],
  },
  {
    title: "Business & people",
    skills: ["Market research", "Business communication", "Problem solving", "Team coordination", "Decision-making", "Sales outreach"],
  },
];

export const certificates = [
  { name: "Advanced Microsoft Excel", detail: "Certificate of Competency · 03 Oct 2025", file: "Advance_Excel_Certificate.pdf" },
  { name: "Business Manager: Developing the Role", detail: "OpenLearn · 02 Feb 2026", file: "FM_MOOC_1.pdf" },
  { name: "Quantitative & Qualitative Research in Finance", detail: "OpenLearn · 02 Feb 2026", file: "FM_MOOC_possibility1.pdf" },
  { name: "Organisations and the Financial System", detail: "OpenLearn · 11 Feb 2026", file: "FM_MOOC1.pdf" },
  { name: "Employee Engagement", detail: "OpenLearn · 16 Feb 2026", file: "HRM_MOOC1.pdf" },
  { name: "Marketing Communications in the Digital Age", detail: "OpenLearn · 21 Feb 2026", file: "Marketing_MOOC1.pdf" },
  { name: "Project Governance & Project Management Office", detail: "OpenLearn · 02 Feb 2026", file: "PM_MOOC1.pdf" },
];

export const cameraStops = [
  { position: [0, 165, 245], target: [0, 8, 0] },
  { position: [-45, 26, 105], target: [-45, 16, -15] },
  { position: [75, 28, -105], target: [75, 18, -45] },
  { position: [75, 28, 105], target: [75, 18, 45] },
  { position: [-75, 27, 105], target: [-75, 17, 45] },
  { position: [15, 50, -165], target: [15, 20, -75] },
  { position: [135, 42, 15], target: [75, 18, 15] },
  { position: [-135, 28, -15], target: [-75, 16, -15] },
];

export const contact = {
  email: "chadhautkarsh06@gmail.com",
  phone: "+91 97307 21301",
  phoneLink: "+919730721301",
  linkedIn: "http://linkedin.com/in/utkarshchadha24/",
  resume: publicAsset("assets/Utkarsh_Chadha_Resume.pdf"),
};

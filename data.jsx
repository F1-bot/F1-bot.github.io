// -----------------------------------------------------------------------------
// Data for Serhii Dolhopolov's personal site
// -----------------------------------------------------------------------------

const PROFILE = {
  name: "Serhii Dolhopolov",
  role: "PhD Student · Computer Science",
  affiliation: "Kyiv National University of Construction and Architecture",
  affiliationShort: "KNUCA",
  location: "Kyiv, Ukraine",
  email: "dolhopolov_sy@knuba.edu.ua",
  photo: "assets/serhii.webp",
  about: [
    "I am a PhD student in Computer Science at Kyiv National University of Construction and Architecture (KNUCA), advised by Dr. Tetyana Honcharenko. My published work spans computer vision for construction site analytics, BIM-driven digital twins, multimodal sentiment analysis with explainable AI, graph and sequence models for environmental and sensor forecasting, and natural language processing for the low-resource Ukrainian language.",
    "I lead BUDOVA, an open Ukrainian voice & text archive selected by Microsoft Research's LINGUA Open Call, where we build NLP resources for a low-resource language with construction-domain NER annotations and an ASR baseline. In parallel I head a state-funded project on AI-agent digital twins for damaged infrastructure, and contribute to work on multimodal sentiment analysis with explainable AI.",
    "My papers have appeared in Water (MDPI, Q1), REKS, IEEE SIST, FRUCT, Springer LNNS and CEUR-indexed proceedings; one received the DTESI 2024 Best Paper Award. I hold the Scholarship of the President of Ukraine for PhD students and have been recognized by the Victor Pinchuk Foundation's Zavtra.UA program.",
  ],
};

// Prioritized: CV first, then scholarly identifiers, then social. Dribbble removed.
const LINKS = [
  { label: "CV",               url: "https://f1-bot.github.io/CV.pdf",                                                   kind: "primary" },
  { label: "Google Scholar",   url: "https://scholar.google.com/citations?user=I54c3uQAAAAJ&hl=en",                      kind: "scholarly" },
  { label: "ORCID",            url: "https://orcid.org/0000-0001-9418-0943",                                             kind: "scholarly" },
  { label: "Scopus",           url: "https://www.scopus.com/authid/detail.uri?authorId=57994271400",                     kind: "scholarly" },
  { label: "Web of Science",   url: "https://www.webofscience.com/wos/author/record/ACU-8785-2022",                      kind: "scholarly" },
  { label: "DBLP",             url: "https://dblp.org/pid/336/0687.html",                                                kind: "scholarly" },
  { label: "Semantic Scholar", url: "https://www.semanticscholar.org/author/S.-Dolhopolov/2191831037",                   kind: "scholarly" },
  { label: "ResearchGate",     url: "https://www.researchgate.net/profile/Serhii-Dolhopolov",                            kind: "scholarly" },
  { label: "LinkedIn",         url: "https://www.linkedin.com/in/serhii-dolhopolov-aa4099193/",                          kind: "social" },
  { label: "GitHub",           url: "https://github.com/F1-bot",                                                         kind: "social" },
];

// Real publications. Topic keys: ml / cv / graph / nlp / security / bim
const PUBLICATIONS = [
  // ---- 2025 ------------------------------------------------------------
  {
    id: "pub-2025-01", selected: true, year: 2025,
    title: "An Advanced Ensemble Machine Learning Framework for Estimating Long-Term Average Discharge at Hydrological Stations Using Global Metadata",
    authors: ["A. Neftissov", "A. Biloshchytskyi", "I. Kazambayev", "S. Dolhopolov", "T. Honcharenko"],
    venue: "Water (MDPI)",
    extra: "Vol. 17(14), 2025 · Q1 · IF 3.0 · CiteScore 6.0",
    quartile: "Q1",
    topic: "ml",
    thumb: "hydro-ensemble",
    links: {
      doi: "https://www.mdpi.com/2073-4441/17/14/2097",
      code: "https://github.com/F1-bot/lta-discharge-ensemble-ml",
      data: "https://grdc.bafg.de/data/data_portal/",
      bib: "neftissov2025water",
    },
  },
  {
    id: "pub-2025-02", selected: true, year: 2025,
    title: "Explainable Artificial Intelligence for Multimodal Sentiment Analysis in Revitalization Project Management",
    authors: ["S. Dolhopolov", "Y. Riabchun", "M. Delembovskyi", "O. Molodid"],
    venue: "Radioelectronic and Computer Systems",
    extra: "2025 · Issue 4 · Q3",
    quartile: "Q3",
    topic: "nlp",
    thumb: "xai-multimodal",
    links: {
      doi: "https://doi.org/10.32620/reks.2025.4.07",
      code: "https://github.com/F1-bot/revitalization-msa-xai",
      bib: "dolhopolov2025reks",
    },
  },
  {
    id: "pub-2025-03", selected: true, year: 2025,
    title: "Sensor-Aware Graph Convolutional and LSTM Model for Reliable Water Quality Forecasting",
    authors: ["S. Dolhopolov", "V. Hots", "O. Fedusenko", "A. Fesan"],
    venue: "IEEE SIST 2025 — 5th Int. Conf. on Smart Information Systems and Technologies",
    extra: "pp. 1–7",
    topic: "graph",
    thumb: "sensor-graph",
    links: { doi: "https://doi.org/10.1109/SIST61657.2025.11139225", bib: "dolhopolov2025sist_water" },
  },
  {
    id: "pub-2025-04", selected: true, year: 2025,
    title: "Ensemble Machine Learning for Global Hydrological Prediction",
    authors: ["A. Neftissov", "T. Honcharenko", "A. Biloshchytskyi", "I. Kazambayev", "S. Dolhopolov"],
    venue: "Scientific Journal of Astana IT University",
    extra: "Vol. 24, pp. 85–98",
    topic: "ml",
    thumb: "pred-vs-obs",
    links: {
      doi: "https://doi.org/10.37943/24DKYV6003",
      pdf: "https://journal.astanait.edu.kz/index.php/ojs/article/view/903/278",
      bib: "neftissov2025aitu",
    },
  },
  {
    id: "pub-2025-05", selected: false, year: 2025,
    title: "Automated Face Recognition System Using Convolutional Neural Network",
    authors: ["T. Honcharenko", "S. Dolhopolov", "I. Sachenko", "I. Achkasov", "A. Fesan", "S. Paliy"],
    venue: "IEEE SIST 2025 — 5th Int. Conf. on Smart Information Systems and Technologies",
    extra: "pp. 1–4",
    topic: "cv",
    thumb: "face-recognition",
    links: { doi: "https://doi.org/10.1109/SIST61657.2025.11139261", bib: "honcharenko2025sist_face" },
  },
  {
    id: "pub-2025-06", selected: false, year: 2025,
    title: "Multimodal Sentiment Analysis with Grad-CAM for Urban Revitalization",
    authors: ["S. Dolhopolov", "T. Honcharenko"],
    venue: "Int. Workshop on Information Technologies: Theoretical and Applied Problems",
    extra: "CEUR-WS, Vol. 4146",
    topic: "nlp",
    thumb: "grad-cam",
    links: { pdf: "https://ceur-ws.org/Vol-4146/paper27.pdf", bib: "dolhopolov2025ittap" },
  },
  {
    id: "pub-2025-07", selected: false, year: 2025,
    title: "Technological Solutions for the Application of the Regulatory Framework for Technical Information Protection",
    authors: ["V. Tkachenko", "S. Dolhopolov"],
    venue: "Management of Development of Complex Systems",
    extra: "No. 64, pp. 177–184",
    topic: "security",
    thumb: "info-protect",
    links: {
      doi: "https://doi.org/10.32347/2412-9933.2025.64.177-184",
      pdf: "https://mdcs.knuba.edu.ua/article/view/351661/338657",
      bib: "tkachenko2025mdcs",
    },
  },
  {
    id: "pub-2025-08", selected: false, year: 2025,
    title: "Methods of Image Pre-Processing for Automated Object Recognition Systems",
    authors: ["S. Dolhopolov", "P. Kruk", "R. Zhuk", "T. Honcharenko"],
    venue: "Management of Development of Complex Systems",
    extra: "No. 62, 2025",
    topic: "cv",
    thumb: "preprocess",
    links: { pdf: "http://mdcs.knuba.edu.ua/article/view/335160", bib: "dolhopolov2025preprocess" },
  },
  {
    id: "pub-2025-09", selected: true, year: 2025,
    title: "NeuroPhysNet: A Novel Hybrid Neural Network Model for Enhanced Prediction and Control of Cyber-Physical Systems",
    authors: ["S. Dolhopolov", "T. Honcharenko", "D. Chernyshev"],
    venue: "Mathematical Modeling and Simulation of Systems (MODS 2024) · LNNS Vol. 1391",
    extra: "Springer, Cham · 2025 · Q4",
    quartile: "Q4",
    topic: "ml",
    thumb: "neuro-phys",
    links: { doi: "https://link.springer.com/chapter/10.1007/978-3-031-90735-7_27", bib: "dolhopolov2025neurophysnet" },
  },

  // ---- 2024 ------------------------------------------------------------
  {
    id: "pub-2024-01", selected: false, year: 2024,
    title: "Optimizing Construction Site Management Through YOLOv5-Based Object Detection: A Comprehensive Analysis of Resource Utilization and Safety Enhancement",
    authors: ["S. Dolhopolov", "T. Honcharenko", "I. Achkasov", "V. Hots"],
    venue: "DTESI 2024 — Int. Conf. on Digital Technologies in Education, Science and Industry",
    extra: "2024",
    topic: "cv",
    thumb: "site-yolo",
    links: { pdf: "https://ceur-ws.org/Vol-3966/W3Paper11.pdf", bib: "dolhopolov2024yolov5_safety" },
  },
  {
    id: "pub-2024-02", selected: true, year: 2024,
    title: "Advancing Automated Quality Control in Automotive Manufacturing: A Comparative Analysis of YOLOv8, YOLOv9, and YOLOv10 for Vehicle Damage Detection",
    authors: ["S. Dolhopolov", "T. Honcharenko", "D. Chernyshev", "O. Panina", "A. Makhynia"],
    venue: "DTESI 2024 — 9th Int. Conf. on Digital Technologies in Education, Science and Industry",
    extra: "2024 · Best Paper Award",
    award: "Best Paper",
    topic: "cv",
    thumb: "yolo-compare",
    links: { pdf: "https://ceur-ws.org/Vol-3966/W3Paper10.pdf", bib: "dolhopolov2024yolov8_10" },
  },
  {
    id: "pub-2024-03", selected: false, year: 2024,
    title: "YOLOv5-Based Object Detection for Construction Site Efficiency: Equipment, Tool, and Vehicle Recognition",
    authors: ["S. Dolhopolov", "T. Honcharenko", "D. Chernyshev", "O. Solovei"],
    venue: "ITTAP 2024 — 4th Int. Workshop on Information Technologies: Theoretical and Applied Problems",
    extra: "2024",
    topic: "cv",
    thumb: "yolo-classes",
    links: { pdf: "https://ceur-ws.org/Vol-3896/paper4.pdf", bib: "dolhopolov2024yolov5_equip" },
  },
  {
    id: "pub-2024-04", selected: false, year: 2024,
    title: "YOLOv8, YOLOv9, and YOLOv10: A Study in Automated Vehicle Damage Detection",
    authors: ["S. Dolhopolov", "T. Honcharenko", "V. Hots", "P. Kruk", "I. Porokhovnichenko"],
    venue: "ITTAP 2024 — 4th Int. Workshop on Information Technologies: Theoretical and Applied Problems",
    extra: "2024",
    topic: "cv",
    thumb: "yolo-progression",
    links: { pdf: "https://ceur-ws.org/Vol-3896/paper3.pdf", bib: "dolhopolov2024yolo_study" },
  },
  {
    id: "pub-2024-05", selected: false, year: 2024,
    title: "Neural Network Threat Detection Systems for Data Breach Protection",
    authors: ["S. Dolhopolov", "T. Honcharenko", "O. Fedusenko", "V. Khrolenko", "V. Hots", "V. Golenkov"],
    venue: "IEEE SIST 2024 — 4th Int. Conf. on Smart Information Systems and Technologies",
    extra: "2024",
    topic: "security",
    thumb: "threat-detect",
    links: { doi: "https://doi.org/10.1109/SIST61555.2024.10629526", bib: "dolhopolov2024sist_threat" },
  },
  {
    id: "pub-2024-06", selected: false, year: 2024,
    title: "Enhancing Urban Planning with LoRa and GANs: A Project Management Perspective",
    authors: ["S. Dolhopolov", "T. Honcharenko", "I. Sachenko", "D. Gergi"],
    venue: "ITPM 2024 — 5th Int. Workshop on IT Project Management",
    extra: "2024",
    topic: "ml",
    thumb: "urban-lora",
    links: {
      doi: "https://doi.org/10.23939/iw_itpm2024.232",
      pdf: "https://ceur-ws.org/Vol-3709/paper19.pdf",
      bib: "dolhopolov2024itpm_lora",
    },
  },
  {
    id: "pub-2024-07", selected: false, year: 2024,
    title: "Strategizing VR Integration in Business and Education: Extending the Technology Acceptance Model Through Project Management Perspectives",
    authors: ["L. Tao", "S. Dolhopolov", "T. Honcharenko"],
    venue: "ITPM 2024 — 5th Int. Workshop on IT Project Management",
    extra: "2024",
    topic: "ml",
    thumb: "vr-tam",
    links: {
      doi: "https://doi.org/10.23939/iw_itpm2024.250",
      pdf: "https://ceur-ws.org/Vol-3709/paper20.pdf",
      bib: "tao2024itpm_vr",
    },
  },
  {
    id: "pub-2024-08", selected: true, year: 2024,
    title: "Multi-Stage Classification of Construction Site Modeling Objects Using Artificial Intelligence Based on BIM Technology",
    authors: ["S. Dolhopolov", "T. Honcharenko", "O. Terentyev", "V. Savenko", "A. Rosynskyi", "N. Bodnar", "E. Alzidi"],
    venue: "FRUCT 2024 — 35th Conf. of Open Innovations Association",
    extra: "2024",
    topic: "bim",
    thumb: "bim-cascade",
    links: {
      doi: "https://doi.org/10.23919/fruct61870.2024.10516383",
      pdf: "https://www.fruct.org/files/publications/volume-35/fruct35/Dol.pdf",
      bib: "dolhopolov2024fruct_bim",
    },
  },

  // ---- 2023 ------------------------------------------------------------
  {
    id: "pub-2023-01", selected: false, year: 2023,
    title: "Information System of Multi-Stage Analysis of the Building of Object Models on a Construction Site",
    authors: ["S. Dolhopolov", "T. Honcharenko", "O. Terentyev", "K. Predun", "A. Rosynskyi"],
    venue: "IOP Conf. Series: Earth and Environmental Science · ICSF 2023",
    extra: "4th Int. Conf. on Sustainable Futures",
    topic: "bim",
    thumb: "build-stages",
    links: {
      doi: "https://doi.org/10.1088/1755-1315/1254/1/012075",
      pdf: "https://iopscience.iop.org/article/10.1088/1755-1315/1254/1/012075/pdf",
      bib: "dolhopolov2023icsf",
    },
  },
  {
    id: "pub-2023-02", selected: false, year: 2023,
    title: "Construction Site Modeling Objects Using Artificial Intelligence and BIM Technology: A Multi-Stage Approach",
    authors: ["S. Dolhopolov", "T. Honcharenko", "V. Savenko", "O. Balina", "I. Bezklubenko", "T. Liashchenko"],
    venue: "IEEE SIST 2023 — Int. Conf. on Smart Information Systems and Technologies",
    extra: "2023",
    topic: "bim",
    thumb: "bim-scan",
    links: { doi: "https://doi.org/10.1109/SIST58284.2023.10223543", bib: "dolhopolov2023sist_bim" },
  },

  // ---- 2022 ------------------------------------------------------------
  {
    id: "pub-2022-01", selected: false, year: 2022,
    title: "Integration of Building Information Modeling and Artificial Intelligence Systems to Create a Digital Twin of the Construction Site",
    authors: ["D. Chernyshev", "S. Dolhopolov", "T. Honcharenko", "H. Haman", "T. Ivanova", "M. Zinchenko"],
    venue: "Int. Scientific and Technical Conf. on Computer Sciences and Information Technologies",
    extra: "2022",
    topic: "bim",
    thumb: "twin-mirror",
    links: { doi: "https://doi.org/10.1109/CSIT56902.2022.10000717", bib: "chernyshev2022csit" },
  },
  {
    id: "pub-2022-02", selected: false, year: 2022,
    title: "Digital Object Detection of Construction Site Based on Building Information Modeling and Artificial Intelligence Systems",
    authors: ["D. Chernyshev", "S. Dolhopolov", "T. Honcharenko", "V. Sapaiev", "M. Delembovskyi"],
    venue: "ITTAP 2022 — 2nd Int. Workshop on Information Technologies: Theoretical and Applied Problems",
    extra: "2022",
    topic: "cv",
    thumb: "object-detect",
    links: { pdf: "https://ceur-ws.org/Vol-3309/short10.pdf", bib: "chernyshev2022ittap" },
  },
  {
    id: "pub-2022-03", selected: false, year: 2022,
    title: "Use of Artificial Intelligence Systems for Determining the Career Guidance of Future University Student",
    authors: ["S. Dolhopolov", "T. Honcharenko", "S. A. Dolhopolova", "O. Riabchun", "M. Delembovskyi", "O. Omelianenko"],
    venue: "IEEE SIST 2022 — Int. Conf. on Smart Information Systems and Technologies",
    extra: "2022",
    topic: "ml",
    thumb: "career-guidance",
    links: { doi: "https://doi.org/10.1109/SIST54437.2022.9945752", bib: "dolhopolov2022sist_career" },
  },
];

const TOPIC_LABEL = {
  ml:       "Machine Learning",
  cv:       "Computer Vision",
  nlp:      "NLP & Sentiment",
  graph:    "Graph & Sequence Models",
  security: "Security",
  bim:      "BIM & Digital Twins",
};

// Experience grouped by employer. Logo is either text (initial) or image path.
const WORK = [
  {
    company: "Kyiv National University of Construction and Architecture",
    companyShort: "KNUCA",
    logo: "assets/knuba-logo.jpg",
    logoType: "image",
    totalDates: "2023 — Present",
    roles: [
      {
        role: "Principal Investigator — BUDOVA (Microsoft Research LINGUA)",
        type: "Contract",
        dates: "Jan 2026 — Present",
        where: "Kyiv, Ukraine · Remote",
        icon: "microsoft",
      },
      {
        role: "Researcher",
        dates: "Jan 2026 — Present",
        where: "Kyiv, Ukraine · Hybrid",
      },
      {
        role: "Assistant Lecturer — IT Department",
        type: "Full-time",
        dates: "Feb 2023 — Present",
        where: "Kyiv, Ukraine · Hybrid",
      },
      {
        role: "Junior Researcher",
        dates: "Mar 2025 — Jan 2026",
        where: "Kyiv, Ukraine · Hybrid",
      },
    ],
  },
  {
    company: "The National Agency for Higher Education Quality Assurance (NAQA)",
    companyShort: "NAQA",
    logo: "assets/naqa-logo.jpg",
    logoType: "image",
    totalDates: "May 2023 — Present",
    roles: [
      {
        role: "Educational Program Accreditation Expert",
        dates: "May 2023 — Present",
        where: "Kyiv, Ukraine · Remote",
      },
    ],
  },
  {
    company: "KernelGlide",
    logo: "assets/kernelglide-logo.png",
    logoType: "image",
    logoDark: true,
    totalDates: "Feb 2022 — Present",
    roles: [
      {
        role: "Founder & Chief AI Architect",
        dates: "Feb 2022 — Present",
        where: "Kyiv, Ukraine · Remote",
      },
    ],
  },
];

const PROJECTS = [
  {
    id: "proj-01",
    title: "LINGUA · BUDOVA",
    subtitle: "Building Ukrainian domain-specific open voice & text archives",
    role: "Head",
    members: ["S. Dolhopolov (head)", "KNUCA research team", "Community contributors"],
    funding: "48 000 USD + Azure credits · Microsoft Research LINGUA program",
    dates: "2026 — 2027",
    status: "Active",
    statusNote: "Supported by Microsoft Research's LINGUA program",
    sponsor: "Microsoft Research",
    description:
      "The first open, comprehensive Ukrainian construction-domain language dataset - addressing a critical digital language gap for a low-resource language with 30–46 million speakers. The team is producing 100+ hours of dialectally diverse speech data and 100M+ tokens of technical text, with construction-specific NER annotations and a baseline ASR model targeting <25 % WER. All resources are released under CC-BY 4.0 via Hugging Face and Zenodo, with full GDPR-compliant ethical protocols.",
    links: [
      { label: "budov.org", url: "https://budov.org" },
      { label: "Hugging Face", url: "https://huggingface.co/BUDOVA" },
      { label: "LINGUA awardees", url: "https://www.microsoft.com/en-us/research/academic-program/lingua-expanding-europes-voices-in-ai/" },
    ],
    thumb: "budova",
  },
  {
    id: "proj-02",
    title: "AI-Agent-Based Digital Twins for Damaged Infrastructure",
    subtitle: "Dynamic verification and condition monitoring of damaged infrastructure objects",
    role: "Project Leader",
    members: [
      "S. Dolhopolov (lead)",
      "I. Bosenko",
      "O. Matsiievskyi",
      "V. Kontsevyi",
      "I. Maksymiuk",
      "M. Omelchenko",
    ],
    funding: "4 358 600 UAH (~101 500 USD) · State Budget of Ukraine",
    registration: "Reg. No. 0126U001450",
    dates: "2026 — 2028",
    status: "Active",
    statusNote: "Approved for funding by the Ministry of Education and Science of Ukraine",
    description:
      "A multi-agent AI system for automated dynamic verification and monitoring of digital twins of damaged infrastructure objects. The approach combines deep learning for computer vision and point-cloud analysis with a collaborative multi-agent architecture that autonomously updates BIM/IFC models from heterogeneous photogrammetry and LiDAR data, enabling rapid and objective damage assessment to support Ukraine's reconstruction.",
    links: [
      { label: "Project documentation", url: "https://dir.ukrintei.ua/view/rk/bed42e8a9d071b93a28a802f039a03a1" },
    ],
    thumb: "digital-twin",
  },
  {
    id: "proj-03",
    title: "Multimodal Content Tonality for Territorial Revitalization",
    subtitle: "Neural-network methods for classification of multimodal content in revitalization projects",
    role: "Project Team Member",
    members: [
      "Dr. T. Honcharenko (lead)",
      "S. Dolhopolov",
      "Dr. O. Poplavskyi",
      "Dr. O. Molodid",
      "M. Delembovskyi",
      "Y. Riabchun",
    ],
    funding: "2 929 695 UAH (~70 650 USD) · State Budget of Ukraine",
    registration: "Reg. No. 0125U001683",
    dates: "2025 — 2027",
    status: "Active",
    statusNote: "Approved for funding by the Ministry of Education and Science of Ukraine",
    description:
      "Develops methodologies for analyzing and classifying multimodal content (text, image, metadata) in territorial revitalization projects using neural-network methods. Applies explainable AI techniques to process heterogeneous data around urban regeneration initiatives and support planners who need defensible, auditable decisions.",
    links: [
      { label: "Project documentation", url: "https://nddkr.ukrintei.ua/view/rk/b5897c60b0cb91bdc3dd28480445dd12" },
      { label: "REKS 2025 paper", url: "https://doi.org/10.32620/reks.2025.4.07" },
      { label: "ITTAP 2025 paper", url: "https://ceur-ws.org/Vol-4146/paper27.pdf" },
    ],
    thumb: "tonality",
  },
];

const AWARDS = [
  {
    title: "Scholarship of the President of Ukraine for PhD students",
    org: "Office of the President of Ukraine",
    date: "2026 — 2027",
  },
  {
    title: "Verkhovna Rada of Ukraine Scholarship",
    org: "Parliament of Ukraine · Two-time recipient",
    date: "2020–2021 · 2021–2022",
  },
  {
    title: "«Zavtra.UA» Scholarship for talented Ukrainian youth",
    org: "Victor Pinchuk Foundation · Two-time recipient",
    date: "2020–2021 · 2022–2023",
  },
];

const EDUCATION = [
  {
    degree: "Ph.D. in Computer Science",
    school: "Kyiv National University of Construction and Architecture",
    dates: "2024 — Present",
    notes: [
      "Scientific Advisor: Dr. Tetyana Honcharenko",
    ],
  },
  {
    degree: "M.Sc. in Cyber Security",
    school: "Kyiv National University of Construction and Architecture",
    dates: "2022 — 2023",
    notes: [
      "Diploma with honours · GPA 97.43 / 100",
      "Scientific Advisor: Dr. Svitlana Kondakova",
    ],
  },
  {
    degree: "B.Sc. in Vocational Education",
    degreeSub: "(Computer Technologies)",
    school: "Kyiv National University of Construction and Architecture",
    dates: "2018 — 2022",
    notes: [
      "Diploma with honours · GPA 100 / 100",
      "Comprehensive State Exam: 100 / 100",
    ],
  },
];

// News - compact with external links.
const NEWS = [
  {
    date: "Mar 26, 2026",
    text: "Presented at Investment Building Congress 2026 with I. Bosenko on the AI-agent system for monitoring and verifying digital twins of damaged infrastructure objects.",
    url: "https://www.facebook.com/kafedraitknuba/posts/122216616578289378/",
  },
  {
    date: "Feb 16, 2026",
    text: "Published «Explainable AI for Multimodal Sentiment Analysis in Revitalization Project Management» in REKS, Issue 4.",
    url: "https://nti.khai.edu/ojs/index.php/reks/article/view/reks.2025.4.07",
  },
  {
    date: "Jan 28, 2026",
    text: "BUDOVA - Building Ukrainian Domain-Specific Open Voice & Text Archives - selected by Microsoft AI for Good Lab in the LINGUA Open Call (16 languages, 10 countries).",
    url: "https://www.microsoft.com/en-us/research/academic-program/lingua-expanding-europes-voices-in-ai/",
  },
  {
    date: "Jan 22, 2026",
    text: "Took part in the World Economic Forum events at Ukraine House Davos as a «Zavtra.UA» scholar of the Victor Pinchuk Foundation.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7421299469490692097/",
  },
  {
    date: "Jan 09, 2026",
    text: "«AI-Agent-Based Digital Twins for Damaged Infrastructure» won the Ministry of Education and Science Young Scientists competition; state-funded from 2026.",
    url: "https://dir.ukrintei.ua/view/rk/bed42e8a9d071b93a28a802f039a03a1",
  },
  {
    date: "Dec 21, 2025",
    text: "Won 1st place in the «Zavtra.UA» essay competition on «Artificial Intelligence: opportunity or threat to democracy?» - prize includes WEF Davos participation with the Victor Pinchuk Foundation.",
    url: "https://www.facebook.com/share/p/1B5Y4CVnTT/",
  },
  {
    date: "Dec 11, 2025",
    text: "«Modeling AI Tasks (Part 1)» (Dolhopolov, Honcharenko · KNUCA · 2025) - 1st place in the «Textbooks» category at the NAN VO Ukraine «Best Edition 2025» competition.",
    url: "http://nanvou.org.ua/Edition%20of%20the%20year/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB_%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D1%80%D1%81.pdf",
  },
  {
    date: "Nov 24, 2025",
    text: "33rd place out of 1500+ at the National CTF Challenge by HackenProof × Defence Intelligence of Ukraine (solo run, top-100 finish).",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7406577393257291776/",
  },
  {
    date: "Nov 19, 2025",
    text: "Awarded the Scholarship of the President of Ukraine for PhD students for the 2025/2026 academic year (MES Order №1526).",
    url: "https://mon.gov.ua/static-objects/mon/sites/1/uploaded-files/2025/akadem-imenni-sotsial-stypendiyi-studentam-kursantam-2025/19-11-2025/dokument-1526.pdf",
  },
  {
    date: "Nov 04, 2025",
    text: "Took part in the First International Kyiv Forum on Critical Infrastructure Protection (CTF + DFIR exercises) with the KNUCA team.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7395767301259796480/",
  },
  {
    date: "Sep 30, 2025",
    text: "Earned the Gemini Certification for Educators from Google.",
    url: "https://edu.google.accredible.com/38fbb280-cd0a-4e92-a69f-7060ec0e8030#acc.m6aTzYdJ",
  },
  {
    date: "Sep 27, 2025",
    text: "Paper presented at STUE-2025 (Kharkiv) - «Fusing Grad-CAM and Textual Explainable AI for Urban Sentiment Assessment».",
    url: "https://stue.kname.edu.ua/conference-agenda/#tab-16833",
  },
  {
    date: "Sep 17, 2025",
    text: "Participated in the Yalta European Strategy 2025 Young Leaders Forum as a Zavtra.UA scholar (Victor Pinchuk Foundation).",
    url: "https://yes-ukraine.org/en/yes-annual-meetings/2025",
  },
  {
    date: "Sep 01, 2025",
    text: "Published «Sensor-Aware Graph Convolutional and LSTM Model for Reliable Water Quality Forecasting» at IEEE SIST 2025.",
    url: "https://doi.org/10.1109/SIST61657.2025.11139225",
  },
  {
    date: "Sep 01, 2025",
    text: "Published «Automated Face Recognition System Using Convolutional Neural Network» at IEEE SIST 2025.",
    url: "https://doi.org/10.1109/SIST61657.2025.11139261",
  },
  {
    date: "Jul 14, 2025",
    text: "Q1 paper out in Water (MDPI): «An Advanced Ensemble ML Framework for Estimating Long-Term Average Discharge at Hydrological Stations».",
    url: "https://www.mdpi.com/2073-4441/17/14/2097",
  },
  {
    date: "Jun 27, 2025",
    text: "Published «Methods of image pre-processing for automated object recognition systems» in MDCS.",
    url: "http://mdcs.knuba.edu.ua/article/view/335160",
  },
  {
    date: "May 14, 2025",
    text: "Two papers accepted at IEEE SIST 2025 in Astana, Kazakhstan.",
    url: "https://sist.astanait.edu.kz/",
  },
  {
    date: "Apr 29, 2025",
    text: "Published «NeuroPhysNet: A Hybrid Neural Network for Cyber-Physical Systems» in Springer LNNS Vol. 1391.",
    url: "https://link.springer.com/chapter/10.1007/978-3-031-90735-7_27",
  },
  {
    date: "Apr 24, 2025",
    text: "Presented «Neural Network Methods for Multimodal Content Analysis in Urban Revitalization» at the KNUCA Sci-Tech Student Conference.",
    url: "https://gisut.knuba.edu.ua/2025/04/29/%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%BD%D1%8F-%D1%81%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D1%81%D1%8C%D0%BA%D0%BE%D1%97-%D0%BD%D0%B0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D1%97-%D0%BA%D0%BE/",
  },
  {
    date: "Apr 21, 2025",
    text: "Our KNUCA team ranked in the Top 10 at UA-EE Cyber Shield (Tallinn Mechanism) for critical-infrastructure cyber-defence.",
    url: "https://www.knuba.edu.ua/komanda-knuba-vvijshla-v-desyatku-najkrashhyh-u-kiberzahysti-krytychnoyi-infrastruktury-na-mizhnarodnyh-zmagannyah/",
  },
  {
    date: "Feb 25, 2025",
    text: "Research project on Multimodal Content Tonality received competitive funding from the Ministry of Education and Science of Ukraine (Order №369).",
    url: "https://mon.gov.ua/npa/pro-zatverdzhennia-pereliku-proiektiv-fundamentalnykh-naukovykh-doslidzhen-prykladnykh-naukovykh-doslidzhen-vykonavtsiamy-iakykh-ie-zaklady-vyshchoi-osvity-ta-naukovi-ustanovy-shcho-nalezhat-",
  },
];

const TEACHING = [
  { course: "Programming in the Python language",                     dates: "Fall 24/25 · Spring 25/26" },
  { course: "Artificial intelligence and hybrid networks",            dates: "Fall 24/25" },
  { course: "Neural networks and AI systems in education",            dates: "Fall 24/25" },
  { course: "Modeling of artificial intelligence tasks",              dates: "Spring 24/25/26" },
  { course: "Object-oriented programming",                            dates: "Fall 23/24/25 · Spring 24/25/26" },
  { course: "Artificial intelligence and neural networks",            dates: "Spring 25/26" },
  { course: "Artificial Intelligence: Foundations and Frontiers 🚀",  dates: "Spring 24" },
];

const VOLUNTEER = [
  {
    role: "Team Member · Volunteer",
    org: "Yalta European Strategy (YES) — Annual International Forum",
    note: "Part of the organizing team for the YES annual conference, bringing together 350+ leaders from politics, business, media and civil society from 50+ countries.",
    url: "https://yes-ukraine.org/en/",
    dates: "2025 — Present",
  },
  {
    role: "Event Volunteer",
    org: "RECOVERY Rehabilitation Network",
    note: "Supporting Ukraine's largest network of innovative rehabilitation centers for wounded soldiers - 16 centers, 22 000+ patients.",
    url: "https://yes-ukraine.org/en/",
    dates: "2024 — Present",
  },
  {
    role: "Developer & Owner",
    org: "«General Combat Losses» Analytics Project",
    note: "Information-analytical platform with combat-loss statistics, air-alert and combat-action maps for civilians.",
    url: "https://t.me/zbvUA_bot",
    dates: "2022 — Present",
  },
];

Object.assign(window, {
  PROFILE, LINKS, PUBLICATIONS, TOPIC_LABEL, WORK, PROJECTS, AWARDS,
  EDUCATION, NEWS, TEACHING, VOLUNTEER,
});

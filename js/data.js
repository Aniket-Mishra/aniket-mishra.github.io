export const profile = {
  name: "Aniket Mishra",
  tagline: "Data Scientist & ML Engineer",
  location: "Eindhoven, NL",

  pitch: "I live to solve complex problems, and I love to build pretty stuff for fun.",

  intro: "I specialise in running code and models faster, cheaper, and with as little human intervention as possible. My interests lie in automating everything around me so that I can spend my time thinking about what's important: understanding what intelligence is. Five years of that so far. Pipelines for 10GW of renewable assets. Anomaly detection that killed 98% of false alarms. A Python framework that cut customer onboarding from three months to one day. My latest paper landed in Springer LNCS at IDA 2026.",

  personality: "I write poems, tell stories, and play games. Poems about people. Stories about graphs. Games about the unreal. I introduce myself by offering to write someone a poem, and somehow it works. My GitHub is mostly two things. Making my life easier and cheaper: if I like a tool but have to pay for it, I will happily spend twelve hours writing a script that does it for free. And automation: every microsecond optimised is a microsecond gained. I read a lot of Asimov and a lot of Excubia. The Fifth Science taught me to take the long view.",


availability: {
  status: "Open to Data Science, ML, and Data Engineer roles",
  detail: "Based in Eindhoven, happy to relocate within the EU.",
},

  image: "images/good_photo.JPEG",

  socials: {
    github: "https://github.com/Aniket-Mishra",
    linkedin: "https://www.linkedin.com/in/aniket97/",
    email: "mailto:anmishraofficial@gmail.com",
    scholar: "",
  },

  resumeUrl: "/pdfs/Aniket_Mishra_Resume.pdf",
  cvUrl: "/pdfs/Aniket_Mishra_CV.pdf",
};

export const radarBlips = ["Code", "Research", "Automate", "Stories", "Poems", "Games"];

export const experience = [
  {
    company: "Eindhoven University of Technology (TU/e)",
    location: "Eindhoven, NL",
    roles: [
      {
        title: "Student Assistant",
        duration: "Feb 2026 - Present",
        points: [
          "Teaching Assistant for two MSc courses, Machine Learning Engineering and Reinforcement Learning in Practice, mentoring 50+ students with feedback and project guidance.",
          "Maintain the RL course repository, building new agent environments and CLI and UI features.",
          "Build components of an automated grading system for programming assignments.",
        ],
      },
    ],
  },
  {
    company: "Avathon (formerly SparkCognition)",
    location: "Bengaluru, IN",
    roles: [
      {
        title: "Data Scientist",
        duration: "Jul 2022 - Jul 2025",
        points: [
          "Authored a Python framework adopted company-wide, cutting customer onboarding from 3 months to 1 day.",
          "Developed anomaly detection and failure prediction models for solar, wind, and battery assets: >95% accuracy, 2 to 4 month lead time, 98% false alarm reduction.",
          "Optimised AWS Lambda ETL and ElasticSearch queries, cutting compute costs by 48% and data pull times from 4+ hours to ~15 minutes.",
          "Shipped Streamlit apps for live KPI checks, hyperparameter tuning, and model tracking, used by 20+ stakeholders.",
        ],
      },
      {
        title: "Data Engineer",
        duration: "Mar 2021 - Jul 2022",
        points: [
          "Built real-time ETL pipelines for 10GW+ renewable energy assets, reducing data latency and cloud costs by ~55%.",
          "Designed and scaled predictive maintenance pipelines across 5GW+ of wind, solar, and storage assets.",
          "Built an internal Python library, packaged with Poetry and PyTest, deployed via JFrog and PyPI for the whole company.",
        ],
      },
    ],
  },
  {
    company: "Freelance",
    location: "Remote",
    roles: [
      {
        title: "Data Science Instructor",
        duration: "Aug 2023 - Aug 2024",
        points: [
          "Ran corporate training in analytics and machine learning for working professionals.",
          "Coached learners into analytics roles with portfolio projects and interview prep.",
        ],
      },
    ],
  },
  {
    company: "Infosys Ltd.",
    location: "Mysore, IN",
    roles: [
      {
        title: "Systems Engineer, Data & Analytics",
        duration: "Jan 2020 - Mar 2021",
        points: [
          "Ran 2000+ ETL workflows in Informatica PowerCenter with high uptime.",
          "Handled database migrations with zero data loss, validation and reconciliation included.",
        ],
      },
    ],
  },
  {
    company: "Codezoned",
    location: "Open source",
    roles: [
      {
        title: "Core Team Developer",
        duration: "Jun 2018 - Present",
        points: [
          "Lead development on open source projects, including ScriptsDump, a large CS and math script archive.",
          "Technical Lead for Hack Against Covid 2020, a hackathon with 1000+ participants from 15+ countries.",
        ],
      },
    ],
  },
];

export const education = [
  {
    school: "Eindhoven University of Technology (TU/e)",
    degree: "MSc, Data Science and Artificial Intelligence",
    duration: "Sep 2024 - Aug 2026 (expected)",
    location: "Eindhoven, NL",
    points: [
      "Major tracks: Data Mining and Machine Learning, plus Data Engineering and Management.",
      "Minor track: Process Mining and Visual Analytics.",
      "Coursework: Machine Learning Engineering, Deep Learning, Survival Analysis, Reinforcement Learning, Big Data Management, Research Topics in Data Mining.",
    ],
  },
  {
    school: "SRM Institute of Science and Technology",
    degree: "B.Tech, Computer Science, First Class with Distinction",
    duration: "Jun 2016 - Sep 2020",
    location: "Chennai, IN",
    points: [
      "Best Research Paper Award at RCICD 2020 for the SRFBGAN project.",
      "Coursework: Artificial Intelligence, Pattern Recognition, Neuro-Fuzzy and Genetic Programming, Algorithm Design and Analysis.",
    ],
  },
];

export const research = [
  {
    title: "Exceptional Model Residual Mining, and Three Richer EMM Description Languages",
    authors: "Aniket Mishra, Cristiana Carbunaru, Wouter Duivesteijn",
    venue: "Springer LNCS, vol. 16513 (IDA 2026). Presented at the International Symposium on Intelligent Data Analysis, Leiden.",
    date: "Apr 2026",
    award: "",
    link: "https://link.springer.com/chapter/10.1007/978-3-032-23833-7_20",
  },
  {
    title: "SRFBGAN: Image Super Resolution using Feedback Loops in Generative Adversarial Networks",
    authors: "Sagar Vakkala, Aniket Mishra, Senthil Kumar, Punitha D",
    venue: "Journal of Emerging Technologies and Innovative Research (JETIR), Vol. 7, Issue 5.",
    date: "May 2020",
    award: "Best Research Paper Award, RCICD 2020",
    link: "https://www.jetir.org/view?paper=JETIRDV06001",
  },
];

export const projectFilters = ["All", "AI & ML", "Systems", "Automation", "Data Viz"];

export const projects = [
  {
    title: "ShieldPay",
    category: "AI Agents",
    filter: "AI & ML",
    description: "Agentic payment fraud prevention, built at the bunq 7.0 Hackathon. An LLM agent reads merchant risk from checkout screenshots and reviews, checks transaction history, and issues disposable virtual cards through the bunq API. The frontend streams the agent thinking out loud. No hardcoded merchant lists, so it works anywhere from day one.",
    tags: ["FastAPI", "Claude Tool Use", "bunq API", "SSE"],
    link: "https://devpost.com/software/shieldpay",
  },
  {
    title: "Synthetic Data Generator",
    category: "Research Tooling",
    filter: "AI & ML",
    description: "A physics grounded telemetry generator for ML research. It simulates solar farms, wind farms, and pumps with configurable fault and attack injection. Each generator solves real physics, not random noise.",
    tags: ["Python", "Time Series", "Anomaly Detection", "Simulation"],
    link: "https://github.com/Aniket-Mishra/synthetic_data_generator",
  },
  {
    title: "Explainable Movie Recommender",
    category: "Data Viz",
    filter: "Data Viz",
    description: "An interactive Dash app for movie recommendations. Clustering, PCA, and XGBoost feed live dashboards that explain why each suggestion showed up.",
    tags: ["Dash", "XGBoost", "PCA"],
    link: "https://github.com/Aniket-Mishra/Movie_Recommendation_and_Analysis",
  },
  {
    title: "Competitive Sudoku AI",
    category: "AI & Games",
    filter: "AI & ML",
    description: "AI agents for competitive Sudoku using heuristics, Monte Carlo, and tree search. Benchmarked against a pile of algorithms.",
    tags: ["Monte Carlo", "MCTS", "Heuristics"],
    link: "https://github.com/Aniket-Mishra/Competitive_Sudoku_Solver_AI",
  },
  {
    title: "Third Eye, Threat Detection",
    category: "Computer Vision",
    filter: "AI & ML",
    description: "A real time facial recognition prototype for the Kerala Police, wired to a suspect database and deployed on edge hardware with a Jetson Nano.",
    tags: ["OpenCV", "Jetson Nano", "Edge AI"],
    link: "https://github.com/Aniket-Mishra",
  },
  {
    title: "RL Robot Navigation",
    category: "Reinforcement Learning",
    filter: "AI & ML",
    description: "DQN, PPO, and baselines for a robot delivery task in a messy restaurant. PPO won on stability and on the ugly obstacle layouts.",
    tags: ["PyTorch", "PPO", "DQN"],
    link: "https://github.com/Aniket-Mishra/2AMC15_Intelligence_Challenge_A2",
  },
  {
    title: "Heart Failure Severity Detection",
    category: "Healthcare AI",
    filter: "AI & ML",
    description: "A neural net that grades heart failure severity from level one to four, built alongside doctors at AIIMS.",
    tags: ["Keras", "Healthcare AI"],
    link: "https://github.com/Aniket-Mishra/Heart_Failure_Severity",
  },
  {
    title: "quickSilver",
    category: "Graph Database",
    filter: "Systems",
    description: "A C++ in-memory graph database for regular path queries. I built the cardinality estimator and an optimised evaluator with plan selection and memory-aware joins, benchmarked on real and synthetic workloads.",
    tags: ["C++17", "Graphs", "Query Optimization"],
    link: "https://github.com/Aniket-Mishra",
  },
  {
    title: "statistical-model-implementer",
    category: "ML Tooling",
    filter: "Systems",
    description: "A prototype library that auto-applies and evaluates models across datasets, then compares metrics and models side by side.",
    tags: ["Python", "Scikit-Learn", "AutoML"],
    link: "https://github.com/Aniket-Mishra/statistical-model-implementer",
  },
  {
    title: "Historical Shark Attacks",
    category: "Data Viz",
    filter: "Data Viz",
    description: "An interactive dashboard exploring a century of shark attacks in Australia. Built to make a grim dataset genuinely fun to poke at.",
    tags: ["Dash", "Plotly"],
    link: "https://github.com/Aniket-Mishra",
  },
  {
    title: "dotfiles",
    category: "Dev Productivity",
    filter: "Automation",
    description: "My development toolkit for macOS and Linux. CLI tools, shell functions, and fast setup scripts that get a fresh machine working in minutes.",
    tags: ["Rust", "Zsh", "Bash"],
    link: "https://github.com/Aniket-Mishra",
  },
  {
    title: "scripts",
    category: "Automation",
    filter: "Automation",
    description: "A pile of small automation tools, from stopping my laptop falling asleep to bulk PDF and image surgery. Built to make the boring stuff vanish.",
    tags: ["Python", "Rust", "CLI"],
    link: "https://github.com/Aniket-Mishra/scripts",
  },
];

export const recommendations = [
  {
    name: "Sahil Maheshwari",
    title: "Vice President of Engineering at Avathon",
    relation: "Sahil managed Aniket directly",
    link: "https://www.linkedin.com/in/sahilmaheshwari/",
    text: "Aniket is a hardworking, sharp and skillful software engineer. He started out as a Data Engineer on our Renewables team and was able to quickly ramp up both on software stack and domain. He has championed various efforts around improving data quality and the tooling to identify and remediate data related issues. He proactively takes up challenging tasks and is a good communicator. A masterful meme generator, Aniket brings his lots of positive energy and enthusiasm and is a great addition to have on the team.",
  },
  {
    name: "Anoop Toffy",
    title: "Forward Deployment Manager, Sr. Data Scientist, AI Enablement",
    relation: "Anoop managed Aniket directly",
    link: "https://www.linkedin.com/in/anooptoffy/",
    text: "Aniket is an invaluable engineer who any team can look up to. I spent more than a year collaborating with Aniket, and during that time I witnessed him always pushing himself to discover answers to the team's problems and motivating them to move forward. Sometimes, I've had to tell him to slow down a few times since he finishes his work ahead of schedule. Aniket devotes a lot of time and energy to his job, and he is constantly the first to accept changes to the product and to voice his ideas. He approaches each task head-on and puts in great effort to see it through. Aniket exhibits exceptional organizational abilities in the way he arranges the data for his study and presents his findings. He also shows a lot of initiative and is self-driven in taking up new challenges and in learning new skills.",
  },
  {
    name: "Jay Shah",
    title: "Senior Data Scientist, LLM/RAG & Agentic Systems",
    relation: "Jay was senior to Aniket",
    link: "https://www.linkedin.com/in/jayshah5696/",
    text: "I had the pleasure of working with Aniket as a data scientist at SparkCognition and was consistently impressed by his expertise and dedication to his work. Aniket is highly skilled in data science, with a strong background in software and domain knowledge. He was instrumental in developing and implementing data-driven solutions for a variety of business problems, and his insights and recommendations always proved to be valuable for the team. He is also a team player and always willing to collaborate with his colleagues to achieve common goals.",
  },
];

export const skills = [
  { title: "Languages", items: ["Python", "SQL", "Rust", "JavaScript", "C", "C++", "Bash", "PySpark"] },
  { title: "ML & AI", items: ["PyTorch", "Scikit-Learn", "Transformers", "HuggingFace", "LangChain", "RAG", "AutoML", "Anomaly Detection", "Time Series", "Reinforcement Learning", "LLMs", "AI Agents", "Stable Diffusion", "ComfyUI", "Ollama", "Continual Learning"] },
  { title: "Data Engineering & MLOps", items: ["Airflow", "Docker", "Serverless", "CI/CD", "Terraform", "GitHub Actions"] },
  { title: "Databases & Search", items: ["PostgreSQL", "MySQL", "InfluxDB", "ElasticSearch", "DuckDB", "Neo4j", "ChromaDB"] },
  { title: "Visualization & Monitoring", items: ["Plotly", "Dash", "Streamlit", "Panel", "Grafana", "Kibana"] },
  { title: "Cloud & Hosting", items: ["AWS", "GCP", "Heroku", "Netlify", "Vercel"] },
  { title: "Platforms & Hardware", items: ["Linux", "macOS", "WSL", "Raspberry Pi", "Arduino", "Jetson Nano"] },
  { title: "Tools", items: ["FastAPI", "Git", "Poetry", "UV", "PyTest", "Postman", "REST APIs"] },
];

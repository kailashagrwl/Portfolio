import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './index.css';
import { WavyBackground } from './components/wavy-background';
import MarqueeDefault from 'react-fast-marquee';
import TiltDefault from 'react-parallax-tilt';
import heroImg from './assets/hero.png';

const Marquee = MarqueeDefault.default || MarqueeDefault;
const Tilt = TiltDefault.default || TiltDefault;

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

const Typewriter = ({ words, delay = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, 100);
    }

    if (!isDeleting && currentText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, delay]);

  return <span>{currentText}</span>;
};

const FadeIn = ({ children, delay = 0, className = '', style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

const TiltCard = ({ children, delay = 0, className = '', style = {} }) => (
  <FadeIn delay={delay} style={{ display: 'flex', width: '100%', height: '100%' }}>
    <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={true} glareMaxOpacity={0.05} glareColor="var(--primary-blue)" glarePosition="all" style={{ width: '100%', display: 'flex' }}>
      <div className={`minimal-card ${className}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', ...style }}>
        {children}
      </div>
    </Tilt>
  </FadeIn>
);

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [githubData, setGithubData] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Sending...');
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSubmitStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('Failed to send. Is the backend running?');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/kailashagrwl');
        setGithubData(response.data);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        // Fallback data if GitHub API rate limit is exceeded
        setGithubData({
          public_repos: "5+",
          followers: "1+",
          following: "1+",
          html_url: "https://github.com/kailashagrwl"
        });
      }
    };
    fetchGithubData();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <CustomCursor />
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <a href="#" className="logo" onClick={closeMenu}>KA</a>
          <div className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#training" className="nav-link">Training</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
          <a href="#about" className="mobile-link" onClick={closeMenu}>About</a>
          <a href="#skills" className="mobile-link" onClick={closeMenu}>Skills</a>
          <a href="#projects" className="mobile-link" onClick={closeMenu}>Projects</a>
          <a href="#training" className="mobile-link" onClick={closeMenu}>Training</a>
          <a href="#education" className="mobile-link" onClick={closeMenu}>Education</a>
          <a href="#contact" className="mobile-link" onClick={closeMenu}>Contact</a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="section section-light" style={{ padding: 0 }}>
          <WavyBackground
            backgroundFill="var(--bg-white)"
            waveOpacity={0.6}
            colors={["#1C76FF", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]}
          >
            <div className="container hero" style={{ paddingTop: '8rem', paddingBottom: '4rem', zIndex: 10 }}>
              <div className="hero-content">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                  className="hero-title"
                >
                  KAILASH<br /><span className="gradient-text">AGARWAL</span>
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
                  className="hero-subtitle"
                >
                  <Typewriter words={["Data Analyst", "Software Developer"]} />
                  <span className="cursor">|</span>
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                  className="hero-desc"
                >
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '0.5rem', textTransform: 'none', whiteSpace: 'nowrap' }}>Turning Data into Insights & Real-World Solutions</strong>
                  Building data-driven applications using analytics, machine learning, and modern web technologies to solve real-world problems.
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }}
                  className="hero-cta"
                >
                  <a href="#projects" className="btn btn-primary">View Projects</a>
                  <a href="/Kailash_Resume.docx" download className="btn btn-outline"><i className="fas fa-download"></i> Resume</a>
                  <a href="#contact" className="btn btn-outline">Contact Me</a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
                  className="social-links"
                >
                  <a href="https://github.com/kailashagrwl" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                  <a href="https://www.linkedin.com/in/kailash-agarwal47/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
                  <a href="mailto:kailashagarwal957@gmail.com"><i className="fas fa-envelope"></i></a>
                </motion.div>
              </div>

              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} glarePosition="all" style={{ zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  style={{ position: 'relative', width: '100%', padding: '2rem' }}
                >
                  <div style={{ position: 'absolute', inset: '10%', background: 'var(--primary-blue)', filter: 'blur(80px)', opacity: 0.4, zIndex: -1, borderRadius: '50%' }}></div>
                  <img src="/kailash.jpg" alt="Kailash Agarwal" style={{ width: '100%', maxWidth: '400px', height: '500px', display: 'block', margin: '0 auto', objectFit: 'cover', borderRadius: '40px', border: '5px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)' }} />
                </motion.div>
              </Tilt>
            </div>
          </WavyBackground>
        </section>

        {/* Marquee Divider */}
        <div style={{ background: 'var(--primary-blue)', color: 'var(--bg-white)', padding: '1.5rem 0', transform: 'rotate(-2deg)', margin: '4rem -2rem', width: 'calc(100% + 4rem)', overflow: 'hidden' }}>
          <Marquee speed={80} gradient={false}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Data Science & Analytics</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Machine Learning</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Statistical Modeling</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Visual Intelligence</span> •
          </Marquee>
        </div>

        {/* About Section */}
        <section id="about" className="section section-light">
          <div className="container">
            <FadeIn><h2 className="section-title">ABOUT <span className="gradient-text">ME</span></h2></FadeIn>
            <div className="about-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="about-text-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
                <FadeIn delay={0.2}>
                  <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: 'var(--text-dark)', fontWeight: '500' }}>
                    I am a Computer Science Engineer passionate about solving real-world problems through technology.
                  </p>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: 'var(--text-dark)', fontWeight: '500' }}>
                    My core interests lie in data analytics and machine learning, where I build data-driven solutions and predictive models to extract meaningful insights. Alongside this, I develop scalable web applications to bring these solutions to life.
                  </p>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: 'var(--text-dark)', fontWeight: '500' }}>
                    With a strong foundation in C++, Python, JavaScript, and SQL, I have worked on projects ranging from interactive dashboards to end-to-end machine learning pipelines focused on performance, clarity, and real impact.
                  </p>
                </FadeIn>
                <FadeIn delay={0.5}>
                  <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: 'var(--text-dark)', fontWeight: '500' }}>
                    I am driven by curiosity, continuous learning, and the goal of building technology that truly makes a difference.
                  </p>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section section-dark">
          <div className="container">
            <FadeIn><h2 className="section-title">MY <span className="gradient-text">SKILLS</span></h2></FadeIn>
            <div className="skills-grid">
              <TiltCard delay={0.1} className="skill-category">
                <div className="stat-icon" style={{ background: 'rgba(28, 118, 255, 0.1)', color: 'var(--primary-blue)', margin: '0 0 1.5rem 0' }}><i className="fas fa-code"></i></div>
                <h3>LANGUAGES</h3>
                <div className="skill-tags">
                  <span>C++</span><span>C</span><span>Python</span><span>SQL</span><span>JavaScript</span>
                </div>
              </TiltCard>
              <TiltCard delay={0.15} className="skill-category">
                <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', margin: '0 0 1.5rem 0' }}><i className="fas fa-desktop"></i></div>
                <h3>FRONTEND</h3>
                <div className="skill-tags">
                  <span>HTML5</span><span>CSS3</span><span>Responsive Web Design</span>
                </div>
              </TiltCard>
              <TiltCard delay={0.2} className="skill-category">
                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', margin: '0 0 1.5rem 0' }}><i className="fas fa-microchip"></i></div>
                <h3>FRAMEWORKS & ML</h3>
                <div className="skill-tags">
                  <span>NumPy</span><span>Pandas</span><span>Scikit-Learn</span><span>Matplotlib</span><span>Seaborn</span>
                </div>
              </TiltCard>
              <TiltCard delay={0.3} className="skill-category">
                <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6', margin: '0 0 1.5rem 0' }}><i className="fas fa-tools"></i></div>
                <h3>TOOLS & PLATFORMS</h3>
                <div className="skill-tags">
                  <span>Power BI</span><span>MS Excel</span><span>MySQL</span><span>Jupyter Notebook</span><span>VS Code</span><span>Vercel</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section section-light">
          <div className="container">
            <FadeIn><h2 className="section-title">FEATURED <span className="gradient-text">PROJECTS</span></h2></FadeIn>
            <div className="projects-grid">
              <TiltCard delay={0.1} className="project-card">
                <div className="project-tags">
                  <span>HTML</span><span>CSS</span><span>JavaScript</span>
                </div>
                <h3>Smart Study Planner</h3>
                <p>Developed a responsive Smart Study Planner with an integrated dashboard to manage subjects, scheduling, task tracking, and performance analytics. Implemented browser-based local storage for persistent state management, ensuring seamless task continuity.</p>
                <div className="project-links">
                  <a href="https://github.com/kailashagrwl/Smart-Study-Planner" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </TiltCard>
              <TiltCard delay={0.2} className="project-card">
                <div className="project-tags">
                  <span>Power BI</span><span>DAX</span><span>Power Query</span>
                </div>
                <h3>Healthcare Analytics Dashboard</h3>
                <p>Built an interactive healthcare analytics dashboard to analyze patient demographics, hospital admissions, billing trends, and diagnostic outcomes. Applied star schema data modeling and created DAX measures to track key metrics.</p>
                <div className="project-links">
                  <a href="https://github.com/kailashagrwl/HealthCare-Analytics" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </TiltCard>
              <TiltCard delay={0.3} className="project-card">
                <div className="project-tags">
                  <span>Python</span><span>NumPy</span><span>Pandas</span><span>Scikit-Learn</span>
                </div>
                <h3>E-Commerce Sales Prediction</h3>
                <p>Built a predictive machine learning pipeline to forecast future e-commerce sales using historic datasets. Cleaned, preprocessed, and engineered data features to deliver an accurate sales-forecasting model with visual insights.</p>
                <div className="project-links">
                  <a href="https://github.com/kailashagrwl/E-Commerce-Sales-Prediction" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="training" className="section section-dark">
          <div className="container">
            <FadeIn><h2 className="section-title">SUMMER <span className="gradient-text">TRAINING</span></h2></FadeIn>
            <div className="timeline">
              <FadeIn delay={0.1} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">Jun 25 - Jul 25</span>
                  <h3>Data Structure and Algorithm</h3>
                  <h4 className="gradient-text">Intensive Summer Program</h4>
                  <ul>
                    <li>Completed an intensive summer training program focused on core Data Structures and Algorithms.</li>
                    <li>Practiced implementing essential data structures like arrays, stacks, queues, trees, graphs, and hash maps.</li>
                    <li>Enhanced ability to write efficient, optimized code using time-space complexity analysis.</li>
                    <li>Tech: Python</li>
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Achievements & Certifications */}
        <section id="achievements" className="section section-light">
          <div className="container">
            <div className="dual-grid">
              <FadeIn delay={0.1}>
                <h2 className="section-title" style={{ textAlign: 'left' }}><span className="gradient-text">CERTIFICATIONS</span></h2>
                <ul className="fancy-list">
                  <li>
                    <i className="fas fa-award"></i>
                    <div style={{ flex: 1 }}>
                      <strong>ChatGPT-4 Prompt Engineering: ChatGPT, Generative AI & LLM</strong>
                      <span>Infosys</span>
                    </div>
                    <a href="https://drive.google.com/file/d/1QSqSLA63JXP0vodULO73jhiLpwCpYdY3/view" target="_blank" rel="noreferrer" className="cert-link" title="View Certificate">
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-award"></i>
                    <div style={{ flex: 1 }}>
                      <strong>Privacy and Security in online social media</strong>
                      <span>NPTEL</span>
                    </div>
                    <a href="https://drive.google.com/file/u/0/d/1cjzmhrc70ZJsEBM1igCZHdh3Bjkq_8Gt/view?usp=sharing&pli=1" target="_blank" rel="noreferrer" className="cert-link" title="View Certificate">
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-award"></i>
                    <div style={{ flex: 1 }}>
                      <strong>Data Structure and Algorithm</strong>
                      <span>CSE Pathshala</span>
                    </div>
                    <a href="https://drive.google.com/file/d/1_mtnIF3BFHOg3jIU6tH3GySN0nsIcmnC/view" target="_blank" rel="noreferrer" className="cert-link" title="View Certificate">
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  </li>
                </ul>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="section-title" style={{ textAlign: 'left' }}><span className="gradient-text">ACHIEVEMENTS</span></h2>
                <div className="stats-grid">
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="var(--primary-blue)" style={{ height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-icon" style={{ background: 'rgba(28, 118, 255, 0.1)', color: 'var(--primary-blue)' }}><i className="fas fa-trophy"></i></div>
                      <div className="stat-number">200+</div>
                      <div className="stat-label">DSA Problems Solved</div>
                    </div>
                  </Tilt>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="#8b5cf6" style={{ height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><i className="fas fa-chart-line"></i></div>
                      <div className="stat-number">1557</div>
                      <div className="stat-label">LeetCode Rating</div>
                    </div>
                  </Tilt>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="#22c55e" style={{ height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}><i className="fas fa-star"></i></div>
                      <div className="stat-number">4★</div>
                      <div className="stat-label">HackerRank C++</div>
                    </div>
                  </Tilt>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="#22c55e" style={{ height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}><i className="fas fa-star"></i></div>
                      <div className="stat-number">4★</div>
                      <div className="stat-label">HackerRank SQL</div>
                    </div>
                  </Tilt>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Education & Github stats */}
        <section id="education" className="section section-dark">
          <div className="container">
            <FadeIn><h2 className="section-title">EDUCATION & <span className="gradient-text">PROFILES</span></h2></FadeIn>
            <div className="dual-grid">
              <div className="timeline">
                <FadeIn delay={0.1} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">2023 - Present</span>
                    <h3>B.Tech Computer Science Engineering</h3>
                    <p style={{ color: 'var(--text-light)', opacity: 0.8 }}>Lovely Professional University &bull; Phagwara, India</p>
                    <p className="highlight">CGPA: 8.25</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.2} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">Apr 2020 - Mar 2022</span>
                    <h3>Delhi Public School (Intermediate)</h3>
                    <p style={{ color: 'var(--text-light)', opacity: 0.8 }}>Digboi, Assam</p>
                    <p className="highlight">Percentage: 71.4</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">Apr 2019 - Mar 2020</span>
                    <h3>Delhi Public School (Matriculation)</h3>
                    <p style={{ color: 'var(--text-light)', opacity: 0.8 }}>Digboi, Assam</p>
                    <p className="highlight">Percentage: 84</p>
                  </div>
                </FadeIn>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignSelf: 'start' }}>
                <TiltCard delay={0.3} className="comp-card">
                  <h3><i className="fas fa-trophy"></i> Competitive Programming</h3>
                  <p>Active participant in competitive programming platforms, continuously refining problem-solving skills and algorithmic thinking.</p>
                  <div className="cp-links">
                    <a href="https://leetcode.com/u/kailashagrwl/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">LeetCode</a>
                    <a href="https://www.hackerrank.com/profile/kailashagarwal91" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">HackerRank</a>
                  </div>
                </TiltCard>

                <TiltCard delay={0.4} className="comp-card">
                  <h3><i className="fab fa-github"></i> GitHub Overview</h3>
                  {githubData ? (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Public Repos</span>
                        <strong style={{ color: 'var(--primary-blue)' }}>{githubData.public_repos}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Followers</span>
                        <strong style={{ color: 'var(--primary-blue)' }}>{githubData.followers}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-light)' }}>Following</span>
                        <strong style={{ color: 'var(--primary-blue)' }}>{githubData.following}</strong>
                      </div>
                      <div className="cp-links" style={{ marginTop: '0.5rem' }}>
                        <a href={githubData.html_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>Visit GitHub</a>
                      </div>
                    </div>
                  ) : (
                    <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading stats...</p>
                  )}
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section section-light">
          <div className="container">
            <FadeIn><h2 className="section-title">GET IN <span className="gradient-text">TOUCH</span></h2></FadeIn>
            <div className="contact-container">
              <FadeIn delay={0.1} className="minimal-card contact-info" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                <h3>Let's start a project together</h3>
                <p>Feel free to reach out for collaborations or just a friendly hello. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                <div className="contact-methods">
                  <a href="mailto:kailashagarwal957@gmail.com" className="contact-method">
                    <div className="cm-icon"><i className="fas fa-envelope"></i></div>
                    <div>
                      <h4>Email</h4>
                      <span>kailashagarwal957@gmail.com</span>
                    </div>
                  </a>
                  <a href="tel:+919707026697" className="contact-method">
                    <div className="cm-icon"><i className="fas fa-phone"></i></div>
                    <div>
                      <h4>Phone</h4>
                      <span>+91-9707026697</span>
                    </div>
                  </a>
                  <div className="contact-method">
                    <div className="cm-icon"><i className="fas fa-map-marker-alt"></i></div>
                    <div>
                      <h4>Location</h4>
                      <span>Tinsukia, Assam</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
              <TiltCard delay={0.2} className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit}>
                  {submitStatus && <p style={{ color: submitStatus.includes('success') ? '#1C76FF' : '#f87171', marginBottom: '1rem', fontWeight: '600' }}>{submitStatus}</p>}
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="YOUR NAME" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="YOUR EMAIL" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="5" placeholder="HOW CAN I HELP YOU?" value={formData.message} onChange={handleChange} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Send Message</button>
                </form>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Footer Marquee */}
        <div style={{ background: 'var(--text-dark)', color: 'var(--primary-blue)', padding: '1rem 0', width: '100%', overflow: 'hidden', borderTop: '1px solid var(--border-dark)' }}>
          <Marquee speed={60} gradient={false} direction="right">
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Available For Freelance</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Let's Build Something Amazing</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Open To Opportunities</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Creative Problem Solving</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Always Learning</span> ∾
          </Marquee>
        </div>
      </main>

      <footer>
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} Kailash Agarwal. All rights reserved.</p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://github.com/kailashagrwl" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/kailash-agarwal47/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;


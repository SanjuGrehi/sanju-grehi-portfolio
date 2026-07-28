import { useState, useEffect, useRef, type ReactNode } from 'react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 18, suffix: '+', label: 'Projects Completed' },
  { value: 42, suffix: '+', label: 'Certifications Earned' },
  { value: 35, suffix: '+', label: 'Technologies Learned' },
  { value: 20, suffix: '+', label: 'IEEE Events Organized' },
  { value: 8,  suffix: '+', label: 'Workshops Attended' },
  { value: 3,  suffix: '+', label: 'Years of Learning' },
]

const SKILL_CATEGORIES = [
  {
    id: 'programming', label: 'Programming',
    icon: '{ }', color: '#7C3AED', bg: '#F5F3FF',
    skills: ['Python', 'C', 'C++', 'MATLAB', 'JavaScript', 'TypeScript', 'Bash Scripting'],
    desc: 'Core programming languages used across embedded systems, automation scripting, and data analysis.',
  },
  {
    id: 'electrical', label: 'Electrical Engineering',
    icon: '⚡', color: '#D97706', bg: '#FFF7ED',
    skills: ['Circuit Analysis', 'Power Systems', 'Control Theory', 'Electrical Machines', 'Power Electronics', 'Protection Systems', 'Signal Processing'],
    desc: 'Foundational and applied electrical engineering disciplines from power distribution to control systems.',
  },
  {
    id: 'automation', label: 'Industrial Automation',
    icon: '⚙', color: '#2563EB', bg: '#EFF6FF',
    skills: ['PLC Programming', 'SCADA Systems', 'HMI Development', 'VFD Configuration', 'Servo Systems', 'Industrial Networking', 'Instrumentation & Control'],
    desc: 'Industrial automation stack — from field device wiring to supervisory control and data acquisition.',
  },
  {
    id: 'renewable', label: 'Renewable Energy',
    icon: '☀', color: '#16A34A', bg: '#F0FDF4',
    skills: ['Solar PV Design', 'PVsyst Simulation', 'Wind Energy Systems', 'Energy Management', 'Grid Integration', 'Battery Storage Systems', 'Energy Audit'],
    desc: 'End-to-end renewable energy system design, simulation, and performance analysis.',
  },
  {
    id: 'ai', label: 'Artificial Intelligence',
    icon: '◈', color: '#DB2777', bg: '#FDF2F8',
    skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Data Analysis', 'TensorFlow', 'scikit-learn', 'Pandas & NumPy'],
    desc: 'Applied AI and data science skills for engineering diagnostics, predictive maintenance, and automation.',
  },
  {
    id: 'simulation', label: 'Simulation Tools',
    icon: '◉', color: '#0891B2', bg: '#ECFEFF',
    skills: ['MATLAB/Simulink', 'PVsyst', 'AutoCAD Electrical', 'LTspice', 'LabVIEW', 'Multisim', 'PSIM'],
    desc: 'Engineering simulation software for system modeling, circuit analysis, and energy yield assessment.',
  },
  {
    id: 'design', label: 'Design Tools',
    icon: '◎', color: '#7C3AED', bg: '#F5F3FF',
    skills: ['AutoCAD', 'SolidWorks', 'Figma', 'Canva', 'Adobe Illustrator', 'EPLAN Electric'],
    desc: 'Technical drawing, electrical schematic design, and UI/graphic design tools.',
  },
  {
    id: 'productivity', label: 'Engineering Productivity',
    icon: '▦', color: '#475569', bg: '#F8FAFC',
    skills: ['Microsoft Office Suite', 'LaTeX Report Writing', 'Git & GitHub', 'Jupyter Notebooks', 'VS Code', 'Notion', 'Obsidian'],
    desc: 'Productivity, documentation, and collaboration tools for professional engineering workflows.',
  },
]

const PROJECTS = [
  {
    id: 1,
    title: 'RFID-Based Smart Attendance System',
    category: 'Embedded Systems',
    description: 'Contactless attendance management using RFID technology with automatic logging, report generation, and unauthorized access alerts. Handles 500+ student records with real-time sync.',
    problem: 'Manual attendance tracking is error-prone, time-consuming, and susceptible to proxy attendance — causing administrative overhead and data inaccuracy in institutions.',
    solution: 'Arduino-based RFID card reader with I²C LCD display and SD card logging. Python backend processes CSV exports and generates daily/weekly attendance reports with email notifications.',
    tags: ['Arduino', 'RFID RC522', 'Python', 'C++', 'SD Card Logging'],
    color: '#2563EB',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&auto=format',
  },
  {
    id: 2,
    title: 'IoT Smart Energy Meter & Dashboard',
    category: 'Renewable Energy',
    description: 'Real-time energy monitoring with CT clamp sensors, ESP32 microcontroller, and a live cloud dashboard showing consumption trends, cost predictions, and anomaly alerts.',
    problem: 'Conventional meters lack real-time visibility and analytics, making it impossible for consumers to identify energy waste or optimize consumption patterns.',
    solution: 'Non-invasive CT clamp sensor with ESP32 publishing MQTT data to HiveMQ cloud broker. React dashboard displays live wattage, historical charts, cost estimations, and sends WhatsApp alerts for unusual spikes.',
    tags: ['ESP32', 'MQTT', 'IoT', 'React Dashboard', 'CT Sensor'],
    color: '#16A34A',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'PLC-Based Adaptive Traffic Control System',
    category: 'Industrial Automation',
    description: 'Siemens S7-1200 PLC controlling a 4-way intersection with adaptive signal timing, emergency vehicle priority override, and pedestrian crossing integration via HMI.',
    problem: 'Fixed-time traffic signals cause unnecessary congestion and delay emergency response — a solvable problem with programmable logic and sensor inputs.',
    solution: 'State-machine ladder logic on Siemens S7-1200 PLC. Inductive loop sensors detect vehicle density; IR sensors trigger emergency override. WinCC HMI provides real-time junction visualization and manual override capability.',
    tags: ['Siemens S7-1200', 'PLC Ladder Logic', 'WinCC HMI', 'SCADA', 'Industrial Sensors'],
    color: '#D97706',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'Solar PV Monitoring & Analytics Platform',
    category: 'Renewable Energy',
    description: '10 kW rooftop solar monitoring platform built with Raspberry Pi data acquisition, real-time panel efficiency tracking, battery SoC monitoring, and predictive maintenance alerts.',
    problem: 'Solar installations lack affordable monitoring solutions that provide actionable insights — panel degradation and inverter faults often go undetected for weeks.',
    solution: 'PVsyst-designed 10 kW system with Raspberry Pi reading Modbus RS-485 inverter data. Node.js backend stores time-series data in InfluxDB. React dashboard shows live generation, historical yield, and fault predictions using LSTM anomaly detection.',
    tags: ['Solar PV', 'PVsyst', 'Raspberry Pi', 'Modbus', 'InfluxDB'],
    color: '#0891B2',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800&h=450&fit=crop&auto=format',
  },
  {
    id: 5,
    title: 'Industrial Conveyor Belt Automation',
    category: 'Industrial Automation',
    description: 'Multi-stage VFD-controlled conveyor with PLC logic for variable speed zones, fault detection, predictive maintenance using vibration sensors, and full SCADA visualization.',
    problem: 'Fixed-speed conveyors cause product damage on fragile goods and inconsistent throughput — VFD integration enables process optimization and energy savings of up to 35%.',
    solution: 'Siemens VFDs in closed-loop speed control via PLC analog outputs. Proximity sensors detect belt slip; vibration sensors trigger predictive maintenance. Factory I/O simulation validated the design before physical implementation.',
    tags: ['VFD Drive', 'PLC Automation', 'SCADA Monitoring', 'Factory I/O', 'Predictive Maintenance'],
    color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop&auto=format',
  },
]

const CERTIFICATIONS = [
  { id: 1,  name: 'Siemens PLC Programming Basics',         org: 'Siemens Digital Industries',    year: '2025', category: 'Automation',       color: '#2563EB' },
  { id: 2,  name: 'Industrial Automation Fundamentals',     org: 'NPTEL – IIT Kharagpur',         year: '2024', category: 'Automation',       color: '#2563EB' },
  { id: 3,  name: 'SCADA & HMI System Design',             org: 'Rockwell Automation',            year: '2025', category: 'Automation',       color: '#2563EB' },
  { id: 4,  name: 'Python for Engineers',                   org: 'Coursera – University of Michigan', year: '2024', category: 'Programming', color: '#7C3AED' },
  { id: 5,  name: 'MATLAB Onramp',                         org: 'MathWorks',                      year: '2023', category: 'Programming',      color: '#7C3AED' },
  { id: 6,  name: 'Introduction to IoT',                   org: 'Cisco Networking Academy',       year: '2024', category: 'Programming',      color: '#7C3AED' },
  { id: 7,  name: 'Solar PV System Design',                org: 'MNRE – Government of India',     year: '2024', category: 'Renewable Energy', color: '#16A34A' },
  { id: 8,  name: 'Renewable Energy Technologies',         org: 'NPTEL – IIT Bombay',             year: '2024', category: 'Renewable Energy', color: '#16A34A' },
  { id: 9,  name: 'Machine Learning Fundamentals',         org: 'Google',                         year: '2025', category: 'AI & ML',          color: '#DB2777' },
  { id: 10, name: 'Data Analysis with Python',             org: 'IBM via Coursera',               year: '2025', category: 'AI & ML',          color: '#DB2777' },
  { id: 11, name: 'Power Electronics Fundamentals',        org: 'NPTEL – IIT Delhi',              year: '2025', category: 'Electrical',        color: '#D97706' },
  { id: 12, name: 'IEEE Workshop – Control Systems',       org: 'IEEE Kerala Section',            year: '2025', category: 'Leadership',        color: '#0891B2' },
]

const EDUCATION = [
  {
    year: '2019 – 2021', type: 'education',
    title: 'Secondary School (Class 10)',
    institution: 'Government Higher Secondary School',
    location: 'Kerala, India',
    description: 'Completed secondary education with distinction in Science and Mathematics, developing a strong analytical foundation.',
  },
  {
    year: '2021 – 2023', type: 'education',
    title: 'Higher Secondary – Science Stream (Class 12)',
    institution: 'Government Higher Secondary School',
    location: 'Kerala, India',
    description: 'Specialized in Physics, Chemistry, Mathematics, and Computer Science. Developed early interest in electrical systems.',
  },
  {
    year: '2023 – 2027', type: 'education', highlight: true,
    title: 'B.Tech – Electrical & Electronics Engineering',
    institution: 'College of Engineering',
    location: 'Kerala, India',
    description: 'Core coursework in Power Systems, Control Systems, Electrical Machines, and Industrial Automation. Active IEEE student member with leadership responsibilities.',
  },
  {
    year: '2025', type: 'leadership',
    title: 'IEEE SPS Student Chapter Chair',
    institution: 'IEEE Signal Processing Society',
    location: 'Student Branch',
    description: 'Elected as Student Chapter Chair. Organized technical workshops, seminars, and IEEE-sponsored events reaching 200+ students.',
  },
  {
    year: '2025', type: 'internship',
    title: 'Industrial Training – KSEB',
    institution: 'Kerala State Electricity Board',
    location: 'Kerala, India',
    description: 'Hands-on training in substation operations, protection relay testing, and distribution network management at KSEB facilities.',
  },
]

const LEADERSHIP = [
  {
    role: 'IEEE SPS Student Chapter Chair',
    org: 'IEEE Signal Processing Society',
    period: '2025 – Present',
    description: 'Leading a 60+ member chapter, organizing technical events, workshops, and industry collaborations to bridge academia and industry for EEE students.',
    achievements: ['Organized Industrial Automation Workshop (200+ attendees)', 'IEEE Day Celebrations 2025 Coordinator', 'Established peer mentorship program'],
    color: '#2563EB',
  },
  {
    role: 'IEEE CSS Student Member',
    org: 'IEEE Control Systems Society',
    period: '2024 – Present',
    description: 'Active member contributing to control systems seminars, technical paper presentations, and co-authoring the department technical newsletter.',
    achievements: ['Presented paper on PLC-Based Traffic Control', 'Organized Control Systems webinar', 'Co-authored quarterly technical newsletter'],
    color: '#7C3AED',
  },
  {
    role: 'Technical Workshop Organizer',
    org: 'Department of EEE',
    period: '2024 – Present',
    description: 'Coordinated department-level workshops on Industrial Automation, Python Programming, and Renewable Energy Systems, inviting industry experts from ABB and Siemens.',
    achievements: ['5+ workshops organized', '500+ total participants', 'Guest lectures from ABB and Siemens engineers'],
    color: '#16A34A',
  },
]

const EXPERIENCE = [
  {
    title: 'Industrial Training',
    company: 'Kerala State Electricity Board (KSEB)',
    period: 'Summer 2025', type: 'Internship',
    description: 'Hands-on experience in 110/11 kV substation operations, protection relay testing (SEL, ABB relays), and distribution transformer maintenance. Observed real-time fault management and power restoration procedures.',
    highlights: ['Protection relay calibration & testing', 'Distribution transformer commissioning', 'Power flow analysis & fault identification', 'Substation automation overview'],
    color: '#2563EB',
  },
  {
    title: 'Research Project – Solar PV System Design',
    company: 'Department of EEE, College of Engineering',
    period: '2024 – 2025', type: 'Research',
    description: 'Designed and simulated a 10 kW rooftop solar PV system for Kerala\'s climate using PVsyst. Optimized panel orientation, string configuration, and grid-tied inverter protection for maximum annual energy yield.',
    highlights: ['PVsyst simulation & loss analysis', 'String sizing & irradiance mapping', 'Grid-tied inverter selection', 'Annual energy yield: 14,200 kWh'],
    color: '#16A34A',
  },
  {
    title: 'Automation Lab Teaching Assistant',
    company: 'College of Engineering – EEE Department',
    period: '2024 – Present', type: 'Academic',
    description: 'Assist final-year students with PLC programming labs, SCADA configuration exercises, and industrial automation project guidance. Maintain lab equipment and documentation.',
    highlights: ['Siemens S7-1200 lab setup', 'WinCC SCADA demonstrations', 'Student project mentoring', 'Lab documentation maintenance'],
    color: '#D97706',
  },
]

const GALLERY_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=380&fit=crop&auto=format', alt: 'Engineering Lab Experiment', cat: 'Lab Work' },
  { id: 2, src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=620&fit=crop&auto=format', alt: 'Solar Panel Installation', cat: 'Renewable Energy' },
  { id: 3, src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=360&fit=crop&auto=format', alt: 'Circuit Board Assembly', cat: 'Electronics' },
  { id: 4, src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=440&fit=crop&auto=format', alt: 'IEEE Technical Workshop', cat: 'IEEE Events' },
  { id: 5, src: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&h=360&fit=crop&auto=format', alt: 'Industrial Automation Panel', cat: 'Industrial' },
  { id: 6, src: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=500&h=560&fit=crop&auto=format', alt: 'Renewable Energy Project', cat: 'Projects' },
  { id: 7, src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=360&fit=crop&auto=format', alt: 'Technical Seminar Session', cat: 'IEEE Events' },
  { id: 8, src: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&h=400&fit=crop&auto=format', alt: 'PLC Programming Lab', cat: 'Lab Work' },
  { id: 9, src: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=340&fit=crop&auto=format', alt: 'Project Team Collaboration', cat: 'Projects' },
]

const NAV_LINKS = ['Home', 'About', 'Education', 'Skills', 'Projects', 'Experience', 'Leadership', 'Certifications', 'Gallery', 'Contact']
const CERT_CATEGORIES = ['All', 'Automation', 'Programming', 'Renewable Energy', 'AI & ML', 'Electrical', 'Leadership']
const TYPE_COLORS: Record<string, string> = { education: '#2563EB', leadership: '#7C3AED', internship: '#16A34A' }
const TYPE_LABELS: Record<string, string> = { education: 'Education', leadership: 'Leadership', internship: 'Internship' }

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useCounter(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('sg-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('sg-theme', dark ? 'dark' : 'light')
  }, [dark])
  return { dark, toggle: () => setDark(d => !d) }
}

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function Tag({ children, color = '#2563EB' }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}28` }}
    >
      {children}
    </span>
  )
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="text-center mb-16"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <span
        className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 inline-block"
        style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}
      >
        {label}
      </span>
      <h2
        className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)', letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
      style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
    >
      {children}
    </button>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const navBg = scrolled
    ? (dark ? 'rgba(15,23,42,0.92)' : 'rgba(248,250,252,0.92)')
    : 'transparent'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #2563EB, #0EA5E9)' }}
            >
              SG
            </div>
            <span className="font-bold text-sm hidden sm:block" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>
              Sanju Grehi
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-xs font-medium transition-all hover:opacity-100"
                style={{ color: 'var(--fg)', opacity: 0.6 }}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <IconBtn onClick={toggleDark} title="Toggle theme">
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </IconBtn>
            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t px-4 pb-4 pt-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
          <div className="grid grid-cols-2 gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: 'var(--fg)', backgroundColor: 'transparent' }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.6,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, var(--bg) 25%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 lg:py-36 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-8"
              style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)28' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              Open to Internships & Collaborations
            </div>

            <h1
              className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-none mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)', letterSpacing: '-0.03em' }}
            >
              Sanju<span style={{ color: 'var(--primary)' }}> Grehi</span>
            </h1>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)', opacity: 0.65 }}>
              Electrical & Electronics Engineering Student
            </p>
            <p className="text-sm font-semibold tracking-wide mb-8" style={{ color: 'var(--secondary)' }}>
              PLC · SCADA · Control Systems · Renewable Energy · AI
            </p>
            <p className="text-sm leading-7 mb-10 max-w-lg" style={{ color: 'var(--fg-muted)' }}>
              Aspiring Industrial Automation Engineer passionate about building intelligent systems
              that bridge electrical engineering and emerging technology. Specializing in
              industrial automation, renewable energy, and AI-driven control systems.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { label: 'Download Resume', primary: true },
                { label: 'View Projects', primary: false, action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: 'Contact Me', primary: false, action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
              ].map(({ label, primary, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                  style={primary
                    ? { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: 'white', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }
                    : { backgroundColor: 'var(--bg-card)', color: 'var(--fg)', border: '1px solid var(--border)' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {[
                { label: 'GitHub', href: 'https://github.com/sanjugrehi', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/sanjugrehi', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: 'Email', href: 'mailto:sanjugrehi@gmail.com', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{ color: 'var(--fg-muted)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', textDecoration: 'none' }}
                >
                  {icon}{label}
                </a>
              ))}
            </div>
          </div>

          {/* Profile card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl" style={{ background: 'linear-gradient(135deg, #2563EB15, #0EA5E915)', border: '1px solid var(--border)' }} />
              <div
                className="relative w-72 sm:w-80 rounded-2xl p-6"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.1)' }}
              >
                <div className="flex justify-center mb-5">
                  <div
                    className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-bold text-4xl"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', boxShadow: '0 12px 40px rgba(37,99,235,0.35)' }}
                  >
                    SG
                  </div>
                </div>
                <div className="text-center mb-5">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>Sanju Grehi</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>B.Tech EEE · 2023–2027</p>
                </div>
                <div
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs font-semibold"
                  style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Open to Opportunities
                </div>
                <div className="space-y-2.5">
                  {[
                    ['Specialization', 'Industrial Automation'],
                    ['IEEE Role', 'SPS Chapter Chair'],
                    ['Location', 'Kerala, India'],
                    ['CGPA', '8.4 / 10.0'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b text-xs last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
                      <span className="font-semibold" style={{ color: 'var(--fg)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--fg-muted)', opacity: 0.6 }}>Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5" style={{ borderColor: 'var(--border)' }}>
          <div className="w-1 h-2 rounded-full" style={{ backgroundColor: 'var(--primary)', animation: 'scrollDot 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  )
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, inView } = useInView()
  const count = useCounter(value, inView)
  return (
    <div
      ref={ref}
      className="text-center p-5 rounded-2xl transition-all hover:scale-105"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
        {count}{suffix}
      </div>
      <div className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>{label}</div>
    </div>
  )
}

function Stats() {
  return (
    <section className="py-14 border-y" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 75} />)}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="About Me" title="Driven by Engineering Innovation" subtitle="Combining technical depth with leadership, dedicated to building the automation and energy systems of tomorrow." />
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>My Engineering Story</h3>
            <div className="space-y-4 text-sm leading-7" style={{ color: 'var(--fg-muted)' }}>
              <p>I'm Sanju Grehi, a B.Tech Electrical & Electronics Engineering student with a deep passion for industrial automation and intelligent energy systems. My journey began with a fascination for how electrical systems power the modern world — and a drive to make them smarter.</p>
              <p>Over three years I've immersed myself in PLC programming, SCADA systems, renewable energy design, and AI applications in engineering. As IEEE SPS Student Chapter Chair, I've organized 20+ technical events bridging industry knowledge with student communities.</p>
              <p>My goal: become an Industrial Automation Engineer at a global technology company — designing control systems that are efficient, reliable, and sustainable. I believe the future of engineering lies at the intersection of automation, AI, and clean energy.</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ['Technical Excellence', 'First principles thinking in every system design'],
                ['Continuous Learning', '42+ certifications across engineering domains'],
                ['IEEE Leadership', 'Organizing technical events and knowledge sharing'],
                ['Sustainable Engineering', 'Designing systems that respect our planet'],
              ].map(([title, desc]) => (
                <div key={title} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-bold mb-1" style={{ color: 'var(--fg)' }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>Current Focus</h4>
                <div className="flex flex-wrap gap-2">
                  {['Industrial Automation', 'PLC Programming', 'SCADA Systems', 'Control Theory', 'Renewable Energy Design', 'Machine Learning'].map(t => (
                    <Tag key={t} color="#2563EB">{t}</Tag>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>Career Vision</h4>
                <div className="space-y-2">
                  {['Industrial Automation Engineer', 'Control Systems Engineer', 'Energy Systems Engineer', 'Automation Consultant'].map(role => (
                    <div key={role} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--fg-muted)' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>→</span>{role}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-muted)' }}>Target Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {['Siemens', 'ABB', 'Schneider Electric', 'Rockwell Automation', 'Honeywell', 'Emerson', 'GE Vernova', 'Tesla Energy'].map(c => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── EDUCATION ───────────────────────────────────────────────────────────────

function Education() {
  return (
    <section id="education" className="py-24" style={{ backgroundColor: 'var(--bg-muted)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Timeline" title="Education & Milestones" subtitle="My academic journey from secondary school to engineering leadership and industry exposure." />
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px" style={{ backgroundColor: 'var(--border)' }} />
          <div className="space-y-6">
            {EDUCATION.map((item, i) => (
              <FadeIn key={i} delay={i * 90}>
                <div className="relative flex gap-6 pl-14">
                  <div
                    className="absolute left-3.5 top-4 w-3 h-3 rounded-full -translate-x-1/2"
                    style={{ backgroundColor: TYPE_COLORS[item.type], boxShadow: `0 0 0 3px var(--bg-muted), 0 0 0 5px ${TYPE_COLORS[item.type]}40` }}
                  />
                  <div
                    className="flex-1 p-5 rounded-2xl"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderLeft: `3px solid ${TYPE_COLORS[item.type]}`,
                      boxShadow: item.highlight ? `0 4px 24px ${TYPE_COLORS[item.type]}18` : 'var(--shadow-sm)',
                    }}
                  >
                    <div className="flex flex-wrap justify-between gap-2 mb-1.5">
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>{item.institution} · {item.location}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: TYPE_COLORS[item.type], backgroundColor: `${TYPE_COLORS[item.type]}15` }}>{TYPE_LABELS[item.type]}</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>{item.year}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{item.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

function Skills() {
  const [active, setActive] = useState<string | null>(null)
  const cat = SKILL_CATEGORIES.find(c => c.id === active)

  return (
    <section id="skills" className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Technical Skills" title="Engineering Expertise" subtitle="Click any category to explore the full skill set, tools, and proficiency in each engineering domain." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {SKILL_CATEGORIES.map((c, i) => (
            <FadeIn key={c.id} delay={i * 55}>
              <button
                onClick={() => setActive(active === c.id ? null : c.id)}
                className="w-full text-left p-5 rounded-2xl transition-all hover:scale-[1.025]"
                style={{
                  backgroundColor: active === c.id ? c.color : 'var(--bg-card)',
                  border: `1px solid ${active === c.id ? c.color : 'var(--border)'}`,
                  boxShadow: active === c.id ? `0 8px 32px ${c.color}35` : 'var(--shadow-sm)',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xs font-bold"
                  style={{ backgroundColor: active === c.id ? 'rgba(255,255,255,0.2)' : c.bg, color: active === c.id ? 'white' : c.color }}
                >
                  {c.icon}
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: active === c.id ? 'white' : 'var(--fg)', fontFamily: 'var(--font-display)' }}>{c.label}</h3>
                <p className="text-xs" style={{ color: active === c.id ? 'rgba(255,255,255,0.65)' : 'var(--fg-muted)' }}>{c.skills.length} skills</p>
              </button>
            </FadeIn>
          ))}
        </div>

        {cat && (
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${cat.color}35`,
              boxShadow: `0 8px 32px ${cat.color}12`,
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>{cat.label}</h3>
                <p className="text-xs mt-1 max-w-lg" style={{ color: 'var(--fg-muted)' }}>{cat.desc}</p>
              </div>
              <button onClick={() => setActive(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0" style={{ color: 'var(--fg-muted)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {cat.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: `${cat.color}12`, color: cat.color, border: `1px solid ${cat.color}22` }}>{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

function Projects() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section id="projects" className="py-24" style={{ backgroundColor: 'var(--bg-muted)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Portfolio" title="Featured Engineering Projects" subtitle="Real-world engineering solutions built with professional technology stacks, documented with problem statements and technical approaches." />
        <div className="space-y-5">
          {PROJECTS.map((p, i) => (
            <FadeIn key={p.id} delay={i * 70}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: expanded === p.id ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <div
                  className="grid md:grid-cols-3 cursor-pointer"
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                >
                  <div className="relative h-48 md:h-auto overflow-hidden" style={{ backgroundColor: '#CBD5E1' }}>
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" style={{ opacity: 0.88, transition: 'opacity 0.3s' }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.color}28, transparent)` }} />
                    <div className="absolute top-3 left-3"><Tag color={p.color}>{p.category}</Tag></div>
                  </div>
                  <div className="md:col-span-2 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold mb-2" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>{p.description}</p>
                      <div className="flex flex-wrap gap-2">{p.tags.map(t => <Tag key={t} color={p.color}>{t}</Tag>)}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{expanded === p.id ? 'Click to collapse' : 'Click to see full technical details'}</span>
                      <span className="text-xs font-bold" style={{ color: p.color }}>{expanded === p.id ? '↑ Collapse' : '↓ Expand'}</span>
                    </div>
                  </div>
                </div>
                {expanded === p.id && (
                  <div className="px-6 pb-6 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--fg-muted)' }}>Problem Statement</h4>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>{p.problem}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--fg-muted)' }}>Engineering Solution</h4>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>{p.solution}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: p.color }}>View Documentation</button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold" style={{ color: 'var(--fg)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}>GitHub Repository</button>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Experience" title="Professional Experience" subtitle="Internships, industrial training, and research work that built real-world engineering competence." />
        <div className="space-y-5">
          {EXPERIENCE.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: `3px solid ${item.color}` }}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>{item.company}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Tag color={item.color}>{item.type}</Tag>
                    <span className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>{item.period}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.highlights.map(h => (
                    <span key={h} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>{h}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── LEADERSHIP ──────────────────────────────────────────────────────────────

function Leadership() {
  return (
    <section id="leadership" className="py-24" style={{ backgroundColor: 'var(--bg-muted)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Leadership" title="Engineering Leadership" subtitle="Organizing technical events, mentoring peers, and building engineering communities through IEEE and departmental initiatives." />
        <div className="grid md:grid-cols-3 gap-5">
          {LEADERSHIP.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="p-6 rounded-2xl h-full flex flex-col" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${item.color}` }}>
                <div className="mb-4">
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>{item.role}</h3>
                  <p className="text-xs font-semibold" style={{ color: item.color }}>{item.org}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>{item.period}</p>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-muted)' }}>{item.description}</p>
                <div className="mt-auto space-y-2">
                  {item.achievements.map(a => (
                    <div key={a} className="flex items-start gap-2 text-xs" style={{ color: 'var(--fg-muted)' }}>
                      <span className="font-bold mt-px" style={{ color: item.color }}>✓</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CERTIFICATIONS ──────────────────────────────────────────────────────────

function Certifications() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? CERTIFICATIONS : CERTIFICATIONS.filter(c => c.category === filter)

  return (
    <section id="certifications" className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Certifications" title="42+ Professional Certifications" subtitle="Verified credentials from Siemens, NPTEL IITs, Coursera, MathWorks, Google, Cisco, Rockwell Automation, and IEEE across all engineering domains." />
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CERT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: filter === cat ? 'var(--primary)' : 'var(--bg-muted)',
                color: filter === cat ? 'white' : 'var(--fg-muted)',
                border: `1px solid ${filter === cat ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cert, i) => (
            <FadeIn key={cert.id} delay={i * 40}>
              <div className="p-5 rounded-2xl flex flex-col h-full transition-all hover:scale-[1.02] hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-3" style={{ backgroundColor: cert.color }}>✓</div>
                <h4 className="text-sm font-bold mb-1 flex-1" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>{cert.name}</h4>
                <p className="text-xs mb-3" style={{ color: 'var(--fg-muted)' }}>{cert.org}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Tag color={cert.color}>{cert.category}</Tag>
                  <span className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>{cert.year}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

function Gallery() {
  const [lightbox, setLightbox] = useState<typeof GALLERY_IMAGES[0] | null>(null)

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  return (
    <section id="gallery" className="py-24" style={{ backgroundColor: 'var(--bg-muted)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Gallery" title="Engineering in Action" subtitle="Moments from labs, IEEE events, workshops, industrial visits, and engineering projects." />
        <div className="columns-2 md:columns-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <FadeIn key={img.id} delay={i * 45}>
              <div
                className="break-inside-avoid mb-4 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.015] hover:shadow-xl"
                onClick={() => setLightbox(img)}
                style={{ backgroundColor: '#CBD5E1' }}
              >
                <img src={img.src} alt={img.alt} className="w-full block" loading="lazy" />
                <div className="px-3 py-2.5" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>{img.alt}</p>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>{img.cat}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src.replace('w=500', 'w=1200').replace('h=380', 'h=900').replace('h=620', 'h=900').replace('h=360', 'h=700').replace('h=440', 'h=900').replace('h=560', 'h=900').replace('h=400', 'h=800').replace('h=340', 'h=700')} alt={lightbox.alt} className="w-full" />
            <div className="p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>{lightbox.alt}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>{lightbox.cat}</p>
            </div>
          </div>
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
            onClick={() => setLightbox(null)}
          >✕</button>
        </div>
      )}
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const inputStyle = {
    backgroundColor: 'var(--bg-muted)',
    border: '1px solid var(--border)',
    color: 'var(--fg)',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Contact" title="Let's Work Together" subtitle="Interested in collaborations, internship opportunities, or want to discuss engineering? I'd love to connect." />
        <div className="grid lg:grid-cols-5 gap-10">
          <FadeIn className="lg:col-span-2">
            <div className="space-y-3">
              {[
                { label: 'Email', value: 'sanjugrehi@gmail.com', color: '#2563EB', href: 'mailto:sanjugrehi@gmail.com', icon: '✉' },
                { label: 'LinkedIn', value: 'linkedin.com/in/sanjugrehi', color: '#0A66C2', href: 'https://linkedin.com', icon: 'in' },
                { label: 'GitHub', value: 'github.com/sanjugrehi', color: '#333', href: 'https://github.com', icon: '⌥' },
                { label: 'Location', value: 'Kerala, India', color: '#16A34A', href: null, icon: '◎' },
              ].map(({ label, value, color, href, icon }) => (
                <a
                  key={label}
                  href={href || undefined}
                  target={href ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.015]"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none', cursor: href ? 'pointer' : 'default' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: color }}>{icon}</div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--fg-muted)' }}>{label}</div>
                    <div className="text-xs font-medium" style={{ color: 'var(--fg)' }}>{value}</div>
                  </div>
                </a>
              ))}
              <div className="p-4 rounded-xl mt-2" style={{ backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)28' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>Actively seeking</p>
                <div className="space-y-1">
                  {['Summer 2026 Internships', 'Research Collaborations', 'IEEE Technical Events', 'Automation Projects'].map(t => (
                    <p key={t} className="text-xs" style={{ color: 'var(--primary)' }}>· {t}</p>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold mb-5" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>Send a Message</h3>
              {sent && (
                <div className="mb-4 p-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                  ✓ Message sent! I'll get back to you soon.
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { field: 'name', label: 'Name', placeholder: 'Your name', type: 'text' },
                  { field: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--fg-muted)' }}>{label}</label>
                    <input
                      type={type} required placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--fg-muted)' }}>Subject</label>
                <input type="text" placeholder="Internship opportunity / Collaboration / General inquiry"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--fg-muted)' }}>Message</label>
                <textarea
                  rows={4} required placeholder="Tell me about the opportunity or what you'd like to discuss..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                  style={inputStyle}
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
                {sent ? '✓ Sent!' : 'Send Message'}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-8 border-t" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #2563EB, #0EA5E9)' }}>SG</div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>Sanju Grehi</p>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Electrical & Electronics Engineering · Kerala, India</p>
            </div>
          </div>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {NAV_LINKS.slice(0, 6).map(link => (
              <button key={link} onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} className="text-xs transition-opacity hover:opacity-100" style={{ color: 'var(--fg)', opacity: 0.5 }}>{link}</button>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>© 2025 Sanju Grehi</p>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { dark, toggle } = useDarkMode()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Nav dark={dark} toggleDark={toggle} />
      <Hero />
      <Stats />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Experience />
      <Leadership />
      <Certifications />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}

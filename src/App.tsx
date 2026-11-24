import { useState, useEffect, useRef, type ReactNode } from "react"

// ─── DATA ────────────────────────────────────────────────────────────────────

const CAREER_SNAPSHOT = [
  { kicker: "Target role", value: "Embedded Systems & Firmware" },
  { kicker: "Specialization", value: "Robotics & Intelligent Systems" },
  { kicker: "Internship window", value: "January – June 2027" },
  { kicker: "Location preference", value: "Kerala first · India tech hubs" },
]

const SKILL_CATEGORIES = [
  {
    id: "project",
    label: "Demonstrated in Projects",
    status: "Project experience",
    icon: "01",
    color: "#2563EB",
    bg: "#EFF6FF",
    skills: [
      "Arduino-based prototyping",
      "C/C++ foundations",
      "ESP32 IoT integration",
      "RFID interfacing",
      "Sensor data acquisition",
      "MQTT communication",
    ],
    desc: "Technologies used across the RFID attendance and IoT energy-monitoring project work currently featured in this portfolio.",
  },
  {
    id: "core",
    label: "Core Embedded Skills",
    status: "Learning",
    icon: "02",
    color: "#7C3AED",
    bg: "#F5F3FF",
    skills: [
      "Embedded C/C++",
      "Microcontroller programming",
      "Hardware–software integration",
      "Firmware debugging",
    ],
    desc: "Highest-priority development areas for building a strong embedded and firmware engineering foundation.",
  },
  {
    id: "platforms",
    label: "Platforms & Interfaces",
    status: "Learning roadmap",
    icon: "03",
    color: "#0891B2",
    bg: "#ECFEFF",
    skills: [
      "ESP32",
      "STM32",
      "ARM Cortex-M",
      "GPIO",
      "Interrupts",
      "Timers",
      "ADC",
      "PWM",
      "UART",
      "SPI",
      "I²C",
      "CAN",
    ],
    desc: "Platforms and peripheral interfaces to learn or strengthen through practical firmware exercises and documented prototypes.",
  },
  {
    id: "specialization",
    label: "Specialization Areas",
    status: "Learning",
    icon: "04",
    color: "#16A34A",
    bg: "#F0FDF4",
    skills: [
      "RTOS concepts",
      "Automotive embedded systems",
      "EV electronics",
      "Robotics",
      "Sensors",
      "Motor control",
    ],
    desc: "Application areas connecting embedded firmware with robotics, intelligent systems, vehicles, EVs, and industrial products.",
  },
  {
    id: "future",
    label: "Future Learning",
    status: "Planned",
    icon: "05",
    color: "#DB2777",
    bg: "#FDF2F8",
    skills: [
      "ROS 2",
      "CAN FD",
      "UDS",
      "BMS concepts",
      "AUTOSAR fundamentals",
      "MATLAB/Simulink",
    ],
    desc: "Longer-term learning topics. These are roadmap items and are not presented as current proficiency.",
  },
  {
    id: "foundation",
    label: "Related EEE Foundation",
    status: "Academic / familiar with",
    icon: "06",
    color: "#D97706",
    bg: "#FFF7ED",
    skills: [
      "Circuit analysis",
      "Control systems",
      "Power electronics",
      "Electrical machines",
      "PLC/SCADA concepts",
      "Technical documentation",
    ],
    desc: "Related electrical engineering and control-system knowledge retained as supporting context rather than the primary career direction.",
  },
]

const PROJECTS = [
  {
    id: 1,
    title: "RFID-Based Smart Attendance System",
    category: "Embedded Systems",
    description:
      "A microcontroller project centered on RFID identification, local interaction, and attendance data logging.",
    problem:
      "Manual attendance tracking is error-prone, time-consuming, and susceptible to proxy attendance — causing administrative overhead and data inaccuracy in institutions.",
    solution:
      "Uses an Arduino, RFID reader, I²C LCD, and SD-card logging, with a supporting workflow for processing exported attendance data.",
    tags: ["Project experience", "Arduino", "RFID", "C/C++", "I²C"],
    color: "#2563EB",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "IoT Smart Energy Meter & Dashboard",
    category: "Embedded IoT",
    description:
      "An ESP32-based monitoring project connecting sensor acquisition, device communication, and a dashboard workflow.",
    problem:
      "Conventional meters lack real-time visibility and analytics, making it impossible for consumers to identify energy waste or optimize consumption patterns.",
    solution:
      "Uses a CT clamp sensor, ESP32, and MQTT publishing, with a dashboard for viewing energy data and trends.",
    tags: ["Project experience", "ESP32", "MQTT", "Sensor integration", "IoT"],
    color: "#16A34A",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "Adaptive Traffic Control System",
    category: "Control Systems",
    description:
      "A PLC-based control project exploring state logic, sensor inputs, adaptive timing, and operator visualization.",
    problem:
      "Fixed-time traffic signals cause unnecessary congestion and delay emergency response — a solvable problem with programmable logic and sensor inputs.",
    solution:
      "Uses ladder-logic state control, traffic-sensing inputs, priority behavior, and HMI visualization. It is presented as adjacent control-systems experience rather than firmware experience.",
    tags: [
      "Related experience",
      "Control logic",
      "Sensors",
      "State machines",
      "HMI",
    ],
    color: "#D97706",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format",
  },
]

const EDUCATION = [
  {
    year: "2023 – 2027",
    type: "education",
    highlight: true,
    title: "B.Tech – Electrical & Electronics Engineering",
    institution: "Sahrdaya College of Engineering & Technology",
    location: "Kerala, India",
    description:
      "Building an electrical engineering foundation while developing practical embedded-systems skills and a specialization direction in robotics and intelligent systems.",
  },
  {
    year: "Jan – Jun 2027",
    type: "goal",
    title: "Six-Month Internship Objective",
    institution: "Embedded systems, firmware, robotics, or IoT",
    location: "Kerala preferred · Open to Indian tech hubs",
    description:
      "Seeking a learning-intensive internship in Kochi or elsewhere in Kerala first, with openness to Bengaluru and other Indian technology hubs for strong technical mentorship and a worthwhile stipend.",
  },
]

const LEADERSHIP = [
  {
    role: "IEEE SPS Student Chapter Chair",
    org: "IEEE Signal Processing Society",
    period: "2025 – Present",
    description:
      "Coordinating technical activities and student engagement through an IEEE student chapter role.",
    achievements: [
      "Event coordination",
      "Team communication",
      "Technical-session planning",
    ],
    color: "#2563EB",
  },
  {
    role: "IEEE CSS Student Member",
    org: "IEEE Control Systems Society",
    period: "2024 – Present",
    description:
      "Participating in student technical activities connected to control systems and engineering knowledge sharing.",
    achievements: [
      "Technical discussions",
      "Presentation practice",
      "Collaborative documentation",
    ],
    color: "#7C3AED",
  },
  {
    role: "Technical Workshop Organizer",
    org: "Department of EEE",
    period: "2024 – Present",
    description:
      "Supporting department-level technical workshops and peer learning activities.",
    achievements: [
      "Workshop coordination",
      "Teamwork",
      "Participant communication",
    ],
    color: "#16A34A",
  },
]

const EXPERIENCE = [
  {
    title: "Industrial Training",
    company: "Kerala State Electricity Board (KSEB)",
    period: "Summer 2025",
    type: "Internship",
    description:
      "Industrial exposure to substation operations, protection systems, distribution equipment, and engineering safety practices.",
    highlights: [
      "Substation operations exposure",
      "Protection-system observation",
      "Technical note-taking",
      "Engineering safety awareness",
    ],
    color: "#2563EB",
  },
  {
    title: "Research Project – Solar PV System Design",
    company: "Department of EEE, Sahrdaya College of Engineering & Technology",
    period: "2024 – 2025",
    type: "Research",
    description:
      "Academic project work involving solar-PV system design and simulation, retained as evidence of structured engineering analysis and documentation.",
    highlights: [
      "Simulation workflow",
      "Design trade-offs",
      "Technical documentation",
      "Engineering analysis",
    ],
    color: "#16A34A",
  },
  {
    title: "Automation Lab Teaching Assistant",
    company: "Sahrdaya College of Engineering & Technology – EEE Department",
    period: "2024 – Present",
    type: "Academic",
    description:
      "Academic support work in automation labs, with emphasis on clear technical communication, lab organization, and documentation.",
    highlights: [
      "Lab support",
      "Peer communication",
      "Documentation",
      "Control-system context",
    ],
    color: "#D97706",
  },
]

const GALLERY_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=380&fit=crop&auto=format",
    alt: "Engineering workspace reference",
    cat: "Product Engineering",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=620&fit=crop&auto=format",
    alt: "Electric-energy technology reference",
    cat: "EV & Energy Systems",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=360&fit=crop&auto=format",
    alt: "Electronic hardware reference",
    cat: "Embedded Hardware",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=440&fit=crop&auto=format",
    alt: "Engineering team reference",
    cat: "Technical Collaboration",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&h=360&fit=crop&auto=format",
    alt: "Industrial electronics reference",
    cat: "Industrial Products",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=500&h=560&fit=crop&auto=format",
    alt: "Intelligent energy-system reference",
    cat: "Connected Systems",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=360&fit=crop&auto=format",
    alt: "Robotics technology reference",
    cat: "Robotics",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&h=400&fit=crop&auto=format",
    alt: "Firmware development reference",
    cat: "Embedded Development",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=340&fit=crop&auto=format",
    alt: "Technical teamwork reference",
    cat: "Engineering Teams",
  },
]

const NAV_LINKS = [
  "Home",
  "About",
  "Education",
  "Skills",
  "Projects",
  "Experience",
  "Leadership",
  "Certifications",
  "Gallery",
  "Contact",
]
const TYPE_COLORS: Record<string, string> = {
  education: "#2563EB",
  goal: "#16A34A",
}
const TYPE_LABELS: Record<string, string> = {
  education: "Education",
  goal: "Career Goal",
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true)
      },
      { threshold },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false
    const saved = localStorage.getItem("sg-theme")
    if (saved) return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("sg-theme", dark ? "dark" : "light")
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function Tag({
  children,
  color = "#2563EB",
}: {
  children: ReactNode
  color?: string
}) {
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}28`,
      }}
    >
      {children}
    </span>
  )
}

function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string
  title: string
  subtitle?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="text-center mb-16"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <span
        className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 inline-block"
        style={{
          color: "var(--primary)",
          backgroundColor: "var(--primary-light)",
        }}
      >
        {label}
      </span>
      <h2
        className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--fg)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--fg-muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
      style={{
        backgroundColor: "var(--bg-muted)",
        color: "var(--fg-muted)",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </button>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ dark, toggleDark }: { dark: boolean toggleDark: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  const navBg = scrolled
    ? dark
      ? "rgba(15,23,42,0.92)"
      : "rgba(248,250,252,0.92)"
    : "transparent"

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBg,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
              }}
            >
              SG
            </div>
            <span
              className="font-bold text-sm hidden sm:block"
              style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}
            >
              Sanju Grehi
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-xs font-medium transition-all hover:opacity-100"
                style={{ color: "var(--fg)", opacity: 0.6 }}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <IconBtn onClick={toggleDark} title="Toggle theme">
              {dark ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </IconBtn>
            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--fg)",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="lg:hidden border-t px-4 pb-4 pt-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          <div className="grid grid-cols-2 gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "var(--fg)", backgroundColor: "transparent" }}
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
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, var(--bg) 25%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 lg:py-36 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-8"
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                border: "1px solid var(--primary)28",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "var(--primary)",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              Seeking a six-month internship · Jan–Jun 2027
            </div>

            <h1
              className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-none mb-3"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--fg)",
                letterSpacing: "-0.03em",
              }}
            >
              Sanju<span style={{ color: "var(--primary)" }}> Grehi</span>
            </h1>
            <p
              className="text-lg font-semibold mb-2"
              style={{
                color: "var(--fg)",
                fontFamily: "var(--font-display)",
                opacity: 0.65,
              }}
            >
              Aspiring Embedded Systems & Firmware Engineer
            </p>
            <p
              className="text-sm font-semibold tracking-wide mb-8"
              style={{ color: "var(--secondary)" }}
            >
              Robotics & Intelligent Systems · Automotive · EV · Industrial
              Products
            </p>
            <p
              className="text-sm leading-7 mb-10 max-w-lg"
              style={{ color: "var(--fg-muted)" }}
            >
              Electrical and Electronics Engineering undergraduate at Sahrdaya
              College of Engineering & Technology, building practical skills in
              microcontrollers, hardware–software integration, and firmware
              development.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {[
                {
                  label: "Discuss an Internship",
                  primary: true,
                  action: () =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  label: "View Projects",
                  primary: false,
                  action: () =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  label: "Explore Skills",
                  primary: false,
                  action: () =>
                    document
                      .getElementById("skills")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
              ].map(({ label, primary, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                  style={
                    primary
                      ? {
                          background:
                            "linear-gradient(135deg, #2563EB, #1D4ED8)",
                          color: "white",
                          boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                        }
                      : {
                          backgroundColor: "var(--bg-card)",
                          color: "var(--fg)",
                          border: "1px solid var(--border)",
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/sanjugrehi",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com/in/sanjugrehi",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: "Email",
                  href: "mailto:sanjugrehi@gmail.com",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{
                    color: "var(--fg-muted)",
                    backgroundColor: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                  }}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Profile card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #2563EB15, #0EA5E915)",
                  border: "1px solid var(--border)",
                }}
              />
              <div
                className="relative w-72 sm:w-80 rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex justify-center mb-5">
                  <div
                    className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-bold text-4xl"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
                      boxShadow: "0 12px 40px rgba(37,99,235,0.35)",
                    }}
                  >
                    SG
                  </div>
                </div>
                <div className="text-center mb-5">
                  <h3
                    className="font-bold text-lg"
                    style={{
                      color: "var(--fg)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Sanju Grehi
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    B.Tech EEE · 2024–2028
                  </p>
                </div>
                <div
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs font-semibold"
                  style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Internship target · Jan–Jun 2027
                </div>
                <div className="space-y-2.5">
                  {[
                    ["Target", "Embedded / Firmware"],
                    ["Specialization", "Robotics & Intelligent Systems"],
                    ["Education", "B.Tech EEE · 2024–2028"],
                    ["Preference", "Kerala first"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-1.5 border-b text-xs last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span style={{ color: "var(--fg-muted)" }}>{label}</span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--fg)" }}
                      >
                        {value}
                      </span>
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
        <span
          className="text-xs"
          style={{ color: "var(--fg-muted)", opacity: 0.6 }}
        >
          Scroll
        </span>
        <div
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{
              backgroundColor: "var(--primary)",
              animation: "scrollDot 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function SnapshotCard({
  kicker,
  value,
  delay,
}: {
  kicker: string
  value: string
  delay: number
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="text-center p-5 rounded-2xl transition-all hover:scale-105"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2"
        style={{ color: "var(--primary)" }}
      >
        {kicker}
      </div>
      <div
        className="text-sm font-bold leading-snug"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg)" }}
      >
        {value}
      </div>
    </div>
  )
}

function Stats() {
  return (
    <section
      className="py-14 border-y"
      style={{
        backgroundColor: "var(--bg-muted)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAREER_SNAPSHOT.map((item, i) => (
            <SnapshotCard key={item.kicker} {...item} delay={i * 75} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section
      id="about"
      className="py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Professional Summary"
          title="Building Toward Embedded Engineering"
          subtitle="An EEE foundation, a practical embedded-systems learning path, and a clear internship objective for 2027."
        />
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}
            >
              Career Direction
            </h3>
            <div
              className="space-y-4 text-sm leading-7"
              style={{ color: "var(--fg-muted)" }}
            >
              <p>
                I'm Sanju Grehi, an Electrical and Electronics Engineering
                undergraduate at Sahrdaya College of Engineering & Technology,
                Kerala, preparing for a career in embedded systems and firmware
                engineering.
              </p>
              <p>
                My current direction is to strengthen Embedded C/C++,
                microcontroller programming, hardware–software integration, and
                debugging through focused learning and practical projects. My
                featured work includes Arduino, RFID, ESP32, sensors, and
                MQTT-based systems.
              </p>
              <p>
                I am seeking a six-month internship from January to June 2027 in
                embedded systems, firmware, robotics, or IoT. I prefer Kochi or
                elsewhere in Kerala first, while remaining open to Bengaluru and
                other Indian technology hubs when the role offers strong
                technical learning and a worthwhile stipend.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                [
                  "Primary Direction",
                  "Embedded systems and firmware engineering",
                ],
                ["Specialization", "Robotics and intelligent systems"],
                ["Industry Context", "Automotive, EV, and industrial products"],
                [
                  "Internship Objective",
                  "Six months from January to June 2027",
                ],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="text-xs font-bold mb-1"
                    style={{ color: "var(--fg)" }}
                  >
                    {title}
                  </div>
                  <div
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="space-y-4">
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Demonstrated in Existing Projects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Arduino prototyping",
                    "ESP32 integration",
                    "RFID interfacing",
                    "Sensor acquisition",
                    "MQTT communication",
                  ].map((t) => (
                    <Tag key={t} color="#2563EB">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Currently Learning
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Embedded C/C++",
                    "Microcontroller programming",
                    "Hardware–software integration",
                    "Firmware debugging",
                    "STM32 / ARM Cortex-M",
                  ].map((t) => (
                    <Tag key={t} color="#7C3AED">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Career Vision
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Develop reliable embedded and intelligent systems for
                  vehicles, electric mobility, robotics, and industrial
                  products—growing from strong firmware fundamentals into
                  real-time and safety-aware engineering.
                </p>
              </div>
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Employers & Sectors to Explore
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Bytebeam",
                    "Navalt Green Mobility",
                    "Automotive & EV",
                    "Robotics companies",
                    "Industrial product teams",
                    "Embedded product startups",
                  ].map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--fg-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p
                  className="text-xs leading-relaxed mt-3"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Research preferences only; no application, offer, employment,
                  or affiliation is implied.
                </p>
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
    <section
      id="education"
      className="py-24"
      style={{ backgroundColor: "var(--bg-muted)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Timeline"
          title="Education & Internship Objective"
          subtitle="The academic foundation and next practical step supporting an embedded and firmware career."
        />
        <div className="relative">
          <div
            className="absolute left-5 top-2 bottom-2 w-px"
            style={{ backgroundColor: "var(--border)" }}
          />
          <div className="space-y-6">
            {EDUCATION.map((item, i) => (
              <FadeIn key={i} delay={i * 90}>
                <div className="relative flex gap-6 pl-14">
                  <div
                    className="absolute left-3.5 top-4 w-3 h-3 rounded-full -translate-x-1/2"
                    style={{
                      backgroundColor: TYPE_COLORS[item.type],
                      boxShadow: `0 0 0 3px var(--bg-muted), 0 0 0 5px ${TYPE_COLORS[item.type]}40`,
                    }}
                  />
                  <div
                    className="flex-1 p-5 rounded-2xl"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderLeft: `3px solid ${TYPE_COLORS[item.type]}`,
                      boxShadow: item.highlight
                        ? `0 4px 24px ${TYPE_COLORS[item.type]}18`
                        : "var(--shadow-sm)",
                    }}
                  >
                    <div className="flex flex-wrap justify-between gap-2 mb-1.5">
                      <div>
                        <h3
                          className="text-sm font-bold"
                          style={{
                            color: "var(--fg)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          {item.institution} · {item.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: TYPE_COLORS[item.type],
                            backgroundColor: `${TYPE_COLORS[item.type]}15`,
                          }}
                        >
                          {TYPE_LABELS[item.type]}
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          {item.year}
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {item.description}
                    </p>
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
  const cat = SKILL_CATEGORIES.find((c) => c.id === active)

  return (
    <section
      id="skills"
      className="py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Technical Skills"
          title="Prioritized Learning Map"
          subtitle="Skills are separated by evidence and learning stage so roadmap items are not mistaken for professional proficiency."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {SKILL_CATEGORIES.map((c, i) => (
            <FadeIn key={c.id} delay={i * 55}>
              <button
                onClick={() => setActive(active === c.id ? null : c.id)}
                className="w-full text-left p-5 rounded-2xl transition-all hover:scale-[1.025]"
                style={{
                  backgroundColor: active === c.id ? c.color : "var(--bg-card)",
                  border: `1px solid ${
                    active === c.id ? c.color : "var(--border)"
                  }`,
                  boxShadow:
                    active === c.id
                      ? `0 8px 32px ${c.color}35`
                      : "var(--shadow-sm)",
                  cursor: "pointer",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xs font-bold"
                  style={{
                    backgroundColor:
                      active === c.id ? "rgba(255,255,255,0.2)" : c.bg,
                    color: active === c.id ? "white" : c.color,
                  }}
                >
                  {c.icon}
                </div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{
                    color: active === c.id ? "white" : "var(--fg)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {c.label}
                </h3>
                <p
                  className="text-xs"
                  style={{
                    color: active === c.id ? "rgba(255,255,255,0.72)" : c.color,
                  }}
                >
                  {c.status}
                </p>
              </button>
            </FadeIn>
          ))}
        </div>

        {cat && (
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: "var(--bg-card)",
              border: `1px solid ${cat.color}35`,
              boxShadow: `0 8px 32px ${cat.color}12`,
              animation: "fadeInUp 0.3s ease",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="font-bold text-base"
                    style={{
                      color: "var(--fg)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {cat.label}
                  </h3>
                  <Tag color={cat.color}>{cat.status}</Tag>
                </div>
                <p
                  className="text-xs mt-1 max-w-lg"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {cat.desc}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  color: "var(--fg-muted)",
                  backgroundColor: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: `${cat.color}12`,
                    color: cat.color,
                    border: `1px solid ${cat.color}22`,
                  }}
                >
                  {skill}
                </span>
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
    <section
      id="projects"
      className="py-24"
      style={{ backgroundColor: "var(--bg-muted)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Portfolio"
          title="Relevant Existing Projects"
          subtitle="Embedded and control-oriented work prioritized for the new career direction, with clear separation between firmware-adjacent and control-systems experience."
        />
        <div className="space-y-5">
          {PROJECTS.map((p, i) => (
            <FadeIn key={p.id} delay={i * 70}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow:
                    expanded === p.id ? "var(--shadow-lg)" : "var(--shadow-sm)",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                <div
                  className="grid md:grid-cols-3 cursor-pointer"
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                >
                  <div
                    className="relative h-48 md:h-auto overflow-hidden"
                    style={{ backgroundColor: "#CBD5E1" }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      style={{ opacity: 0.88, transition: "opacity 0.3s" }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${p.color}28, transparent)`,
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Tag color={p.color}>{p.category}</Tag>
                    </div>
                  </div>
                  <div className="md:col-span-2 p-6 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-base font-bold mb-2"
                        style={{
                          color: "var(--fg)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <Tag key={t} color={p.color}>
                            {t}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    <div
                      className="flex items-center justify-between mt-4 pt-4"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        {expanded === p.id
                          ? "Click to collapse"
                          : "Click to see full technical details"}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: p.color }}
                      >
                        {expanded === p.id ? "↑ Collapse" : "↓ Expand"}
                      </span>
                    </div>
                  </div>
                </div>
                {expanded === p.id && (
                  <div
                    className="px-6 pb-6 border-t pt-5"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <h4
                          className="text-xs font-bold uppercase tracking-widest mb-2"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          Problem Statement
                        </h4>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--fg)" }}
                        >
                          {p.problem}
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <h4
                          className="text-xs font-bold uppercase tracking-widest mb-2"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          Engineering Solution
                        </h4>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--fg)" }}
                        >
                          {p.solution}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span
                        className="px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{
                          color: "var(--fg-muted)",
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        Documentation link not provided
                      </span>
                      <span
                        className="px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{
                          color: "var(--fg-muted)",
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        Repository link not provided
                      </span>
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
    <section
      id="experience"
      className="py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Experience"
          title="Engineering & Academic Experience"
          subtitle="Existing training and academic contributions reframed around transferable technical analysis, documentation, teamwork, and problem-solving."
        />
        <div className="space-y-5">
          {EXPERIENCE.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: "var(--fg)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {item.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Tag color={item.color}>{item.type}</Tag>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {item.period}
                    </span>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--fg-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {h}
                    </span>
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
    <section
      id="leadership"
      className="py-24"
      style={{ backgroundColor: "var(--bg-muted)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Leadership"
          title="Teamwork Beyond the Lab"
          subtitle="Existing student leadership retained for the communication, coordination, and documentation skills valued in engineering teams."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {LEADERSHIP.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div
                className="p-6 rounded-2xl h-full flex flex-col"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderTop: `3px solid ${item.color}`,
                }}
              >
                <div className="mb-4">
                  <h3
                    className="font-bold text-sm mb-1"
                    style={{
                      color: "var(--fg)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {item.role}
                  </h3>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: item.color }}
                  >
                    {item.org}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {item.period}
                  </p>
                </div>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {item.description}
                </p>
                <div className="mt-auto space-y-2">
                  {item.achievements.map((a) => (
                    <div
                      key={a}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      <span
                        className="font-bold mt-px"
                        style={{ color: item.color }}
                      >
                        —
                      </span>
                      {a}
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
  return (
    <section
      id="certifications"
      className="py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Certifications"
          title="Verified Credentials"
          subtitle="Only confirmed, relevant credentials will be shown here."
        />
        <FadeIn>
          <div
            className="p-8 rounded-2xl text-center"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--primary)" }}
            >
              Confirmation needed
            </div>
            <h3
              className="font-bold mb-2"
              style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}
            >
              No verified certifications are currently listed
            </h3>
            <p
              className="text-sm leading-relaxed max-w-xl mx-auto"
              style={{ color: "var(--fg-muted)" }}
            >
              Relevant certification names, issuing organizations, dates, and
              credential links can be added after they are confirmed.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

function Gallery() {
  const [lightbox, setLightbox] = useState<typeof GALLERY_IMAGES[0] | null>(
    null,
  )

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null)
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [])

  return (
    <section
      id="gallery"
      className="py-24"
      style={{ backgroundColor: "var(--bg-muted)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Visual Library"
          title="Engineering Interests"
          subtitle="Reference imagery representing embedded hardware, mobility, robotics, and engineering teamwork—not personal project documentation."
        />
        <div className="columns-2 md:columns-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <FadeIn key={img.id} delay={i * 45}>
              <div
                className="break-inside-avoid mb-4 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.015] hover:shadow-xl"
                onClick={() => setLightbox(img)}
                style={{ backgroundColor: "#CBD5E1" }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full block"
                  loading="lazy"
                />
                <div
                  className="px-3 py-2.5"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--fg)" }}
                  >
                    {img.alt}
                  </p>
                  <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                    {img.cat}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-3xl w-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src
                .replace("w=500", "w=1200")
                .replace("h=380", "h=900")
                .replace("h=620", "h=900")
                .replace("h=360", "h=700")
                .replace("h=440", "h=900")
                .replace("h=560", "h=900")
                .replace("h=400", "h=800")
                .replace("h=340", "h=700")}
              alt={lightbox.alt}
              className="w-full"
            />
            <div className="p-4" style={{ backgroundColor: "var(--bg-card)" }}>
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--fg)" }}
              >
                {lightbox.alt}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--fg-muted)" }}
              >
                {lightbox.cat}
              </p>
            </div>
          </div>
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(
      form.subject || "Embedded / firmware internship conversation",
    )
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    )
    window.location.href = `mailto:sanjugrehi@gmail.com?subject=${subject}&body=${body}`
  }

  const inputStyle = {
    backgroundColor: "var(--bg-muted)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
    outline: "none",
    transition: "border-color 0.2s",
  }

  return (
    <section
      id="contact"
      className="py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Contact"
          title="Start an Engineering Conversation"
          subtitle="Recruiters and engineering teams are welcome to discuss six-month embedded, firmware, robotics, or IoT internship opportunities for January–June 2027."
        />
        <div className="grid lg:grid-cols-5 gap-10">
          <FadeIn className="lg:col-span-2">
            <div className="space-y-3">
              {[
                {
                  label: "Email",
                  value: "sanjugrehi@gmail.com",
                  color: "#2563EB",
                  href: "mailto:sanjugrehi@gmail.com",
                  icon: "E",
                },
                {
                  label: "LinkedIn",
                  value: "linkedin.com/in/sanju-grehi",
                  color: "#0A66C2",
                  href: "https://linkedin.com/in/sanju-grehi",
                  icon: "in",
                },
                {
                  label: "GitHub",
                  value: "github.com/sanjugrehi",
                  color: "#333",
                  href: "https://github.com/sanjugrehi",
                  icon: "GH",
                },
                {
                  label: "Location",
                  value: "Kerala, India",
                  color: "#16A34A",
                  href: null,
                  icon: "IN",
                },
              ].map(({ label, value, color, href, icon }) => (
                <a
                  key={label}
                  href={href || undefined}
                  target={href ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.015]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    cursor: href ? "pointer" : "default",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: "var(--fg)" }}
                    >
                      {value}
                    </div>
                  </div>
                </a>
              ))}
              <div
                className="p-4 rounded-xl mt-2"
                style={{
                  backgroundColor: "var(--primary-light)",
                  border: "1px solid var(--primary)28",
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "var(--primary)" }}
                >
                  Actively seeking
                </p>
                <div className="space-y-1">
                  {[
                    "Embedded Systems Intern",
                    "Firmware Engineering Intern",
                    "Robotics Intern",
                    "IoT / Embedded Systems Intern",
                  ].map((t) => (
                    <p
                      key={t}
                      className="text-xs"
                      style={{ color: "var(--primary)" }}
                    >
                      · {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-bold mb-2"
                style={{
                  color: "var(--fg)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Draft an Email
              </h3>
              <p
                className="text-xs leading-relaxed mb-5"
                style={{ color: "var(--fg-muted)" }}
              >
                Submitting this form opens your email app with the message
                prefilled. The website does not store or send form data.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  {
                    field: "name",
                    label: "Name",
                    placeholder: "Your name",
                    type: "text",
                  },
                  {
                    field: "email",
                    label: "Email",
                    placeholder: "your@email.com",
                    type: "email",
                  },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[(field as keyof typeof form)]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Internship opportunity / Collaboration / General inquiry"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={inputStyle}
                />
              </div>
              <div className="mb-5">
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about the opportunity or what you'd like to discuss..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                }}
              >
                Open Email Draft
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
    <footer
      className="py-8 border-t"
      style={{
        backgroundColor: "var(--bg-muted)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
              }}
            >
              SG
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{
                  color: "var(--fg)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Sanju Grehi
              </p>
              <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                Embedded Systems & Firmware · Kerala, India
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {NAV_LINKS.slice(0, 6).map((link) => (
              <button
                key={link}
                onClick={() =>
                  document
                    .getElementById(link.toLowerCase())
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-xs transition-opacity hover:opacity-100"
                style={{ color: "var(--fg)", opacity: 0.5 }}
              >
                {link}
              </button>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
            © 2026 Sanju Grehi
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { dark, toggle } = useDarkMode()

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--fg)",
      }}
    >
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

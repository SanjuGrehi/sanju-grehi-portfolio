import { useState, useEffect } from "react"
import { Hardware3D, BOARD_PINS, type PinInfo } from "./components/Hardware3D"
import { LogicAnalyzer } from "./components/LogicAnalyzer"
import { InteractiveProjects } from "./components/InteractiveProjects"
import { EngineeringTerminal } from "./components/EngineeringTerminal"
import { CertificationsSection } from "./components/CertificationsSection"

// ─── SKILL TAXONOMY ──────────────────────────────────────────────────────────

const SKILL_DOMAINS = [
  {
    title: "Core Embedded & Firmware",
    category: "FIRMWARE_CORE",
    desc: "Low-level deterministic systems programming and bare-metal hardware control.",
    color: "#2563eb",
    skills: [
      { name: "Embedded C", level: "Primary Language", note: "Pointers, memory management, bitwise manipulation" },
      { name: "C++ for Embedded", level: "Firmware Core", note: "OOP abstractions, templates, zero-cost drivers" },
      { name: "Microcontroller Programming", level: "Hardware Direct", note: "Registers, clock tree configuration, bare-metal" },
      { name: "Firmware Debugging", level: "Instrumentation", note: "GDB, SWD/JTAG, logic analysis, UART logging" },
    ],
  },
  {
    title: "Platforms & Architectures",
    category: "SILICON_PLATFORMS",
    desc: "Target microcontrollers and silicon architectures used across projects.",
    color: "#0891b2",
    skills: [
      { name: "STM32 (ARM Cortex-M4)", level: "32-bit Architecture", note: "NVIC interrupts, DMA, hardware timers, ADC" },
      { name: "ESP32 / ESP32-S3", level: "Dual-Core IoT", note: "Wi-Fi/BLE stacks, FreeRTOS tasks, MQTT clients" },
      { name: "Arduino (ATmega328P)", level: "Prototyping", note: "Rapid hardware verification and peripheral testing" },
      { name: "Raspberry Pi / Linux", level: "Embedded Linux", note: "Shell scripting, Python automation, serial bridges" },
    ],
  },
  {
    title: "Buses & Peripheral Protocols",
    category: "COMM_PROTOCOLS",
    desc: "Inter-chip and subsystem communication standards.",
    color: "#16a34a",
    skills: [
      { name: "UART / USART", level: "Serial Comms", note: "115200 baud, framing, ring buffers, interrupts" },
      { name: "SPI Bus", level: "Synchronous High-Speed", note: "10-25 MHz SD card logging, display drivers, sensors" },
      { name: "I2C Bus", level: "Multi-Drop 2-Wire", note: "100k/400k Fast-mode, OLED, LCD, IMU interfacing" },
      { name: "CAN 2.0B", level: "Automotive / Robotics", note: "Differential signaling, identifier arbitration, CRC" },
      { name: "GPIO / Timers / PWM", level: "Hardware Peripherals", note: "Input capture, edge triggers, motor driver PWM" },
      { name: "ADC & Sensor Interfacing", level: "Mixed Signal", note: "12-bit SAR, CT clamps, thermistors, analog conditioning" },
    ],
  },
  {
    title: "Specialization & Systems",
    category: "SYSTEMS_INTEGRATION",
    desc: "Connecting embedded firmware with intelligent systems and real-world machinery.",
    color: "#d97706",
    skills: [
      { name: "FreeRTOS Concepts", level: "Real-Time OS", note: "Task scheduling, queues, semaphores, mutexes" },
      { name: "Robotics & Actuation", level: "Mechatronics", note: "DC/Servo motors, encoder feedback, kinematics" },
      { name: "Industrial Automation & PLC", level: "Control Systems", note: "Ladder logic, safety interlocks, sensor automation" },
      { name: "Electric Vehicle Systems", level: "Powertrain / BMS", note: "Battery telemetry, high-voltage sensing, CAN nodes" },
    ],
  },
]

export default function App() {
  const [dark, setDark] = useState(true)
  const [activePin, setActivePin] = useState<PinInfo>(BOARD_PINS[2]) // PA5 PWM default
  const [isPowered, setIsPowered] = useState(true)
  const [firmwareMode, setFirmwareMode] = useState("RTOS_SCHEDULER")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ─── SYSTEM TOP TELEMETRY BAR ────────────────────────────────────────── */}
      <div className="w-full bg-slate-900 border-b border-slate-800 text-[11px] font-mono px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-bold">PORTFOLIO NODE ONLINE</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">B.TECH EEE (2024–2028) · SAHRDAYA CET</span>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="text-cyan-400 hidden md:inline">INTERNSHIP TARGET: JAN–JUN 2027</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 hidden lg:inline">LOCATION: THexampleR / KERALA, INDIA</span>
          <span className="text-slate-700 hidden lg:inline">|</span>
          <span className="text-emerald-400 font-semibold">20 VERIFIED CREDENTIALS</span>
        </div>
      </div>

      {/* ─── MAIN NAVIGATION ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm shadow-inner">
              SG
            </div>
            <div>
              <div className="font-bold text-slate-100 text-sm tracking-tight leading-tight">SANJU GREHI</div>
              <div className="text-[10px] font-mono text-slate-400 leading-none">EMBEDDED &amp; FIRMWARE</div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-slate-300">
            <button onClick={() => scrollTo("workbench")} className="hover:text-cyan-400 transition-colors">
              3D WORKBENCH
            </button>
            <button onClick={() => scrollTo("projects")} className="hover:text-cyan-400 transition-colors">
              HARDWARE LAB
            </button>
            <button onClick={() => scrollTo("skills")} className="hover:text-cyan-400 transition-colors">
              SKILLS MATRIX
            </button>
            <button onClick={() => scrollTo("education")} className="hover:text-cyan-400 transition-colors">
              EDUCATION &amp; INTERNSHIP
            </button>
            <button onClick={() => scrollTo("certifications")} className="hover:text-cyan-400 transition-colors">
              CERTIFICATIONS (20)
            </button>
            <button onClick={() => scrollTo("terminal")} className="hover:text-cyan-400 transition-colors">
              CLI TERMINAL
            </button>
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollTo("contact")}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/80 text-cyan-300 text-xs font-mono font-semibold hover:bg-cyan-900/80 transition-all hidden sm:inline-flex"
            >
              CONTACT
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-2 font-mono text-xs">
            <button
              onClick={() => scrollTo("workbench")}
              className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400"
            >
              &gt; 3D WORKBENCH
            </button>
            <button
              onClick={() => scrollTo("projects")}
              className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400"
            >
              &gt; HARDWARE LAB
            </button>
            <button
              onClick={() => scrollTo("skills")}
              className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400"
            >
              &gt; SKILLS MATRIX
            </button>
            <button
              onClick={() => scrollTo("education")}
              className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400"
            >
              &gt; EDUCATION &amp; INTERNSHIP
            </button>
            <button
              onClick={() => scrollTo("certifications")}
              className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400"
            >
              &gt; CERTIFICATIONS (20)
            </button>
            <button
              onClick={() => scrollTo("terminal")}
              className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400"
            >
              &gt; CLI TERMINAL
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="block w-full text-left py-2 text-cyan-400 font-bold"
            >
              &gt; CONTACT / HIRE
            </button>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Headlines & Pitch */}
            <div className="lg:col-span-7 space-y-6">
              {/* Engineering Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-300">
                  ELECTRICAL &amp; ELECTRONICS ENGINEERING · 2024–2028
                </span>
              </div>

              {/* Main Name & Title */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-none">
                  Sanju Grehi
                </h1>
                <div className="text-lg sm:text-xl font-mono text-cyan-400 mt-3 font-semibold">
                  Embedded Systems, Firmware &amp; Robotics Engineer
                </div>
              </div>

              {/* Concise Human Technical Summary */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                B.Tech EEE undergraduate at Sahrdaya College of Engineering &amp; Technology, Kerala.
                I build practical embedded hardware and firmware in Embedded C/C++, focusing on microcontroller
                programming (STM32, ESP32, ARM Cortex-M), bus protocols (CAN, SPI, I2C, UART), and intelligent robotics.
              </p>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">DEGREE WINDOW</div>
                  <div className="text-slate-200 font-bold mt-0.5">2024 – 2028</div>
                  <div className="text-slate-400 text-[10px]">B.Tech EEE</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">INTERNSHIP</div>
                  <div className="text-cyan-400 font-bold mt-0.5">JAN – JUN 2027</div>
                  <div className="text-slate-400 text-[10px]">6 Months Full-Time</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">CREDENTIALS</div>
                  <div className="text-emerald-400 font-bold mt-0.5">20 VERIFIED</div>
                  <div className="text-slate-400 text-[10px]">IEEE, NIELIT, KSEB</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">LOCATION</div>
                  <div className="text-amber-400 font-bold mt-0.5">KERALA / TECH HUBS</div>
                  <div className="text-slate-400 text-[10px]">Kerala First · BLR</div>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => scrollTo("workbench")}
                  className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-950 flex items-center gap-2"
                >
                  <span>TEST 3D HARDWARE</span>
                  <span>&darr;</span>
                </button>
                <button
                  onClick={() => scrollTo("projects")}
                  className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-850 hover:border-slate-600 transition-all"
                >
                  EXPLORE PROJECTS
                </button>
                <a
                  href="https://github.com/SanjuGrehi"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all"
                >
                  GITHUB
                </a>
                <a
                  href="https://linkedin.com/in/sanju-grehi-b4618731b"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all"
                >
                  LINKEDIN
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Hardware Summary Badge */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">HARDWARE SPEC SHEET</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
                    TESTED PROTOTYPES
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">CORE SILICON:</span>
                    <span className="text-slate-100 font-bold text-right">STM32F401 (Cortex-M4) &amp; ESP32</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">CLOCK SPEEDS:</span>
                    <span className="text-slate-100 text-right">84 MHz (STM32) / 240 MHz (ESP32)</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">BUS PROTOCOLS:</span>
                    <span className="text-cyan-400 font-semibold text-right">CAN 2.0B · SPI · I2C · UART · MQTT</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">KEY HARDWARE:</span>
                    <span className="text-slate-200 text-right">CT Clamp Sensors, RFID Transponders, PLC Logic</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">AWARDS:</span>
                    <span className="text-emerald-400 font-bold text-right">Best Project Award (E-Savu, 2024-25)</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">LEADERSHIP:</span>
                    <span className="text-slate-200 text-right">Secretary, IEEE Signal Processing Society '25</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>DEV ENVIRONMENT: GCC / ST-LINK / ESP-IDF</span>
                  <span className="text-cyan-400">100% HAND-CRAFTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: 3D HARDWARE WORKBENCH + LOGIC ANALYZER ───────────────── */}
      <section id="workbench" className="py-20 sm:py-24 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>INTERACTIVE 3D SILICON BENCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              STM32 Embedded Development Board &amp; Signal Inspector
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              Drag to rotate the 3D development board in 360-degree space, zoom in to inspect SMD components,
              and click any gold pin header to attach the digital logic probe. Watch the real-time oscilloscope
              waveform respond to your selected pin and firmware mode.
            </p>
          </div>

          {/* 3D Board and Logic Analyzer in Two Columns or Stacked */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* 3D Board Canvas (7 Cols) */}
            <div className="lg:col-span-7">
              <Hardware3D
                activePin={activePin}
                onSelectPin={(pin) => setActivePin(pin)}
                isPowered={isPowered}
                onTogglePower={() => setIsPowered(!isPowered)}
                firmwareMode={firmwareMode}
                onChangeMode={(mode) => setFirmwareMode(mode)}
              />
            </div>

            {/* Companion Logic Analyzer (5 Cols) */}
            <div className="lg:col-span-5">
              <LogicAnalyzer activePin={activePin} isPowered={isPowered} firmwareMode={firmwareMode} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: INTERACTIVE PROJECTS LAB ─────────────────────────────── */}
      <section id="projects" className="py-20 sm:py-24 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HARDWARE SIMULATION LAB</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Interactive Engineering Prototypes
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              Test out the three flagship projects built during B.Tech coursework: swipe RFID tags,
              toggle electrical loads on the smart energy meter, or trigger vehicle density and emergency
              preemption on the adaptive traffic PLC.
            </p>
          </div>

          {/* Interactive Project Simulators Component */}
          <InteractiveProjects />
        </div>
      </section>

      {/* ─── SECTION 3: SKILLS MATRIX ────────────────────────────────────────── */}
      <section id="skills" className="py-20 sm:py-24 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>SYSTEMATIC CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Engineering Skills &amp; Domain Knowledge
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
              Divided into practical embedded competencies, targeted platforms, hardware buses,
              and control systems foundations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {SKILL_DOMAINS.map((domain, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
                    <span className="font-bold text-slate-200 uppercase tracking-wider">{domain.title}</span>
                    <span className="text-[10px] text-slate-400">{domain.category}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-2.5 leading-relaxed">{domain.desc}</p>

                  <div className="mt-5 space-y-3">
                    {domain.skills.map((skill, si) => (
                      <div
                        key={si}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                      >
                        <div>
                          <div className="font-bold text-slate-100 text-xs font-mono">{skill.name}</div>
                          <div className="text-[11px] text-slate-400 leading-tight">{skill.note}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-cyan-400 border border-slate-800 shrink-0 self-start sm:self-center">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: EDUCATION & INTERNSHIP OBJECTIVE ──────────────────────── */}
      <section id="education" className="py-20 sm:py-24 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left: Academic Credentials */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>ACADEMIC FOUNDATION</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                  Education &amp; Institution
                </h2>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Bachelor of Technology (B.Tech)
                    </h3>
                    <div className="text-cyan-400 font-mono text-xs mt-0.5">
                      Electrical &amp; Electronics Engineering
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700">
                    2024 – 2028
                  </span>
                </div>

                <div className="text-slate-300 text-xs font-mono">
                  Sahrdaya College of Engineering &amp; Technology
                  <div className="text-slate-500 text-[11px]">Autonomous · Irinjalakuda, Kodakara P.O., Kerala, India</div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed pt-2 border-t border-slate-800">
                  Comprehensive grounding in circuit analysis, control systems, power electronics,
                  microcontroller interfacing, and robotics. Actively involved in IEEE student branch
                  leadership as Secretary of IEEE Signal Processing Society (Execom '25).
                </p>
              </div>
            </div>

            {/* Right: 6-Month Internship Plan */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>CAREER HORIZON</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                  Six-Month Internship Objective
                </h2>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-slate-300 font-bold">TARGET: JANUARY – JUNE 2027</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    6 MONTHS DURATION
                  </span>
                </div>

                <div className="space-y-3 text-slate-300">
                  <div>
                    <div className="text-slate-500 text-[10px]">TARGET ROLES:</div>
                    <div className="font-bold text-slate-100 mt-0.5">
                      Embedded Systems Intern · Firmware Engineer Intern · Robotics Intern
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">GEOGRAPHIC PREFERENCE:</div>
                    <div className="text-slate-200 mt-0.5">
                      Kerala (Kochi / Thrissur) preferred initially · Open to Bengaluru &amp; Indian technology hubs for strong technical mentorship.
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">CORE VALUE PROPOSITION:</div>
                    <div className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                      Hands-on capability in microcontroller debugging, peripheral drivers (UART, SPI, I2C, CAN),
                      circuit prototyping, and willingness to tackle demanding bare-metal and real-time firmware tasks.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: VERIFIED CERTIFICATIONS (ALL 20 CERTS) ────────────────── */}
      <CertificationsSection />

      {/* ─── SECTION 6: INTERACTIVE CLI TERMINAL ──────────────────────────────── */}
      <section id="terminal" className="py-20 sm:py-24 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>DIRECT SERIAL SHELL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Interactive Firmware Terminal
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed font-sans">
              For engineers and recruiters who prefer a command line: query skills, hardware pinouts,
              project specifications, and contact coordinates directly from this virtual terminal.
            </p>
          </div>

          <EngineeringTerminal />
        </div>
      </section>

      {/* ─── SECTION 7: CONTACT & FOOTER ─────────────────────────────────────── */}
      <footer id="contact" className="py-20 bg-slate-950 text-slate-300 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid gap-8 md:grid-cols-12 items-start">
            <div className="md:col-span-6 space-y-3 font-sans">
              <div className="text-xl font-bold text-slate-100">Sanju Grehi</div>
              <p className="text-slate-400 text-sm max-w-md font-mono text-xs leading-relaxed">
                Electrical &amp; Electronics Engineering student specializing in embedded firmware,
                microcontrollers, and robotics. Open to discussing six-month 2027 internship opportunities.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono pt-2">
                STATUS: ACCEPTING INTERVIEW DISCUSSIONS FOR JAN–JUN 2027
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase">DIRECT EMAIL</div>
                <a
                  href="mailto:sanjugrehi@gmail.com"
                  className="font-bold text-slate-100 hover:text-cyan-400 text-xs block transition-colors break-all"
                >
                  sanjugrehi@gmail.com
                </a>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase">LINKEDIN</div>
                <a
                  href="https://linkedin.com/in/sanju-grehi-b4618731b"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-slate-100 hover:text-cyan-400 text-xs block transition-colors"
                >
                  /in/sanju-grehi
                </a>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase">GITHUB</div>
                <a
                  href="https://github.com/SanjuGrehi"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-slate-100 hover:text-cyan-400 text-xs block transition-colors"
                >
                  @SanjuGrehi
                </a>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase">INSTITUTION</div>
                <div className="font-bold text-slate-200 text-xs">
                  Sahrdaya CET, Kerala
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>&copy; 2026 Sanju Grehi · Hand-Crafted Embedded Systems Portfolio</div>
            <div>BUILT WITH REACT 19 · THREE.JS · TAILWIND CSS · VITE</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

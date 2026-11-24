import { useState, useRef, useEffect } from "react"

interface TerminalLine {
  type: "input" | "output" | "error" | "system"
  text: string
}

export function EngineeringTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "system", text: "SANJU GREHI [FIRMWARE NODE v2.4.0]" },
    { type: "system", text: "Target: STM32F401RET6 · ARM Cortex-M4 @ 84MHz" },
    { type: "system", text: "Type 'help' for available commands or 'pinout' to view hardware map." },
  ])
  const [inputVal, setInputVal] = useState("")
  const [cmdIndex, setCmdIndex] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newHistory: TerminalLine[] = [...history, { type: "input", text: `$ ${cmd}` }]

    if (!trimmed) {
      setHistory(newHistory)
      return
    }

    setCmdHistory((prev) => [...prev, cmd])
    setCmdIndex(-1)

    switch (trimmed) {
      case "help":
        newHistory.push(
          { type: "output", text: "AVAILABLE COMMANDS:" },
          { type: "output", text: "  about       - Professional background & engineering focus" },
          { type: "output", text: "  skills      - Core embedded, platforms, and peripheral skills" },
          { type: "output", text: "  projects    - Summary of featured hardware & IoT projects" },
          { type: "output", text: "  certs       - 20 verified engineering certifications" },
          { type: "output", text: "  pinout      - STM32 development board pin definitions" },
          { type: "output", text: "  internship  - Details on 6-month Jan-Jun 2027 internship" },
          { type: "output", text: "  contact     - Official links, GitHub, LinkedIn, email" },
          { type: "output", text: "  clear       - Clear terminal screen" }
        )
        break

      case "about":
        newHistory.push(
          { type: "output", text: "SANJU GREHI" },
          { type: "output", text: "Undergraduate: B.Tech in Electrical & Electronics Engineering (2024 – 2028)" },
          { type: "output", text: "Institution: Sahrdaya College of Engineering & Technology, Kerala" },
          { type: "output", text: "Focus: Embedded Systems, Firmware Engineering, Robotics & Intelligent Systems" },
          { type: "output", text: "Objective: 6-month internship (January – June 2027) in Kerala / Bengaluru hubs" }
        )
        break

      case "skills":
        newHistory.push(
          { type: "output", text: "EMBEDDED & HARDWARE PROFICIENCIES:" },
          { type: "output", text: "  Core: Embedded C/C++, Microcontroller Programming, Hardware-Software Integration" },
          { type: "output", text: "  MCUs: STM32 (ARM Cortex-M4), ESP32-S3, Arduino ATmega328P" },
          { type: "output", text: "  Protocols: UART, SPI, I2C, CAN Bus, MQTT, GPIO/Interrupts/Timers, ADC/PWM" },
          { type: "output", text: "  Specializations: RTOS concepts, Robotics, Sensor Data Acquisition, Motor Control" }
        )
        break

      case "projects":
        newHistory.push(
          { type: "output", text: "FEATURED PROJECTS:" },
          { type: "output", text: "  1. RFID-Based Smart Attendance System (ATmega328P, RC522 SPI, I2C LCD, SD Card)" },
          { type: "output", text: "  2. IoT Smart Energy Meter & Dashboard (ESP32, SCT-013 CT Sensor, MQTT Telemetry)" },
          { type: "output", text: "  3. Adaptive Traffic Control System (PLC Ladder Logic, State Machine, Priority Preemption)" }
        )
        break

      case "certs":
        newHistory.push(
          { type: "output", text: "VERIFIED CREDENTIALS (TOTAL 20):" },
          { type: "output", text: "  - KSEBL 110KV Substation Industrial Internship (Jul 2025)" },
          { type: "output", text: "  - NIELIT Calicut / MeitY Drone & UAS Bootcamp (Feb 2025)" },
          { type: "output", text: "  - Elewayte Embedded Systems Course Completion (Jul 2025)" },
          { type: "output", text: "  - Dell / Intel AI for Future Workforce Program (Apr 2025)" },
          { type: "output", text: "  - FutureSkills Prime Digital 101 Gold (Dec 2024)" },
          { type: "output", text: "  - Best Project Award: E-Savu (Mar 2025)" },
          { type: "output", text: "  - IEEE SPS / CSS / Student Memberships 2025 & 2026" },
          { type: "output", text: "  - Execom'25 Secretary, IEEE SPS Sahrdaya SB" }
        )
        break

      case "pinout":
        newHistory.push(
          { type: "output", text: "STM32F401 HEADER PINOUT MAPPING:" },
          { type: "output", text: "  [01] 3V3       | VDD Logic Rail (3.30V)" },
          { type: "output", text: "  [02] GND       | System Ground (0.00V)" },
          { type: "output", text: "  [03] PA5       | TIM2_CH1 Hardware PWM Out" },
          { type: "output", text: "  [04] PA9/PA10  | USART1 TX/RX (115200 8N1)" },
          { type: "output", text: "  [05] PB6/PB7   | I2C1 SCL/SDA (400kHz Fast-Mode)" },
          { type: "output", text: "  [06] PA0       | ADC1_IN0 12-Bit Analog Input" },
          { type: "output", text: "  [07] PB8/PB9   | CAN1 RX/TX Differential Bus" }
        )
        break

      case "internship":
        newHistory.push(
          { type: "output", text: "INTERNSHIP SPECIFICATION:" },
          { type: "output", text: "  Window: January to June 2027 (Six Months Duration)" },
          { type: "output", text: "  Domains: Embedded Systems, Firmware, Robotics, IoT Electronics" },
          { type: "output", text: "  Locations: Kerala (Kochi/Thrissur) first preference · Open to Bengaluru & Indian tech hubs" },
          { type: "output", text: "  Requirement: Technical mentorship, hands-on hardware/firmware learning, fair stipend" }
        )
        break

      case "contact":
        newHistory.push(
          { type: "output", text: "COMMUNICATION CHANNELS:" },
          { type: "output", text: "  Email:    sanjugrehi@gmail.com" },
          { type: "output", text: "  LinkedIn: linkedin.com/in/sanju-grehi-b4618731b" },
          { type: "output", text: "  GitHub:   github.com/SanjuGrehi" },
          { type: "output", text: "  Location: Thrissur, Kerala, India" }
        )
        break

      case "clear":
        setHistory([])
        return

      default:
        newHistory.push({
          type: "error",
          text: `Command not found: '${trimmed}'. Type 'help' for available commands.`,
        })
    }

    setHistory(newHistory)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal)
      setInputVal("")
    } else if (e.key === "ArrowUp") {
      if (cmdHistory.length === 0) return
      const nextIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1)
      setCmdIndex(nextIdx)
      setInputVal(cmdHistory[nextIdx])
    } else if (e.key === "ArrowDown") {
      if (cmdIndex === -1) return
      const nextIdx = cmdIndex + 1
      if (nextIdx >= cmdHistory.length) {
        setCmdIndex(-1)
        setInputVal("")
      } else {
        setCmdIndex(nextIdx)
        setInputVal(cmdHistory[nextIdx])
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const commands = ["help", "about", "skills", "projects", "certs", "pinout", "internship", "contact", "clear"]
      const match = commands.find((c) => c.startsWith(inputVal.toLowerCase()))
      if (match) setInputVal(match)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-700/60 bg-slate-950 overflow-hidden shadow-2xl font-mono text-xs flex flex-col">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-semibold ml-2">sanju@embedded-node: ~</span>
        </div>
        <div className="text-[10px] text-slate-500 hidden sm:inline">
          INTERACTIVE UART/SSH TERMINAL (TAB AUTOCOMPLETE)
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 bg-slate-950 h-64 overflow-y-auto space-y-1 text-slate-300">
        {history.map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "input"
                ? "text-cyan-400 font-semibold"
                : line.type === "error"
                ? "text-red-400"
                : line.type === "system"
                ? "text-slate-500"
                : "text-slate-300 whitespace-pre-wrap"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
        <span className="text-emerald-400 font-bold">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help', 'skills', 'projects', 'certs'..."
          className="w-full bg-transparent text-slate-200 outline-none placeholder:text-slate-600 font-mono text-xs"
        />
        <span className="text-[10px] text-slate-500 shrink-0 hidden sm:inline">ENTER TO EXEC</span>
      </div>
    </div>
  )
}

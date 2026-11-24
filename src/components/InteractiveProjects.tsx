import { useState, useEffect } from "react"

export function InteractiveProjects() {
  const [activeTab, setActiveTab] = useState<"rfid" | "energy" | "traffic">("rfid")

  // ── Project 1: RFID State
  const [rfidLog, setRfidLog] = useState<Array<{ id: string; name: string; time: string; status: string }>>([
    { id: "TAG_E04B", name: "Sanju Grehi (EEE-31)", time: "08:15:22 AM", status: "VERIFIED" },
    { id: "TAG_7A12", name: "Dr. Anil A. (HOD)", time: "08:22:04 AM", status: "VERIFIED" },
  ])
  const [rfidLcd, setRfidLcd] = useState<{ line1: string; line2: string; active: boolean }>({
    line1: "SYSTEM READY",
    line2: "SWIPE RFID CARD",
    active: false,
  })
  const [rfidScanning, setRfidScanning] = useState(false)

  const swipeCard = (card: { id: string; name: string }) => {
    setRfidScanning(true)
    // Subtle Web Audio beep for authentic hardware tactile feedback
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(2400, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (_) {}

    setRfidLcd({
      line1: "TAG IDENTIFIED",
      line2: card.name.split(" ")[0].toUpperCase() + " GRANTED",
      active: true,
    })

    const now = new Date()
    const timeStr = now.toLocaleTimeString()

    setTimeout(() => {
      setRfidLog((prev) => [{ id: card.id, name: card.name, time: timeStr, status: "VERIFIED" }, ...prev.slice(0, 5)])
      setRfidScanning(false)
    }, 400)

    setTimeout(() => {
      setRfidLcd({ line1: "SYSTEM READY", line2: "SWIPE RFID CARD", active: false })
    }, 2800)
  }

  // ── Project 2: Energy Meter State
  const [appliances, setAppliances] = useState<{ [key: string]: boolean }>({
    lighting: true,
    workstation: true,
    induction: false,
    evCharger: false,
  })

  const loadAmps =
    (appliances.lighting ? 0.8 : 0) +
    (appliances.workstation ? 1.5 : 0) +
    (appliances.induction ? 8.2 : 0) +
    (appliances.evCharger ? 15.0 : 0)

  const voltage = 230
  const powerFactor = loadAmps > 0 ? 0.96 : 1.0
  const activePowerW = Math.round(voltage * loadAmps * powerFactor)
  const apparentPowerVA = Math.round(voltage * loadAmps)

  // ── Project 3: Traffic Controller State
  const [trafficDensity, setTrafficDensity] = useState({ north: 18, south: 12, east: 6, west: 8 })
  const [trafficPhase, setTrafficPhase] = useState<"NS_GREEN" | "NS_YELLOW" | "EW_GREEN" | "EW_YELLOW" | "EMERGENCY">("NS_GREEN")
  const [phaseTimer, setPhaseTimer] = useState(14)
  const [emergencyActive, setEmergencyActive] = useState(false)

  useEffect(() => {
    if (activeTab !== "traffic") return
    const interval = setInterval(() => {
      if (emergencyActive) {
        setTrafficPhase("EMERGENCY")
        return
      }

      setPhaseTimer((prev) => {
        if (prev <= 1) {
          // Transition state machine
          if (trafficPhase === "NS_GREEN") {
            setTrafficPhase("NS_YELLOW")
            return 3
          } else if (trafficPhase === "NS_YELLOW") {
            setTrafficPhase("EW_GREEN")
            // Allocate adaptive green time based on east/west traffic density!
            const ewDensity = trafficDensity.east + trafficDensity.west
            return Math.max(8, Math.min(25, Math.round(ewDensity * 0.8)))
          } else if (trafficPhase === "EW_GREEN") {
            setTrafficPhase("EW_YELLOW")
            return 3
          } else {
            setTrafficPhase("NS_GREEN")
            const nsDensity = trafficDensity.north + trafficDensity.south
            return Math.max(8, Math.min(25, Math.round(nsDensity * 0.8)))
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTab, trafficPhase, emergencyActive, trafficDensity])

  const toggleEmergency = () => {
    setEmergencyActive((prev) => {
      const next = !prev
      if (next) {
        setTrafficPhase("EMERGENCY")
        setPhaseTimer(15)
      } else {
        setTrafficPhase("NS_GREEN")
        setPhaseTimer(10)
      }
      return next
    })
  }

  return (
    <div className="w-full rounded-2xl border border-slate-700/60 bg-slate-950 overflow-hidden shadow-2xl font-mono text-xs">
      {/* Project Workbench Header with Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="font-bold text-slate-100 tracking-wide text-xs">INTERACTIVE HARDWARE PROJECT LAB</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: "rfid", label: "01. RFID Attendance" },
            { id: "energy", label: "02. IoT Energy Meter" },
            { id: "traffic", label: "03. Adaptive Traffic PLC" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROJECT 1: RFID ATTENDANCE SYSTEM ── */}
      {activeTab === "rfid" && (
        <div className="p-5 sm:p-6 grid gap-6 lg:grid-cols-12 bg-slate-950">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                MICROCONTROLLER PROTOTYPE
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-2 font-sans">
                RFID-Based Smart Attendance System
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Hardware prototype utilizing RC522 13.56MHz RFID reader via SPI, HD44780 I2C LCD, and FAT32 SD-Card SPI logger for offline deterministic logging.
              </p>
            </div>

            {/* Simulated 16x2 I2C LCD Display */}
            <div className="p-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-800/80 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] font-mono">
              <div className="text-[10px] text-emerald-400/70 mb-1 flex justify-between">
                <span>HD44780 I2C 16x2</span>
                <span className={rfidScanning ? "text-amber-400 animate-pulse" : "text-emerald-500"}>
                  {rfidScanning ? "READING TAG..." : "BUS IDLE"}
                </span>
              </div>
              <div className="bg-emerald-900/40 p-3 rounded border border-emerald-700/50 text-emerald-300 font-mono tracking-widest text-sm space-y-1">
                <div>&gt; {rfidLcd.line1}</div>
                <div>&gt; {rfidLcd.line2}</div>
              </div>
            </div>

            {/* Clickable RFID Cards */}
            <div>
              <div className="text-slate-400 text-[11px] mb-2 font-bold">SWIPE VIRTUAL RFID TRANSPONDERS:</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "TAG_E04B", name: "Sanju Grehi", role: "EEE Student" },
                  { id: "TAG_9C21", name: "Meera Nair", role: "Lab Lead" },
                  { id: "TAG_5D88", name: "Dr. K. George", role: "Faculty" },
                  { id: "TAG_11A4", name: "Devika S.", role: "Research Asst" },
                ].map((card) => (
                  <button
                    key={card.id}
                    onClick={() => swipeCard(card)}
                    disabled={rfidScanning}
                    className="p-3 text-left rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:bg-slate-850 transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-cyan-400 font-bold">{card.id}</span>
                      <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400" />
                    </div>
                    <div className="text-slate-200 font-semibold text-xs mt-1">{card.name}</div>
                    <div className="text-slate-400 text-[10px]">{card.role}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SD Card Live Log Output */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>SD-CARD LOG FILE: /DATA/ATTEND_2026.CSV</span>
              <span className="text-emerald-400 font-bold">SPI BUS: 10 MHz</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex-1 flex flex-col">
              <div className="grid grid-cols-4 pb-2 border-b border-slate-800 text-slate-500 font-bold text-[10px]">
                <span>TAG UID</span>
                <span>STUDENT / STAFF</span>
                <span>TIMESTAMP</span>
                <span className="text-right">RESULT</span>
              </div>
              <div className="divide-y divide-slate-850 overflow-y-auto max-h-56">
                {rfidLog.map((log, i) => (
                  <div key={i} className="grid grid-cols-4 py-2 text-[11px] items-center">
                    <span className="text-cyan-400 font-bold">{log.id}</span>
                    <span className="text-slate-200">{log.name}</span>
                    <span className="text-slate-400">{log.time}</span>
                    <span className="text-right text-emerald-400 font-semibold">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>HARDWARE: Arduino ATmega328P · RC522 SPI · I2C LCD · MicroSD Shield</span>
              <span className="text-cyan-400 font-semibold">100% RELIABILITY</span>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT 2: IOT SMART ENERGY METER ── */}
      {activeTab === "energy" && (
        <div className="p-5 sm:p-6 grid gap-6 lg:grid-cols-12 bg-slate-950">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                ESP32 + CURRENT TRANSFORMER
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-2 font-sans">
                IoT Smart Energy Meter &amp; MQTT Telemetry
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Non-invasive current transformer (SCT-013-000) sampling at 1kHz, processing RMS calculations on ESP32, and streaming via MQTT broker.
              </p>
            </div>

            {/* Connected Appliance Load Toggles */}
            <div className="space-y-2">
              <div className="text-slate-400 text-[11px] font-bold">SWITCH TEST LOADS TO SIMULATE DRAW:</div>
              {[
                { key: "lighting", label: "Laboratory Lighting", amps: "0.8A", watts: "184W" },
                { key: "workstation", label: "Embedded Engineering Workstation", amps: "1.5A", watts: "345W" },
                { key: "induction", label: "Induction Heating Load", amps: "8.2A", watts: "1886W" },
                { key: "evCharger", label: "Level-2 EV Charging Circuit", amps: "15.0A", watts: "3450W" },
              ].map((load) => (
                <button
                  key={load.key}
                  onClick={() =>
                    setAppliances((prev) => ({ ...prev, [load.key]: !prev[load.key] }))
                  }
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    appliances[load.key]
                      ? "bg-slate-850 border-cyan-500/70 text-slate-100"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        appliances[load.key] ? "bg-cyan-400 shadow-[0_0_8px_#38bdf8]" : "bg-slate-700"
                      }`}
                    />
                    <span className="font-semibold text-xs">{load.label}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {load.amps} <span className="text-slate-600">|</span> {load.watts}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Meter Readouts & Waveform */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">AC VOLTAGE (RMS)</div>
                <div className="text-lg font-bold text-slate-100 mt-0.5">{voltage} V</div>
                <div className="text-[9px] text-emerald-400">STABLE 50.0 Hz</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">CURRENT (RMS)</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{loadAmps.toFixed(2)} A</div>
                <div className="text-[9px] text-slate-400">CT: SCT-013 100A</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ACTIVE POWER</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{activePowerW} W</div>
                <div className="text-[9px] text-slate-400">{apparentPowerVA} VA APPARENT</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">POWER FACTOR</div>
                <div className="text-lg font-bold text-amber-400 mt-0.5">{powerFactor.toFixed(2)}</div>
                <div className="text-[9px] text-slate-400">LAGGING INDUCTIVE</div>
              </div>
            </div>

            {/* Instantaneous AC Waveform Visualization */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>SIMULATED CT AC WAVEFORM (50Hz SINGLE PHASE)</span>
                <span className="text-cyan-400">MQTT TOPIC: tele/meter/instant</span>
              </div>
              <div className="h-32 w-full bg-slate-950 rounded border border-slate-850 relative overflow-hidden flex items-center">
                <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                  {/* Zero axis */}
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Voltage Sine Wave (Blue) */}
                  <path
                    d={Array.from({ length: 60 }).reduce(
                      (acc, _, i) =>
                        `${acc} ${i === 0 ? "M" : "L"} ${i * 10} ${60 - Math.sin((i / 60) * Math.PI * 8) * 45}`,
                      ""
                    )}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    opacity="0.85"
                  />
                  {/* Current Sine Wave (Green - amplitude scaled to loadAmps) */}
                  <path
                    d={Array.from({ length: 60 }).reduce(
                      (acc, _, i) =>
                        `${acc} ${i === 0 ? "M" : "L"} ${i * 10} ${
                          60 - Math.sin((i / 60) * Math.PI * 8 - 0.25) * (Math.min(loadAmps, 20) * 2.2)
                        }`,
                      ""
                    )}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.2"
                  />
                </svg>
                <div className="absolute top-2 right-3 flex items-center gap-3 text-[10px]">
                  <span className="text-sky-400">VOLTAGE (230V)</span>
                  <span className="text-emerald-400 font-bold">CURRENT ({loadAmps.toFixed(1)}A)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT 3: ADAPTIVE TRAFFIC PLC CONTROLLER ── */}
      {activeTab === "traffic" && (
        <div className="p-5 sm:p-6 grid gap-6 lg:grid-cols-12 bg-slate-950">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                PLC &amp; CONTROL SYSTEMS LOGIC
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-2 font-sans">
                Adaptive Traffic Control &amp; Priority State Machine
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Closed-loop traffic optimization algorithm adapting signal timing dynamically based on road-bed inductive loop queue density.
              </p>
            </div>

            {/* Queue Density Sliders */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[11px] font-bold">INDUCTIVE LOOP VEHICLE DENSITY:</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>NORTH CORRIDOR:</span>
                    <span className="font-bold text-cyan-400">{trafficDensity.north} VEHICLES</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={trafficDensity.north}
                    onChange={(e) =>
                      setTrafficDensity((prev) => ({ ...prev, north: Number(e.target.value) }))
                    }
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>EAST CORRIDOR:</span>
                    <span className="font-bold text-cyan-400">{trafficDensity.east} VEHICLES</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={trafficDensity.east}
                    onChange={(e) =>
                      setTrafficDensity((prev) => ({ ...prev, east: Number(e.target.value) }))
                    }
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Priority Trigger Button */}
            <button
              onClick={toggleEmergency}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all border ${
                emergencyActive
                  ? "bg-red-950 border-red-500 text-red-200 animate-pulse"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-300"
              }`}
            >
              {emergencyActive ? "[OVERRIDE ENGAGED] CANCEL EMERGENCY" : "TRIGGER EMERGENCY VEHICLE PREEMPTION"}
            </button>
          </div>

          {/* Interactive State Machine Traffic Visualizer */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">STATE MACHINE STATUS:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  trafficPhase === "EMERGENCY"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                }`}
              >
                {trafficPhase} ({phaseTimer}s REMAINING)
              </span>
            </div>

            {/* Traffic Signal Heads (North-South vs East-West) */}
            <div className="grid grid-cols-2 gap-4">
              {/* North-South Signal */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-3">
                <span className="text-slate-300 font-bold text-xs">NORTH - SOUTH CORRIDOR</span>
                <div className="p-2.5 bg-black rounded-2xl border-2 border-slate-800 flex flex-col gap-2 shadow-inner">
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${
                      trafficPhase === "EW_GREEN" || trafficPhase === "EW_YELLOW"
                        ? "bg-red-500 shadow-[0_0_12px_#ef4444]"
                        : "bg-red-950/40"
                    }`}
                  />
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${
                      trafficPhase === "NS_YELLOW" ? "bg-amber-400 shadow-[0_0_12px_#f59e0b]" : "bg-amber-950/40"
                    }`}
                  />
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${
                      trafficPhase === "NS_GREEN" || trafficPhase === "EMERGENCY"
                        ? "bg-emerald-400 shadow-[0_0_12px_#10b981]"
                        : "bg-emerald-950/40"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  {trafficPhase === "NS_GREEN"
                    ? `GREEN: FLOWING (${trafficDensity.north} Q)`
                    : "STOPPED"}
                </span>
              </div>

              {/* East-West Signal */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-3">
                <span className="text-slate-300 font-bold text-xs">EAST - WEST CORRIDOR</span>
                <div className="p-2.5 bg-black rounded-2xl border-2 border-slate-800 flex flex-col gap-2 shadow-inner">
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${
                      trafficPhase === "NS_GREEN" || trafficPhase === "NS_YELLOW" || trafficPhase === "EMERGENCY"
                        ? "bg-red-500 shadow-[0_0_12px_#ef4444]"
                        : "bg-red-950/40"
                    }`}
                  />
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${
                      trafficPhase === "EW_YELLOW" ? "bg-amber-400 shadow-[0_0_12px_#f59e0b]" : "bg-amber-950/40"
                    }`}
                  />
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${
                      trafficPhase === "EW_GREEN" ? "bg-emerald-400 shadow-[0_0_12px_#10b981]" : "bg-emerald-950/40"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  {trafficPhase === "EW_GREEN"
                    ? `GREEN: FLOWING (${trafficDensity.east} Q)`
                    : "STOPPED"}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-[10px] text-slate-400 flex justify-between">
              <span>ALGORITHM: Real-Time Adaptive Dynamic Priority (RTADP)</span>
              <span className="text-emerald-400">SAFETY INTERLOCK: PASS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

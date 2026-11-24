import { useState, useEffect, useRef } from "react"
import type { PinInfo } from "./Hardware3D"

interface LogicAnalyzerProps {
  activePin: PinInfo
  isPowered: boolean
  firmwareMode: string
}

export function LogicAnalyzer({ activePin, isPowered, firmwareMode }: LogicAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [protocol, setProtocol] = useState<"pwm" | "uart" | "i2c" | "adc" | "can">("pwm")
  const [dutyCycle, setDutyCycle] = useState(65)
  const [frequency, setFrequency] = useState(20) // in kHz
  const [uartText, setUartText] = useState("SG")
  const [triggerMode, setTriggerMode] = useState<"AUTO" | "NORM" | "SINGLE">("AUTO")
  const [timeDiv, setTimeDiv] = useState<"10us" | "50us" | "100us" | "500us">("50us")
  const animRef = useRef<number | null>(null)
  const phaseRef = useRef(0)

  // Sync protocol with active pin when pin changes
  useEffect(() => {
    if (activePin.signalType === "pwm") setProtocol("pwm")
    else if (activePin.signalType === "uart") setProtocol("uart")
    else if (activePin.signalType === "i2c") setProtocol("i2c")
    else if (activePin.signalType === "adc") setProtocol("adc")
    else if (activePin.signalType === "can") setProtocol("can")
  }, [activePin])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const render = () => {
      animId = requestAnimationFrame(render)
      const w = canvas.width
      const h = canvas.height

      // Dark oscilloscope screen background with phosphor persistence
      ctx.fillStyle = "#06090e"
      ctx.fillRect(0, 0, w, h)

      // Oscilloscope Graticule (Grid)
      ctx.strokeStyle = "#162330"
      ctx.lineWidth = 1
      const numX = 10
      const numY = 8
      const cellW = w / numX
      const cellH = h / numY

      for (let x = 0; x <= numX; x++) {
        ctx.beginPath()
        ctx.moveTo(x * cellW, 0)
        ctx.lineTo(x * cellW, h)
        ctx.stroke()
      }
      for (let y = 0; y <= numY; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * cellH)
        ctx.lineTo(w, y * cellH)
        ctx.stroke()
      }

      // Center crosshairs with division tick marks
      ctx.strokeStyle = "#253b52"
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2, h)
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()

      // Ticks along axes
      for (let x = 0; x < w; x += cellW / 5) {
        ctx.beginPath()
        ctx.moveTo(x, h / 2 - 3)
        ctx.lineTo(x, h / 2 + 3)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += cellH / 5) {
        ctx.beginPath()
        ctx.moveTo(w / 2 - 3, y)
        ctx.lineTo(w / 2 + 3, y)
        ctx.stroke()
      }

      if (!isPowered) {
        // Flat line when powered down
        ctx.strokeStyle = "#334155"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, h * 0.75)
        ctx.lineTo(w, h * 0.75)
        ctx.stroke()

        ctx.fillStyle = "#64748b"
        ctx.font = "12px monospace"
        ctx.fillText("POWER RAIL DOWN - PROBE DISCONNECTED", 20, 30)
        return
      }

      // Signal Rendering
      phaseRef.current += 0.05

      const topY = h * 0.25
      const botY = h * 0.75

      if (protocol === "pwm") {
        // PWM Digital Square Wave
        const period = (w / 4) * (20 / frequency)
        const highWidth = period * (dutyCycle / 100)

        // Glow pass
        ctx.strokeStyle = "#10b98144"
        ctx.lineWidth = 6
        ctx.beginPath()
        for (let x = -period; x < w + period; x += period) {
          const shift = (phaseRef.current * 40) % period
          const startX = x - shift
          ctx.moveTo(startX, botY)
          ctx.lineTo(startX, topY)
          ctx.lineTo(startX + highWidth, topY)
          ctx.lineTo(startX + highWidth, botY)
          ctx.lineTo(startX + period, botY)
        }
        ctx.stroke()

        // Crisp trace pass
        ctx.strokeStyle = "#10b981" // Phosphor green
        ctx.lineWidth = 2.5
        ctx.beginPath()
        for (let x = -period; x < w + period; x += period) {
          const shift = (phaseRef.current * 40) % period
          const startX = x - shift
          ctx.moveTo(startX, botY)
          ctx.lineTo(startX, topY)
          ctx.lineTo(startX + highWidth, topY)
          ctx.lineTo(startX + highWidth, botY)
          ctx.lineTo(startX + period, botY)
        }
        ctx.stroke()
      } else if (protocol === "uart") {
        // UART Serial Packet (Start, 8 data bits, Stop)
        const bitWidth = 28
        const shift = Math.floor(phaseRef.current * 8) % 400

        ctx.strokeStyle = "#06b6d4" // Cyan
        ctx.lineWidth = 2
        ctx.beginPath()

        // Draw serial sequence
        let curX = 10 - (shift % bitWidth)
        let curVal = 1
        ctx.moveTo(0, topY)

        // Generate bits from text ASCII
        const bytes = (uartText || "SG").split("").map((c) => c.charCodeAt(0))
        const bitStream: number[] = [1, 1] // Idle high
        bytes.forEach((b) => {
          bitStream.push(0) // Start bit
          for (let i = 0; i < 8; i++) bitStream.push((b >> i) & 1)
          bitStream.push(1) // Stop bit
          bitStream.push(1) // Idle
        })

        for (let i = 0; i < bitStream.length * 4; i++) {
          const b = bitStream[i % bitStream.length]
          const targetY = b === 1 ? topY : botY
          ctx.lineTo(curX, curVal === 1 ? topY : botY)
          ctx.lineTo(curX, targetY)
          ctx.lineTo(curX + bitWidth, targetY)
          curVal = b
          curX += bitWidth
          if (curX > w) break
        }
        ctx.stroke()

        // Bit markers
        ctx.fillStyle = "#0891b2"
        ctx.font = "10px monospace"
        ctx.fillText("START", 40, topY - 12)
        ctx.fillText("D0..D7 (ASCII)", 100, topY - 12)
        ctx.fillText("STOP", 240, topY - 12)
      } else if (protocol === "i2c") {
        // Dual Trace: Channel 1 SCL (Clock), Channel 2 SDA (Data)
        const sclTop = h * 0.2
        const sclBot = h * 0.45
        const sdaTop = h * 0.58
        const sdaBot = h * 0.82
        const clkW = 24

        // Channel 1: SCL Clock Burst (Yellow)
        ctx.strokeStyle = "#facc15"
        ctx.lineWidth = 2
        ctx.beginPath()
        let sx = 20
        ctx.moveTo(0, sclTop)
        for (let i = 0; i < 24; i++) {
          ctx.lineTo(sx, sclTop)
          ctx.lineTo(sx, sclBot)
          ctx.lineTo(sx + clkW / 2, sclBot)
          ctx.lineTo(sx + clkW / 2, sclTop)
          ctx.lineTo(sx + clkW, sclTop)
          sx += clkW
        }
        ctx.stroke()

        // Channel 2: SDA Data (Blue)
        ctx.strokeStyle = "#38bdf8"
        ctx.beginPath()
        let dx = 20
        const dataBits = [0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0]
        ctx.moveTo(0, sdaTop)
        dataBits.forEach((bit, i) => {
          const dy = bit === 1 ? sdaTop : sdaBot
          ctx.lineTo(dx, dy)
          ctx.lineTo(dx + clkW, dy)
          dx += clkW
        })
        ctx.stroke()

        ctx.fillStyle = "#facc15"
        ctx.font = "10px monospace"
        ctx.fillText("CH1: SCL (400 kHz)", 20, sclTop - 8)
        ctx.fillStyle = "#38bdf8"
        ctx.fillText("CH2: SDA (ADDR 0x68 ACK)", 20, sdaTop - 8)
      } else if (protocol === "adc") {
        // Analog Waveform with Sampling Points
        ctx.strokeStyle = "#a855f7" // Purple
        ctx.lineWidth = 2.5
        ctx.beginPath()
        for (let x = 0; x < w; x++) {
          const angle = x * 0.03 + phaseRef.current * 2
          const y = h / 2 + Math.sin(angle) * (h * 0.28) + Math.sin(angle * 3) * 8
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Sample & Hold dots (12-bit ADC quantization)
        ctx.fillStyle = "#c084fc"
        for (let x = 10; x < w; x += 32) {
          const angle = x * 0.03 + phaseRef.current * 2
          const y = h / 2 + Math.sin(angle) * (h * 0.28) + Math.sin(angle * 3) * 8
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (protocol === "can") {
        // High-Speed CAN Differential (CAN_H and CAN_L)
        const canRecessive = h * 0.5
        const canH_Dom = h * 0.3
        const canL_Dom = h * 0.7
        const bitW = 22

        const canBits = [0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0]

        // CAN_H (Orange)
        ctx.strokeStyle = "#fb923c"
        ctx.lineWidth = 2
        ctx.beginPath()
        let cx = 10
        ctx.moveTo(0, canRecessive)
        canBits.forEach((bit) => {
          const y = bit === 0 ? canH_Dom : canRecessive
          ctx.lineTo(cx, y)
          ctx.lineTo(cx + bitW, y)
          cx += bitW
        })
        ctx.stroke()

        // CAN_L (Blue)
        ctx.strokeStyle = "#60a5fa"
        ctx.beginPath()
        let cx2 = 10
        ctx.moveTo(0, canRecessive)
        canBits.forEach((bit) => {
          const y = bit === 0 ? canL_Dom : canRecessive
          ctx.lineTo(cx2, y)
          ctx.lineTo(cx2 + bitW, y)
          cx2 += bitW
        })
        ctx.stroke()

        ctx.fillStyle = "#fb923c"
        ctx.font = "10px monospace"
        ctx.fillText("CAN_H (3.5V Dominant)", 20, canH_Dom - 8)
        ctx.fillStyle = "#60a5fa"
        ctx.fillText("CAN_L (1.5V Dominant)", 20, canL_Dom + 18)
      }

      // Telemetry Overlay HUD
      ctx.fillStyle = "#94a3b8"
      ctx.font = "11px monospace"
      ctx.fillText(`CH1 1.00V/div`, w - 110, 24)
      ctx.fillText(`M ${timeDiv}`, w - 110, 42)
      ctx.fillText(`TRIG: ${triggerMode}`, w - 110, 60)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [protocol, dutyCycle, frequency, uartText, isPowered, triggerMode, timeDiv])

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl flex flex-col font-mono text-xs">
      {/* Scope Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-bold text-emerald-400">LOGIC ANALYZER & OSCILLOSCOPE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">PROBING: {activePin.name}</span>
          <span className="text-cyan-400 font-semibold hidden sm:inline">[{activePin.alt}]</span>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(
            [
              { id: "pwm", label: "PWM" },
              { id: "uart", label: "UART" },
              { id: "i2c", label: "I2C" },
              { id: "adc", label: "ADC" },
              { id: "can", label: "CAN" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => setProtocol(p.id)}
              className={`px-2.5 py-1 rounded text-[11px] transition-all font-semibold ${
                protocol === p.id
                  ? "bg-slate-800 text-cyan-400 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Display */}
      <div className="relative w-full h-64 bg-slate-950">
        <canvas ref={canvasRef} width={800} height={256} className="w-full h-full block" />

        {/* Live Measurement Readouts */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px] bg-slate-900/90 border border-slate-800 rounded p-1.5 backdrop-blur-sm">
          <span className="text-slate-400">Vpp: <span className="text-slate-200 font-bold">3.30V</span></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Vrms: <span className="text-slate-200 font-bold">2.33V</span></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Freq: <span className="text-emerald-400 font-bold">{frequency}.00 kHz</span></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Duty: <span className="text-cyan-400 font-bold">{dutyCycle}%</span></span>
        </div>
      </div>

      {/* Interactive Signal Controls */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Duty Cycle Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>PWM DUTY CYCLE:</span>
            <span className="text-cyan-400 font-bold">{dutyCycle}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={99}
            value={dutyCycle}
            onChange={(e) => setDutyCycle(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Frequency Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>SIGNAL FREQUENCY:</span>
            <span className="text-emerald-400 font-bold">{frequency} kHz</span>
          </div>
          <input
            type="range"
            min={1}
            max={80}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Timebase Selection */}
        <div className="space-y-1.5">
          <div className="text-slate-400 text-[11px]">TIMEBASE / DIV:</div>
          <div className="grid grid-cols-4 gap-1">
            {(["10us", "50us", "100us", "500us"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeDiv(t)}
                className={`py-1 text-center rounded border text-[10px] ${
                  timeDiv === t
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* UART Data Input or Trigger */}
        <div className="space-y-1.5">
          <div className="text-slate-400 text-[11px]">UART PACKET PAYLOAD:</div>
          <input
            type="text"
            maxLength={6}
            value={uartText}
            onChange={(e) => setUartText(e.target.value.toUpperCase())}
            placeholder="SG"
            className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  )
}

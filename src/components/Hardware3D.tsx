import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export interface PinInfo {
  id: string
  name: string
  gpio: string
  alt: string
  type: "power" | "ground" | "gpio" | "analog" | "comm"
  voltage: string
  signalType: "pwm" | "i2c" | "uart" | "adc" | "can" | "dc" | "gnd"
  description: string
}

export const BOARD_PINS: PinInfo[] = [
  { id: "p1", name: "3V3", gpio: "VDD", alt: "Power Rail", type: "power", voltage: "+3.30V", signalType: "dc", description: "Regulated 3.3V logic supply rail from onboard LDO" },
  { id: "p2", name: "GND", gpio: "VSS", alt: "Ground", type: "ground", voltage: "0.00V", signalType: "gnd", description: "Common circuit ground reference" },
  { id: "p3", name: "PA5", gpio: "GPIO_A5", alt: "TIM2_CH1 / PWM", type: "gpio", voltage: "0..3.3V", signalType: "pwm", description: "Hardware timer PWM output running at 20.0 kHz, motor/actuator drive" },
  { id: "p4", name: "PA9", gpio: "GPIO_A9", alt: "USART1_TX", type: "comm", voltage: "3.3V Logic", signalType: "uart", description: "Asynchronous serial transmitter (115200 baud, 8N1 telemetry stream)" },
  { id: "p5", name: "PA10", gpio: "GPIO_A10", alt: "USART1_RX", type: "comm", voltage: "3.3V Logic", signalType: "uart", description: "Asynchronous serial receiver with hardware FIFO buffer" },
  { id: "p6", name: "PB6", gpio: "GPIO_B6", alt: "I2C1_SCL", type: "comm", voltage: "Open-Drain", signalType: "i2c", description: "I2C serial bus clock line (400 kHz Fast-Mode) with external pull-up" },
  { id: "p7", name: "PB7", gpio: "GPIO_B7", alt: "I2C1_SDA", type: "comm", voltage: "Open-Drain", signalType: "i2c", description: "I2C serial bus bidirectional data line communicating with sensors" },
  { id: "p8", name: "PA0", gpio: "GPIO_A0", alt: "ADC1_IN0", type: "analog", voltage: "0..3.3V Analog", signalType: "adc", description: "12-bit Successive Approximation ADC input, sampling at 1 MSPS" },
  { id: "p9", name: "PB8", gpio: "GPIO_B8", alt: "CAN1_RX", type: "comm", voltage: "Differential", signalType: "can", description: "Controller Area Network receiver bus line for automotive/robotics" },
  { id: "p10", name: "PB9", gpio: "GPIO_B9", alt: "CAN1_TX", type: "comm", voltage: "Differential", signalType: "can", description: "Controller Area Network transmitter bus line for deterministic comms" },
  { id: "p11", name: "PA4", gpio: "GPIO_A4", alt: "SPI1_NSS", type: "comm", voltage: "Active Low", signalType: "uart", description: "SPI bus slave-select chip line" },
  { id: "p12", name: "5V0", gpio: "VBUS", alt: "USB 5V In", type: "power", voltage: "+5.00V", signalType: "dc", description: "Raw USB VBUS power rail filtered via ferrite bead" },
]

interface Hardware3DProps {
  activePin: PinInfo
  onSelectPin: (pin: PinInfo) => void
  isPowered: boolean
  onTogglePower: () => void
  firmwareMode: string
  onChangeMode: (mode: string) => void
}

export function Hardware3D({
  activePin,
  onSelectPin,
  isPowered,
  onTogglePower,
  firmwareMode,
  onChangeMode,
}: Hardware3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [wireframe, setWireframe] = useState(false)
  const [cameraPreset, setCameraPreset] = useState<"iso" | "top" | "mcu" | "pins">("iso")
  const animFrameRef = useRef<number | null>(null)
  const pinMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const targetCamPos = useRef(new THREE.Vector3(7, 6, 8))
  const targetCamLook = useRef(new THREE.Vector3(0, 0, 0))
  const ledLightsRef = useRef<THREE.PointLight[]>([])
  const isInteracting = useRef(false)
  const pointerDownPos = useRef({ x: 0, y: 0 })
  const rotAngles = useRef({ x: 0.55, y: -0.65 })
  const targetRot = useRef({ x: 0.55, y: -0.65 })
  const zoomDist = useRef(11)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(7, 6, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // Lighting (Industrial precision studio lighting)
    const ambient = new THREE.AmbientLight(0xffffff, 0.75)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2)
    keyLight.position.set(6, 12, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 25
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x90b4ce, 1.2)
    rimLight.position.set(-8, 6, -6)
    scene.add(rimLight)

    const bottomBounce = new THREE.DirectionalLight(0x2a3d45, 0.5)
    bottomBounce.position.set(0, -6, 0)
    scene.add(bottomBounce)

    // Board Group
    const boardGroup = new THREE.Group()
    scene.add(boardGroup)

    // ── 1. PCB SUBSTRATE (Matte Military-Grade FR-4)
    const pcbWidth = 6.4
    const pcbLength = 9.2
    const pcbThickness = 0.18
    const pcbGeo = new THREE.BoxGeometry(pcbWidth, pcbThickness, pcbLength)
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x11241a, // Dark matte PCB green
      roughness: 0.45,
      metalness: 0.1,
    })
    const pcb = new THREE.Mesh(pcbGeo, pcbMat)
    pcb.receiveShadow = true
    pcb.castShadow = true
    boardGroup.add(pcb)

    // Mounting Holes (4 corner copper rings)
    const holeRadius = 0.22
    const holeGeo = new THREE.CylinderGeometry(holeRadius, holeRadius, pcbThickness + 0.02, 16)
    const holeMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.3 })
    const cornerOffsets = [
      [-pcbWidth / 2 + 0.4, -pcbLength / 2 + 0.4],
      [pcbWidth / 2 - 0.4, -pcbLength / 2 + 0.4],
      [-pcbWidth / 2 + 0.4, pcbLength / 2 - 0.4],
      [pcbWidth / 2 - 0.4, pcbLength / 2 - 0.4],
    ]
    cornerOffsets.forEach(([cx, cz]) => {
      const ring = new THREE.Mesh(holeGeo, holeMat)
      ring.position.set(cx, 0, cz)
      boardGroup.add(ring)
    })

    // Ground Plane Silkscreen Border
    const borderGeo = new THREE.BoxGeometry(pcbWidth - 0.25, 0.01, pcbLength - 0.25)
    const borderEdges = new THREE.EdgesGeometry(borderGeo)
    const borderLines = new THREE.LineSegments(
      borderEdges,
      new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.4 })
    )
    borderLines.position.y = pcbThickness / 2 + 0.005
    boardGroup.add(borderLines)

    // ── 2. MAIN MCU CHIP (STM32F4 / ARM Cortex-M4 QFP package)
    const mcuSize = 2.4
    const mcuGeo = new THREE.BoxGeometry(mcuSize, 0.24, mcuSize)
    const mcuMat = new THREE.MeshStandardMaterial({
      color: 0x181a20, // Matte epoxy resin black
      roughness: 0.35,
      metalness: 0.15,
    })
    const mcu = new THREE.Mesh(mcuGeo, mcuMat)
    mcu.position.set(0, pcbThickness / 2 + 0.12, 0.2)
    mcu.castShadow = true
    boardGroup.add(mcu)

    // Pin 1 Index Dot on MCU
    const dotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12)
    const dotMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 })
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.set(-mcuSize / 2 + 0.25, pcbThickness / 2 + 0.24 + 0.01, -mcuSize / 2 + 0.25)
    boardGroup.add(dot)

    // Laser-etched text plate on chip
    const labelCanvas = document.createElement("canvas")
    labelCanvas.width = 512
    labelCanvas.height = 512
    const ctx = labelCanvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#181a20"
      ctx.fillRect(0, 0, 512, 512)
      ctx.fillStyle = "#94a3b8"
      ctx.font = "bold 34px monospace"
      ctx.textAlign = "center"
      ctx.fillText("SANJU GREHI", 256, 170)
      ctx.font = "26px monospace"
      ctx.fillStyle = "#cbd5e1"
      ctx.fillText("STM32F401RET6", 256, 230)
      ctx.font = "20px monospace"
      ctx.fillStyle = "#64748b"
      ctx.fillText("ARM CORTEX-M4 · 84MHz", 256, 280)
      ctx.fillText("HW-REV 2.4 · EEE NODE", 256, 330)
    }
    const labelTex = new THREE.CanvasTexture(labelCanvas)
    const mcuTopGeo = new THREE.PlaneGeometry(mcuSize * 0.9, mcuSize * 0.9)
    const mcuTopMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.5,
      metalness: 0.05,
    })
    const mcuTop = new THREE.Mesh(mcuTopGeo, mcuTopMat)
    mcuTop.rotation.x = -Math.PI / 2
    mcuTop.position.set(0, pcbThickness / 2 + 0.24 + 0.005, 0.2)
    boardGroup.add(mcuTop)

    // Silver Leads around QFP MCU (4 sides)
    const leadMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.2 })
    const leadCountPerSide = 12
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < leadCountPerSide; i++) {
        const offset = (i - (leadCountPerSide - 1) / 2) * (mcuSize / (leadCountPerSide + 1))
        const leadGeo = new THREE.BoxGeometry(0.06, 0.06, 0.3)
        const lead = new THREE.Mesh(leadGeo, leadMat)
        if (side === 0) lead.position.set(offset, pcbThickness / 2 + 0.03, 0.2 + mcuSize / 2 + 0.15)
        if (side === 1) lead.position.set(offset, pcbThickness / 2 + 0.03, 0.2 - mcuSize / 2 - 0.15)
        if (side === 2) {
          lead.rotation.y = Math.PI / 2
          lead.position.set(mcuSize / 2 + 0.15, pcbThickness / 2 + 0.03, 0.2 + offset)
        }
        if (side === 3) {
          lead.rotation.y = Math.PI / 2
          lead.position.set(-mcuSize / 2 - 0.15, pcbThickness / 2 + 0.03, 0.2 + offset)
        }
        boardGroup.add(lead)
      }
    }

    // ── 3. CRYSTAL OSCILLATOR (Metal can 16.000 MHz)
    const xtalGeo = new THREE.BoxGeometry(0.9, 0.35, 0.45)
    const xtalMat = new THREE.MeshStandardMaterial({ color: 0xd8e2dc, metalness: 0.95, roughness: 0.15 })
    const xtal = new THREE.Mesh(xtalGeo, xtalMat)
    xtal.position.set(-1.8, pcbThickness / 2 + 0.18, 0.2)
    xtal.castShadow = true
    boardGroup.add(xtal)

    // ── 4. USB-C PORT (Brushed Aluminum Housing)
    const usbcGeo = new THREE.BoxGeometry(1.6, 0.5, 1.2)
    const usbcMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
    const usbc = new THREE.Mesh(usbcGeo, usbcMat)
    usbc.position.set(0, pcbThickness / 2 + 0.25, -pcbLength / 2 + 0.5)
    boardGroup.add(usbc)

    // USB-C Inner Slot
    const usbcSlotGeo = new THREE.BoxGeometry(1.2, 0.16, 0.2)
    const usbcSlotMat = new THREE.MeshBasicMaterial({ color: 0x050505 })
    const usbcSlot = new THREE.Mesh(usbcSlotGeo, usbcSlotMat)
    usbcSlot.position.set(0, pcbThickness / 2 + 0.25, -pcbLength / 2 - 0.01)
    boardGroup.add(usbcSlot)

    // ── 5. TACTILE PUSHBUTTONS (Reset & User)
    const btnBaseGeo = new THREE.BoxGeometry(0.7, 0.25, 0.7)
    const btnBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.3, roughness: 0.4 })
    const btnActuatorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16)
    const btnActuatorMatRst = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    const btnActuatorMatUsr = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 })

    // Reset button
    const rstBase = new THREE.Mesh(btnBaseGeo, btnBaseMat)
    rstBase.position.set(-2.0, pcbThickness / 2 + 0.125, -pcbLength / 2 + 1.2)
    const rstAct = new THREE.Mesh(btnActuatorGeo, btnActuatorMatRst)
    rstAct.position.set(-2.0, pcbThickness / 2 + 0.25 + 0.075, -pcbLength / 2 + 1.2)
    boardGroup.add(rstBase, rstAct)

    // User button
    const usrBase = new THREE.Mesh(btnBaseGeo, btnBaseMat)
    usrBase.position.set(2.0, pcbThickness / 2 + 0.125, -pcbLength / 2 + 1.2)
    const usrAct = new THREE.Mesh(btnActuatorGeo, btnActuatorMatUsr)
    usrAct.position.set(2.0, pcbThickness / 2 + 0.25 + 0.075, -pcbLength / 2 + 1.2)
    boardGroup.add(usrBase, usrAct)

    // ── 6. DIAGNOSTIC STATUS LEDS (Surface Mount 0805)
    const ledSpecs = [
      { color: 0x10b981, pos: [-1.4, pcbThickness / 2 + 0.05, -pcbLength / 2 + 2.0], label: "PWR" },
      { color: 0xf59e0b, pos: [-0.9, pcbThickness / 2 + 0.05, -pcbLength / 2 + 2.0], label: "STAT" },
      { color: 0x38bdf8, pos: [-0.4, pcbThickness / 2 + 0.05, -pcbLength / 2 + 2.0], label: "CAN" },
      { color: 0xffffff, pos: [0.1, pcbThickness / 2 + 0.05, -pcbLength / 2 + 2.0], label: "TX" },
    ]

    const ledMeshes: THREE.Mesh[] = []
    const ledLights: THREE.PointLight[] = []

    ledSpecs.forEach((spec) => {
      const ledGeo = new THREE.BoxGeometry(0.2, 0.08, 0.3)
      const ledMat = new THREE.MeshStandardMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: isPowered ? 1.5 : 0.05,
        roughness: 0.2,
      })
      const ledMesh = new THREE.Mesh(ledGeo, ledMat)
      ledMesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2])
      boardGroup.add(ledMesh)
      ledMeshes.push(ledMesh)

      const pLight = new THREE.PointLight(spec.color, isPowered ? 0.8 : 0, 1.8)
      pLight.position.set(spec.pos[0], spec.pos[1] + 0.2, spec.pos[2])
      boardGroup.add(pLight)
      ledLights.push(pLight)
    })
    ledLightsRef.current = ledLights

    // ── 7. PIN HEADERS (Dual in-line 2x16 gold plated ENIG pins)
    const pinMap = new Map<string, THREE.Mesh>()
    const headerShroudMat = new THREE.MeshStandardMaterial({ color: 0x1c1e24, roughness: 0.6 })
    const pinGoldMat = new THREE.MeshStandardMaterial({ color: 0xe5b342, metalness: 0.9, roughness: 0.2 })
    const activePinMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.8,
      metalness: 0.9,
    })

    const headerPositions = [-pcbWidth / 2 + 0.5, pcbWidth / 2 - 0.5]
    const numPinsPerSide = 12
    const pinSpacing = 0.55
    const startZ = -pcbLength / 2 + 1.8

    // Shrouds (Black plastic strips holding pins)
    headerPositions.forEach((hx) => {
      const shroudGeo = new THREE.BoxGeometry(0.45, 0.45, (numPinsPerSide - 1) * pinSpacing + 0.6)
      const shroud = new THREE.Mesh(shroudGeo, headerShroudMat)
      shroud.position.set(hx, pcbThickness / 2 + 0.22, startZ + ((numPinsPerSide - 1) * pinSpacing) / 2)
      boardGroup.add(shroud)
    })

    // Individual clickable pins
    BOARD_PINS.forEach((pin, index) => {
      const isRightSide = index >= 6
      const pinIndexOnSide = isRightSide ? index - 6 : index
      const px = isRightSide ? headerPositions[1] : headerPositions[0]
      const pz = startZ + pinIndexOnSide * pinSpacing

      const pinGeo = new THREE.BoxGeometry(0.12, 0.85, 0.12)
      const isSelected = pin.id === activePin.id
      const pMesh = new THREE.Mesh(pinGeo, isSelected ? activePinMat : pinGoldMat)
      pMesh.position.set(px, pcbThickness / 2 + 0.42, pz)
      pMesh.userData = { pin }
      pMesh.castShadow = true
      boardGroup.add(pMesh)
      pinMap.set(pin.id, pMesh)

      // Add a hit test cylinder for easy clicking
      const hitGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 8)
      const hitMat = new THREE.MeshBasicMaterial({ visible: false })
      const hitMesh = new THREE.Mesh(hitGeo, hitMat)
      hitMesh.position.copy(pMesh.position)
      hitMesh.userData = { pin }
      boardGroup.add(hitMesh)
    })
    pinMeshesRef.current = pinMap

    // ── 8. PASSIVE SMD COMPONENTS (Resistors, Decoupling Capacitors)
    const smdMat = new THREE.MeshStandardMaterial({ color: 0x826540, roughness: 0.4 })
    const smdCapMat = new THREE.MeshStandardMaterial({ color: 0xb58e65, roughness: 0.3 })
    for (let c = 0; c < 16; c++) {
      const rx = (Math.random() - 0.5) * 3.6
      const rz = (Math.random() - 0.5) * 3.6
      if (Math.abs(rx) > 1.4 || Math.abs(rz) > 1.4) {
        const isCap = c % 2 === 0
        const smdGeo = new THREE.BoxGeometry(0.24, 0.1, 0.14)
        const smd = new THREE.Mesh(smdGeo, isCap ? smdCapMat : smdMat)
        smd.position.set(rx, pcbThickness / 2 + 0.05, rz + 0.2)
        smd.rotation.y = (Math.PI / 2) * Math.floor(Math.random() * 2)
        boardGroup.add(smd)
      }
    }

    // Raycasting for pin clicks
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (e: MouseEvent) => {
      isInteracting.current = true
      pointerDownPos.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e: MouseEvent) => {
      if (!isInteracting.current) return
      const dx = e.clientX - pointerDownPos.current.x
      const dy = e.clientY - pointerDownPos.current.y
      targetRot.current.y += dx * 0.007
      targetRot.current.x = Math.max(-0.4, Math.min(1.2, targetRot.current.x + dy * 0.007))
      pointerDownPos.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = (e: MouseEvent) => {
      isInteracting.current = false
      // Click detection if movement was small
      const rect = renderer.domElement.getBoundingClientRect()
      const clickDist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y)
      if (clickDist < 5) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(boardGroup.children)
        for (const hit of intersects) {
          if (hit.object.userData && hit.object.userData.pin) {
            onSelectPin(hit.object.userData.pin)
            break
          }
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomDist.current = Math.max(6, Math.min(16, zoomDist.current + e.deltaY * 0.01))
    }

    const dom = renderer.domElement
    dom.addEventListener("mousedown", onPointerDown)
    window.addEventListener("mousemove", onPointerMove)
    window.addEventListener("mouseup", onPointerUp)
    dom.addEventListener("wheel", onWheel, { passive: false })

    // Resize handler
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    // Animation Loop
    let clock = new THREE.Clock()
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth rotation damping
      rotAngles.current.x += (targetRot.current.x - rotAngles.current.x) * 0.1
      rotAngles.current.y += (targetRot.current.y - rotAngles.current.y) * 0.1

      boardGroup.rotation.x = rotAngles.current.x
      boardGroup.rotation.y = rotAngles.current.y

      // Idle float breathing motion
      if (!isInteracting.current) {
        boardGroup.position.y = Math.sin(elapsed * 1.5) * 0.08
      }

      // Dynamic LED blinking patterns
      if (isPowered) {
        const heartbeat = (Math.sin(elapsed * 6) + 1) * 0.5 > 0.4 ? 1.8 : 0.2
        const rxActivity = Math.random() > 0.6 ? 1.6 : 0.1
        if (ledLightsRef.current[1]) ledLightsRef.current[1].intensity = heartbeat
        if (ledLightsRef.current[3]) ledLightsRef.current[3].intensity = rxActivity
      } else {
        ledLightsRef.current.forEach((l) => (l.intensity = 0))
      }

      // Smooth camera motion toward presets
      camera.position.lerp(targetCamPos.current, 0.06)
      camera.lookAt(targetCamLook.current)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", onResize)
      dom.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("mousemove", onPointerMove)
      window.removeEventListener("mouseup", onPointerUp)
      dom.removeEventListener("wheel", onWheel)
      renderer.dispose()
      if (container.contains(dom)) container.removeChild(dom)
    }
  }, [isPowered])

  // Update pin colors when activePin changes
  useEffect(() => {
    pinMeshesRef.current.forEach((mesh, pinId) => {
      const isSelected = pinId === activePin.id
      mesh.material = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : 0xe5b342,
        emissive: isSelected ? 0x0284c7 : 0x000000,
        emissiveIntensity: isSelected ? 2.0 : 0.0,
        metalness: 0.9,
        roughness: isSelected ? 0.1 : 0.25,
      })
    })
  }, [activePin])

  // Camera preset handler
  const setPreset = (preset: "iso" | "top" | "mcu" | "pins") => {
    setCameraPreset(preset)
    if (preset === "iso") {
      targetCamPos.current.set(7, 6, 8)
      targetCamLook.current.set(0, 0, 0)
      targetRot.current = { x: 0.55, y: -0.65 }
    } else if (preset === "top") {
      targetCamPos.current.set(0, 11, 0.1)
      targetCamLook.current.set(0, 0, 0)
      targetRot.current = { x: 1.57, y: 0 }
    } else if (preset === "mcu") {
      targetCamPos.current.set(0, 3.8, 3.2)
      targetCamLook.current.set(0, 0, 0.2)
      targetRot.current = { x: 0.35, y: 0 }
    } else if (preset === "pins") {
      targetCamPos.current.set(5.5, 3.5, 4.5)
      targetCamLook.current.set(2.4, 0, 0)
      targetRot.current = { x: 0.4, y: -0.9 }
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl flex flex-col">
      {/* Top Instrumentation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isPowered ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-700"
              }`}
            />
            <span className="font-semibold tracking-wider text-slate-200">
              BOARD {isPowered ? "[ONLINE]" : "[POWER OFF]"}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">STM32F401RET6 · 84MHz ARM</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-emerald-400 hidden md:inline">ENIG GOLD · 4-LAYER FR4</span>
        </div>

        {/* Tactile Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Power Switch */}
          <button
            onClick={onTogglePower}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all border ${
              isPowered
                ? "bg-emerald-950/70 border-emerald-600 text-emerald-300 hover:bg-emerald-900/80"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
            }`}
          >
            PWR: {isPowered ? "ON (3.3V)" : "OFF"}
          </button>

          {/* Firmware Mode Segmented Control */}
          <select
            value={firmwareMode}
            onChange={(e) => onChangeMode(e.target.value)}
            disabled={!isPowered}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-40"
          >
            <option value="RTOS_SCHEDULER">FW: FreeRTOS Tick</option>
            <option value="CAN_TELEMETRY">FW: CAN Bus Broadcast</option>
            <option value="PWM_MOTOR">FW: PWM Actuator</option>
            <option value="ADC_STREAM">FW: ADC 1MSPS Stream</option>
          </select>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-radial from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Overlay Grid lines & engineering crosshairs */}
        <div className="absolute inset-0 pointer-events-none border border-slate-800/40">
          <div className="absolute top-3 left-3 font-mono text-[10px] text-slate-500 space-y-0.5">
            <div>3D HARDWARE WORKBENCH</div>
            <div>DRAG TO ROTATE · SCROLL TO ZOOM</div>
            <div>CLICK ANY PIN TO PROBE SIGNAL</div>
          </div>
          <div className="absolute top-3 right-3 font-mono text-[10px] text-right text-slate-500">
            <div>X: 64.0mm · Y: 92.0mm</div>
            <div>ENIG FINISH · COPPER 2oz</div>
          </div>
        </div>

        {/* Camera Preset Toolbar */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10 font-mono text-[11px]">
          <span className="px-2 py-1 bg-slate-900/90 text-slate-400 rounded border border-slate-800 text-[10px] hidden sm:inline">
            CAMERA:
          </span>
          {[
            { id: "iso", label: "Isometric" },
            { id: "top", label: "Top (PCB Layout)" },
            { id: "mcu", label: "MCU Core" },
            { id: "pins", label: "Pin Header" },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setPreset(preset.id as any)}
              className={`px-2.5 py-1 rounded border transition-all ${
                cameraPreset === preset.id
                  ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-semibold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Active Pin Floating Tag */}
        <div className="absolute bottom-3 right-3 z-10 font-mono text-xs bg-slate-900/95 border border-cyan-500/60 rounded-lg p-2.5 shadow-xl max-w-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-cyan-400">PROBE: {activePin.name}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
              {activePin.alt}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 leading-tight">{activePin.description}</div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
            <span>GPIO: {activePin.gpio}</span>
            <span>VOLT: {activePin.voltage}</span>
          </div>
        </div>
      </div>

      {/* Quick Pin Selector Bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider shrink-0">TEST POINTS:</span>
        {BOARD_PINS.map((pin) => (
          <button
            key={pin.id}
            onClick={() => onSelectPin(pin)}
            className={`px-2.5 py-1 rounded transition-all shrink-0 border ${
              activePin.id === pin.id
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            {pin.name} ({pin.alt.split(" ")[0]})
          </button>
        ))}
      </div>
    </div>
  )
}

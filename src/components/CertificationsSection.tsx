import { useState } from "react"

export interface CertItem {
  title: string
  issuer: string
  date: string
  type: "Completion" | "Internship" | "Award" | "Leadership" | "Achievement" | "Membership" | "Participation"
  color: string
  description: string
  code?: string
}

export const VERIFIED_CERTS: CertItem[] = [
  {
    title: "KSEBL Internship – 110 KV Substation",
    issuer: "Kerala State Electricity Board Limited",
    date: "Jul 2025",
    type: "Internship",
    color: "#16a34a",
    code: "HRD/Ind.Trg/2025-26/2025060818054/1",
    description: "Completed intensive industrial internship training at 110 KV Substation, Irinjalakuda, Thrissur (03-Jul-2025 to 11-Jul-2025).",
  },
  {
    title: "Allied Technologies for UAS / Drone Boot Camp",
    issuer: "NIELIT Calicut / MeitY / IEEE Kerala Section",
    date: "Feb 2025",
    type: "Completion",
    color: "#2563eb",
    code: "C3757",
    description: "One-week offline boot camp on Drone & Unmanned Aircraft Systems hardware, avionics, sensors, and robotics funded by Ministry of Electronics & IT.",
  },
  {
    title: "Embedded Systems Certification Course",
    issuer: "Elewayte",
    date: "Jul 2025",
    type: "Completion",
    color: "#7c3aed",
    code: "CC320256795",
    description: "Completed rigorous embedded systems training curriculum covering microcontrollers, embedded C, peripheral interfacing, and debugging (May-Jun 2025).",
  },
  {
    title: "AI Awareness & Foundation – AI for Future Workforce",
    issuer: "Dell Technologies / Intel / Sahrdaya CET",
    date: "Apr 2025",
    type: "Completion",
    color: "#0891b2",
    code: "AI4FWDTS300425236",
    description: "Completed foundational AI and digital readiness curriculum conducted at Sahrdaya CET in collaboration with Intel and Dell Technologies.",
  },
  {
    title: "Digital 101 – 30 Hours (Gold Category)",
    issuer: "FutureSkills Prime / NASSCOM / MeitY",
    date: "Dec 2024",
    type: "Completion",
    color: "#d97706",
    code: "FSP/2024/12/10190180",
    description: "Cleared the official government & industry standard assessment with Gold Category honors (70%+ score threshold).",
  },
  {
    title: "Be10X AI Tools & ChatGPT Workshop",
    issuer: "Be10X",
    date: "Jul 2026",
    type: "Completion",
    color: "#db2777",
    description: "Hands-on engineering workshop on applying modern AI workflows, rapid code prototyping, and data synthesis.",
  },
  {
    title: "Best Project Award – 'E-Savu'",
    issuer: "Sahrdaya College of Engineering & Technology",
    date: "Mar 2025",
    type: "Award",
    color: "#16a34a",
    description: "Awarded Best Project in Electrical & Electronics Engineering during academic project evaluation for the 2024-2025 academic year.",
  },
  {
    title: "Secretary – IEEE Signal Processing Society (SPS)",
    issuer: "IEEE Sahrdaya SB (Execom '25)",
    date: "2025",
    type: "Leadership",
    color: "#2563eb",
    description: "Elected Secretary of IEEE SPS chapter; managed technical symposiums, workshops, and student engineering hackathons.",
  },
  {
    title: "How Engineers Can Stand Out to Employers",
    issuer: "Siemens",
    date: "May 2025",
    type: "Achievement",
    color: "#0891b2",
    description: "Certificate of Achievement for successfully completing Siemens industrial engineering career and technical presentation course.",
  },
  {
    title: "IEEE Student Membership 2026",
    issuer: "IEEE (Institute of Electrical & Electronics Engineers)",
    date: "2026",
    type: "Membership",
    color: "#d97706",
    description: "Student Member in good standing through December 2026, denoting professional commitment to technical excellence.",
  },
  {
    title: "IEEE Control Systems Society Membership 2026",
    issuer: "IEEE Control Systems Society",
    date: "2026",
    type: "Membership",
    color: "#7c3aed",
    description: "Active society member focusing on feedback control, modern state-space controllers, and autonomous systems.",
  },
  {
    title: "IEEE Signal Processing Society Membership 2026",
    issuer: "IEEE Signal Processing Society",
    date: "2026",
    type: "Membership",
    color: "#db2777",
    description: "Active society member engaged in digital filter design, sensor DSP algorithms, and edge audio/image processing.",
  },
  {
    title: "IEEE Student Membership 2025",
    issuer: "IEEE",
    date: "2025",
    type: "Membership",
    color: "#d97706",
    description: "Student Member in good standing through December 2025.",
  },
  {
    title: "IEEE YESS'25 – Yearly Engineering Students Summit",
    issuer: "IEEE Kerala Section / IEEE LINK",
    date: "Sep 2025",
    type: "Participation",
    color: "#16a34a",
    description: "Participated in the premier statewide engineering leadership and innovation summit at NIT Calicut.",
  },
  {
    title: "MINDMESH – IEEE YESS'25 Technical Event",
    issuer: "IEEE SB RSET / IEEE Kerala Section",
    date: "Sep 2025",
    type: "Participation",
    color: "#2563eb",
    description: "Competed in the MINDMESH engineering challenge conducted as part of YESS'25 at National Institute of Technology Calicut.",
  },
  {
    title: "AI Image Generation – Myth & Future Tech",
    issuer: "IEEE SPS Sahrdaya SB",
    date: "Mar 2025",
    type: "Participation",
    color: "#7c3aed",
    description: "Participated in the prompt engineering and generative modeling competition held on 16th March 2025.",
  },
  {
    title: "Navigating Engineering as Friends: Success Story Gateway",
    issuer: "IEEE CSS SBC CET",
    date: "Mar 2025",
    type: "Participation",
    color: "#0891b2",
    description: "Attended technical session on engineering transition and career trajectory hosted by IEEE Control Systems Society CET.",
  },
  {
    title: "WiE Doodle Competition",
    issuer: "IEEE Women in Engineering (WiE), Sahrdaya SB",
    date: "2025",
    type: "Participation",
    color: "#db2777",
    description: "Participated in technical schematic and creative illustration challenge organized by WiE affinity group.",
  },
  {
    title: "Tech Trivia – National Digital Library of India",
    issuer: "NDLI Club / IIT Kharagpur / Sahrdaya",
    date: "Oct 2024",
    type: "Participation",
    color: "#d97706",
    description: "Participated in national level technical assessment conducted by NDLI partner club on 26th October 2024.",
  },
  {
    title: "Professional Career Counselling Webinar",
    issuer: "Elewayte",
    date: "Nov 2024",
    type: "Participation",
    color: "#16a34a",
    code: "51874",
    description: "Participated in specialized guidance program on core engineering recruitment and firmware roles.",
  },
]

const CATEGORIES = [
  "All",
  "Completion",
  "Internship",
  "Award",
  "Leadership",
  "Achievement",
  "Membership",
  "Participation",
] as const

export function CertificationsSection() {
  const [selectedCat, setSelectedCat] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = VERIFIED_CERTS.filter((cert) => {
    const matchesCat = selectedCat === "All" || cert.type === selectedCat
    const matchesQuery =
      searchQuery === "" ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesQuery
  })

  return (
    <section id="certifications" className="py-24 border-t border-slate-800/80 bg-slate-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-semibold">
              DOCUMENTED CREDENTIALS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Verified Engineering Certifications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            All 20 verified credentials cataloged from industrial training, professional societies (IEEE), government initiatives (NIELIT, MeitY), and technical courses.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 font-mono text-xs">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? VERIFIED_CERTS.length : VERIFIED_CERTS.filter((c) => c.type === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                    selectedCat === cat
                      ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter credentials..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs font-mono"
            />
          </div>
        </div>

        {/* Certificate Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cert, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3 font-mono text-[11px]">
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${cert.color}15`,
                      color: cert.color,
                      border: `1px solid ${cert.color}35`,
                    }}
                  >
                    {cert.type}
                  </span>
                  <span className="text-slate-400 font-medium">{cert.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                  {cert.title}
                </h3>

                <p className="text-xs font-medium text-slate-400 mt-1 font-mono">
                  {cert.issuer}
                </p>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {cert.code && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ID: {cert.code}</span>
                  <span className="text-emerald-400 font-semibold">VERIFIED</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-mono text-xs">
            No certifications found matching your filter criteria.
          </div>
        )}
      </div>
    </section>
  )
}

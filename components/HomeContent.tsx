'use client'

import { useVersion } from './VersionToggle'
import { investorContent } from '../lib/investor-content'
import ContactForm from './ContactForm'
import SiteFooter from './SiteFooter'

type ContentType = typeof investorContent

export default function HomeContent({ originalContent }: { originalContent: ContentType }) {
  const { version } = useVersion()
  const c = version === 'investor' ? investorContent : originalContent

  return (
    <>
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(232,93,47,0.12)_0%,transparent_70%)]" />

        <div className="relative inline-flex items-center gap-2 bg-[rgba(232,93,47,0.12)] border border-[rgba(232,93,47,0.3)] text-[#f0923a] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e85d2f] animate-pulse" />
          <span data-field="heroBadge">{c.heroBadge}</span>
        </div>

        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-[-0.04em] leading-[1.05] max-w-4xl">
          <span data-field="heroHeadline">{c.heroHeadline}</span><br />
          <span data-field="heroHeadlineAccent" className="bg-gradient-to-br from-[#e85d2f] to-[#f0923a] bg-clip-text text-transparent">
            {c.heroHeadlineAccent}
          </span>
        </h1>

        <p data-field="heroSubtext" className="mt-6 text-lg text-[#888] max-w-xl leading-relaxed">{c.heroSubtext}</p>

        <div className="relative z-10 flex gap-4 mt-10 flex-wrap justify-center">
          <a href="#how-it-works" className="inline-flex items-center gap-2 bg-[#e85d2f] text-white font-semibold px-7 py-3 rounded-lg no-underline hover:bg-[#f0923a] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,93,47,0.35)]">
            {version === 'investor' ? 'See the Opportunity →' : 'See How It Works →'}
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 border border-[#2a2a2a] text-[#f0ede8] font-semibold px-7 py-3 rounded-lg no-underline hover:border-[#888] transition-all hover:-translate-y-0.5">
            {version === 'investor' ? 'Request Pitch Deck' : 'Get in Touch'}
          </a>
        </div>

        <div className="flex gap-12 mt-20 pt-10 border-t border-[#2a2a2a] flex-wrap justify-center">
          {c.heroStats?.map((stat: { value: string; label: string }, i: number) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-extrabold tracking-[-0.04em] bg-gradient-to-b from-[#f0ede8] to-[#888] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-[#888] uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#2a2a2a]" />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">{version === 'investor' ? 'The Problem' : 'How It Works'}</p>
            <h2 data-field="howTitle" className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-5">{c.howTitle}</h2>
            <p data-field="howDescription" className="text-[#888] leading-relaxed mb-8">{c.howDescription}</p>
            <div className="flex flex-col gap-3">
              {c.howPoints?.map((point: { title: string; description: string }, i: number) => (
                <div key={i} className="flex gap-4 p-5 bg-[#111] border border-[#2a2a2a] rounded-xl hover:border-[rgba(232,93,47,0.35)] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#e85d2f] mt-1.5 shrink-0" />
                  <div>
                    <h4 data-field={`howPoints[${i}].title`} className="font-bold text-sm mb-1">{point.title}</h4>
                    <p data-field={`howPoints[${i}].description`} className="text-[#888] text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl aspect-[4/3] flex items-center justify-center">
            <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
              <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spinR { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                @keyframes piston1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(18px); } }
                @keyframes piston2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
                .r1 { animation: spin 8s linear infinite; transform-origin: 110px 110px; }
                .r2 { animation: spinR 5s linear infinite; transform-origin: 110px 110px; }
                .r3 { animation: spin 12s linear infinite; transform-origin: 110px 110px; }
                .p1 { animation: piston1 1.5s ease-in-out infinite; }
                .p2 { animation: piston2 1.5s ease-in-out infinite; }
              `}</style>
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(232,93,47,0.2)" strokeWidth="1.5" strokeDasharray="4 8" className="r1" />
              <circle cx="110" cy="110" r="75" fill="none" stroke="rgba(240,146,58,0.4)" strokeWidth="1.5" strokeDasharray="2 6" className="r2" />
              <circle cx="110" cy="110" r="50" fill="none" stroke="#e85d2f" strokeWidth="1.5" className="r3" />
              <circle cx="110" cy="110" r="28" fill="#1a1a1a" stroke="#e85d2f" strokeWidth="1.5" />
              <rect x="95" y="62" width="30" height="16" rx="4" fill="#e85d2f" className="p1" />
              <rect x="95" y="142" width="30" height="16" rx="4" fill="#e85d2f" className="p2" />
              <text x="110" y="114" textAnchor="middle" fill="#f0ede8" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="700">UniMod</text>
            </svg>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#2a2a2a]" />

      {/* ── TECHNOLOGY ── */}
      <section id="technology" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p data-field="techTitle" className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">{c.techTitle}</p>
            <h2 data-field="techSubtitle" className="text-4xl font-extrabold tracking-[-0.03em] leading-tight">{c.techSubtitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {c.techFeatures?.map((f: { icon: string; title: string; description: string }, i: number) => (
              <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-7 hover:border-[rgba(232,93,47,0.4)] hover:-translate-y-1 transition-all">
                <div className="w-11 h-11 bg-[rgba(232,93,47,0.1)] border border-[rgba(232,93,47,0.25)] rounded-xl flex items-center justify-center text-xl mb-5">
                  <span data-field={`techFeatures[${i}].icon`}>{f.icon}</span>
                </div>
                <h3 data-field={`techFeatures[${i}].title`} className="font-bold mb-2">{f.title}</h3>
                <p data-field={`techFeatures[${i}].description`} className="text-[#888] text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[#2a2a2a]" />

      {/* ── POWER SPLIT ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">Power Architecture</p>
            <h2 data-field="powerTitle" className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-5">Hydraulic-first power delivery</h2>
            <p data-field="powerDescription" className="text-[#888] leading-relaxed">
              Unlike conventional engines that output rotational torque through a crankshaft, the UniMod directly pressurizes hydraulic fluid — unlocking a more efficient pathway to both motion and electrical generation.
            </p>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8">
            <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-6">Power Output Split</p>
            {[
              { label: 'Hydraulic Output', value: 90, display: '90%' },
              { label: 'Electrical Output', value: 10, display: '10%' },
              { label: 'Efficiency vs. Conventional ICE', value: 72, display: '+28%', accent: true },
            ].map((bar) => (
              <div key={bar.label} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#888]">{bar.label}</span>
                  <span className={`font-bold ${bar.accent ? 'text-[#e85d2f]' : ''}`}>{bar.display}</span>
                </div>
                <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f0923a]" style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-[#888] leading-relaxed mt-5">
              Hydraulic energy storage via accumulator enables near-instant power delivery and lossless energy recovery during braking or load reduction events.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#2a2a2a]" />

      {/* ── APPLICATIONS ── */}
      <section id="applications" className="py-24 px-6 bg-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-12">
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">{version === 'investor' ? 'Market Opportunity' : 'Applications'}</p>
            <h2 data-field="appsTitle" className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-4">{c.appsTitle}</h2>
            <p data-field="appsSubtitle" className="text-[#888]">{c.appsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {c.applications?.map((app: { title: string; description: string; tags: string[] }, i: number) => (
              <div key={i} className="border border-[#2a2a2a] rounded-2xl p-10 bg-[#0a0a0a] relative overflow-hidden group hover:border-[rgba(232,93,47,0.4)] transition-colors">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e85d2f] to-[#f0923a] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-6xl font-extrabold tracking-[-0.05em] text-[#2a2a2a] leading-none mb-4">0{i + 1}</div>
                <h3 data-field={`applications[${i}].title`} className="text-xl font-bold tracking-tight mb-3">{app.title}</h3>
                <p data-field={`applications[${i}].description`} className="text-[#888] text-sm leading-relaxed mb-5">{app.description}</p>
                <div className="flex flex-wrap gap-2">
                  {app.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[rgba(232,93,47,0.1)] border border-[rgba(232,93,47,0.2)] text-[#f0923a]">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[#2a2a2a]" />

      {/* ── COMPANY ── */}
      <section id="company" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">{version === 'investor' ? 'Traction & Team' : 'Company'}</p>
            <h2 data-field="companyTitle" className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-5">{c.companyTitle}</h2>
            <p data-field="companyDescription" className="text-[#888] leading-relaxed mb-4">{c.companyDescription}</p>
            <p data-field="companyLocation" className="text-[#888] leading-relaxed mb-8">{c.companyLocation}</p>
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#e85d2f] text-white font-semibold px-7 py-3 rounded-lg no-underline hover:bg-[#f0923a] transition-all hover:-translate-y-0.5">
              {version === 'investor' ? 'Request Pitch Deck →' : 'Talk to the Team →'}
            </a>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 flex flex-col gap-5">
            {c.teamMembers?.map((member: { name: string; role: string; initials: string }, i: number) => (
              <div key={i} className={`flex items-center gap-4 ${i < (c.teamMembers?.length ?? 0) - 1 ? 'pb-5 border-b border-[#2a2a2a]' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg ${i === 0 ? 'bg-gradient-to-br from-[#e85d2f] to-[#f0923a]' : 'bg-gradient-to-br from-[#3a8ef0] to-[#5fb4f5]'}`}>
                  {member.initials}
                </div>
                <div>
                  <div data-field={`teamMembers[${i}].name`} className="font-bold">{member.name}</div>
                  <div data-field={`teamMembers[${i}].role`} className="text-xs text-[#888]">{member.role}</div>
                </div>
              </div>
            ))}
            <div className="mt-2 p-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <p className="text-sm text-[#888] leading-relaxed italic">&ldquo;<span data-field="companyQuote">{c.companyQuote}</span>&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#2a2a2a]" />

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 bg-[#111]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">Contact</p>
            <h2 data-field="contactTitle" className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-4">{c.contactTitle}</h2>
            <p data-field="contactSubtext" className="text-[#888] leading-relaxed mb-10">{c.contactSubtext}</p>
            <div className="flex flex-col gap-5">
              {[
                { icon: '📍', label: 'Location', value: c.contactLocation, field: 'contactLocation' },
                { icon: '📞', label: 'Phone (EST)', value: c.contactPhone, field: 'contactPhone' },
                { icon: '👥', label: 'Key Contacts', value: c.contactNames, field: 'contactNames' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[rgba(232,93,47,0.1)] border border-[rgba(232,93,47,0.2)] rounded-xl flex items-center justify-center text-base shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#888] mb-0.5">{item.label}</div>
                    <div data-field={item.field} className="font-medium text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </>
  )
}

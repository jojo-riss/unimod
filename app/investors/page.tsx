import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import PageHeader from '../../components/PageHeader'
import ContactForm from '../../components/ContactForm'

export const metadata = {
  title: 'Investors — Unimod Motors',
  description: 'Investment opportunities in UniMod engine technology. Raising $24M for beta production and national rollout.',
}

export default function InvestorsPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#f0ede8] font-sans antialiased min-h-screen">
      <SiteNav />
      <PageHeader
        label="Investors"
        title="Seeking Investors"
        subtitle="UniMod leverages a strategy of Rapid Scaling through modular manufacturing and strategic licensing."
      />

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] leading-tight mb-6">Rapid Scaling Strategy</h2>
            <p className="text-[#888] leading-relaxed mb-6">
              Backed by existing patent protections (Patent 8,671,681 B1), Unimod Motors is currently raising
              <span className="text-[#e85d2f] font-bold"> $24 million</span> to finance the beta production version
              and launch a National Rollout of the UniMod power system.
            </p>
            <p className="text-[#888] leading-relaxed mb-8">
              This transition will facilitate mass production and global distribution, ensuring that our
              stewardship-focused technology reaches those who need it most.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Raising', value: '$24M' },
                { label: 'Patent', value: '8,671,681 B1' },
                { label: 'Stage', value: 'Beta Production' },
                { label: 'Strategy', value: 'National Rollout' },
              ].map((item) => (
                <div key={item.label} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                  <div className="text-xs text-[#888] uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Two Markets, One Platform</h3>
            <div className="flex flex-col gap-3">
              {[
                { title: 'Vehicle Propulsion', desc: 'Hydraulic hybrid drivetrain for trucks, buses, and fleet vehicles — with regenerative braking and zero battery degradation.' },
                { title: 'Building Energy', desc: 'On-site power generation providing electricity, heating, cooling, and mechanical power from a single modular system.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 bg-[#111] border border-[#2a2a2a] rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-[#e85d2f] mt-1.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-[#888] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Request Information</h3>
            <p className="text-[#888] text-sm mb-6 leading-relaxed">
              Interested in learning more about investment opportunities? Fill out the form below and our team will get back to you.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

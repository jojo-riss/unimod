export default function PageHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="pt-32 pb-16 px-6 border-b border-[#2a2a2a]">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-4">{label}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] leading-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-[#888] max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  )
}

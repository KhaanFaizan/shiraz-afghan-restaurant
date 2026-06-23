import AnimatedSection from './AnimatedSection'

/**
 * Reusable section heading:
 *   • eyebrow label (small caps)
 *   • main title (display font)
 *   • decorative gold divider
 *   • optional subtitle paragraph
 */
export default function SectionHeading({
  label,
  title,
  subtitle,
  center = true,
  light = false,
}) {
  const align = center ? 'text-center items-center' : 'text-left items-start'
  const textColor = light ? 'text-[#0a0a0a]' : 'text-[#f7efe2]'

  return (
    <div className={`flex flex-col gap-4 ${align}`}>
      <AnimatedSection>
        <span className="text-[#c2844b] text-[10px] tracking-[0.55em] uppercase font-medium">
          {label}
        </span>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <h2 className={`font-display text-4xl md:text-5xl leading-tight ${textColor}`}>
          {title}
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.18}>
        <div className={`flex gap-3 ${center ? 'justify-center' : ''}`}>
          <div className="w-10 h-px bg-[#c2844b] self-center" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c2844b] shrink-0" />
          <div className="w-10 h-px bg-[#c2844b] self-center" />
        </div>
      </AnimatedSection>

      {subtitle && (
        <AnimatedSection delay={0.26}>
          <p className="text-[#c8bfb3] max-w-xl leading-relaxed text-base">
            {subtitle}
          </p>
        </AnimatedSection>
      )}
    </div>
  )
}

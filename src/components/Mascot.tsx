import { MASCOT, MASCOT_NAME, type MascotPose, type MascotVariant } from '../brand/mascot'
import { useApp } from '../app/store'
import { tr } from '../utils/text'

const url = (path: string) => `${import.meta.env.BASE_URL}${path}`

interface Props {
  pose?: MascotPose
  /** `illustration` = full character; `avatar` = head crop for small sizes */
  variant?: MascotVariant
  /** rendered CSS size in px (the image is always square — never distorted or cropped by object-fit) */
  size: number
  /** purely decorative next to text that already names the product: empty alt, hidden from assistive tech */
  decorative?: boolean
  eager?: boolean
  className?: string
}

export function Mascot({ pose = 'welcome', variant = 'illustration', size, decorative = false, eager = false, className = '' }: Props) {
  const { lang } = useApp()
  const a = (MASCOT[pose] ?? MASCOT.welcome)[variant]
  const alt = decorative ? '' : variant === 'avatar' ? tr(MASCOT_NAME, lang) : tr((MASCOT[pose] ?? MASCOT.welcome).alt, lang)
  return (
    <img
      className={`mascot mascot--${variant} ${className}`.trim()}
      src={url(a.large)}
      srcSet={`${url(a.small)} ${a.smallPx}w, ${url(a.large)} ${a.largePx}w`}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  )
}

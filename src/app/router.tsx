import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'

const read = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, qs = ''] = raw.split('?')
  const parts = path.split('/').filter(Boolean)
  return { path: '/' + parts.join('/'), parts, query: new URLSearchParams(qs) }
}

export type Route = ReturnType<typeof read>

export function useRoute(): Route {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const navigate = (to: string) => {
  window.location.hash = to
}

export function goBack(fallback: string) {
  if (window.history.length > 1) window.history.back()
  else navigate(fallback)
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  children: ReactNode
}
export function A({ to, children, ...rest }: LinkProps) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  )
}

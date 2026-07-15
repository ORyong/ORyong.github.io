import { useEffect, useRef, useState } from 'react'

const VIDEO_URL = '/assets/mainframe-background.mp4'
const SENSITIVITY = 0.8
const TYPEWRITER_TEXT =
  "Stay humble, remain critical. I build software, explore science, and turn curious ideas into useful tools."
const EMAIL = 'shan@live.cn'

const navigation = [
  { label: 'Blog', href: 'https://ww-fs.com/' },
  { label: 'GitHub', href: 'https://github.com/ORyong' },
  { label: 'RSS', href: 'https://ww-fs.com/rss.xml' },
]
const actions = [
  { label: 'Read my blog', href: 'https://ww-fs.com/' },
  { label: 'Explore GitHub', href: 'https://github.com/ORyong' },
]

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)

    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      let index = 0
      intervalId = window.setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))

        if (index >= text.length) {
          window.clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="3" width="7" height="7" rx="0.8" stroke="currentColor" />
      <rect x="4" y="1" width="7" height="7" rx="0.8" stroke="currentColor" />
    </svg>
  )
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previousXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionsVisible, setActionsVisible] = useState(false)
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT)

  useEffect(() => {
    const timer = window.setTimeout(() => setActionsVisible(true), 400)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const video = videoRef.current
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
        previousXRef.current = event.clientX
        return
      }

      if (previousXRef.current === null) {
        previousXRef.current = event.clientX
        return
      }

      const delta = event.clientX - previousXRef.current
      previousXRef.current = event.clientX
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTimeRef.current = Math.min(
        video.duration,
        Math.max(0, targetTimeRef.current + offset),
      )

      if (
        !seekingRef.current &&
        Math.abs(video.currentTime - targetTimeRef.current) > 0.01
      ) {
        seekingRef.current = true
        video.currentTime = targetTimeRef.current
      }
    }

    const resetPointer = () => {
      previousXRef.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('blur', resetPointer)
    document.addEventListener('mouseleave', resetPointer)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('blur', resetPointer)
      document.removeEventListener('mouseleave', resetPointer)
    }
  }, [])

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    targetTimeRef.current = video.currentTime
  }

  const handleSeeked = () => {
    const video = videoRef.current
    if (!video) return

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      video.currentTime = targetTimeRef.current
      return
    }

    seekingRef.current = false
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="relative h-screen overflow-hidden bg-white">
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center]"
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}
        aria-hidden="true"
      />

      <nav className="fixed left-0 top-0 z-10 flex w-full items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <a href="#" className="relative z-10 flex items-center gap-3 text-black" aria-label="ORyong home">
          <span
            className="text-[21px] tracking-tight sm:text-[26px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ORyong
          </span>
          <span
            className="select-none text-[25px] tracking-[-0.02em] sm:text-[30px]"
            aria-hidden="true"
          >
            ✳︎
          </span>
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center text-[23px] text-black md:flex">
          {navigation.map((item, index) => (
            <span key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition-opacity hover:opacity-60"
              >
                {item.label}
              </a>
              {index < navigation.length - 1 && ', '}
            </span>
          ))}
        </div>

        <a
          href={`mailto:${EMAIL}`}
          className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Get in touch
        </a>

        <button
          type="button"
          className="relative z-10 flex flex-col gap-[5px] p-1 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`h-[2px] w-6 bg-black transition-all duration-300 ${
              menuOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-black transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-black transition-all duration-300 ${
              menuOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        {navigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="text-[32px] font-medium text-black transition-opacity hover:opacity-60"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            {item.label}
          </a>
        ))}
        <a
          href={`mailto:${EMAIL}`}
          className="text-[32px] font-medium text-black underline underline-offset-2 transition-opacity hover:opacity-60"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          Get in touch
        </a>
      </div>

      <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          <p
            className="pointer-events-none mb-5 select-none whitespace-pre-line text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              filter: 'blur(4px)',
            }}
          >
            {'ORyong - ideas, code, and curiosity.\nBuilding useful things for science and the web'}
          </p>

          <p
            className="mb-5 min-h-[54px] text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
            }}
            aria-label={TYPEWRITER_TEXT}
          >
            <span aria-hidden="true">{displayed}</span>
            {!done && (
              <span
                aria-hidden="true"
                className="typewriter-cursor ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-black"
              />
            )}
          </p>

          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: actionsVisible ? 1 : 0,
              transform: actionsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {action.label}
              </a>
            ))}

            <button
              type="button"
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"

              onClick={() => navigator.clipboard.writeText(EMAIL)}
              aria-label={`Copy ${EMAIL}`}
            >
              <span>
                Email me: <span className="underline underline-offset-1">{EMAIL}</span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App

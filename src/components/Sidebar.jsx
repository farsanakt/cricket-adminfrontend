import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard,
  Activity,
  Users,
  UserCog,
  BookOpen,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Shield,
  ClipboardList,
  Dumbbell,
  FileText,
  Menu,
  X,
} from 'lucide-react'
import logo from '../assets/company-logo.png'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'players', label: 'Players', icon: Users, path: '/players' },
   {
    id: 'exercises',
    label: 'Exercises',
    icon: Dumbbell,
    path: '/exercises',
  },
  { id: 'daily-report', label: 'Daily Report', icon: BookOpen, path: '/report-form' },
  {
    id: 'physio',
    label: 'Physio',
    icon: Activity,
    path: '/physio',
    children: [
      { id: 'physio-consultation', label: 'Consultation', icon: ClipboardList, path: '/consultation' },
      { id: 'physio-rehab', label: 'Rehab Program', icon: Dumbbell, path: '/rehab' },
      { id: 'physio-assessment', label: 'Assessment', icon: Activity, path: '/assessment' },
      { id: 'physio-reports', label: 'Reports', icon: FileText, path: '/physio/reports' },
    ],
  },
  { id: 'nutrition', label: 'Nutrition', icon: BookOpen, path: '/nutrition' },
  { id: 'coach', label: 'Coach', icon: Shield, path: '/coach' },
  { id: 'trainer', label: 'Trainer', icon: UserCog, path: '/trainer' },
  { id: 'reports', label: 'Reports', icon: BarChart2, path: '/reports' },
]

export default function Sidebar({ activePath = '/', onNavigate = () => {}, role = 'admin' }) {
  const [expanded, setExpanded] = useState({ physio: true })
  const [mobileOpen, setMobileOpen] = useState(false)
  // null = unknown, 'mobile', 'tablet', 'desktop'
  const [breakpoint, setBreakpoint] = useState('desktop')
  const overlayRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setBreakpoint('mobile')
      else if (w < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Close drawer on route change (mobile/tablet)
  useEffect(() => {
    setMobileOpen(false)
  }, [activePath])

  // Close drawer on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [mobileOpen])

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  const isActive = (path) => activePath === path
  const isGroupActive = (item) => item.children?.some((c) => activePath === c.path)

  const filteredItems = NAV_ITEMS.filter((item) => {
    if (role === 'admin') return true
    if (role === 'trainer') return item.path === '/trainer'
    if (role === 'physio') return item.id === 'physio'
    if (role === 'nutrition') return item.path === '/nutrition'
    if (role === 'coach') return item.path === '/coach'
    return false
  })

  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet'
  const isTablet = breakpoint === 'tablet'

  // --- Sidebar inner content (shared across all sizes) ---
  const SidebarContent = ({ compact = false }) => (
    <aside
      style={{
        width: compact ? '64px' : '260px',
        minWidth: compact ? '64px' : '260px',
        backgroundColor: '#0d2a63',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1f3f8a',
        userSelect: 'none',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* LOGO */}
      <div
        style={{
          padding: compact ? '22px 0 18px 0' : '22px 28px 18px 28px',
          borderBottom: '1px solid #1f3f8a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
        }}
      >
        {compact ? (
          <img src={logo} alt="Palaestra" style={{ width: '44px', height: 'auto', display: 'block' }} />
        ) : (
          <img src={logo} alt="Palaestra" style={{ height: '34px', width: 'auto', display: 'block', maxWidth: '100%' }} />
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
        {filteredItems.map((item) => {
          const Icon = item.icon
          const hasChildren = !!item.children && !compact
          const isOpen = expanded[item.id]
          const groupActive = isGroupActive(item)
          const itemActive = !hasChildren && isActive(item.path)
          const highlighted = groupActive || itemActive

          return (
            <div key={item.id}>
              <div
                title={compact ? item.label : undefined}
                onClick={() => {
                  if (compact) {
                    onNavigate(item.path)
                    return
                  }
                  if (hasChildren) {
                    toggle(item.id)
                    if (item.path) onNavigate(item.path)
                  } else {
                    onNavigate(item.path)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: compact ? '12px 0' : '10px 20px 10px 24px',
                  justifyContent: compact ? 'center' : 'flex-start',
                  cursor: 'pointer',
                  backgroundColor: itemActive || (groupActive && isOpen) ? '#ffffff' : 'transparent',
                  borderLeft: !compact && (groupActive || itemActive) ? '3px solid #2f9be0' : '3px solid transparent',
                  borderRight: compact && highlighted ? '3px solid #2f9be0' : '3px solid transparent',
                  transition: 'background 0.15s',
                  gap: compact ? '0' : '10px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!itemActive && !(groupActive && isOpen)) {
                    e.currentTarget.style.backgroundColor = '#16335f'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!itemActive && !(groupActive && isOpen)) {
                    e.currentTarget.style.backgroundColor = itemActive || (groupActive && isOpen) ? '#ffffff' : 'transparent'
                  }
                }}
              >
                <Icon size={compact ? 20 : 18} style={{ color: highlighted ? '#2f9be0' : '#9aa6bd', flexShrink: 0 }} />
                {!compact && (
                  <>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: highlighted ? '600' : '400', color: highlighted ? '#2f9be0' : '#cbd3e0' }}>
                      {item.label}
                    </span>
                    {hasChildren && (isOpen
                      ? <ChevronUp size={14} style={{ color: '#2f9be0' }} />
                      : <ChevronDown size={14} style={{ color: '#9aa6bd' }} />
                    )}
                  </>
                )}
              </div>

              {/* CHILD ITEMS */}
              {hasChildren && isOpen && !compact && (
                <div style={{ backgroundColor: '#123577' }}>
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const childActive = isActive(child.path)
                    return (
                      <div
                        key={child.id}
                        onClick={() => onNavigate(child.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 20px 9px 54px',
                          cursor: 'pointer',
                          backgroundColor: childActive ? '#ffffff' : 'transparent',
                          borderLeft: childActive ? '3px solid #2f9be0' : '3px solid transparent',
                        }}
                        onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.backgroundColor = '#16335f' }}
                        onMouseLeave={(e) => { if (!childActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <ChildIcon size={15} style={{ color: childActive ? '#2f9be0' : '#9aa6bd' }} />
                        <span style={{ fontSize: '13.5px', fontWeight: childActive ? '600' : '400', color: childActive ? '#2f9be0' : '#cbd3e0' }}>
                          {child.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div
        style={{
          padding: compact ? '14px 0' : '14px 24px',
          borderTop: '1px solid #1f3f8a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
          gap: compact ? '0' : '10px',
        }}
      >
        <div
          title={compact ? (role || 'Admin') : undefined}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#2f9be0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0,
          }}
        >
          {role?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        {!compact && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', textTransform: 'capitalize' }}>{role || 'Admin'}</div>
            <div style={{ fontSize: '11px', color: '#8a97b5' }}>cricket@system.com</div>
          </div>
        )}
      </div>
    </aside>
  )

  // ── DESKTOP: full sidebar ──
  if (breakpoint === 'desktop') {
    return <SidebarContent compact={false} />
  }

  // ── TABLET: icon-only sidebar (collapsed), no overlay needed ──
  if (isTablet) {
    return <SidebarContent compact={true} />
  }

  // ── MOBILE: hamburger + slide-in drawer ──
  return (
    <>
      {/* Hamburger toggle button */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        style={{
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: 1100,
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#2f9be0',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay backdrop */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            zIndex: 1050,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 1099,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        <SidebarContent compact={false} />
      </div>
    </>
  )
}
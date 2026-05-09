import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Mail, Users, Target, Trophy, Bot, Plane, Shield,
  BookOpen, Mic, FileText, GitBranch, BarChart3, Lock, Zap,
  ChevronLeft, ChevronRight, Sparkles, LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tooltip } from 'antd';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: Mail, label: 'Email Intelligence', path: '/email', badge: 12 },
      { icon: Target, label: 'Smart Priority', path: '/priority', badge: 5 },
      { icon: Users, label: 'Customer 360', path: '/customer360' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { icon: Zap, label: 'Proactive Intel', path: '/proactive', badge: 3 },
      { icon: Bot, label: 'AI Avatar', path: '/avatar' },
      { icon: Sparkles, label: 'Auto Actions', path: '/actions', badge: 8 },
      { icon: Mic, label: 'Voice Intel', path: '/voice' },
      { icon: FileText, label: 'Documents', path: '/documents' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { icon: Plane, label: 'Travel & Expense', path: '/travel' },
      { icon: Shield, label: 'Compliance', path: '/compliance' },
      { icon: GitBranch, label: 'Workflows', path: '/workflows' },
      { icon: BookOpen, label: 'Learning', path: '/learning' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { icon: Trophy, label: 'Gamification', path: '/gamification' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: Lock, label: 'Security', path: '/security' },
    ],
  },
];

// Memoized nav button to prevent re-renders during animation
const NavButton = memo(({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}) => {
  const Icon = item.icon;

  const btn = (
    <button
      onClick={onClick}
      className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
      style={{ justifyContent: collapsed ? 'center' : undefined }}
    >
      {isActive && <div className="sidebar-active-indicator" />}
      <Icon className="sidebar-icon" />
      {!collapsed && (
        <>
          <span className="sidebar-label">{item.label}</span>
          {item.badge && (
            <span className={`sidebar-badge ${isActive ? 'active' : ''}`}>
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && <span className="sidebar-badge-dot" />}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" mouseEnterDelay={0}>
        {btn}
      </Tooltip>
    );
  }

  return btn;
});

export const Sidebar = memo(({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sparkles style={{ width: '18px', height: '18px', color: 'white' }} />
        </div>
        <div className="sidebar-logo-text">
          <h1>Rapyder Bank</h1>
          <p>AI Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <p className="sidebar-section-title">{section.title}</p>
            <div className="sidebar-section-items">
              {section.items.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path}
                  collapsed={collapsed}
                  onClick={() => handleNavigate(item.path)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button onClick={onToggle} className="sidebar-toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <ChevronRight style={{ width: '14px', height: '14px' }} /> : <ChevronLeft style={{ width: '14px', height: '14px' }} />}
      </button>

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-user-inner">
          <div className="sidebar-user-avatar">PS</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">Priya Sharma</p>
            <p className="sidebar-user-role">Relationship Manager</p>
          </div>
          <LogOut className="sidebar-user-logout" />
        </div>
      </div>
    </aside>
  );
});

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  UserPen,
  Heart,
  Bookmark,
  MapPinned,
  Settings,
  LogOut,
  ChevronDown,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../lib/useAuthSync';
import UserAvatar from './UserAvatar';
import './ProfileDropdown.css';

interface MenuItem {
  label: string;
  icon: typeof User;
  to?: string;
  disabled?: boolean;
  /** Shown as a small badge for items that are not built yet. */
  badge?: string;
}

export default function ProfileDropdown() {
  const { user, storedUser, signOut } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = storedUser?.name || 'Explorer';
  const email = storedUser?.email || user?.email || '';
  const avatar = storedUser?.avatar ?? null;

  const closeMenu = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  /**
   * Position the panel against the trigger using fixed coordinates, so it
   * always clears the navbar and never runs off the edge of the viewport.
   */
  const positionMenu = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gutter = 12;
    const panelWidth = menuRef.current?.offsetWidth ?? 260;

    const left = Math.min(
      Math.max(gutter, rect.right - panelWidth),
      window.innerWidth - panelWidth - gutter
    );

    setMenuStyle({
      position: 'fixed',
      top: Math.round(rect.bottom + 8),
      left: Math.round(left),
    });
  }, []);

  // Measure as soon as the panel is in the DOM, before the browser paints it.
  useLayoutEffect(() => {
    if (!isOpen) return;
    positionMenu();
  }, [isOpen, positionMenu]);

  // Keep the panel glued to the trigger while the page scrolls or resizes.
  useEffect(() => {
    if (!isOpen) return;
    const handleReposition = () => positionMenu();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen, positionMenu]);

  // ---- Close on outside click ----
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        closeMenu(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  // ---- Close on Escape ----
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // ---- Move focus into the menu when it opens ----
  useEffect(() => {
    if (!isOpen) return;
    const firstItem = menuRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])'
    );
    firstItem?.focus();
  }, [isOpen]);

  // ---- Arrow key navigation between menu items ----
  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      ) ?? []
    );
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const nextIndex =
      event.key === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  const handleSignOut = async () => {
    setError('');
    setIsSigningOut(true);
    try {
      await signOut();
      setIsOpen(false);
      navigate('/');
    } catch {
      setError("We couldn't sign you out just now. Please try again.");
      setIsSigningOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    { label: 'My Profile', icon: User, to: '/profile' },
    { label: 'Edit Profile', icon: UserPen, to: '/profile?edit=1' },
    { label: 'Favourite Places', icon: Heart, to: '/profile#favourites' },
    {
      label: 'Saved Places',
      icon: Bookmark,
      disabled: true,
      badge: 'Soon',
    },
    { label: 'My Trips', icon: MapPinned, to: '/profile#trips' },
    { label: 'Settings', icon: Settings, to: '/profile#preferences' },
  ];

  const handleItemSelect = (item: MenuItem) => {
    if (item.disabled) return;
    closeMenu(false);
  };

  return (
    <div className="profile-dropdown" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`profile-dropdown__trigger ${isOpen ? 'profile-dropdown__trigger--open' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${name}`}
      >
        <UserAvatar src={avatar} name={name} size={36} />
        <span className="profile-dropdown__chevron" aria-hidden="true">
          <ChevronDown size={14} />
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="profile-dropdown__menu"
          style={menuStyle}
          role="menu"
          aria-label="Account"
          onKeyDown={handleMenuKeyDown}
        >
          {/* Signed-in identity */}
          <div className="profile-dropdown__header">
            <UserAvatar src={avatar} name={name} size={44} />
            <div className="profile-dropdown__identity">
              <span className="profile-dropdown__name">{name}</span>
              {email && (
                <span className="profile-dropdown__email" title={email}>
                  {email}
                </span>
              )}
            </div>
          </div>

          <div className="profile-dropdown__divider" role="separator" />

          <div className="profile-dropdown__items">
            {menuItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    role="menuitem"
                    aria-disabled="true"
                    className="profile-dropdown__item profile-dropdown__item--disabled"
                    title="This feature is not available yet"
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span className="profile-dropdown__item-label">{item.label}</span>
                    {item.badge && (
                      <span className="profile-dropdown__badge">{item.badge}</span>
                    )}
                  </span>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to ?? '/'}
                  role="menuitem"
                  className="profile-dropdown__item"
                  onClick={() => handleItemSelect(item)}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span className="profile-dropdown__item-label">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="profile-dropdown__divider" role="separator" />

          <button
            type="button"
            role="menuitem"
            className="profile-dropdown__item profile-dropdown__signout"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <LoaderCircle size={15} className="profile-dropdown__spinner" aria-hidden="true" />
            ) : (
              <LogOut size={15} aria-hidden="true" />
            )}
            <span className="profile-dropdown__item-label">
              {isSigningOut ? 'Signing out…' : 'Sign Out'}
            </span>
          </button>

          {error && (
            <p className="profile-dropdown__error" role="alert">
              <AlertCircle size={13} aria-hidden="true" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

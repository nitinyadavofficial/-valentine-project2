import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useOnClickOutside } from '@/hooks/useUtils';

interface DropdownItem {
  label?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactElement;
  items: DropdownItem[];
  align?: 'left' | 'right';
  offset?: number;
}

export function Dropdown({ trigger, items, align = 'right', offset = 8 }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      toggle();
      trigger.props.onClick?.(e);
    },
    'aria-haspopup': 'true',
    'aria-expanded': isOpen,
  });

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {clonedTrigger}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'absolute z-50 mt-2 w-56 min-w-[200px] bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-navy-200 dark:border-navy-800 py-1 overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0'
            )}
            style={{ transformOrigin: align === 'right' ? 'top right' : 'top left' }}
            role="menu"
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.03 }}
              >
                {item.divider && <div className="h-px bg-navy-200 dark:bg-navy-800 my-1" role="separator" />}
                {!item.divider && (
                  <button
                    onClick={() => { item.onClick(); close(); }}
                    disabled={item.disabled}
                    className={cn(
                      'w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm transition-colors',
                      item.danger
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface UserMenuProps {
  user: { name: string; email: string; avatar?: string };
  onProfile: () => void;
  onSettings: () => void;
  onTrips: () => void;
  onLogout: () => void;
}

export function UserMenu({ user, onProfile, onSettings, onTrips, onLogout }: UserMenuProps) {
  const items: DropdownItem[] = [
    { label: 'My Profile', icon: <UserIcon />, onClick: onProfile },
    { label: 'My Trips', icon: <TicketIcon />, onClick: onTrips },
    { label: 'Settings', icon: <SettingsIcon />, onClick: onSettings },
    { divider: true },
    { label: 'Sign Out', icon: <LogOutIcon />, onClick: onLogout, danger: true },
  ];

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">{user.name.charAt(0)}</span>
            </div>
          )}
          <span className="hidden sm:block text-sm font-medium text-navy-700 dark:text-navy-300">{user.name}</span>
          <ChevronDown className="w-4 h-4 text-navy-500" />
        </button>
      }
      items={items}
      align="right"
    />
  );
}

function UserIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}
function TicketIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
}
function SettingsIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function LogOutIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}
function ChevronDown({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
}
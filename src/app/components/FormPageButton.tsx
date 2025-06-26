'use client';
import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Page } from '@/app/types/PageTypes'

interface FormPageButtonProps {
  page: Page;
  isActive: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent, anchorEl: HTMLElement | null) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  Info: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="14" r="1" fill="currentColor" /><rect x="9" y="6" width="2" height="5" rx="1" fill="currentColor" /></svg>
  ),
  Details: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" /><rect x="3" y="9" width="10" height="2" rx="1" fill="currentColor" /><rect x="3" y="13" width="7" height="2" rx="1" fill="currentColor" /></svg>
  ),
  Other: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" /></svg>
  ),
  Ending: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" /><path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
};

const FormPageButton: React.FC<FormPageButtonProps> = ({
  page,
  isActive,
  onClick,
  onContextMenu,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.7 : 1,
  };

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const tabBtnRef = useRef<HTMLButtonElement>(null);

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, tabBtnRef.current);
  };

  // Prevent parent button from being triggered
  const stopPropagation = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Pick icon based on page title (fallback to Other)
  const iconKey = Object.keys(ICONS).find(key => page.title.toLowerCase().includes(key.toLowerCase())) || 'Other';
  const icon = ICONS[iconKey];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center"
    >
      <button
        ref={tabBtnRef}
        {...attributes}
        {...listeners}
        className={`px-2.5 py-1.5 rounded-lg border text-sm font-medium transition-all duration-150
           select-none focus:outline-none focus:ring-2 focus:ring-blue-500/80 
           shadow-sm flex items-center gap-1.5 w-full pr-6
          ${isActive
            ? 'bg-white text-gray-900 font-semibold border-gray-400 shadow-md'
            : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700'
          }
          ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}
        `}
        onClick={onClick}
        onContextMenu={e => onContextMenu(e, tabBtnRef.current)}
        tabIndex={0}
        type="button"
      >
        <span className={`flex items-center justify-center ${isActive ? 'text-yellow-400' : 'text-gray-300'}`}>{icon}</span>
        <span className={`truncate max-w-[80px] ${isActive ? '' : 'font-normal'}`}>{page.title}</span>
      </button>
      {isActive && (
        <button
          ref={menuBtnRef}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5
          rounded-full hover:bg-blue-700/20 focus:outline-none focus:ring-2 focus:ring-blue-500/80 
          transition-colors z-10"
          onClick={handleMenuButtonClick}
          onMouseDown={stopPropagation}
          onPointerDown={stopPropagation}
          tabIndex={0}
          aria-label="Open context menu"
          type="button"
        >
          {/* Vertical three dots */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="3.5" r="1.2" fill="currentColor" />
            <circle cx="8" cy="8" r="1.2" fill="currentColor" />
            <circle cx="8" cy="12.5" r="1.2" fill="currentColor" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FormPageButton; 
'use client';
import React, { useEffect } from 'react';
import { useFloating, flip, shift, offset, autoUpdate } from '@floating-ui/react-dom';

interface PageContextMenuProps {
  anchorEl: HTMLElement;
  onClose: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const PageContextMenu: React.FC<PageContextMenuProps> = ({
  anchorEl,
  onClose,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const { x, y, refs, strategy } = useFloating({
    placement: 'top-start',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (anchorEl) refs.setReference(anchorEl);
  }, [anchorEl, refs]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={refs.setFloating}
      className="fixed z-50 min-w-[220px] bg-white rounded-xl shadow-2xl border border-gray-200 animate-fade-in-fast font-sans"
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="px-5 pt-4 pb-2 border-b border-gray-100">
        <span className="font-bold text-lg text-gray-900">Settings</span>
      </div>
      <ul className="text-base text-gray-900">
        <li
          className="flex items-center gap-3 px-5 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
          style={{ color: '#2563eb', fontWeight: 500 }}
        >
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 21V5a2 2 0 012-2h9.5a1.5 1.5 0 010 3H7m0 0v15" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Set as first page
        </li>
        <li
          className="flex items-center gap-3 px-5 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => handleAction(onRename)}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 5.487l1.65-1.65a2.121 2.121 0 113 3l-1.65 1.65M15.5 7l-9.193 9.193a2 2 0 00-.497.878l-1.3 4.55a.5.5 0 00.606.606l4.55-1.3a2 2 0 00.878-.497L17 8.5" /></svg>
          Rename
        </li>
        <li
          className="flex items-center gap-3 px-5 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
          Copy
        </li>
        <li
          className="flex items-center gap-3 px-5 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => handleAction(onDuplicate)}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="8" y="8" width="10" height="10" rx="2" /><rect x="4" y="4" width="10" height="10" rx="2" /></svg>
          Duplicate
        </li>
        <li className="border-t border-gray-100 my-1" />
        <li
          className="flex items-center gap-3 px-5 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition-colors rounded-b-xl"
          onClick={() => handleAction(onDelete)}
        >
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a2 2 0 012 2v2H8V5a2 2 0 012-2z" /></svg>
          Delete
        </li>
      </ul>
    </div>
  );
};

export default PageContextMenu; 
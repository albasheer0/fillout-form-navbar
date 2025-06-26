'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import FormPageButton from '@/app/components/FormPageButton';
import { Page } from '@/app/types/PageTypes';

interface FormPageNavbarProps {
  pages: Page[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: (index: number) => void;
  onContextMenu: (id: string, event: React.MouseEvent, anchorEl: HTMLElement | null) => void;
  onReorderPages: (oldIndex: number, newIndex: number) => void;
}

const SCROLL_AMOUNT = 120;

const FormPageNavbar: React.FC<FormPageNavbarProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onContextMenu,
  onReorderPages,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // drag only starts after 8px movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      setShowLeftFade(el.scrollLeft > 0);
      setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    handleScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pages.length]);

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      onReorderPages(oldIndex, newIndex);
    }
  }

  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDragCancel() {
    setIsDragging(false);
  }

  const scrollBy = (amount: number) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div className="flex justify-start w-full  px-0 relative">
        {/* Fading edges and arrow buttons */}
        {showLeftFade && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 z-20" style={{background: 'linear-gradient(to right, var(--color-gray-300) 20%, transparent)'}} />
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow rounded-full p-1 flex items-center justify-center transition-colors border border-gray-200"
              style={{marginLeft: '4px'}}
              onClick={() => scrollBy(-SCROLL_AMOUNT)}
              aria-label="Scroll left"
              type="button"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M13 16l-5-6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}
        {showRightFade && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 z-20" style={{background: 'linear-gradient(to left, var(--color-gray-300) 20%, transparent)'}} />
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow rounded-full p-1 flex items-center justify-center transition-colors border border-gray-200"
              style={{marginRight: '4px'}}
              onClick={() => scrollBy(SCROLL_AMOUNT)}
              aria-label="Scroll right"
              type="button"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 4l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}
        <nav ref={scrollRef} className="flex items-center gap-0 px-4 py-2 bg-white border border-gray-200  shadow-lg group transition-all duration-150 w-full overflow-x-auto overflow-y-hidden scrollbar-hide relative"
          style={{
            overflowY: 'hidden',
            touchAction: isDragging ? 'pan-x' : 'auto',
            maxHeight: '56px',
          }}
        >
          <SortableContext items={pages.map(p => p.id)} strategy={horizontalListSortingStrategy}>
            {pages.map((page, idx) => (
              <React.Fragment key={page.id}>
                <FormPageButton
                  page={page}
                  isActive={page.id === activePageId}
                  onClick={() => onSelectPage(page.id)}
                  onContextMenu={(e: React.MouseEvent, anchorEl: HTMLElement | null) => onContextMenu(page.id, e, anchorEl)}
                />
                {idx < pages.length - 1 && (
                  <div className="relative flex flex-col items-center justify-center w-10 mx-0 group/addsep">
                    {/* Horizontal dotted line as a track */}
                    <div className="w-full h-0.5 border-t-2 border-dotted border-gray-300 absolute top-1/2 left-0 -translate-y-1/2 z-0" />
                    {/* Add button overlays the line, only on hover/focus */}
                    <button
                      className="opacity-0 group-hover/addsep:opacity-100 group-focus-within/addsep:opacity-100 transition-opacity duration-150 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-400 text-blue-500 shadow-sm z-10"
                      style={{ position: 'relative', top: 0 }}
                      onClick={e => { onAddPage(idx + 1); e.currentTarget.blur(); }}
                      tabIndex={0}
                      aria-label="Add page"
                      type="button"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </SortableContext>
          {/* Add page button at the end */}
          <button
            className="flex items-center gap-2 px-2.5 py-1.5 ml-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium border border-transparent shadow-md bg-white whitespace-nowrap text-sm"
            onClick={() => onAddPage(pages.length)}
            type="button"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Add page
          </button>
        </nav>
      </div>
    </DndContext>
  );
};

export default FormPageNavbar; 
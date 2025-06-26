'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { arrayMove } from '@dnd-kit/sortable';
import FormPageNavbar from "./components/FormPageNavbar";
import { Page } from "./types/PageTypes";
import PageContextMenu from "./components/PageContextMenu";

export default function Home() {
  // Demo state for pages
  const [pages, setPages] = useState<Page[]>([
    { id: "1", title: "Info" },
    { id: "2", title: "Details" },
    { id: "3", title: "Other" },
    { id: "4", title: "Ending" },
  ]);
  const [activePageId, setActivePageId] = useState<string>(pages[0].id);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    anchorEl: HTMLElement | null;
    pageId: string | null;
  }>({ visible: false, anchorEl: null, pageId: null });

  // Use a ref for the next page ID (SSR/CSR safe)
  const nextPageId = useRef(5);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (contextMenu.visible) {
      window.addEventListener("click", closeContextMenu);
    }
    return () => {
      window.removeEventListener("click", closeContextMenu);
    };
  }, [contextMenu.visible, closeContextMenu]);

  // Handlers
  const handleSelectPage = (id: string) => setActivePageId(id);

  const handleReorderPages = (oldIndex: number, newIndex: number) => {
    setPages((pages) => arrayMove(pages, oldIndex, newIndex));
  };

  const handleAddPage = (index: number) => {
    const newPage: Page = {
      id: String(nextPageId.current++),
      title: `Page ${pages.length + 1}`,
    };
    const updated = [...pages];
    updated.splice(index, 0, newPage);
    setPages(updated);
  };
  const handleContextMenu = (pageId: string, event: React.MouseEvent, anchorEl: HTMLElement | null) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      visible: true,
      anchorEl,
      pageId,
    });
  };

  const handleRename = () => {
    if (!contextMenu.pageId) return;
    const newTitle = prompt("Enter new page title:");
    if (newTitle) {
      setPages(
        pages.map((p) =>
          p.id === contextMenu.pageId ? { ...p, title: newTitle } : p
        )
      );
    }
  };

  const handleDuplicate = () => {
    if (!contextMenu.pageId) return;
    const pageToDuplicate = pages.find((p) => p.id === contextMenu.pageId);
    if (pageToDuplicate) {
      const newPage: Page = {
        ...pageToDuplicate,
        id: String(nextPageId.current++),
        title: `${pageToDuplicate.title} (Copy)`,
      };
      const index = pages.findIndex((p) => p.id === contextMenu.pageId);
      const updated = [...pages];
      updated.splice(index + 1, 0, newPage);
      setPages(updated);
    }
  };

  const handleDelete = () => {
    if (!contextMenu.pageId || pages.length <= 1) return;
    setPages(pages.filter((p) => p.id !== contextMenu.pageId));
    if (activePageId === contextMenu.pageId) {
      setActivePageId(pages.find((p) => p.id !== contextMenu.pageId)?.id ?? "");
    }
  };

  const activePage = pages.find((p) => p.id === activePageId);

  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex flex-col gap-4 items-center justify-center flex-1 w-full px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Form Builder</h1>
        <div className="text-lg text-gray-400 mb-2">Right-click a page tab to see the menu.</div>
        {activePage && (
          <div className="text-2xl font-semibold text-blue-300 mb-8 flex items-center gap-2">
            <p  className="text-gray-500">Selected Page:</p>
            <p className="text-gray-500">{activePage.title}</p>
          </div>
        )}
            {/* GitHub Repo Button */}
      <div className="flex justify-center py-8">
        <a
          href="https://github.com/albasheer0/fillout-form-navbar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-lg"
          aria-label="View project on GitHub"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.36.31.68.92.68 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.02 22 6.484 17.523 2 12 2Z" fill="currentColor"/></svg>
          <span>View on GitHub</span>
        </a>
      </div>
      </main>

      <FormPageNavbar
        pages={pages}
        activePageId={activePageId}
        onSelectPage={handleSelectPage}
        onAddPage={handleAddPage}
        onContextMenu={handleContextMenu}
        onReorderPages={handleReorderPages}
      />

      {contextMenu.visible && contextMenu.anchorEl && (
        <PageContextMenu
          anchorEl={contextMenu.anchorEl}
          onClose={closeContextMenu}
          onRename={handleRename}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}

  
    </div>
  );
}

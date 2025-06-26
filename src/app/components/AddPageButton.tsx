'use client';
import React from "react";

interface AddPageButtonProps {
  onClick: () => void;
  className?: string;
}

const AddPageButton: React.FC<AddPageButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      className={`w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:shadow-md transition-all duration-150 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 opacity-0 group-hover:opacity-100 ${className}`}
      onClick={onClick}
      aria-label="Add page"
      tabIndex={0}
      type="button"
    >
      <span className="text-lg font-bold leading-none">+</span>
    </button>
  );
};

export default AddPageButton; 
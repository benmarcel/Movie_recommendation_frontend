// components/Carousel.jsx
import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Example icons from Heroicons

/**
 * Carousel Component
 * Displays a list of items in a horizontally scrollable view with navigation arrows.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title for the carousel section.
 * @param {Array<object>} props.items - An array of data objects to be displayed.
 * @param {Function} props.renderItem - A function that takes an item and its index as arguments
 * and returns the React element to render for that item.
 */
const Carousel = ({ title, items, renderItem }) => {
  const scrollContainerRef = useRef(null);

  // Scroll the carousel left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.offsetWidth * 0.8, // Scroll by 80% of container width
        behavior: 'smooth',
      });
    }
  };

  // Scroll the carousel right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.offsetWidth * 0.8, // Scroll by 80% of container width
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return null; // Don't render carousel if no items
  }

  return (
    <div className="mb-8 relative group"> {/* Group for hover-based arrow visibility */}
      <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">{title}</h2>

      {/* Navigation Arrows */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-900 bg-opacity-70 text-white p-2 rounded-r-lg z-10
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   hidden md:block" // Hidden on small screens, shown on md and up
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-900 bg-opacity-70 text-white p-2 rounded-l-lg z-10
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   hidden md:block" // Hidden on small screens, shown on md and up
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 py-2 px-1 hides-scrollbar" // 'hides-scrollbar' for custom styling
      >
        {items.map((item, index) => (
          <div key={item.id || index} className="flex-none w-40 sm:w-48 md:w-56 lg:w-64"> {/* Fixed width for each item */}
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {/* Custom Scrollbar Styling (Optional, for 'hides-scrollbar' class) */}
      <style jsx>{`
        .hides-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hides-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Carousel;

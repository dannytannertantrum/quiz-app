'use client';

import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';

import { FaSolidPlusCircle } from '../../../public/svgs/FaSolidPlusCircle';

interface AccordionProps {
  children: ReactNode;
  title: string;
}

export const Accordion = ({ children, title }: AccordionProps) => {
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // For proper keyboard navigation, we need to update all navigable elements to tabindex='-1'
  // when the accordion is closed
  const updateFocusability = (disable: boolean) => {
    if (contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      focusableElements.forEach((element) => {
        (element as HTMLElement).tabIndex = disable ? -1 : 0;
      });
    }
  };

  const toggleAccordion = () => {
    setShowContent(!showContent);
    updateFocusability(!showContent);
  };

  useEffect(() => {
    // Initial update for focusability when the component mounts
    updateFocusability(!showContent);
  }, [showContent]);

  return (
    <Fragment>
      <button
        className={`flex justify-between items-center outline-none w-full text-left p-3 border-b border-thunder-400 text-2xl sticky top-0
        bg-thunder-200 focus-visible:outline-2 focus-visible:outline-outer-space-900 dark:border-thunder-700 dark:bg-thunder-975
        dark:outline-none dark:focus-visible:outline-2 dark:focus-visible:outline-outer-space-300`}
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <span className={`transition-all duration-500 ${showContent ? 'rotate-45' : ''}`}>
          <FaSolidPlusCircle />
        </span>
      </button>
      <section
        className={`grid grid-rows-0fr transition-all duration-500 p-3 w-full ${
          showContent ? 'grid-rows-1fr' : ''
        }`}
      >
        <div className={`overflow-hidden`} ref={contentRef}>
          {children}
        </div>
      </section>
    </Fragment>
  );
};

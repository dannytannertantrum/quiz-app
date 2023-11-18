'use client';

import { Fragment, ReactNode, useState } from 'react';

import { FaSolidPlusCircle } from '../../../public/svgs/FaSolidPlusCircle';

interface AccordionProps {
  children: ReactNode;
  title: string;
}

export const Accordion = ({ children, title }: AccordionProps) => {
  const [showContent, setShowContent] = useState(false);

  return (
    <Fragment>
      <button
        className={`flex justify-between items-center outline-none w-full text-left p-3 border-b border-thunder-400 text-2xl
        focus-visible:outline-2 focus-visible:outline-outer-space-900 dark:border-thunder-700
        dark:outline-none dark:focus-visible:outline-2 dark:focus-visible:outline-outer-space-300`}
        onClick={() => setShowContent(!showContent)}
      >
        <span>{title}</span>
        <span className={`transition-all duration-500 ${showContent ? 'rotate-45' : ''}`}>
          <FaSolidPlusCircle />
        </span>
      </button>
      <section
        className={`grid grid-rows-0fr transition-all duration-500 p-3 ${
          showContent ? 'grid-rows-1fr' : ''
        }`}
      >
        <div className='overflow-hidden'>{children}</div>
      </section>
    </Fragment>
  );
};

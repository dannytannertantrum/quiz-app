'use client';

import { Fragment } from 'react';

import { Accordion } from '../molecules/Accordion';
import { QLink } from '../atoms/QLink';

export const AboutPage = () => {
  return (
    <Fragment>
      <h1 className='text-4xl mb-4 text-center'>About QuizApp</h1>
      <p className='text-xl leading-8 mb-6'>
        Thanks for checking out QuizApp! This site was built as a means to showcase my skill set,
        learn some new tech, and have fun along the way (yes, I&apos;m a nerd and coding is fun for
        me). I&apos;m a full stack developer, but my greatest strengths lie on the frontend. One of
        my last roles was <em>Lead Engineer</em> for a frontend-based team, so my backend skills got
        a little rusty. I wrote Python in the past and loved it. I dabbled the <em>tiniest</em> bit
        in{' '}
        <QLink href='https://fastapi.tiangolo.com/' newWindow>
          FastAPI
        </QLink>{' '}
        several years ago as well. Since then, this Python framework has gained a greater following
        and continues to grow in popularity. I can certaily see why after using it for this project!
      </p>
      <p className='text-xl leading-8 mb-6'>
        Jumping to the frontend, I heard lots of hype around{' '}
        <QLink href='https://tailwindcss.com/' newWindow>
          tailwindcss
        </QLink>{' '}
        and{' '}
        <QLink href='https://nextjs.org/' newWindow>
          Next.js v13+
        </QLink>
        . I decided to build a fun little quiz application from soup to nuts to see what all the
        fuss is about! You can learn about the rest of the tech stack and the reasons behind my
        decisions below.
      </p>
      <Accordion title='Tech Stack'>
        <Fragment>
          <h3 className='text-2xl mb-2'>Backend</h3>
          <ul className='text-xl list-disc list-inside mb-8'>
            <li>Python</li>
            <li>FastAPI</li>
            <li>PostgreSQL</li>
            <li>SQLAlchemy</li>
            <li>Alembic</li>
            <li>Pytest</li>
            <li>Pydantic</li>
          </ul>
          <h3 className='text-2xl mb-2'>Frontend</h3>
          <ul className='text-xl list-disc list-inside mb-8'>
            <li>TypeScript</li>
            <li>Next.js v13</li>
            <li>React Testing Library</li>
            <li>Jest</li>
            <li>Tailwind</li>
            <li>Storybook</li>
          </ul>
          <h3 className='text-2xl mb-2'>Other</h3>
          <ul className='text-xl list-disc list-inside'>
            <li>Docker and Docker Compose</li>
            <li>AWS</li>
            <li>Atomic Design Principles</li>
          </ul>
        </Fragment>
      </Accordion>
      <Accordion title='A11y'>
        <Fragment>
          <p className='text-xl leading-8 mb-6'>
            A11y, or accessibility, is based around the thought that, &ldquo;The Web is
            fundamentally designed to work for all people, whatever their hardware, software,
            language, location, or ability. When the web meets this goal, it is accessible to people
            with a diverse range of hearing, movement, sight, and cognitive ability.&rdquo;
            {' ('}
            <QLink href='https://www.w3.org/mission/accessibility/' newWindow>
              The World Wide Web Consortium (W3C)
            </QLink>
            {')'}
          </p>
          <p className='text-xl leading-8 mb-6'>
            I am passionate about belonging and I believe accessibility is incredibly important in
            web development. Proper HTML semantics, focus states, roles, etc. make this site screen
            reader friendly. It also ensures a pleasant experience for those using keyboard
            navigation as their primary tool to browse the web.
          </p>
        </Fragment>
      </Accordion>
      <Accordion title='Where Can I See the Code?'>
        <p className='text-xl leading-8 mb-6'>
          Code for QuizApp is hosted{' '}
          <QLink href='https://github.com/dannytannertantrum/quiz-app' newWindow>
            publicly on GitHub
          </QLink>
          . I also plan on uploading some choide screenshots to my{' '}
          <QLink href='https://jaimefarnan.com/' newWindow>
            personal site
          </QLink>{' '}
          with a nice image carousel. This will be the best way to peer into my software engineering
          world - from seeing my project structure and basic decisions to the more nit-picky/nitty
          gritty quirks like wanting imports alphabetized. Stay tuned!
        </p>
      </Accordion>
      <Accordion title="Why Isn't This Site Flashy? Where's The Pizzaz?">
        <Fragment>
          <p className='text-xl leading-8 mb-6'>
            A flashy site would certainly make me look cool 😎 I typically work with UX/UI
            professionals when developing web applications. Although my design skills won&apos;t
            stack up against what they can achieve, head over to{' '}
            <QLink href='https://jaimefarnan.com/' newWindow>
              my personal site
            </QLink>{' '}
            if you&apos;re interested in seeing some of my design skills when I&apos;m flying solo.
          </p>
          <p className='text-xl leading-8 mb-6'>
            While I certainly could have pumped more time into finding some beautiful images and
            creating more appealing layouts, my primary focus was set on restoring my backend
            skills, learning new tech, and enhancing my chops across the whole stack. I also wanted
            to build an entire web application on my own. As software engineers, we often join teams
            where codebases are already set up. It can be rare to not only work on a greenfield
            project, but one where you get to build every piece of it.
          </p>
        </Fragment>
      </Accordion>
      <Accordion title='Considerations and Refactors'>
        <p className='text-xl leading-8 mb-6'>
          As developers, I think it&apos;s important to look back on the code we write and improve
          it; I&apos;ve already done this quite a bit! As a side-project primarily built for
          learning purposes, there are decisions I made along the way that would vary from building
          a real-world application. For example, I would set up a more robust build pipeline and
          utilize something like GitHub Actions. I chose to skip this because we only have so much
          time in our schedules and I want to focus more of my free time on{' '}
          <QLink href='https://www.youtube.com/watch?v=QdrRuEfdr6g' newWindow>
            music
          </QLink>{' '}
          and{' '}
          <QLink href='https://www.youtube.com/watch?v=uwDJ3aVB91g' newWindow>
            comedy
          </QLink>{' '}
          sketches again. Furthermore and for this particular example, deepening my knowledge on
          something like GitHub Actions would be nice, but if I learn it and end up using other tech
          for deployment pipelines at work or in another setting, I will eventually forget what I
          learned over time and/or the technology will update and I&apos;ll have to relearn it again
          anyhow. There are lots of things I&apos;d like to learn and lots I&apos;d like to
          refactor. If you&apos;re interested in learning more about what those things might be,
          let&apos;s chat!
        </p>
      </Accordion>
    </Fragment>
  );
};

import React from 'react';
import { Hero } from './Hero';
import { TargetAudience } from './TargetAudience';
import { WhyUs } from './WhyUs';
import { Marquee } from './Marquee';
import { Portfolio } from './Portfolio';
import { Process } from './Process';
import { Services } from './Services';
import { Reviews } from './Reviews';
import { FAQ } from './FAQ';
import { Contact } from './Contact';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <TargetAudience />
      <WhyUs />
      <Marquee text="VISUAL EXCELLENCE" outline />
      <Portfolio />
      <Process />
      <Services />
      <Reviews />
      <FAQ />
      <Contact />
    </>
  );
};
'use client';

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowUpRight} from 'lucide-react';

gsap.registerPlugin(useGSAP,ScrollTrigger);

const story=['Start with spice.','Pass the plate.','Stay for more.'];

export function FlavorStory({motion}:{motion:boolean}){
 const root=useRef<HTMLElement>(null);
 useGSAP(()=>{
  const section=root.current;
  if(!section||!motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const lines=Array.from(section.querySelectorAll<HTMLElement>('.flavor-line'));
  const text=Array.from(section.querySelectorAll<HTMLElement>('.flavor-line>span'));
  const tacos=section.querySelector('.flavor-tacos'),nachos=section.querySelector('.flavor-nachos');
  section.classList.add('flavor-animated');
  const tl=gsap.timeline({scrollTrigger:{
   trigger:section,start:'top top',end:'bottom bottom',scrub:.45,invalidateOnRefresh:true,
  }});
  gsap.set(lines,{overflow:'clip'});gsap.set(text,{yPercent:110});
  tl.fromTo(tacos,{x:-55,y:35,rotation:-24,scale:.88},{x:()=>innerWidth<761?18:65,y:0,rotation:-5,scale:1,duration:1.15,ease:'power2.out'},0)
   .fromTo(nachos,{x:55,y:25,rotation:24,scale:.88},{x:()=>innerWidth<761?-18:-65,y:-10,rotation:6,scale:1,duration:1.2,ease:'power2.out'},.85);
  lines.forEach((line,i)=>{
   tl.to(text[i],{yPercent:0,duration:.8,ease:'expo.out'},i*.85);
  });
  tl.to(tacos,{y:-35,rotation:7,duration:1.1,ease:'sine.inOut'},1.8)
   .to(nachos,{y:-40,rotation:-7,duration:1.1,ease:'sine.inOut'},1.8)
   .to({}, {duration:.35});
  return()=>section.classList.remove('flavor-animated');
 },{scope:root,dependencies:[motion],revertOnUpdate:true});

 return <section ref={root} className="flavor-story" id="story" aria-labelledby="flavor-story-title">
  <div className="flavor-stage">
   <img className="plate flavor-tacos" src="/images/plates/tacos.jpg" alt="" loading="lazy"/>
   <img className="plate flavor-nachos" src="/images/plates/nachos.jpg" alt="" loading="lazy"/>
   <div className="flavor-story-copy">
    <p className="eyebrow">THE MAKINGS OF A BELLA NIGHT</p>
    <h2 id="flavor-story-title">{story.map((line,i)=><span className="flavor-line" key={line}><span>{line}</span>{i<story.length-1?' ':null}</span>)}</h2>
    <p className="manifesto-copy" data-text-rise>Tacos to start. Nachos for the table. Good company to keep you here.</p>
    <a className="text-link" href="#visit">Come make yourself at home <ArrowUpRight size={17}/></a>
   </div>
  </div>
 </section>
}

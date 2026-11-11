'use client';

import {useRef,type ReactNode} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP,ScrollTrigger);

export function CateringExpand({motion,children}:{motion:boolean;children:ReactNode}){
 const root=useRef<HTMLDivElement>(null);
 useGSAP(()=>{
  if(!motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const stage=root.current!;
  const frame=stage.querySelector<HTMLElement>('.gather-frame')!;
  const before=stage.querySelectorAll<HTMLElement>('.flip-before');
  const after=stage.querySelectorAll<HTMLElement>('.flip-after');
  const pronoun=stage.querySelector<HTMLElement>('.flip-word')!;
  const wordWidth=(word:HTMLElement)=>`${word.offsetWidth/parseFloat(getComputedStyle(pronoun).fontSize)}em`;
  const addFlip=(timeline:gsap.core.Timeline,at:number)=>{
   gsap.set(before,{autoAlpha:1,rotationX:0});
   gsap.set(after,{autoAlpha:0,rotationX:90});
   gsap.set(pronoun,{width:()=>wordWidth(before[0])});
   timeline.fromTo(pronoun,{width:()=>wordWidth(before[0])},{width:()=>wordWidth(after[0]),duration:.39,ease:'power2.inOut'},at);
   timeline.to(before,{rotationX:-90,autoAlpha:0,duration:.18,stagger:.07,ease:'power2.in'},at)
    .to(after,{rotationX:0,autoAlpha:1,duration:.25,stagger:.07,ease:'power2.out'},at+.14);
  };
  const mm=gsap.matchMedia();
  mm.add('(min-width: 761px)',()=>{
   const timeline=gsap.timeline({scrollTrigger:{trigger:stage,start:'top top',end:()=>`+=${innerHeight*.65}`,pin:true,scrub:true,invalidateOnRefresh:true,refreshPriority:1}})
    .fromTo(frame,{left:'6.65%',right:'6.65%',top:'8%',bottom:'8%',borderRadius:36},{left:'0%',right:'0%',top:0,bottom:0,borderRadius:0,duration:1,ease:'none'},0);
   addFlip(timeline,.38);
  });
  mm.add('(max-width: 760px)',()=>{
   addFlip(gsap.timeline({scrollTrigger:{trigger:stage.querySelector('.gather-headline'),start:'top 75%',end:'top 35%',scrub:.4,invalidateOnRefresh:true}}),0);
   gsap.fromTo(frame,{width:'92%',borderRadius:24},{width:'100%',borderRadius:0,ease:'none',scrollTrigger:{trigger:stage,start:'top 70%',end:'top 15%',scrub:.4,invalidateOnRefresh:true}});
  });
  return()=>mm.revert();
 },{scope:root,dependencies:[motion],revertOnUpdate:true});
 return <div className="gather-stage" ref={root}><div className="gather-frame">{children}</div></div>;
}

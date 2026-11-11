'use client';

import type {RefObject} from 'react';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';

gsap.registerPlugin(useGSAP,ScrollTrigger,SplitText);

/** Masked line rises for headings and supporting copy. */
export function useTextMotion(root:RefObject<HTMLDivElement|null>,enabled:boolean){
 useGSAP((context,contextSafe)=>{
  const el=root.current;if(!el)return;
  const releaseIntro=()=>document.documentElement.removeAttribute('data-type-boot');
  if(!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches){releaseIntro();return;}
  let alive=true,fontTimer:ReturnType<typeof setTimeout>,refreshTimer:ReturnType<typeof setTimeout>;
  const splits:SplitText[]=[],triggers:ScrollTrigger[]=[];
  let resize:ResizeObserver|undefined;
  // Authored hero lines need no font measurement. Set up their entrance now,
  // so the font-loading budget cannot silently skip the main headline.
  const hero=el.querySelector<HTMLElement>('#hero-title');
  if(hero){
   const lines=Array.from(hero.querySelectorAll<HTMLElement>('.text-line'));
   const masks=Array.from(hero.querySelectorAll<HTMLElement>('.text-line-wrap'));
   gsap.set(masks,{overflow:'clip'});
   const entrance=gsap.timeline({paused:true,delay:.1,
    onStart:()=>masks.forEach(mask=>mask.style.overflow='clip'),
    onComplete:()=>{
     lines.forEach(line=>line.style.removeProperty('transform'));
     masks.forEach(mask=>mask.style.removeProperty('overflow'));
    },
   })
    .fromTo(lines[0],{yPercent:115},{yPercent:0,duration:.48,ease:'power3.out'},0)
    .fromTo(lines[1],{yPercent:115},{yPercent:0,duration:.6,ease:'power3.out'},.16)
    .fromTo(lines[2],{yPercent:115},{yPercent:0,duration:1.25,ease:'power2.out'},.42);
   releaseIntro();
   triggers.push(ScrollTrigger.create({trigger:hero,start:'top bottom',end:'bottom top',
    onEnter:()=>entrance.restart(true),onEnterBack:()=>entrance.restart(true),
    onLeave:()=>entrance.progress(1),onLeaveBack:()=>entrance.pause(0),
   }));
  }
  const prepare=contextSafe!(()=>{
   if(!alive)return;
   try{
    el.querySelectorAll<HTMLElement>('[data-heading-rise]:not(#hero-title)').forEach(heading=>{
     if(heading.getBoundingClientRect().top<innerHeight*.88)return;
     const lines=Array.from(heading.querySelectorAll<HTMLElement>('.text-line'));
     const masks=Array.from(heading.querySelectorAll<HTMLElement>('.text-line-wrap'));
     gsap.set(masks,{overflow:'clip'});
     const tl=gsap.timeline({paused:true,onStart:()=>masks.forEach(mask=>mask.style.overflow='clip'),onComplete:()=>{
      lines.forEach(line=>['transform','translate','rotate','scale'].forEach(prop=>line.style.removeProperty(prop)));
      masks.forEach(mask=>mask.style.removeProperty('overflow'));
     }}).fromTo(lines,{yPercent:110},{yPercent:0,duration:.8,ease:'expo.out',stagger:.06});
     triggers.push(ScrollTrigger.create({trigger:heading,start:'top 88%',once:true,onEnter:()=>tl.play()}));
    });
    el.querySelectorAll<HTMLElement>('[data-text-rise]').forEach(copy=>{
     if(copy.getBoundingClientRect().top<innerHeight*.88)return;
     // Match the reference: whole lines rise through masks, with no bounce or rotation.
     const split=SplitText.create(copy,{
      type:'lines',mask:'lines',aria:'auto',autoSplit:true,
      onSplit:contextSafe!((self:SplitText)=>gsap.fromTo(self.lines,{yPercent:110},{
       yPercent:0,duration:.8,ease:'expo.out',stagger:.06,
       scrollTrigger:{trigger:copy,start:'top 88%',once:true},
       onComplete:()=>self.revert(),
      })),
     });
     splits.push(split);
    });
    el.querySelectorAll<HTMLElement>('[data-heading-meet]').forEach(heading=>{
     if(heading.getBoundingClientRect().top<innerHeight*.88)return;
     const lines=Array.from(heading.querySelectorAll<HTMLElement>('.text-line'));
     const flower=heading.closest('.visit-callout')?.querySelector('svg');
     const tl=gsap.timeline({paused:true,onComplete:()=>{
      lines.forEach(line=>['transform','translate','rotate','scale','opacity'].forEach(prop=>line.style.removeProperty(prop)));
      if(flower)['transform','transform-origin','translate','rotate','scale'].forEach(prop=>flower.style.removeProperty(prop));
     }}).fromTo(lines,{xPercent:i=>i%2?18:-18,y:12,rotation:i=>i%2?3:-3,opacity:0},
      {xPercent:0,y:0,rotation:0,opacity:1,duration:1.1,ease:'power3.out',stagger:.14});
     if(flower)tl.fromTo(flower,{rotation:-65,scale:.7,transformOrigin:'50% 50%'},{rotation:0,scale:1,duration:1.2,ease:'back.out(1.5)'},.12);
     triggers.push(ScrollTrigger.create({trigger:heading,start:'top 85%',once:true,onEnter:()=>tl.play()}));
    });
    resize=new ResizeObserver(()=>{
     clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{if(alive)ScrollTrigger.refresh();},120);
    });
    resize.observe(el);ScrollTrigger.refresh();
   }catch(error){
    context.revert();splits.forEach(split=>split.revert());
    console.error('Text motion restored to its readable state.',error);
   }finally{releaseIntro();}
  });
  // Missed font budget leaves text static instead of waiting indefinitely.
  fontTimer=setTimeout(()=>{alive=false;releaseIntro();},900);
  document.fonts.ready.then(()=>{if(!alive)return;clearTimeout(fontTimer);prepare();});
  return()=>{
   alive=false;clearTimeout(fontTimer);clearTimeout(refreshTimer);resize?.disconnect();
   triggers.forEach(trigger=>trigger.kill());splits.forEach(split=>split.revert());
  };
 },{scope:root,dependencies:[enabled],revertOnUpdate:true});
}

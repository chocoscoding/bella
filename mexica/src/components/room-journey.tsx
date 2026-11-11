'use client';
import {useEffect,useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ArrowUpRight,ArrowDown} from 'lucide-react';
import {RevealText} from './reveal-text';
import {RiseLabel} from './rise-label';

gsap.registerPlugin(useGSAP);

function WelcomeWord({children}:{children:string}){
 return <span className="room-emphasis"><span aria-hidden="true" className="room-weight-space">{children}</span><span className="room-weight">{children}</span></span>;
}

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function RoomJourney({motion}:{motion:boolean}){
 const section=useRef<HTMLElement>(null),film=useRef<HTMLVideoElement>(null);
 const reveal=useRef<gsap.core.Timeline|null>(null);
 useGSAP(()=>{
  if(!motion||!section.current)return;
  const el=section.current;
  // One reversible timeline owns the welcome; room scroll supplies its progress.
  const tl=gsap.timeline({paused:true})
   .fromTo(el.querySelectorAll('.room-weight'),{yPercent:115},
    {yPercent:0,duration:.65,stagger:.13,ease:'power3.out'},0)
   .fromTo(el.querySelectorAll('.room-weight'),{fontWeight:800},
    {fontWeight:900,duration:.4,stagger:.13,ease:'power2.inOut'},.25)
   .fromTo(el.querySelector('.room-welcome .eyebrow'),{opacity:0,y:12},
    {opacity:1,y:0,duration:.3,ease:'power2.out'},0)
   .fromTo(el.querySelector('.room-welcome .action'),{opacity:0,y:16},
    {opacity:1,y:0,duration:.25,ease:'power2.out'},.8);
  reveal.current=tl;
  return()=>{reveal.current=null;};
 },{scope:section,dependencies:[motion],revertOnUpdate:true});
 useEffect(()=>{
  const el=section.current,video=film.current;if(!el||!video||!motion)return;
  let frame=0,visible=false;
  const draw=()=>{
   frame=0;
   const box=el.getBoundingClientRect();
   const p=clamp(-box.top/Math.max(1,box.height-innerHeight));
   const grow=clamp(p/.75),arrival=clamp((p-.28)/.4);
   reveal.current?.progress(clamp((p-.4)/.42));
   el.style.setProperty('--grow',grow.toFixed(4));
   el.style.setProperty('--arrival',arrival.toFixed(4));
   el.style.setProperty('--intro',clamp(1-p/.28).toFixed(4));
   el.classList.toggle('room-arrived',p>.72);
  };
  const schedule=()=>{if(visible&&!frame)frame=requestAnimationFrame(draw)};
  const observer=new IntersectionObserver(([entry])=>{
   visible=entry.isIntersecting;
   if(visible){draw();video.play().catch(()=>{})}else video.pause();
  },{rootMargin:'100px'});
  observer.observe(el);
  const resize=new ResizeObserver(schedule);resize.observe(el);resize.observe(document.body);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  draw();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);video.pause();el.removeAttribute('style');el.classList.remove('room-arrived')};
 },[motion]);
 return <section ref={section} className={`room-journey ${motion?'room-animated':'room-static'}`} aria-label="Come inside Bella Cucina">
  <div className="room-stage">
   <div className="room-window"><video ref={film} src="/films/mexican-salon.mp4" poster="/films/mexican-salon.jpg" muted loop playsInline preload="none" aria-label="Inside the colorful Bella Cucina Mexican dining room"/><div className="room-shade"/></div>
   <div className="room-intro"><p className="eyebrow">PULL UP A CHAIR</p><h2><RevealText lines={["Built on flavor.", "Loved around", "the table."]} accentLine={1}/></h2><p data-text-rise>From a quick lunch to a long catch-up, there’s a place for you here.</p><span className="room-scroll">Come on in <ArrowDown size={17}/></span></div>
   <div className="room-welcome"><p className="eyebrow">THE BELLA FEELING</p><h2>
    <span className="display-line"><span className="text-line-wrap"><span className="text-line"><WelcomeWord>Come</WelcomeWord>{' '}<WelcomeWord>hungry.</WelcomeWord></span></span>{' '}</span>
    <span className="display-line accent-line"><span className="text-line-wrap"><span className="text-line"><WelcomeWord>Stay</WelcomeWord>{' '}<WelcomeWord>awhile.</WelcomeWord></span></span></span>
   </h2><a className="action" href="#visit"><RiseLabel>Your table is waiting</RiseLabel><ArrowUpRight size={17}/></a></div>
  </div>
 </section>
}

'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';

type Motif='chili'|'lime'|'cactus'|'papel';
const motifs:Motif[]=['chili','lime','cactus','papel'];
const lines=[['A fresh','one'],['taste of','two'],['Mexico.','three']];

function MexicanMotif({kind}:{kind:Motif}){
 return <svg viewBox="0 0 100 110" fill="none" aria-hidden="true" focusable="false">
  {kind==='chili'&&<>
   <path d="M62 30C77 27 87 42 78 64C68 87 42 100 18 99C37 87 41 75 42 55C43 39 48 32 62 30Z" fill="#a52a38" stroke="#f8f1e9" strokeWidth="3"/>
   <path d="M53 34L61 23L72 33L64 40Z" fill="#134e3b"/><path d="M62 28Q58 12 75 10" stroke="#134e3b" strokeWidth="7" strokeLinecap="round"/>
   <path d="M70 45Q74 61 59 76" stroke="#ffc629" strokeWidth="4" strokeLinecap="round"/>
  </>}
  {kind==='lime'&&<>
   <circle cx="50" cy="56" r="38" fill="#134e3b" stroke="#f8f1e9" strokeWidth="3"/><circle cx="50" cy="56" r="30" fill="#bbce80" stroke="#f8f1e9" strokeWidth="3"/>
   {[0,60,120,180,240,300].map(a=><path key={a} d="M50 56L50 28" stroke="#f8f1e9" strokeWidth="3" transform={`rotate(${a} 50 56)`}/>)}<circle cx="50" cy="56" r="5" fill="#f8f1e9"/>
   <path d="M49 17Q59 0 78 10Q64 24 49 17" fill="#134e3b"/>
  </>}
  {kind==='cactus'&&<>
   <path d="M43 102V64H31Q17 64 17 49V33Q17 24 25 24Q33 24 33 33V48H43V22Q43 11 52 11Q61 11 61 22V62H72V44Q72 36 80 36Q88 36 88 44V66Q88 79 74 79H61V102Z" fill="#134e3b" stroke="#f8f1e9" strokeWidth="3" strokeLinejoin="round"/>
   <path d="M51 31V88M25 35V48M80 48V64" stroke="#bbce80" strokeWidth="3" strokeLinecap="round"/><path d="M43 12L40 5L49 8L54 1L58 10L67 8L62 17" fill="#c9b8e5"/>
  </>}
  {kind==='papel'&&<>
   <path d="M9 16Q50 27 91 16" stroke="#134e3b" strokeWidth="4" strokeLinecap="round"/>
   <path d="M18 20H82V88Q74 99 66 88Q58 99 50 88Q42 99 34 88Q26 99 18 88Z" fill="#c9b8e5" stroke="#f8f1e9" strokeWidth="2"/>
   <path d="M50 35L57 47L50 59L43 47ZM33 53L39 62L33 71L27 62ZM67 53L73 62L67 71L61 62ZM50 69L56 77L50 85L44 77Z" fill="#134e3b"/>
   <path d="M26 29H74M25 82H34M66 82H75" stroke="#f8f1e9" strokeWidth="3" strokeLinecap="round"/>
  </>}
 </svg>
}

/** One quiet surprise at a time, only while the headline is on screen. */
export function HeroHeadline({motion}:{motion:boolean}){
 const heading=useRef<HTMLHeadingElement>(null);
 const [peek,setPeek]=useState<{line:number;kind:Motif;left:number;tilt:number;id:number}|null>(null);
 useEffect(()=>{
  const el=heading.current;if(!el||!motion){setPeek(null);return}
  let timer:ReturnType<typeof setTimeout>|undefined,visible=false,lastLine=-1,lastMotif=-1,id=0;
  const stop=()=>{clearTimeout(timer);timer=undefined};
  const schedule=(delay:number)=>{stop();timer=setTimeout(()=>{
   if(!visible||document.hidden)return;
   const line=(lastLine+1+Math.floor(Math.random()*2))%3;
   const motif=(lastMotif+1+Math.floor(Math.random()*3))%4;
   lastLine=line;lastMotif=motif;
   setPeek({line,kind:motifs[motif],left:22+Math.random()*48,tilt:-18+Math.random()*36,id:++id});
   schedule(3900+Math.random()*1700);
  },delay)};
  const sync=()=>{stop();setPeek(null);if(visible&&!document.hidden)schedule(1100)};
  const observer=new IntersectionObserver(([entry])=>{const next=entry.isIntersecting;if(next!==visible){visible=next;sync()}},{threshold:.4});
  observer.observe(el);document.addEventListener('visibilitychange',sync);
  return()=>{stop();observer.disconnect();document.removeEventListener('visibilitychange',sync)};
 },[motion]);
 return <h1 ref={heading} id="hero-title" data-heading-rise>{lines.map(([text,position],i)=><span className={`hero-line ${position}`} key={position}><span className="hero-phrase">
  {motion&&peek?.line===i&&<span key={peek.id} className="hero-peek" data-motif={peek.kind} aria-hidden="true" style={{left:`${peek.left}%`,'--peek-tilt':`${peek.tilt}deg`} as CSSProperties}><MexicanMotif kind={peek.kind}/></span>}
  <span className="hero-words text-line-wrap"><span className="text-line">{text}</span></span>
 </span>{i<lines.length-1?' ':null}</span>)}</h1>
}

'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowRight,ArrowLeft,Menu,X,MapPin,Phone,Plus,Minus,Sun,Utensils} from 'lucide-react';
import {restaurant as r,dishes} from '@/lib/restaurant';
import {RevealText} from './reveal-text';
import {RoomJourney} from './room-journey';
import {HeroHeadline} from './hero-headline';
import {FlavorStory} from './flavor-story';
import {useTextMotion} from './use-text-motion';
import {RiseLabel} from './rise-label';
import {useDragScroll} from './use-drag-scroll';
import {VisitRibbon} from './visit-ribbon';
import {CateringExpand} from './catering-expand';
import {Action,Mark} from './brand';
import {SiteFooter} from './site-footer';
import Link from 'next/link';

function Flower({className=''}:{className?:string}){return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">{Array.from({length:8},(_,i)=><ellipse key={i} cx="50" cy="23" rx="10" ry="22" transform={`rotate(${i*45} 50 50)`}/>)}<circle cx="50" cy="50" r="16"/></svg>}
const groups=['All favorites','Tacos & more','To share','From the grill','Something fresh'];
const faqs=[['Can I order online?','Yes. Choose your favorites from our online ordering menu. You’ll find current dishes, prices and available options there.'],['Can you cater our gathering?','Yes. Visit our catering page, then call us to talk about your group, the occasion and what you have in mind.'],['Where can I find you?',`${r.address}, ${r.locality}. Use the Get directions link to plan your visit.`],['What are your hours?','Monday through Saturday, 11:00 am – 10:00 pm. Sunday, 11:00 am – 9:00 pm.']];

export default function Home(){
 const [menu,setMenu]=useState(false),[group,setGroup]=useState('All favorites'),[expanded,setExpanded]=useState(false),[faq,setFaq]=useState<number|null>(null),[motion,setMotion]=useState(true);
 const root=useRef<HTMLDivElement>(null),rail=useRef<HTMLDivElement>(null);
 useTextMotion(root,motion);
 useDragScroll(rail);
 useEffect(()=>{
   const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setMotion(!media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
   const el=root.current;if(!el||!motion)return;
   const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.12});
   el.querySelectorAll('[data-reveal]').forEach(n=>{n.classList.add('will-reveal');observer.observe(n)});
   return()=>{observer.disconnect();el.querySelectorAll('.will-reveal').forEach(n=>n.classList.remove('will-reveal'))};
 },[motion]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 const filtered=group==='All favorites'?dishes:dishes.filter(d=>d.group===group),shown=expanded?filtered:filtered.slice(0,4);
 return <div ref={root} className={`mexican-site ${motion?'motion-on':''}`}>
 <a className="skip" href="#main">Skip to content</a>
 <header className="nav-shell"><div className="nav-bar">
  <nav className="desktop-nav" aria-label="Main"><a href="#menu">The menu</a><a href="#story">Our story</a><Link href={r.catering}>Catering</Link><Link href={r.blog}>Blog</Link><a href="#visit">Visit us</a></nav>
  <a href="#top" className="brand" aria-label="Bella Cucina Mexican home"><Mark/></a>
  <div className="nav-actions"><a href="#visit" className="nav-visit">Find us <MapPin size={15}/></a><Action href={r.order}>Order online</Action><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu?'Close navigation':'Open navigation'}>{menu?<X/>:<Menu/>}</button></div>
 </div>{menu&&<nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">{[['The menu','#menu'],['Our story','#story'],['Catering',r.catering],['Blog',r.blog],['Visit us','#visit']].map(([label,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}<ArrowUpRight/></a>)}</nav>}</header>
 <main id="main">
  <section className="hero" id="top" aria-labelledby="hero-title">
   <p className="hero-kicker">LOCUST GROVE, VIRGINIA <span>✦</span> BIENVENIDOS A BELLA</p>
   <div className="hero-composition">
    <HeroHeadline motion={motion}/>
    <img className="hero-nachos plate" src="/images/plates/nachos.jpg" alt="A generous plate of loaded nachos with shrimp and melted cheese" fetchPriority="high"/>
    <span className="hero-note">A little spice.<br/>A whole lot of soul.<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M5 8Q75 3 53 48M40 39L53 49L65 36" fill="none" stroke="currentColor" strokeWidth="2"/></svg></span>
    <Flower className="hero-flower"/>
   </div>
   <div className="hero-actions"><Action href={r.order}>Order your favorites</Action><a className="text-link" href="#menu"><RiseLabel>Explore the menu</RiseLabel><ArrowRight size={17}/></a></div>
   <div className="hero-foot"><span>Good food. Better company.</span><span>Scroll for the good stuff ↓</span><span>Mexican kitchen · Virginia heart</span></div>
  </section>
  <section className="favorites section-pad" id="menu" aria-labelledby="menu-title">
   <div className="flavor-band"><span>Warm tortillas</span><Sun/><span>Golden cheese</span><Sun/><span>A little heat</span><Sun/><span>Made to share</span></div>
   <div className="section-heading"><p className="eyebrow">THE FIRST DELICIOUS DECISION</p><h2 id="menu-title"><RevealText lines={["What are you", "craving?"]}/></h2></div>
   <div className="menu-filters" role="group" aria-label="Filter dishes">{groups.map(g=><button key={g} aria-pressed={group===g} onClick={e=>{setGroup(g);setExpanded(false);e.currentTarget.scrollIntoView({inline:'center',block:'nearest',behavior:motion?'smooth':'instant'})}}>{g}</button>)}</div>
   <div className="menu-grid" aria-live="polite">{shown.map(d=><a className="menu-card" href={r.menu} key={d.file}><div className="menu-photo"><img className="plate" src={`/images/plates/${d.file}.jpg`} alt={d.name} loading="lazy"/></div><p className="card-note">{d.note}</p><h3>{d.name}</h3><p>{d.description}</p><span className="small-link">View in menu <ArrowUpRight size={16}/></span></a>)}</div>
   <div className="menu-bottom">{filtered.length>4&&<button className="text-link" onClick={()=>setExpanded(!expanded)}>{expanded?'Show fewer dishes':'See all favorites'}{expanded?<Minus size={17}/>:<Plus size={17}/>}</button>}<small>Find current prices and availability in our online menu.</small></div>
  </section>
  <FlavorStory motion={motion}/>
  <RoomJourney motion={motion}/>
  <section className="from-kitchen">
   <div className="section-heading"><p className="eyebrow">FROM OUR KITCHEN</p><h2><RevealText lines={["Big flavor.","Your kind of plate."]}/></h2><Action href={r.menu}>View the full menu</Action></div>
   <div className="color-cards" id="kitchen-dishes" ref={rail}>{dishes.slice(0,6).map((d,i)=><a key={d.file} href={r.menu} className="color-card" style={{background:d.color}}><span className="card-index">0{i+1} / BELLA FAVORITES</span><img className="plate" src={`/images/plates/${d.file}.jpg`} alt={d.name} loading="lazy"/><span className="card-note">{d.note}</span><h3>{d.name}</h3><span className="small-link">Find your favorite <ArrowUpRight size={18}/></span></a>)}</div>
   <div className="rail-controls"><button aria-label="Previous dishes" onClick={()=>rail.current?.scrollBy({left:-420,behavior:motion?'smooth':'instant'})}><ArrowLeft size={20}/></button><span>There’s more to love.</span><button aria-label="Next dishes" onClick={()=>rail.current?.scrollBy({left:420,behavior:motion?'smooth':'instant'})}><ArrowRight size={20}/></button></div>
  </section>
  <section className="gather section-pad" id="catering">
   <CateringExpand motion={motion}><div className="gather-grid"><div className="gather-photo"><img src="/images/catering-celebration.webp?v=1" alt="Birthday celebration concept in Bella’s colorful dining room, with friends sharing tacos" loading="lazy"/><span>GOOD FOOD. GREAT COMPANY.</span></div><div className="gather-copy"><h3 className="gather-headline" aria-label="You bring the occasion. We’ll bring the flavor."><span className="gather-sentence" aria-hidden="true"><span className="flip-word"><span className="flip-before">You</span><span className="flip-after">We’ll</span></span>{' '}<span>bring the</span>{' '}<span className="flip-word"><span className="flip-before">occasion.</span><span className="flip-after">flavor.</span></span></span></h3><p data-text-rise>Family celebrations. Office lunches. A gathering that deserves something good. Let’s talk food.</p><div className="gather-actions"><Action href={r.catering}>Plan your catering</Action><a href={r.phoneHref} className="text-link">Or give us a call <ArrowUpRight size={16}/></a></div></div></div></CateringExpand>
  </section>
  <VisitRibbon motion={motion}><section className="questions closing-questions"><div><p className="eyebrow">BEFORE YOU STOP BY</p><h3>A few good answers.</h3></div><div className="faq-list">{faqs.map(([q,a],i)=><div className="faq" key={q}><h3><button aria-expanded={faq===i} aria-controls={`answer-${i}`} onClick={()=>setFaq(faq===i?null:i)}>{q}{faq===i?<Minus size={19}/>:<Plus size={19}/>}</button></h3><div id={`answer-${i}`} hidden={faq!==i}><p>{a}</p></div></div>)}</div></section></VisitRibbon>
 </main>
 <SiteFooter extra={<button onClick={()=>setMotion(!motion)}>{motion?'Pause animations':'Enable animations'}</button>}/>
 </div>
}

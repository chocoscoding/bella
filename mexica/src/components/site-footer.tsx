import Link from 'next/link';
import type {ReactNode} from 'react';
import {restaurant as r} from '@/lib/restaurant';
import {Action, Mark} from './brand';

/** Shared dark footer. `extra` sits in the bottom bar (the home page puts its motion toggle there). */
export function SiteFooter({extra}:{extra?:ReactNode}){
 return <footer className="footer section-pad">
  <div className="footer-top"><h2 data-text-rise>Hungry yet?</h2><Action href={r.order}>Let’s fix that</Action></div>
  <div className="footer-grid">
   <div><Mark/><p>A fresh taste of Mexico.<br/>Right here in Locust Grove.</p></div>
   <div><h3>Come find us</h3><p>{r.address}<br/>{r.locality}</p><a href={r.directions}>Directions ↗</a></div>
   <div><h3>Our hours</h3>{r.hours.map(([day,time])=><p key={day}>{day}<br/>{time}</p>)}</div>
   <div><h3>A little more Bella</h3><a href={r.menu}>The menu ↗</a><Link href={r.catering}>Catering</Link><Link href={r.blog}>Blog</Link><a href={r.phoneHref}>{r.phone}</a></div>
  </div>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} Bella Cucina Mexican</span>{extra}<a href="#main">Back to top ↑</a></div>
 </footer>;
}

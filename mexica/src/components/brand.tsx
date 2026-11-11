import Link from 'next/link';
import type {ReactNode} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {RiseLabel} from './rise-label';

export function Mark(){return <span className="wordmark"><b>Bella Cucina</b><small>MEXICAN KITCHEN</small></span>}

/** The orange pill button. Internal paths use client-side navigation. */
export function Action({href,children,light=false}:{href:string;children:ReactNode;light?:boolean}){
 const className=`action ${light?'light':''}`;
 const inner=<><RiseLabel>{children}</RiseLabel><ArrowUpRight size={17} aria-hidden="true"/></>;
 return href.startsWith('/')&&!href.startsWith('//')?<Link className={className} href={href}>{inner}</Link>:<a className={className} href={href}>{inner}</a>;
}

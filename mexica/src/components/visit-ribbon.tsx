'use client';

import {useRef, type ReactNode} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowUpRight} from 'lucide-react';
import {PaperFlag} from './paper-flag';
import {restaurant as r} from '@/lib/restaurant';
import {RiseLabel} from './rise-label';
import {RevealText} from './reveal-text';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function VisitRibbon({motion,children}:{motion:boolean;children:ReactNode}){
  const root=useRef<HTMLElement>(null);
  useGSAP(()=>{
    const el=root.current;
    if(!el || !motion || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const canopy=el.querySelector<HTMLElement>('.ribbon-canopy')!;
    const hangers=Array.from(el.querySelectorAll<HTMLElement>('.ribbon-hanger'));
    const flags=Array.from(el.querySelectorAll<SVGSVGElement>('.ribbon-flag'));
    const rail=el.querySelector<HTMLElement>('.ribbon-flags')!;
    const cord=el.querySelector<SVGSVGElement>('.ribbon-cord')!;
    const path=cord.querySelector('path')!;
    const nodes=flags.map(()=>({x:0,y:0,vx:0,vy:0,angle:0,spin:0}));
    const setters=hangers.map(h=>({x:gsap.quickSetter(h,'x','px'),y:gsap.quickSetter(h,'y','px')}));
    const rotations=flags.map(flag=>gsap.quickSetter(flag,'rotation','deg'));
    let railWidth=1400;
    let anchors:{x:number;y:number}[]=[];
    let drag:{id:number;index:number;startX:number;startY:number;originX:number;originY:number;x:number;y:number}|null=null;
    let hoverX:number|null=null;
    let hoverGust=0;
    let last=window.scrollY;
    let visible=false;
    const measure=()=>{
      railWidth=rail.clientWidth;
      cord.setAttribute('viewBox',`0 0 ${railWidth} ${rail.clientHeight}`);
      anchors=Array.from(rail.querySelectorAll<HTMLElement>('.ribbon-sag')).map(sag=>({x:sag.offsetLeft+sag.offsetWidth/2,y:parseFloat(getComputedStyle(sag).paddingTop)+2}));
    };
    measure();
    const resize=new ResizeObserver(measure);resize.observe(rail);
    const draw=()=>{
      setters.forEach((set,i)=>{set.x(nodes[i].x);set.y(nodes[i].y);rotations[i](nodes[i].angle)});
      // The cord passes through every moving flag's top-center attachment.
      const points=[{x:0,y:2},...anchors.map((p,i)=>({x:p.x+nodes[i].x,y:p.y+nodes[i].y})),{x:railWidth,y:2}];
      let d=`M${points[0].x},${points[0].y}`;
      for(let i=0;i<points.length-1;i++){
        const a=points[i],b=points[i+1],mid=(a.x+b.x)/2;
        d+=` C${mid},${a.y} ${mid},${b.y} ${b.x},${b.y}`;
      }
      path.setAttribute('d',d);
    };
    ScrollTrigger.create({trigger:canopy,start:'top bottom',end:'bottom top',onToggle:self=>{visible=self.isActive}});
    const tick=()=>{
      const moved=window.scrollY-last;last=window.scrollY;
      if(!visible&&!drag)return;
      // Small fixed substeps keep the coupled springs stable after a slow frame.
      const elapsed=Math.min(1/30,gsap.ticker.deltaRatio(60)/60);
      const steps=Math.max(1,Math.ceil(elapsed*120)),dt=elapsed/steps;
      const gust=gsap.utils.clamp(-45,45,moved*.8);
      hoverGust*=Math.exp(-elapsed*5);
      for(let step=0;step<steps;step++){
        const forces=nodes.map((node,i)=>{
          const left=nodes[i-1],right=nodes[i+1];
          const distance=hoverX===null?0:(hoverX-anchors[i].x)/(railWidth/nodes.length);
          const influence=hoverX===null?0:Math.max(0,1-Math.abs(distance)/1.7);
          return {
            x:-70*node.x+110*((left?.x??0)+(right?.x??0)-2*node.x)-9*node.vx,
            y:-65*(node.y-influence*22)+155*((left?.y??0)+(right?.y??0)-2*node.y)-8*node.vy+gust,
            angle:distance*24*influence+hoverGust*influence+((right?.y??0)-(left?.y??0))*.14-node.vx*.09+gust*.06,
          };
        });
        nodes.forEach((node,i)=>{
          if(drag?.index===i){
            node.vx=gsap.utils.clamp(-600,600,(drag.x-node.x)/dt);
            node.vy=gsap.utils.clamp(-850,850,(drag.y-node.y)/dt);
            node.x=drag.x;node.y=drag.y;
          }else{
            node.vx+=forces[i].x*dt;node.vy+=forces[i].y*dt;
            node.x+=node.vx*dt;node.y+=node.vy*dt;
          }
          node.spin+=((forces[i].angle-node.angle)*90-node.spin*7)*dt;
          node.angle+=node.spin*dt;
          if(drag?.index!==i&&Math.abs(node.x)+Math.abs(node.y)+Math.abs(node.vx)+Math.abs(node.vy)<.001){node.x=node.y=node.vx=node.vy=0;}
          if(Math.abs(node.angle)+Math.abs(node.spin)<.001){node.angle=node.spin=0;}
        });
      }
      draw();
    };
    gsap.ticker.add(tick);
    const move=(event:PointerEvent)=>{
      if(drag?.id===event.pointerId){
        // Elastic resistance bounds a long pull without an abrupt hard stop.
        const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
        drag.x=drag.originX+55*Math.tanh(dx/90);
        drag.y=drag.originY+125*Math.tanh(dy/150);
        event.preventDefault();return;
      }
      if(!drag&&event.pointerType==='mouse'){
        const next=event.clientX-rail.getBoundingClientRect().left;
        if(hoverX!==null)hoverGust=gsap.utils.clamp(-26,26,hoverGust+(next-hoverX)*.22);
        hoverX=next;
      }
    };
    const down=(event:PointerEvent)=>{
      if(drag||!event.isPrimary||event.button!==0)return;
      const box=rail.getBoundingClientRect(),x=event.clientX-box.left;
      const flag=event.target instanceof Element?event.target.closest('.ribbon-flag'):null;
      let index=flag?flags.indexOf(flag as SVGSVGElement):-1;
      if(index<0)index=anchors.reduce((best,p,i)=>Math.abs(p.x+nodes[i].x-x)<Math.abs(anchors[best].x+nodes[best].x-x)?i:best,0);
      const node=nodes[index];
      drag={id:event.pointerId,index,startX:event.clientX,startY:event.clientY,originX:node.x,originY:node.y,x:node.x,y:node.y};
      hoverX=null;canopy.setPointerCapture(event.pointerId);
      canopy.classList.add('is-pulling');event.preventDefault();
    };
    const release=(event:PointerEvent)=>{
      if(drag?.id!==event.pointerId)return;
      drag=null;hoverX=null;canopy.classList.remove('is-pulling');
      if(canopy.hasPointerCapture(event.pointerId))canopy.releasePointerCapture(event.pointerId);
    };
    const leave=()=>{hoverX=null};
    canopy.classList.add('is-elastic');
    canopy.addEventListener('pointerdown',down);
    canopy.addEventListener('pointermove',move);
    canopy.addEventListener('pointerup',release);
    canopy.addEventListener('pointercancel',release);
    canopy.addEventListener('lostpointercapture',release);
    canopy.addEventListener('pointerleave',leave);
    draw();
    return()=>{
      resize.disconnect();gsap.ticker.remove(tick);
      canopy.removeEventListener('pointerdown',down);
      canopy.removeEventListener('pointermove',move);
      canopy.removeEventListener('pointerup',release);
      canopy.removeEventListener('pointercancel',release);
      canopy.removeEventListener('lostpointercapture',release);
      canopy.removeEventListener('pointerleave',leave);
      if(drag&&canopy.hasPointerCapture(drag.id))canopy.releasePointerCapture(drag.id);
      canopy.classList.remove('is-elastic','is-pulling');
      cord.setAttribute('viewBox','0 0 1400 200');path.setAttribute('d','M0 5 Q700 100 1400 5');
      [...hangers,...flags].forEach(item=>item.style.removeProperty('transform'));
    };
  },{scope:root,dependencies:[motion],revertOnUpdate:true});

  const flags=['scallop','sun','flower','scallop','sun','flower','scallop','sun','flower','scallop','sun','flower','scallop'] as const;
  return <section className={`visit-ribbon ${motion?'ribbon-motion':''}`} id="visit" ref={root} aria-labelledby="ribbon-title">
    <div className="ribbon-canopy" aria-hidden="true" data-lenis-prevent>
      <div className="ribbon-flags"><svg className="ribbon-cord" viewBox="0 0 1400 200" preserveAspectRatio="none"><path d="M0 5 Q700 100 1400 5"/></svg>{flags.map((motif,i)=><div className="ribbon-sag" key={i} style={{paddingTop:`${Math.sin((i+.5)/flags.length*Math.PI)*2.5}%`}}><div className="ribbon-hanger"><PaperFlag motif={motif}/></div></div>)}</div>
    </div>
    <div className="ribbon-journey">
      <div className="ribbon-content ribbon-stage">
        <div className="ribbon-invitation">
          <div className="ribbon-heading">
            <p className="eyebrow">MAKE IT A BELLA DAY</p>
            <h2 id="ribbon-title"><RevealText lines={['Your craving.','Your way.']} accentLine={1}/></h2>
            <p className="ribbon-intro-copy" data-text-rise>A table with us. A feast at home.<br/>Make it your kind of Bella day.</p>

          </div>
          <div className="ribbon-choices" aria-label="Make it your kind of Bella day">
            <a className="ribbon-option" href={r.directions}>
              <span className="ribbon-number" aria-hidden="true">01</span>
              <span><span className="ribbon-option-title">Pull up a chair.</span><span className="ribbon-option-copy">Good food. Better company.</span><span className="ribbon-option-link"><RiseLabel>Come find us</RiseLabel></span></span>
              <ArrowUpRight size={23} aria-hidden="true"/>
            </a>
            <a className="ribbon-option" href={r.order}>
              <span className="ribbon-number" aria-hidden="true">02</span>
              <span><span className="ribbon-option-title">Take Bella home.</span><span className="ribbon-option-copy">Your favorites. Your favorite spot.</span><span className="ribbon-option-link"><RiseLabel>Order online</RiseLabel></span></span>
              <ArrowUpRight size={23} aria-hidden="true"/>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="ribbon-closing" hidden>
      <div className="closing-wash" aria-hidden="true"/>
      <div className="ribbon-goodbye"><p className="eyebrow">A LITTLE SPICE. A WHOLE LOT OF SOUL.</p><h2><RevealText lines={['See you','at Bella.']}/></h2><a className="text-link" href={r.phoneHref}>Give us a call <ArrowUpRight size={16}/></a></div>
      {children}
    </div>
  </section>;
}

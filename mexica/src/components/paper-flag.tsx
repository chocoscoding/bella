export type Motif = 'sun'|'flower'|'scallop';
const CX = 200,CY = 196;
const n = (v:number)=>v.toFixed(1);
const at = (r:number,deg:number,cx=CX,cy=CY):[number,number]=>[cx+r*Math.cos(deg*Math.PI/180),cy+r*Math.sin(deg*Math.PI/180)];
const circle = (x:number,y:number,r:number)=>`M${n(x-r)} ${n(y)}a${r} ${r} 0 1 0 ${r*2} 0a${r} ${r} 0 1 0 ${-r*2} 0Z`;
const poly = (...points:[number,number][])=>`M${points.map(p=>`${n(p[0])} ${n(p[1])}`).join('L')}Z`;
const diamond = (x:number,y:number,r:number)=>poly([x,y-r],[x+r*.72,y],[x,y+r],[x-r*.72,y]);
const ring = (count:number,offset:number,make:(deg:number,i:number)=>string)=>Array.from({length:count},(_,i)=>make(offset+i*360/count,i)).join('');

function leaf(deg:number,from:number,to:number,width:number){
  const a = at(from,deg),b = at(to,deg),mid = (from+to)/2;
  const left = at(mid,deg-Math.atan2(width,mid)*180/Math.PI),right = at(mid,deg+Math.atan2(width,mid)*180/Math.PI);
  return `M${n(a[0])} ${n(a[1])}Q${n(left[0])} ${n(left[1])} ${n(b[0])} ${n(b[1])}Q${n(right[0])} ${n(right[1])} ${n(a[0])} ${n(a[1])}Z`;
}

export const motifs:Record<Motif,string> = {
  sun:circle(CX,CY,50)+ring(12,-90,deg=>poly(at(70,deg-11),at(160,deg),at(70,deg+11)))+ring(12,-75,deg=>diamond(...at(136,deg),11)),
  flower:circle(CX,CY,24)+ring(8,-90,deg=>leaf(deg,40,164,56))+ring(8,-67.5,deg=>diamond(...at(132,deg),13)),
  scallop:[[96,[100,200,300]],[160,[50,150,250,350]],[224,[100,200,300]],[288,[50,150,250,350]]].map(([y,xs])=>(xs as number[]).map(x=>{
    const r = 45,left = Math.max(x-r,44),right = Math.min(x+r,356);
    return left===x-r&&right===x+r?`M${x-r} ${y}A${r} ${r} 0 0 0 ${x+r} ${y}Z`:diamond(x,(y as number)+18,16);
  }).join('')).join(''),
};

const frame = Array.from({length:13},(_,i)=>diamond(20+i*30,24,10)).join('')+Array.from({length:8},(_,i)=>`M${10+i*50} 362A15 15 0 0 0 ${40+i*50} 362Z`).join('')+Array.from({length:8},(_,i)=>diamond(20,62+i*40,9)+diamond(380,62+i*40,9)).join('');

const outline = `M0 0H400V392${'a25 25 0 0 1 -50 0'.repeat(8)}Z`;
export function PaperFlag({motif}:{motif:Motif}){
  return <svg className="ribbon-flag" viewBox="0 0 400 424" aria-hidden="true"><path fillRule="evenodd" d={outline+frame+motifs[motif]}/></svg>;
}

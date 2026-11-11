/** Authored lines keep their layout and accessible text throughout the rise reveal. */
export function RevealText({lines,accentLine=-1,effect='rise'}:{lines:string[];accentLine?:number;effect?:'rise'|'meet'}){
 return <span className="text-reveal" data-heading-rise={effect==='rise'?'':undefined} data-heading-meet={effect==='meet'?'':undefined}>
  {lines.map((line,i)=><span className={`display-line ${i===accentLine?'accent-line':''}`} key={line}><span className="text-line-wrap"><span className="text-line">{line}</span></span>{i<lines.length-1?' ':null}</span>)}
 </span>
}

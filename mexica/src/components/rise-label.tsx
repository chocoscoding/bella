import type {ReactNode} from 'react';

/** The second, decorative label rolls into the first label's resting position. */
export function RiseLabel({children}:{children:ReactNode}){
 return <span className="button-rise-mask"><span className="button-rise-track">
  <span>{children}</span><span aria-hidden="true">{children}</span>
 </span></span>;
}

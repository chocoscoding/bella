import type {Metadata} from 'next';
import './globals.css';
import {siteUrl} from '@/lib/site';
import {site} from '@/lib/seo';
export const metadata: Metadata = {
 metadataBase:siteUrl,
 title:{default:'Bella Cucina Mexican | Mexican Restaurant in Locust Grove, VA',template:'%s | Bella Cucina Mexican'},
 description:site.description,
 applicationName:site.name,
 keywords:['Mexican restaurant Locust Grove VA','tacos Locust Grove','Mexican food near Lake of the Woods','Mexican food Orange County VA','Mexican catering Locust Grove'],
 alternates:{canonical:'/',types:{'application/rss+xml':[{url:'/blog/rss.xml',title:site.blogName}]}},
 openGraph:{type:'website',siteName:site.name,locale:site.locale,url:'/',title:'Bella Cucina Mexican | Mexican Restaurant in Locust Grove, VA',description:site.description},
 twitter:{card:'summary_large_image'},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
 formatDetection:{telephone:false},
 verification:{google:process.env.GOOGLE_SITE_VERIFICATION,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:undefined},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><link rel="preload" href="/fonts/crnch-artwork.otf" as="font" type="font/otf" crossOrigin=""/><link rel="preload" href="/fonts/bricolage-grotesque-latin-standard-normal.woff2" as="font" type="font/woff2" crossOrigin=""/><script dangerouslySetInnerHTML={{__html:`if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-type-boot','');setTimeout(function(){document.documentElement.removeAttribute('data-type-boot')},1200)}`}}/></head><body>{children}</body></html>}

import Home from '@/components/home';
import {JsonLd,restaurantSchema,websiteSchema} from '@/lib/seo';
export default function Page(){return <><JsonLd data={[restaurantSchema(),websiteSchema()]}/><Home/></>}

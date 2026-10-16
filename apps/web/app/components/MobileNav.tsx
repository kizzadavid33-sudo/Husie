'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect,useState} from 'react'
import {apiGet} from '@/lib/mirrorgram/client'
const links=[['/','⌂','Home'],['/discover','⌕','Discover'],['/circles','◉','Circles'],['/create','＋','Create'],['/messages','◌','Messages'],['/notifications','♧','Activity'],['/profile','♙','Profile']]
export default function MobileNav({authenticated}:{authenticated:boolean}){const path=usePathname();const[unread,setUnread]=useState(0);useEffect(()=>{if(!authenticated)return;let alive=true;const refresh=async()=>{try{const r=await apiGet<{count:number}>('/api/notifications/unread-count');if(alive)setUnread(r.count)}catch{}};refresh();const t=setInterval(refresh,10000);return()=>{alive=false;clearInterval(t)}},[authenticated]);if(!authenticated&&path==='/')return null;if(path==='/login'||path.startsWith('/husie'))return null;return <nav className="mobile-bottom" aria-label="Mobile navigation">{links.map(([href,icon,label])=><Link key={href} href={href} className={path===href?'active':''}><span className="mobile-nav-icon">{icon}{label==='Notifications'&&unread>0&&<b className="notification-badge mobile-badge">{unread>99?'99+':unread}</b>}</span><span>{label}</span></Link>)}</nav>}

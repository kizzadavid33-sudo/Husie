'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect,useState} from 'react'
import {apiGet} from '@/lib/mirrorgram/client'
import Brand from './Brand'
const links=[['/','⌂','Home'],['/discover','⌕','Discover'],['/circles','◉','Private Circles'],['/create','＋','Create'],['/messages','◌','Messages'],['/notifications','♧','Notifications'],['/settings','⚙','Settings'],['/profile','♙','Profile'],['/studio','✦','Creator Studio'],['/map','⌖','Map & Events'],['/live','◉','Live'],['/safety','◇','Safety']]
export default function Nav({username}:{username?:string|null}){const path=usePathname();const[unread,setUnread]=useState(0);useEffect(()=>{let alive=true;const refresh=async()=>{try{const r=await apiGet<{count:number}>('/api/notifications/unread-count');if(alive)setUnread(r.count)}catch{}};refresh();const t=setInterval(refresh,10000);return()=>{alive=false;clearInterval(t)}},[]);return <aside className="app-nav"><Brand/><nav className="nav-list">{links.map(([href,icon,label])=><Link key={href} className={path===href?'active':''} href={href}><span className="nav-icon">{icon}</span><span>{label==='Profile'&&username?`@${username}`:label}{label==='Notifications'&&unread>0&&<b className="notification-badge">{unread>99?'99+':unread}</b>}</span></Link>)}</nav></aside>}

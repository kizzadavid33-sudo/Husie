import Link from 'next/link'
import {redirect} from 'next/navigation'
import {serverGet,serverMe} from '@/lib/mirrorgram/server'
import HusieCard from '../components/HusieCard'
export const dynamic='force-dynamic'
export default async function HusiePage(){if(!await serverMe<any>())redirect('/login');const posts=(await serverGet<{posts:any[]}>('/api/feed?limit=60')).data.posts.filter((p:any)=>p.media?.some((m:any)=>m.media_type==='video')).map((p:any)=>{const m=p.media.find((x:any)=>x.media_type==='video');return {...p,mediaUrl:m?.url,likeCount:p.like_count,commentCount:p.comment_count}});return <main className="husie-page">{posts.length?<section className="husie-feed">{posts.map((p:any)=><HusieCard key={p.id} post={p}/>)}</section>:<section className="husie-empty"><h2>No Husie videos yet</h2><p>Publish a video and it will appear here.</p><Link className="primary link-button" href="/create">Create a video</Link></section>}</main>}

import Link from 'next/link'
import {redirect} from 'next/navigation'
import {serverGet,serverMe} from '@/lib/mirrorgram/server'
export const dynamic='force-dynamic'
export default async function StudioPage(){if(!await serverMe<any>())redirect('/login');const {data}=await serverGet<{stats:any}>('/api/studio');const {stats}=data;return <main className="shell"><header className="topbar"><div><h1>Creator Studio</h1><p>Your Husie dashboard.</p></div><Link href="/">Home</Link></header><section className="grid stats"><div className="card"><span className="muted">Posts</span><h2>{stats.posts}</h2></div><div className="card"><span className="muted">Followers</span><h2>{stats.followers}</h2></div><div className="card"><span className="muted">Likes received</span><h2>{stats.likes_received}</h2></div></section><section className="card"><h2>Creator tools</h2><p>Profile, publishing, stories, live, analytics and safety now use the independent Husie backend.</p></section></main>}

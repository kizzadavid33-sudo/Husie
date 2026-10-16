import Link from 'next/link'
import Nav from '../components/Nav'
import NotificationsClient from './NotificationsClient'
import {serverMe,serverGet} from '@/lib/mirrorgram/server'
export const dynamic='force-dynamic'
export default async function NotificationsPage(){const user=await serverMe<any>();if(!user)return <main className="shell"><Link href="/login">Log in</Link></main>;const r=await serverGet<{notifications:any[]}>('/api/notifications');return <main className="shell narrow"><header className="topbar"><div><h1>Notifications</h1><p>Likes, comments, follows and messages.</p></div><Nav username={user.username}/></header><section className="card"><NotificationsClient userId={user.id} initial={r.data.notifications??[]}/></section></main>}

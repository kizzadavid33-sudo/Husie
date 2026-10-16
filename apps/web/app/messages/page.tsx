import {redirect} from 'next/navigation'
import Nav from '../components/Nav'
import MessagesClient from '../components/MessagesClient'
import {serverMe} from '@/lib/mirrorgram/server'
export default async function MessagesPage({searchParams}:{searchParams?:Promise<{to?:string}>}){const user=await serverMe<any>();if(!user)redirect('/login');const params=searchParams?await searchParams:{};return <main className="shell"><header className="topbar"><div><h1>Messages</h1><p>Private conversations with people you choose to contact.</p></div><Nav username={user.username}/></header><MessagesClient userId={user.id} initialUsername={params.to??''}/></main>}

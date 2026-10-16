import {redirect} from 'next/navigation'
import {serverMe} from '@/lib/mirrorgram/server'
import CircleClient from './CircleClient'
export const dynamic='force-dynamic'
export default async function CirclesPage(){if(!await serverMe<any>())redirect('/login');return <main className="shell"><header className="topbar"><div><p className="eyebrow">HUSIE · YOUR INNER WORLD</p><h1>Private Circles</h1><p>Small spaces for the people you trust.</p></div></header><CircleClient/></main>}

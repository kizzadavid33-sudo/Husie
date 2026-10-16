import {redirect} from 'next/navigation'
import Nav from '../components/Nav'
import CreatePostForm from '../components/CreatePostForm'
import {serverMe} from '@/lib/mirrorgram/server'
export default async function CreatePage(){const user=await serverMe<any>();if(!user)redirect('/login');return <main className="shell"><header className="topbar"><div><h1>Husie</h1><p>Create</p></div><Nav username={user.username}/></header><CreatePostForm/></main>}

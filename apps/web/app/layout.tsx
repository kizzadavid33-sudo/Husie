import './globals.css'
import type {Metadata} from 'next'
import MobileNav from './components/MobileNav'
import {serverMe} from '@/lib/mirrorgram/server'
export const metadata:Metadata={title:'Husie',description:'Capture your reflection, share your light. Husie is where your moments reflect back. Post photos and videos, find your people, and keep memories in your own mirror. No noise, no fakes. Built in Mukono for the world.',icons:{icon:'/husie-logo.svg'}}
export default async function RootLayout({children}:{children:React.ReactNode}){const user=await serverMe();return <html lang="en"><body>{children}<MobileNav authenticated={!!user}/></body></html>}

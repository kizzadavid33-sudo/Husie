'use server'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {serverLogin,serverSignup} from '@/lib/mirrorgram/server'

async function setSession(setCookie:string|null){
 if(!setCookie)return
 const match=setCookie.match(/mirrorgram_session=([^;]+)/)
 if(match){const c=await cookies();c.set('mirrorgram_session',match[1],{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:30*86400})}
}
export async function login(formData:FormData){
 const email=String(formData.get('email')||'').trim(),password=String(formData.get('password')||'')
 if(!email||!password)redirect('/login?error=Enter your email and password.')
 try{const r=await serverLogin(email,password);await setSession(r.setCookie)}catch(e){redirect(`/login?error=${encodeURIComponent(e instanceof Error?e.message:'Login failed.')}`)}
 redirect('/')
}
export async function signup(formData:FormData){
 const email=String(formData.get('email')||'').trim(),password=String(formData.get('password')||''),username=String(formData.get('username')||'').trim().toLowerCase()
 if(!email||!password||!username)redirect('/login?error=Enter an email, username, and password to create your account.')
 if(password.length<8)redirect('/login?error=Your password must be at least 8 characters.')
 if(!/^[a-z0-9_]{3,30}$/.test(username))redirect('/login?error=Choose a username using 3-30 letters, numbers, or underscores.')
 try{const r=await serverSignup(email,username,password);await setSession(r.setCookie)}catch(e){redirect(`/login?error=${encodeURIComponent(e instanceof Error?e.message:'Registration failed.')}`)}
 redirect('/')
}

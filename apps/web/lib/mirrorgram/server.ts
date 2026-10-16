import {cookies} from 'next/headers'

const API_URL=(process.env.MIRROR_GRAM_API_URL||'http://127.0.0.1:4000').replace(/\/$/,'')
const SESSION_COOKIE='mirrorgram_session'

async function request<T>(path:string,init:RequestInit={}){
  const jar=await cookies()
  const token=jar.get(SESSION_COOKIE)?.value
  const headers=new Headers(init.headers)
  if(token) headers.set('cookie',`${SESSION_COOKIE}=${token}`)
  if(init.body && !headers.has('content-type')) headers.set('content-type','application/json')
  const res=await fetch(`${API_URL}${path}`,{...init,headers,cache:'no-store'})
  const text=await res.text();let data:any=null
  try{data=text?JSON.parse(text):null}catch{data=text}
  if(!res.ok) throw new Error(data?.error||`Request failed (${res.status})`)
  return {data:data as T,res}
}

export async function serverGet<T>(path:string){return request<T>(path)}
export async function serverPost<T>(path:string,body?:unknown){return request<T>(path,{method:'POST',body:body===undefined?undefined:JSON.stringify(body)})}
export async function serverMe<T=any>(){return (await request<{user:T|null}>('/api/auth/me')).data.user}

export async function serverLogin(email:string,password:string){
  const result=await request<{user:any}>('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})})
  const setCookie=result.res.headers.get('set-cookie')
  return {user:result.data.user,setCookie}
}

export async function serverSignup(email:string,username:string,password:string){
  const result=await request<{user:any}>('/api/auth/register',{method:'POST',body:JSON.stringify({email,username,display_name:username})})
  const setCookie=result.res.headers.get('set-cookie')
  return {user:result.data.user,setCookie}
}

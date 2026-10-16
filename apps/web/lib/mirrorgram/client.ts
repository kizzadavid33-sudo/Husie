export type ApiError={error:string}

export async function apiFetch<T>(path:string,init:RequestInit={}){
  const headers=new Headers(init.headers)
  if(init.body && !headers.has('content-type') && !(init.body instanceof FormData)) headers.set('content-type','application/json')
  const res=await fetch(path,{...init,headers,credentials:'include'})
  const text=await res.text()
  let data:any=null
  try{data=text?JSON.parse(text):null}catch{data=text}
  if(!res.ok) throw new Error(data?.error||`Request failed (${res.status})`)
  return data as T
}

export async function apiGet<T>(path:string){return apiFetch<T>(path)}
export async function apiPost<T>(path:string,body?:unknown){return apiFetch<T>(path,{method:'POST',body:body===undefined?undefined:JSON.stringify(body)})}

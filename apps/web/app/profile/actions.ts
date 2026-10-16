'use server'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {revalidatePath} from 'next/cache'
const API=(process.env.MIRROR_GRAM_API_URL||'http://127.0.0.1:4000').replace(/\/$/,'')
async function forward(path:string,init:RequestInit){const c=await cookies();const token=c.get('mirrorgram_session')?.value;const h=new Headers(init.headers);if(token)h.set('cookie',`mirrorgram_session=${token}`);return fetch(API+path,{...init,headers:h,cache:'no-store'})}
export async function updateProfile(formData:FormData){const r=await forward('/api/profile/update',{method:'POST',body:formData});if(!r.ok){const d=await r.json().catch(()=>({}));redirect('/profile?edit=1&error='+encodeURIComponent(d.error||'Profile update failed.'))}revalidatePath('/profile');redirect('/profile?saved=1')}
export async function signOut(){await forward('/api/auth/logout',{method:'POST'});const c=await cookies();c.delete('mirrorgram_session');redirect('/login')}

export async function deleteAccount(formData:FormData){
 const confirmation=String(formData.get('confirmation')||'');
 if(confirmation!=='DELETE HUSIE')redirect('/delete-account?error=confirmation');
 const r=await forward('/api/account/delete',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({confirmation})});
 if(!r.ok){const d=await r.json().catch(()=>({}));redirect('/delete-account?error='+encodeURIComponent(d.error||'Account deletion failed.'));}
 const c=await cookies();c.delete('mirrorgram_session');redirect('/login?accountDeleted=1');
}

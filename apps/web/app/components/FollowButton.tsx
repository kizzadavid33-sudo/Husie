'use client'
import {useState} from 'react'
import {apiPost} from '@/lib/mirrorgram/client'
export default function FollowButton({targetId,initialFollowing=false}:{targetId:string;initialFollowing?:boolean}){const [following,setFollowing]=useState(initialFollowing),[busy,setBusy]=useState(false);async function toggle(){if(busy)return;setBusy(true);try{const r=await apiPost<{following:boolean}>(`/api/follows/${targetId}`);setFollowing(r.following)}catch{}finally{setBusy(false)}}return <button className={following?'secondary':'primary'} onClick={toggle} disabled={busy}>{busy?'Please wait…':following?'Following':'Follow'}</button>}

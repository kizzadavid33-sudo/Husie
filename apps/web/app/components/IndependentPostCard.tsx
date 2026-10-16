'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'
import {apiGet,apiPost} from '@/lib/mirrorgram/client'

type Comment={id:string;user_id:string;body:string;created_at:string;username?:string;display_name?:string}
type Post={id:string;user_id:string;caption:string;created_at:string;username:string;display_name:string;avatar_path?:string|null;media?:{id:string;storage_path:string;media_type:string;url:string}[];music_path?:string|null;music_name?:string|null;music_url?:string|null;like_count:number;comment_count:number;liked:boolean;saved:boolean}
export default function IndependentPostCard({post}:{post:Post}){
 const [liked,setLiked]=useState(post.liked),[likes,setLikes]=useState(post.like_count),[show,setShow]=useState(false),[comments,setComments]=useState<Comment[]>([]),[body,setBody]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 const avatar=post.avatar_path?`/media/${post.avatar_path}`:null
 async function like(){if(busy)return;setBusy(true);setError('');try{const r=await apiPost<{liked:boolean}>(`/api/posts/${post.id}/like`);setLiked(r.liked);setLikes(v=>Math.max(0,v+(r.liked?1:-1)))}catch(e){setError(e instanceof Error?e.message:'Could not update like')}finally{setBusy(false)}}
 async function loadComments(){try{const r=await apiGet<{comments:Comment[]}>(`/api/posts/${post.id}/comments`);setComments(r.comments)}catch(e){setError(e instanceof Error?e.message:'Could not load comments')}}
 async function addComment(){const text=body.trim();if(!text)return;setBusy(true);setError('');try{const r=await apiPost<Comment>(`/api/posts/${post.id}/comments`,{body:text});setComments(v=>[...v,r]);setBody('')}catch(e){setError(e instanceof Error?e.message:'Could not comment')}finally{setBusy(false)}}
 return <article className="card post">
  <div className="post-head"><div className="post-author"><div className="post-author-avatar">{avatar?<img src={avatar} alt="" loading="lazy"/>:<span>{(post.username||'U')[0].toUpperCase()}</span>}</div><Link href={`/profile/${post.user_id}`} className="post-author-link"><strong>@{post.username}</strong><span>{post.display_name}</span></Link></div></div>
  {post.caption&&<p className="post-caption">{post.caption}</p>}
  {post.media?.length&&<div className="post-media-gallery">{post.media.map(m=>m.media_type==='video'?<video key={m.id} className="post-media" src={m.url} controls playsInline preload="metadata"/>:<img key={m.id} className="post-media" src={m.url} alt="" loading="lazy"/>)}</div>}
  {post.music_path&&<div className="post-music"><span>🎵</span><strong>{post.music_name||'Music'}</strong><audio controls preload="none" src={`/media/${post.music_path}`}/></div>}
  <div className="post-actions"><button type="button" onClick={like} disabled={busy}>{liked?'♥ Liked':'♡ Like'} {likes}</button><button type="button" onClick={()=>{const n=!show;setShow(n);if(n)loadComments()}}>💬 {post.comment_count+(comments.length>post.comment_count?comments.length-post.comment_count:0)}</button></div>
  {error&&<div className="message-error" role="alert">{error}</div>}
  {show&&<section className="comments"><h4>Comments</h4>{comments.map(c=><div className="comment-row" key={c.id}><strong>@{c.username||'user'}</strong><span>{c.body}</span></div>)}{!comments.length&&<div className="muted">No comments yet.</div>}<div className="comment-box"><input value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addComment()}} placeholder="Add a kind comment…"/><button type="button" onClick={addComment} disabled={busy||!body.trim()}>Post</button></div></section>}
 </article>
}

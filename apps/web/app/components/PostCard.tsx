'use client'
import IndependentPostCard from './IndependentPostCard'
export default function PostCard({post}:{post:any}){return <IndependentPostCard post={{...post,like_count:post.like_count??post.likeCount??0,comment_count:post.comment_count??post.commentCount??0}}/>}

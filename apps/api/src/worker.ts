import {q} from './db.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import {spawn} from 'node:child_process'
const root=process.env.MEDIA_ROOT||path.resolve(process.cwd(),'../../storage')
const ffmpeg=process.env.FFMPEG_BIN||'ffmpeg'
const interval=Number(process.env.MEDIA_WORKER_INTERVAL_MS||5000)
async function run(cmd:string,args:string[]){return new Promise<void>((resolve,reject)=>{const p=spawn(cmd,args,{stdio:['ignore','ignore','pipe']});let e='';p.stderr.on('data',x=>e+=x.toString());p.on('error',reject);p.on('close',c=>c===0?resolve():reject(new Error(e.slice(-4000)||`exit ${c}`)))})}
async function processOne(){const r=await q("with next as (select id from media_jobs where status='queued' and attempts<3 order by created_at for update skip locked limit 1) update media_jobs j set status='processing',attempts=j.attempts+1,started_at=now() from next where j.id=next.id returning j.*");if(!r.rowCount)return;const job=r.rows[0];try{const src=path.join(root,job.source_path);const outRel=job.source_path.replace(/\.[^.]+$/,'-optimized.mp4');const posterRel=job.source_path.replace(/\.[^.]+$/,'-poster.jpg');const out=path.join(root,outRel),poster=path.join(root,posterRel);await fs.mkdir(path.dirname(out),{recursive:true});await run(ffmpeg,['-y','-i',src,'-c:v','libx264','-preset','veryfast','-crf','28','-c:a','aac','-b:a','96k','-movflags','+faststart',out]);await run(ffmpeg,['-y','-ss','00:00:01','-i',out,'-frames:v','1','-q:v','4',poster]);await q("update media_jobs set status='done',output_path=$1,poster_path=$2,finished_at=now() where id=$3",[outRel,posterRel,job.id])}catch(e:any){await q("update media_jobs set status=case when attempts>=3 then 'failed' else 'queued' end,error_message=$1 where id=$2",[String(e?.message||e).slice(0,4000),job.id])}}
async function main(){console.log('Husie media worker running');for(;;){try{await processOne()}catch(e){console.error(e)}await new Promise(r=>setTimeout(r,interval))}}main()

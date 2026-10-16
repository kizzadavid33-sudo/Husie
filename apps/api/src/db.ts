import pg from 'pg'
const {Pool}=pg
export const pool=new Pool({connectionString:process.env.DATABASE_URL,max:Number(process.env.DB_POOL_SIZE||20)})
export async function q<T=any>(text:string,params:any[]=[]){return pool.query<T>(text,params)}

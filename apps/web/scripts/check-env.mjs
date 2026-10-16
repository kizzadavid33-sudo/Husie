const url = process.env.MIRROR_GRAM_API_URL
if (!url) { console.error('Husie environment check failed: MIRROR_GRAM_API_URL is missing.'); process.exit(1) }
try { const u=new URL(url); if (!['http:','https:'].includes(u.protocol)) throw new Error('protocol') } catch { console.error('Husie environment check failed: MIRROR_GRAM_API_URL must be a valid http(s) URL.'); process.exit(1) }
console.log('Husie independent environment check passed.')

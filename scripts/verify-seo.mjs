import assert from 'node:assert/strict';

const base=process.env.SITE_URL??'http://127.0.0.1:3199';
const strict=process.argv.includes('--strict-vary');
const r=await fetch(base+'/sitemap.xml');assert.equal(r.status,200);
const urls=[...((await r.text()).matchAll(/<loc>(.*?)<\/loc>/g))].map(m=>new URL(m[1]).pathname);
const attr=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));
let varyMissing=0, checks=0;
for(const path of urls){
 const html=await fetch(base+path,{headers:{Accept:'text/html'}});assert.equal(html.status,200,path);
 const body=await html.text();const tags=[...body.matchAll(/<meta\b[^>]*>/g)].map(m=>attr(m[0]));
 const meta=k=>tags.find(t=>t.name===k||t.property===k)?.content;
 assert.ok(meta('og:image'),path+' og:image');assert.ok(meta('twitter:image'),path+' twitter:image');
 assert.equal(new URL(meta('og:url')).pathname,path,path+' og:url');
 assert.ok(meta('twitter:title'),path+' twitter:title');
 assert.ok(!body.includes('opacity:0;')&&!body.includes('opacity:0"'),path+' hidden server content');
 if(!/(?:^|,\s*)Accept(?:,|$)/i.test(html.headers.get('vary')??''))varyMissing++;
 const md=await fetch(base+path,{headers:{Accept:'text/markdown',...(html.headers.get('etag')?{'If-None-Match':html.headers.get('etag')}: {})}});
 assert.equal(md.status,200,path+' Markdown with HTML ETag');
 assert.ok(md.headers.get('content-type').startsWith('text/markdown'));
 assert.match(md.headers.get('vary'),/(?:^|,\s*)Accept(?:,|$)/i);
 assert.match(md.headers.get('cache-control'),/no-store/);
 assert.equal(md.headers.get('cdn-cache-control'),'no-store');
 const again=await fetch(base+path,{headers:{Accept:'text/html'}});assert.ok(again.headers.get('content-type').startsWith('text/html'));
 console.log('PASS',path,'social metadata, visible HTML, Markdown, ETag and cache alternation');checks++;
}
const query=await fetch(base+'/blog?q=zzznomatchingarticle',{headers:{Accept:'text/markdown'}}).then(r=>r.text());assert.ok(query.includes('No articles match your search.'));
const matched=await fetch(base+'/blog?q=brand',{headers:{Accept:'text/markdown'}}).then(r=>r.text());assert.ok(matched.includes('Brand System vs. Logo'));
for(const path of ['/missing-regression','/services/missing-regression','/blog/missing-regression'])for(const accept of ['text/html','text/markdown'])assert.equal((await fetch(base+path,{headers:{Accept:accept}})).status,404);
const image=await fetch(base+'/_next/image?url=%2Fimages%2Fhero-bg.png&w=750&q=50');assert.equal(image.status,200);assert.ok(image.headers.get('content-type').startsWith('image/'));await image.arrayBuffer();
const robots=await fetch(base+'/robots.txt').then(r=>r.text());assert.ok(!robots.includes('Disallow: /icons/'));
console.log('PASS search parity, missing routes, q=50 hero image and favicon crawling');
const result={date:new Date().toISOString(),base,pages:checks,htmlVaryMissing:varyMissing,strict,technicalChecks:'passed',cacheDeploymentGate:varyMissing?'pending':'passed'};
console.log(JSON.stringify(result));
if(varyMissing){console.warn('DEPLOYMENT GATE:',varyMissing,'HTML routes lose Vary: Accept in this Next.js version. Validate edge/CDN before release.');if(strict)process.exitCode=1;}


import assert from 'node:assert/strict';

const base=process.env.SITE_URL??'http://127.0.0.1:3199';
const strict=process.argv.includes('--strict-vary');
const r=await fetch(base+'/sitemap.xml');assert.equal(r.status,200);
const urls=[...((await r.text()).matchAll(/<loc>(.*?)<\/loc>/g))].map(m=>new URL(m[1]).pathname);
const attr=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));
const decode=s=>s.replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const text=s=>decode(s.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
// Markdown titles that intentionally differ from the visible HTML H1; every other page must match its H1.
const mdTitleAlias={'/':'Neex Creative','/work':'Selected work','/services':'Services','/about':'About Neex Creative','/contact':'Contact Neex Creative','/book':'Book a discussion','/blog':'Blog'};
const mdTitle=md=>(md.match(/^# (.+)$/m)??[])[1]?.trim();
let varyMissing=0, checks=0;const seenTitles=new Map();
for(const path of urls){
 const html=await fetch(base+path,{headers:{Accept:'text/html'}});assert.equal(html.status,200,path);
 const body=await html.text();const tags=[...body.matchAll(/<meta\b[^>]*>/g)].map(m=>attr(m[0]));
 const meta=k=>tags.find(t=>t.name===k||t.property===k)?.content;
 assert.ok(meta('og:image'),path+' og:image');assert.ok(meta('twitter:image'),path+' twitter:image');
 assert.equal(new URL(meta('og:url')).pathname,path,path+' og:url');
 assert.ok(meta('twitter:title'),path+' twitter:title');
 assert.ok(!body.includes('opacity:0;')&&!body.includes('opacity:0"'),path+' hidden server content');
 const canonical=[...body.matchAll(/<link\b[^>]*>/g)].map(m=>attr(m[0])).find(l=>l.rel==='canonical');
 assert.equal(new URL(canonical?.href).pathname,path,path+' canonical');
 const jsonLd=[...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];assert.ok(jsonLd.length>0,path+' JSON-LD');for(const m of jsonLd)JSON.parse(m[1]);
 const h1s=[...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>text(m[1]));assert.equal(h1s.length,1,path+' one H1');
 if(!/(?:^|,\s*)Accept(?:,|$)/i.test(html.headers.get('vary')??''))varyMissing++;
 const md=await fetch(base+path,{headers:{Accept:'text/markdown',...(html.headers.get('etag')?{'If-None-Match':html.headers.get('etag')}: {})}});
 assert.equal(md.status,200,path+' Markdown with HTML ETag');
 assert.ok(md.headers.get('content-type').startsWith('text/markdown'));
 assert.match(md.headers.get('vary'),/(?:^|,\s*)Accept(?:,|$)/i);
 assert.match(md.headers.get('cache-control'),/no-store/);
 assert.equal(md.headers.get('cdn-cache-control'),'no-store');
 // Content identity: the Markdown must describe this page, not another one.
 const title=mdTitle(await md.text());const expected=mdTitleAlias[path]??h1s[0];
 assert.equal(title,expected,path+' Markdown title must identify the page');
 assert.ok(!seenTitles.has(title),`${path} Markdown duplicates ${seenTitles.get(title)}`);seenTitles.set(title,path);
 const again=await fetch(base+path,{headers:{Accept:'text/html'}});assert.ok(again.headers.get('content-type').startsWith('text/html'));
 assert.equal(text((await again.text()).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]),h1s[0],path+' HTML after Markdown');
 const mdAgain=await fetch(base+path,{headers:{Accept:'text/markdown'}});assert.equal(mdTitle(await mdAgain.text()),expected,path+' Markdown after HTML');
 console.log('PASS',path,'social metadata, canonical, JSON-LD, one H1, Markdown identity, ETag and cache alternation');checks++;
}
const query=await fetch(base+'/blog?q=zzznomatchingarticle',{headers:{Accept:'text/markdown'}}).then(r=>r.text());assert.equal(mdTitle(query),'Blog');assert.ok(query.includes('No articles match your search.'));
const matched=await fetch(base+'/blog?q=brand',{headers:{Accept:'text/markdown'}}).then(r=>r.text());assert.equal(mdTitle(matched),'Blog');
assert.ok(matched.includes('Brand System vs. Logo'));assert.ok(!matched.includes('The 6-Second Rule'),'blog search must filter');
for(const path of ['/missing-regression','/services/missing-regression','/blog/missing-regression'])for(const accept of ['text/html','text/markdown']){const res=await fetch(base+path,{headers:{Accept:accept}});assert.equal(res.status,404);if(accept==='text/markdown')assert.equal(res.headers.get('x-robots-tag'),'noindex');}
const image=await fetch(base+'/_next/image?url=%2Fimages%2Fhero-bg.png&w=750&q=50');assert.equal(image.status,200);assert.ok(image.headers.get('content-type').startsWith('image/'));await image.arrayBuffer();
const robots=await fetch(base+'/robots.txt').then(r=>r.text());assert.ok(!robots.includes('Disallow: /icons/'));assert.ok(/Sitemap: https:\/\/www\.neexcreative\.com\/sitemap\.xml/.test(robots));
const llms=await fetch(base+'/llms.txt');assert.equal(llms.status,200);assert.ok(llms.headers.get('content-type').startsWith('text/plain'));assert.equal(mdTitle(await llms.text()),'Neex Creative');
for(const [from,to] of [['/index.html','/'],['/about.html','/about'],['/contact.html','/contact'],['/book.html','/book'],['/web-design.html','/web-design']]){const res=await fetch(base+from,{redirect:'manual'});assert.equal(res.status,308,from);assert.equal(new URL(res.headers.get('location'),base).pathname,to,from);}
console.log('PASS search parity, missing routes, q=50 hero image, robots, llms.txt and legacy redirects');
const result={date:new Date().toISOString(),base,pages:checks,htmlVaryMissing:varyMissing,strict,technicalChecks:'passed',cacheDeploymentGate:varyMissing?'pending':'passed'};
console.log(JSON.stringify(result));
if(varyMissing){console.warn('DEPLOYMENT GATE:',varyMissing,'HTML routes lose Vary: Accept in this Next.js version. Validate edge/CDN before release.');if(strict)process.exitCode=1;}

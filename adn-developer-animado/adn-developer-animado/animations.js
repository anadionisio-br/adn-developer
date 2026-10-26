/* ADN Developer — animações. Carregado com defer, depois do script principal. */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)],R=document.documentElement,raf=requestAnimationFrame;
const calm=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||R.classList.contains('nm'),start=!calm(),hov=matchMedia('(hover:hover)').matches,ease=t=>1-Math.pow(1-t,3);
if(start)R.classList.add('anim');
const set=(s,c)=>$$(s).forEach(e=>e.classList.add(c));
/* ordem de entrada e variações */
$$('.sv,.pj,.dl,.gl,.ps4,.sg').forEach(p=>[...p.children].forEach((c,i)=>c.style.setProperty('--i',i)));
set('.dg>.rv:first-child,.ct>.rv:first-child','rv-l');set('.dv,.cta2','rv-r');set('.sg>.rv','rv-z');
$('#orcamento .cta .btn.p')?.classList.add('pulse');
$$('.card svg *,.dl svg *').forEach(e=>e.setAttribute('pathLength',1));
/* títulos palavra por palavra */
function split(el){let i=0;el.setAttribute('aria-label',el.textContent.trim());(function w(n){[...n.childNodes].forEach(c=>{if(c.nodeType!==3)return w(c);const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p))return f.append(p);const s=document.createElement('span'),t=document.createElement('span');s.className='w';s.setAttribute('aria-hidden',true);t.className='wi';t.textContent=p;t.style.setProperty('--i',i++);s.append(t);f.append(s)});c.replaceWith(f)})})(el)}
if(start){const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('sp-in');sio.unobserve(e.target)}}),{threshold:.4});$$('main h2').forEach(h=>{split(h);sio.observe(h)});split($('h1'))}
/* preloader → entrada do hero */
const pre=$('#pre'),bar=$('#pre i'),go=()=>{$('.hero').classList.add('in');$('h1').classList.add('sp-in')};
if(!start){pre.remove();go()}else{const t0=performance.now();(function t(){const e=performance.now()-t0,ok=document.readyState==='complete';bar.style.setProperty('--p',Math.min(e/1100,ok?1:.9));if((ok&&e>1100)||e>4000){pre.classList.add('out');setTimeout(()=>pre.remove(),1300);setTimeout(go,500)}else raf(t)})()}
/* palavra digitada */
const rw=$('.rot-w');if(rw){const W=['restaurantes','barbearias','escritórios de arquitetura','lojas e comércios','profissionais autônomos'];let wi=0,ci=0,del=false;
if(!start)rw.textContent='negócios de todo tipo';else(function tw(){if(calm())return rw.textContent='negócios de todo tipo';const w=W[wi];ci+=del?-1:1;rw.textContent=w.slice(0,ci);let d=del?35:70;if(!del&&ci===w.length){del=true;d=1600}else if(del&&!ci){del=false;wi=(wi+1)%W.length;d=350}setTimeout(tw,d)})()}
/* partículas do hero */
const cv=$('#fx'),hero=$('.hero');
if(cv&&start){const x=cv.getContext('2d'),m={x:-999,y:-999};let W,H,P=[],vis=true;const col=()=>['--g1','--g2','--g3'].map(v=>getComputedStyle(R).getPropertyValue(v).trim());let C=col();
new MutationObserver(()=>C=col()).observe(R,{attributes:true,attributeFilter:['data-theme']});
const size=()=>{const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);P=Array.from({length:Math.min(70,Math.round(W*H/16000))},(_,i)=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1.5+Math.random()*2,c:i%3}))};
size();addEventListener('resize',size);
hero.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();m.x=e.clientX-b.left;m.y=e.clientY-b.top});hero.addEventListener('pointerleave',()=>m.x=-999);
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(hero);
(function f(){raf(f);if(!vis||document.hidden||calm())return;x.clearRect(0,0,W,H);
for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy)||1;if(d<140){p.x+=dx/d*1.6;p.y+=dy/d*1.6}x.globalAlpha=.7;x.fillStyle=C[p.c];x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}
for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){x.globalAlpha=(1-d/120)*.35;x.strokeStyle=C[a.c];x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}})()}
/* mockup do hero acompanha o mouse */
const st=$('.stage');if(st&&start&&hov){hero.addEventListener('pointermove',e=>{if(calm())return;st.style.setProperty('--ry',(e.clientX/innerWidth-.5)*14+'deg');st.style.setProperty('--rx',(.5-e.clientY/innerHeight)*10+'deg')});hero.addEventListener('pointerleave',()=>{st.style.setProperty('--rx','0deg');st.style.setProperty('--ry','0deg')})}
/* progresso de rolagem + botão WhatsApp */
const pg=$('#prog'),wa=$('#wa'),wl=$('[data-wa]');if(wl)wa.href=wl.href;
addEventListener('scroll',()=>{const m=R.scrollHeight-innerHeight;pg.style.setProperty('--s',m>0?scrollY/m:0);wa.classList.toggle('on',scrollY>600)},{passive:true});
/* contadores */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,n=+el.dataset.n,s=el.dataset.s||'';cio.unobserve(el);if(!start)return el.textContent=n+s;const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1600);el.textContent=Math.round(n*ease(k))+s;if(k<1)raf(f)})(t0)}),{threshold:.6});
$$('[data-n]').forEach(e=>{if(start)e.textContent=0;cio.observe(e)});
/* tilt 3D + brilho que segue o mouse */
const fio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fio.unobserve(e.target);setTimeout(()=>e.target.classList.add('fin'),start?1700:0)}}),{threshold:.15});
if(hov)$$('.pc,.card,.gt').forEach(el=>{el.classList.add('tl3');fio.observe(el);
el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),px=(e.clientX-b.left)/b.width,py=(e.clientY-b.top)/b.height;el.style.setProperty('--mx',px*100+'%');el.style.setProperty('--my',py*100+'%');if(calm())return;el.style.setProperty('--ry',(px-.5)*8+'deg');el.style.setProperty('--rx',(.5-py)*8+'deg')});
el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')})});
/* botões magnéticos + ondas ao clicar */
if(hov)$$('.btn.p,.cta .btn').forEach(b=>{b.addEventListener('pointermove',e=>{if(calm())return;const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.25}px ${(e.clientY-r.top-r.height/2)*.35}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.db');if(!b||calm())return;const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)/2,i=document.createElement('i');i.className='rip';i.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.append(i);setTimeout(()=>i.remove(),650)});
/* cursor com rastro */
const cu=$('#cur');if(cu&&start&&matchMedia('(hover:hover) and (pointer:fine)').matches){let tx=0,ty=0,cx=0,cy=0;addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;cu.classList.add('on');cu.classList.toggle('h',!!e.target.closest('a,button,input,select,textarea,label'))});document.documentElement.addEventListener('pointerleave',()=>cu.classList.remove('on'));(function f(){raf(f);cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cu.style.transform=`translate3d(${cx}px,${cy}px,0)`})()}
/* menu de exemplo alterna sozinho */
$$('.mn').forEach(m=>{const b=[...m.children],pick=x=>{b.forEach(y=>y.classList.remove('on'));x.classList.add('on')};let i=0;b.forEach(x=>x.addEventListener('click',()=>{pick(x);i=b.indexOf(x)}));setInterval(()=>{if(!calm()&&!m.matches(':hover'))pick(b[i=(i+1)%b.length])},1800)});
/* confete quando a mensagem do formulário fica pronta */
const res=$('#res');
function boom(){const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:400';c.width=innerWidth;c.height=innerHeight;document.body.append(c);const x=c.getContext('2d'),P=Array.from({length:110},()=>({x:c.width/2,y:c.height*.6,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:4+Math.random()*6,r:Math.random()*6,c:`hsl(${Math.random()*80+300},80%,65%)`}));let n=0;(function f(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});++n<130?raf(f):c.remove()})()}
if(res&&start)new MutationObserver(()=>{if(/^Tudo certo/.test(res.textContent.trim()))boom()}).observe(res,{childList:true});
})();

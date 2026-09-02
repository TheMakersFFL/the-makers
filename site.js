(function(){
 const nav=document.querySelector('.nav'), hamb=document.querySelector('.hamb');
 const setNav=open=>{
   if(!nav||!hamb)return;
   nav.classList.toggle('open',open);
   hamb.setAttribute('aria-expanded',String(open));
   hamb.setAttribute('aria-label',open?'Close navigation':'Open navigation');
   hamb.textContent=open?'×':'☰';
   document.body.classList.toggle('nav-open',open && matchMedia('(max-width:1050px)').matches);
 };
 if(nav&&hamb){
   if(!nav.id)nav.id='site-nav';
   hamb.type='button';
   hamb.setAttribute('aria-controls',nav.id);
   hamb.setAttribute('aria-expanded','false');
   hamb.addEventListener('click',e=>{e.stopPropagation();setNav(!nav.classList.contains('open'))});
   nav.addEventListener('click',e=>{if(e.target.closest('a'))setNav(false)});
   document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!e.target.closest('.topbar'))setNav(false)});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setNav(false);hamb.focus()}});
   addEventListener('resize',()=>{if(innerWidth>1050&&nav.classList.contains('open'))setNav(false)},{passive:true});
 }
 const here=(location.pathname.split('/').pop()||'index.html');
 document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')===here)a.classList.add('active')});
 document.querySelectorAll('.table-wrap').forEach((w,i)=>{if(!w.hasAttribute('tabindex'))w.tabIndex=0;if(!w.hasAttribute('role'))w.setAttribute('role','region');if(!w.hasAttribute('aria-label'))w.setAttribute('aria-label',`Scrollable table ${i+1}`)});
 window.fmt=(n)=>Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
 window.gradeClass=(g)=>{let x=(g||'').toLowerCase()[0];return ['a','b','c','d','f'].includes(x)?x:'b'};
 window.esc=(s)=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
})();

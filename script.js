function goTo(id){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}

/* ============ LOADER ============ */
(function(){
  var name='Chiranjit Chakma';
  var el=document.getElementById('ld-name');
  var bar=document.getElementById('ld-bar');
  var pct=document.getElementById('ld-pct');
  var loader=document.getElementById('loader');
  var i=0;
  function type(){
    if(i<name.length){el.textContent+=name[i];i++;setTimeout(type,50)}
    else{
      bar.style.width='100%';
      var s=Date.now(),d=1300;
      (function count(){
        var p=Math.min((Date.now()-s)/d,1);
        pct.textContent=Math.floor(p*100)+'%';
        if(p<1){requestAnimationFrame(count)}
        else{pct.textContent='100%';setTimeout(function(){loader.style.opacity='0';setTimeout(function(){loader.style.display='none'},600)},150)}
      })();
    }
  }
  setTimeout(type,150);
})();

/* ============ HAMBURGER / MOBILE NAV ============ */
var hbg=document.getElementById('hbg'),mnav=document.getElementById('mnav');
hbg.addEventListener('click',function(){hbg.classList.toggle('open');mnav.classList.toggle('open')});
function cM(){hbg.classList.remove('open');mnav.classList.remove('open')}
window.addEventListener('resize',function(){if(window.innerWidth>1024)cM()});

/* ============ NAV COMPACT + SCROLL PROGRESS + GO-TOP ============ */
var progressBar=document.getElementById('scrollProgress');
var navEl=document.getElementById('nav');
var goTopBtn=document.getElementById('goTop');
window.addEventListener('scroll',function(){
  navEl.style.padding=window.scrollY>50?'9px 0':'16px 0';
  if(window.scrollY>400){goTopBtn.classList.add('show')}else{goTopBtn.classList.remove('show')}
  var doc=document.documentElement;
  var scrollable=doc.scrollHeight-doc.clientHeight;
  var pct=scrollable>0?(window.scrollY/scrollable)*100:0;
  progressBar.style.width=pct+'%';
},{passive:true});

/* ============ ABOUT BIO READ-MORE ============ */
function toggleBio(){
  var bio=document.getElementById('aboutBio');
  var btn=document.getElementById('bioToggle');
  var expanded=bio.classList.toggle('expanded');
  btn.classList.toggle('expanded',expanded);
  btn.querySelector('span').textContent=expanded?'Show Less':'Read More';
}

/* ============ SKILL BARS (fill on scroll into view) ============ */
var skillsDone=false;
window.addEventListener('scroll',function(){
  if(skillsDone)return;
  var s=document.getElementById('skills');
  if(s&&s.getBoundingClientRect().top<window.innerHeight*0.85){
    skillsDone=true;
    document.querySelectorAll('.skill-fill').forEach(function(b){b.style.width=b.getAttribute('data-w')});
  }
},{passive:true});

/* ============ ANIMATED NUMBER COUNTERS ============ */
(function(){
  var counted=new WeakSet();
  function animateCount(el){
    if(counted.has(el))return;
    counted.add(el);
    var target=parseInt(el.getAttribute('data-count'),10);
    var suffix=el.getAttribute('data-suffix')||'';
    if(isNaN(target))return;
    var start=0,duration=1200,startTime=null;
    function step(ts){
      if(!startTime)startTime=ts;
      var progress=Math.min((ts-startTime)/duration,1);
      var eased=1-Math.pow(1-progress,3);
      el.textContent=Math.floor(eased*target)+suffix;
      if(progress<1)requestAnimationFrame(step);
      else el.textContent=target+suffix;
    }
    requestAnimationFrame(step);
  }
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters=document.querySelectorAll('[data-count]');
  if(reduce||!('IntersectionObserver' in window)){
    counters.forEach(function(el){el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'')});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){animateCount(entry.target);io.unobserve(entry.target)}
      });
    },{threshold:0.5});
    counters.forEach(function(el){io.observe(el)});
  }
})();

/* ============ CONTACT FORM (front-end only, no backend wired) ============ */
document.getElementById('sBtn').addEventListener('click',function(){
  var btn=this,n=document.getElementById('fn').value.trim(),e=document.getElementById('fe').value.trim(),m=document.getElementById('fm').value.trim();
  if(!n||!e||!m){btn.textContent='Fill all fields';setTimeout(function(){btn.textContent='Send Message'},2000);return}
  btn.textContent='Sending...';btn.disabled=true;
  setTimeout(function(){
    btn.textContent='Sent!';btn.style.background='#4ade80';btn.style.color='#000';
    ['fn','fe','fs','fm'].forEach(function(id){document.getElementById(id).value=''});
    setTimeout(function(){btn.textContent='Send Message';btn.style.background='';btn.style.color='';btn.disabled=false},3000);
  },1500);
});

/* ============ SCREENSHOT GALLERY / LIGHTBOX ============ */
var galleries={
  netsafe:['netsafe-homepage.png','netsafe-connectpage-1.png','netsafe-connectpage-2.png','netsafe-profilepage.png'],
  netsafex:['netsafe.x-securitypage.png','netsafe.x-settingspage.png','netsafe.x-toolspage.png']
};
var currentGallery=[],currentIndex=0;
function openGallery(name){
  currentGallery=galleries[name];currentIndex=0;
  showLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function showLightboxImage(){
  document.getElementById('lightbox-img').src=currentGallery[currentIndex];
  document.getElementById('lightbox-counter').textContent=(currentIndex+1)+' / '+currentGallery.length;
}
function lightboxNav(dir){
  currentIndex=(currentIndex+dir+currentGallery.length)%currentGallery.length;
  showLightboxImage();
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){
  if(!document.getElementById('lightbox').classList.contains('open'))return;
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft')lightboxNav(-1);
  if(e.key==='ArrowRight')lightboxNav(1);
});

/* ============ SCROLL REVEAL ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.reveal');
  if(reduce||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el=entry.target;
        var parent=el.parentElement;
        var siblings=Array.prototype.filter.call(parent.children,function(c){return c.classList.contains('reveal')});
        var idx=siblings.indexOf(el);
        setTimeout(function(){el.classList.add('in')},Math.max(0,idx)*80);
        io.unobserve(el);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(e){io.observe(e)});
})();

/* ============ SCROLL-SPY NAV HIGHLIGHTING ============ */
(function(){
  var navBtns=document.querySelectorAll('[data-section]');
  var sectionIds=['about','skills','projects','cyber','goals','contact'];
  var sections=sectionIds.map(function(id){return document.getElementById(id)}).filter(Boolean);
  function setActive(id){
    navBtns.forEach(function(b){b.classList.toggle('active',b.getAttribute('data-section')===id)});
  }
  function onScroll(){
    var scrollY=window.scrollY||window.pageYOffset;
    var probe=scrollY+140;
    var current=null;
    for(var i=0;i<sections.length;i++){
      var s=sections[i],top=s.offsetTop,bottom=top+s.offsetHeight;
      if(probe>=top&&probe<bottom){current=s.id;break}
    }
    if(sections.length&&probe<sections[0].offsetTop){current=null}
    var maxScroll=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    if(sections.length&&scrollY>=maxScroll-2){current=sections[sections.length-1].id}
    setActive(current);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  onScroll();
})();

/* ============ CURSOR-FOLLOW SPOTLIGHT (project & goal cards) ============ */
document.querySelectorAll('.proj-card, .gc').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});

/* ============ 3D TILT (project & goal cards) — desktop only, subtle ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  if(window.matchMedia('(pointer: coarse)').matches)return; /* skip on touch devices */
  document.querySelectorAll('.proj-card, .gc').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-0.5;
      var py=(e.clientY-r.top)/r.height-0.5;
      var rx=(py*-3.5).toFixed(2);
      var ry=(px*3.5).toFixed(2);
      card.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-2px)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='';
    });
  });
})();

/* ============ HERO BLOB PARALLAX (desktop only) ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  if(window.matchMedia('(pointer: coarse)').matches)return;
  var hero=document.getElementById('hero');
  var blobs=document.querySelectorAll('.blob-wrap');
  if(!hero||!blobs.length)return;
  hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect();
    var px=(e.clientX-r.left)/r.width-0.5;
    var py=(e.clientY-r.top)/r.height-0.5;
    blobs.forEach(function(b,i){
      var strength=(i+1)*10;
      b.style.transform='translate('+(px*strength).toFixed(1)+'px,'+(py*strength).toFixed(1)+'px)';
    });
  });
})();

/* ============ HERO PARTICLE NETWORK ============ */
(function(){
  var canvas=document.getElementById('heroCanvas');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var host=canvas.parentElement;
  var particles=[],mouse={x:null,y:null};
  var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2);

  function resize(){
    var rect=host.getBoundingClientRect();
    W=rect.width;H=rect.height;
    canvas.width=W*dpr;canvas.height=H*dpr;
    canvas.style.width=W+'px';canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function initParticles(){
    var area=W*H;
    var count=Math.round(Math.min(95,Math.max(32,area/12500)));
    particles=[];
    for(var i=0;i<count;i++){
      particles.push({
        x:Math.random()*W,
        y:Math.random()*H,
        vx:(Math.random()-0.5)*0.3,
        vy:(Math.random()-0.5)*0.3,
        r:Math.random()*1.7+0.9,
        hue:Math.random()>0.7?'34,211,238':'130,190,255'
      });
    }
  }

  resize();initParticles();
  var resizeTimer;
  window.addEventListener('resize',function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){resize();initParticles()},150);
  });

  host.addEventListener('mousemove',function(e){
    var r=host.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
  });
  host.addEventListener('mouseleave',function(){mouse.x=null;mouse.y=null});

  var linkDist=130;

  function frame(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
      if(mouse.x!==null){
        var dx=mouse.x-p.x,dy=mouse.y-p.y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){p.x-=dx*0.0022;p.y-=dy*0.0022}
      }
    }
    for(var i=0;i<particles.length;i++){
      for(var j=i+1;j<particles.length;j++){
        var a=particles[i],b=particles[j];
        var dx=a.x-b.x,dy=a.y-b.y;
        var dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<linkDist){
          ctx.strokeStyle='rgba(79,157,255,'+(0.22*(1-dist/linkDist)).toFixed(3)+')';
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+p.hue+',0.75)';
      ctx.shadowColor='rgba('+p.hue+',0.9)';
      ctx.shadowBlur=6;
      ctx.fill();
      ctx.shadowBlur=0;
    }
  }

  if(reduce){
    frame();
  }else{
    (function loop(){frame();requestAnimationFrame(loop)})();
  }
})();
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  if(window.matchMedia('(pointer: coarse)').matches)return;
  document.querySelectorAll('.btn-solid, .btn-border').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      var x=(e.clientX-r.left-r.width/2)*0.25;
      var y=(e.clientY-r.top-r.height/2)*0.35;
      btn.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
    });
    btn.addEventListener('mouseleave',function(){
      btn.style.transform='';
    });
  });
})();

/* ============ CUSTOM CURSOR ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(window.matchMedia('(pointer: coarse)').matches)return;
  var dot=document.getElementById('cursorDot');
  var ring=document.getElementById('cursorRing');
  var label=document.getElementById('cursorLabel');
  if(!dot||!ring)return;

  var mx=0,my=0,rx=0,ry=0,shown=false;

  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';dot.style.top=my+'px';
    if(!shown){
      shown=true;
      dot.classList.add('show');ring.classList.add('show');
      rx=mx;ry=my;
    }
  });
  document.addEventListener('mouseleave',function(){
    dot.classList.remove('show');ring.classList.remove('show');shown=false;
  });

  function tick(){
    rx+=(mx-rx)*0.18;ry+=(my-ry)*0.18;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  document.body.classList.add('custom-cursor');

  function setState(state,text){
    ring.classList.remove('link-hover','action-hover');
    if(state)ring.classList.add(state);
    label.textContent=text||'';
  }

  document.querySelectorAll('a, button, [onclick]').forEach(function(el){
    el.addEventListener('mouseenter',function(){setState('link-hover','')});
    el.addEventListener('mouseleave',function(){setState(null,'')});
  });
  document.querySelectorAll('input, textarea').forEach(function(el){
    el.addEventListener('mouseenter',function(){dot.classList.remove('show');ring.classList.remove('show')});
    el.addEventListener('mouseleave',function(){dot.classList.add('show');ring.classList.add('show');setState(null,'')});
  });
  document.querySelectorAll('.proj-card').forEach(function(el){
    el.addEventListener('mouseenter',function(){setState('action-hover','VIEW')});
    el.addEventListener('mouseleave',function(){setState(null,'')});
  });
  document.querySelectorAll('.gc').forEach(function(el){
    el.addEventListener('mouseenter',function(){setState('action-hover','GOAL')});
    el.addEventListener('mouseleave',function(){setState(null,'')});
  });
  var lbImg=document.getElementById('lightbox-img');
  if(lbImg){
    lbImg.addEventListener('mouseenter',function(){setState('action-hover','CLOSE')});
    lbImg.addEventListener('mouseleave',function(){setState(null,'')});
  }
})();

/* ============ COMMAND PALETTE ============ */
(function(){
  var palette=document.getElementById('palette');
  var input=document.getElementById('paletteInput');
  var list=document.getElementById('paletteList');
  var hint=document.getElementById('cmdkHint');
  if(!palette||!input||!list)return;

  var commands=[
    {label:'Go to About',sub:'Read about Chiranjit',icon:'&#128100;',action:function(){goTo('about')}},
    {label:'Go to Skills',sub:'View technical capabilities',icon:'&#9889;',action:function(){goTo('skills')}},
    {label:'Go to Projects',sub:'NetSafe, NetSafe X, Safe IQ & more',icon:'&#128187;',action:function(){goTo('projects')}},
    {label:'Go to Security',sub:'Cybersecurity focus areas',icon:'&#128272;',action:function(){goTo('cyber')}},
    {label:'Go to Goals',sub:'Roadmap & ambitions',icon:'&#127919;',action:function(){goTo('goals')}},
    {label:'Go to Contact',sub:'Get in touch',icon:'&#9993;',action:function(){goTo('contact')}},
    {label:'Email Chiranjit',sub:'chiranjitc.official@gmail.com',icon:'&#128231;',action:function(){location.href='mailto:chiranjitc.official@gmail.com'}},
    {label:'Open GitHub',sub:'github.com/chiranjitchakma',icon:'&#128193;',action:function(){window.open('https://github.com/chiranjitchakma','_blank')}},
    {label:'Open LinkedIn',sub:'Connect professionally',icon:'&#128188;',action:function(){window.open('https://www.linkedin.com/in/chiranjit-c-a1ab0b31a','_blank')}},
    {label:'Keyboard Shortcuts',sub:'See all available shortcuts',icon:'&#8984;',action:function(){openShortcuts()}},
    {label:'Back to Top',sub:'Return to the hero section',icon:'&#8593;',action:function(){goTo('hero')}}
  ];

  var activeIndex=0;

  function render(filter){
    filter=(filter||'').toLowerCase();
    var filtered=commands.filter(function(c){
      return c.label.toLowerCase().indexOf(filter)!==-1||c.sub.toLowerCase().indexOf(filter)!==-1;
    });
    list.innerHTML='';
    if(!filtered.length){
      list.innerHTML='<div class="palette-empty">No matches. Try "projects", "contact", "github"...</div>';
      return;
    }
    filtered.forEach(function(c,i){
      var el=document.createElement('div');
      el.className='palette-item'+(i===activeIndex?' active':'');
      el.innerHTML='<div class="pi-icon">'+c.icon+'</div><div><div class="pi-label">'+c.label+'</div><div class="pi-sub">'+c.sub+'</div></div>';
      el.addEventListener('click',function(){c.action();closePalette()});
      el.addEventListener('mousemove',function(){
        if(activeIndex!==i){activeIndex=i;render(input.value)}
      });
      list.appendChild(el);
    });
  }

  window.openPalette=function(){
    palette.classList.add('open');
    input.value='';
    activeIndex=0;
    render('');
    document.body.style.overflow='hidden';
    if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
    var attempts=0;
    (function tryFocus(){
      input.focus();
      attempts++;
      if(document.activeElement!==input&&attempts<12){
        setTimeout(tryFocus,25);
      }
    })();
  };
  window.closePalette=function(){
    palette.classList.remove('open');
    document.body.style.overflow='';
    input.blur();
  };

  input.addEventListener('input',function(){activeIndex=0;render(input.value)});
  input.addEventListener('keydown',function(e){
    var items=list.querySelectorAll('.palette-item');
    if(e.key==='ArrowDown'){e.preventDefault();activeIndex=Math.min(activeIndex+1,items.length-1);render(input.value)}
    else if(e.key==='ArrowUp'){e.preventDefault();activeIndex=Math.max(activeIndex-1,0);render(input.value)}
    else if(e.key==='Enter'){
      var filtered=commands.filter(function(c){
        var f=input.value.toLowerCase();
        return c.label.toLowerCase().indexOf(f)!==-1||c.sub.toLowerCase().indexOf(f)!==-1;
      });
      if(filtered[activeIndex]){filtered[activeIndex].action();closePalette()}
    }
    else if(e.key==='Escape'){closePalette()}
  });

  document.addEventListener('keydown',function(e){
    var isMac=navigator.platform.toUpperCase().indexOf('MAC')>=0;
    var modKey=isMac?e.metaKey:e.ctrlKey;
    if(modKey&&e.key.toLowerCase()==='k'){
      e.preventDefault();
      if(palette.classList.contains('open'))closePalette();else openPalette();
    }
    if(e.key==='Escape'&&palette.classList.contains('open'))closePalette();
  });
})();

/* ============ INTERACTIVE TERMINAL ============ */
(function(){
  var output=document.getElementById('termOutput');
  var input=document.getElementById('termInput');
  var row=document.getElementById('termInputRow');
  if(!output||!input)return;

  var history=[],historyIdx=-1;

  function line(html,cls){
    var d=document.createElement('div');
    if(cls)d.className=cls;
    d.innerHTML=html;
    output.appendChild(d);
    output.scrollTop=output.scrollHeight;
  }

  var commands={
    help:function(){
      line('<span class="term-out-accent">Available commands:</span>');
      line('&nbsp;&nbsp;whoami &mdash; who is Chiranjit');
      line('&nbsp;&nbsp;skills &mdash; technical skill breakdown');
      line('&nbsp;&nbsp;projects &mdash; list of projects &amp; status');
      line('&nbsp;&nbsp;goals &mdash; short &amp; long-term roadmap');
      line('&nbsp;&nbsp;contact &mdash; how to reach Chiranjit');
      line('&nbsp;&nbsp;ls &mdash; list site sections');
      line('&nbsp;&nbsp;sudo hire chiranjit &mdash; try it &#128521;');
      line('&nbsp;&nbsp;clear &mdash; clear this terminal');
    },
    whoami:function(){
      line('<span class="tc">Chiranjit Chakma &mdash; AI-Driven Developer &amp; Future Cybersecurity Specialist.</span>');
      line('<span class="tc">BSc Physics, Mathematics &amp; Computer Science &middot; Amrita Vishwa Vidyapeetham, Mysore.</span>');
    },
    skills:function(){
      line('<span class="term-out-accent">skills.json</span>');
      line('<span class="tc">  AI-Assisted Development ................ 85%</span>');
      line('<span class="tc">  Logical Thinking ......................... 80%</span>');
      line('<span class="tc">  HTML &amp; CSS .............................. 70%</span>');
      line('<span class="tc">  OS Knowledge ............................. 65%</span>');
      line('<span class="tc">  Cybersecurity Concepts ................... 60%</span>');
      line('<span class="tc">  Kali Linux ............................... 40%</span>');
    },
    projects:function(){
      line('<span class="term-out-accent">projects/</span>');
      line('<span class="tp">[ACTIVE]</span> <span class="tc">NetSafe &mdash; Digital Safety &amp; Trusted Device Management</span>');
      line('<span class="tw">[DEV]</span>&nbsp;&nbsp;&nbsp;<span class="tc">NetSafe X &mdash; Android Cybersecurity Platform</span>');
      line('<span class="tw">[DEV]</span>&nbsp;&nbsp;&nbsp;<span class="tc">Safe IQ &mdash; AI-Powered Community Safety Platform</span>');
      line('<span class="th">[PLAN]</span>&nbsp;<span class="tc">Cyber Threat Detection Dashboard</span>');
    },
    goals:function(){
      line('<span class="term-out-accent">Short-term (1&ndash;2yrs):</span> <span class="tc">Finish BSc PMCS, ship 5+ projects, earn CEH/Security+</span>');
      line('<span class="term-out-accent">Long-term (3&ndash;5yrs):</span> <span class="tc">Master\'s in Cybersecurity &amp; AI, work as a security/AI engineer</span>');
    },
    contact:function(){
      line('<span class="tc">Email:</span> <span class="term-out-accent">chiranjitc.official@gmail.com</span>');
      line('<span class="tc">Phone:</span> <span class="term-out-accent">+91 8798712804</span>');
      line('<span class="tc">Location:</span> <span class="term-out-accent">Mysore, Karnataka, India</span>');
    },
    ls:function(){
      line('<span class="tc">about.md&nbsp;&nbsp;skills.json&nbsp;&nbsp;projects/&nbsp;&nbsp;security.sh&nbsp;&nbsp;goals.yaml&nbsp;&nbsp;contact.txt</span>');
    },
    clear:function(){
      output.innerHTML='';
    }
  };

  function handleCommand(raw){
    var cmd=raw.trim();
    line('<span class="tp">root@kali:~#</span> <span class="term-out-echo">'+cmd.replace(/</g,'&lt;')+'</span>');
    if(!cmd)return;
    var lc=cmd.toLowerCase();
    if(lc==='sudo hire chiranjit'||lc==='sudo hire me'){
      line('<span class="tp">[&#10003;] Permission granted.</span> <span class="tc">Redirecting to contact section...</span>');
      setTimeout(function(){goTo('contact')},900);
      return;
    }
    if(commands[lc]){commands[lc]();return}
    line('<span class="term-out-error">command not found: '+cmd.replace(/</g,'&lt;')+'</span> <span class="tc">&mdash; type \'help\' for a list.</span>');
  }

  input.addEventListener('keydown',function(e){
    if(e.key==='Enter'){
      if(input.value.trim()){history.push(input.value);historyIdx=history.length}
      handleCommand(input.value);
      input.value='';
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      if(historyIdx>0){historyIdx--;input.value=history[historyIdx]}
    }else if(e.key==='ArrowDown'){
      e.preventDefault();
      if(historyIdx<history.length-1){historyIdx++;input.value=history[historyIdx]}
      else{historyIdx=history.length;input.value=''}
    }
  });

  if(row){
    row.addEventListener('click',function(){input.focus()});
  }
})();

/* ============ LIVE GITHUB STATS ============ */
(function(){
  var statsEl=document.getElementById('ghStats');
  if(!statsEl)return;
  var username='chiranjitckz';

  fetch('https://api.github.com/users/'+username)
    .then(function(res){
      if(!res.ok)throw new Error('GitHub API responded '+res.status);
      return res.json();
    })
    .then(function(data){
      var joined=new Date(data.created_at).getFullYear();
      statsEl.innerHTML=
        '<div class="gh-stat">'+data.public_repos+'<span>Repos</span></div>'+
        '<div class="gh-stat">'+data.followers+'<span>Followers</span></div>'+
        '<div class="gh-stat">'+joined+'<span>Since</span></div>';
    })
    .catch(function(){
      statsEl.innerHTML='<span class="gh-error">Live stats unavailable right now &mdash; the profile link still works.</span>';
    });
})();

/* ============ TOAST NOTIFICATIONS ============ */
function showToast(icon,title,sub,ms){
  var stack=document.getElementById('toastStack');
  if(!stack)return;
  var t=document.createElement('div');
  t.className='toast';
  t.innerHTML='<div class="toast-icon">'+icon+'</div><div><div class="toast-title">'+title+'</div>'+(sub?'<div class="toast-sub">'+sub+'</div>':'')+'</div>';
  stack.appendChild(t);
  requestAnimationFrame(function(){t.classList.add('show')});
  setTimeout(function(){
    t.classList.remove('show');
    setTimeout(function(){t.remove()},400);
  },ms||4200);
}

function hasSeen(key){
  try{return localStorage.getItem('seen_'+key)==='1'}catch(e){return false}
}
function markSeen(key){
  try{localStorage.setItem('seen_'+key,'1')}catch(e){}
}

/* ============ KEYBOARD SHORTCUTS OVERLAY ============ */
(function(){
  var overlay=document.getElementById('shortcutsOverlay');
  if(!overlay)return;
  window.closeShortcuts=function(){overlay.classList.remove('open')};
  window.openShortcuts=function(){overlay.classList.add('open')};

  document.addEventListener('keydown',function(e){
    var tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    if(e.key==='?'){
      e.preventDefault();
      if(overlay.classList.contains('open'))closeShortcuts();else openShortcuts();
    }
    if(e.key==='Escape'&&overlay.classList.contains('open'))closeShortcuts();
  });
})();

/* ============ EASTER EGG (KONAMI CODE) ============ */
(function(){
  var eggOverlay=document.getElementById('eggOverlay');
  if(!eggOverlay)return;
  window.closeEgg=function(){eggOverlay.classList.remove('open')};

  var sequence=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var progress=0;

  document.addEventListener('keydown',function(e){
    var tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    var key=e.key.length===1?e.key.toLowerCase():e.key;
    if(key===sequence[progress]){
      progress++;
      if(progress===sequence.length){
        progress=0;
        eggOverlay.classList.add('open');
        if(!hasSeen('konami')){
          markSeen('konami');
          setTimeout(function(){
            showToast('&#127942;','Achievement Unlocked','Code Explorer &mdash; you found the Konami code');
          },600);
        }
      }
    }else{
      progress=(key===sequence[0])?1:0;
    }
  });
})();

/* ============ ACHIEVEMENT HOOKS ============ */
(function(){
  var origOpenPalette=window.openPalette;
  if(origOpenPalette){
    window.openPalette=function(){
      origOpenPalette();
      if(!hasSeen('palette')){
        markSeen('palette');
        setTimeout(function(){showToast('&#9889;','Power user detected','You found the command palette')},500);
      }
    };
  }
})();
(function(){
  var input=document.getElementById('termInput');
  if(!input)return;
  var fired=false;
  input.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!fired&&input.value.trim()){
      fired=true;
      if(!hasSeen('terminal')){
        markSeen('terminal');
        setTimeout(function(){showToast('&#128187;','Achievement Unlocked','Hands on the terminal &mdash; nice')},400);
      }
    }
  });
})();

(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    sparkle:'M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z',
    heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    share:'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 10.5l6.8-4M8.6 13.5l6.8 4',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    bookmark:'M6 3h12v18l-6-4-6 4V3Z', search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    copy:'M9 9h12v12H9zM15 9V3H3v12h6', check:'m5 12 4 4L19 6', close:'m6 6 12 12M6 18 18 6',
    writing:'m16 3 5 5L8 21H3v-5L16 3ZM13 6l5 5', marketing:'m3 11 18-7v16l-18-7v-2ZM6 14l2 7h4l-2-6',
    product:'M3 6h18v14H3zM8 6V3h8v3M3 11h18M10 11v3h4v-3', design:'M12 3 3 9l9 6 9-6-9-6ZM3 15l9 6 9-6M3 12l9 6 9-6',
    coding:'m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18', business:'M3 21h18M5 21V9h6v12M11 21V3h8v18M14 7h2M14 11h2M14 15h2',
    sales:'m3 17 6-6 4 4 8-10M15 5h6v6', productivity:'M9 3h6M12 3v4M20 5l-2 2M12 10v5l3 2M20 14a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    learning:'M2 5h8l2 2 2-2h8v14h-8l-2 2-2-2H2V5ZM12 7v14', research:'M21 21l-6-6M17 9a7 7 0 1 1-14 0 7 7 0 0 1 14 0M6 9h6M9 6v6',
    data:'M3 3v18h18M7 17v-4M12 17V9M17 17V5', career:'M4 7h16v14H4zM8 7V3h8v4M4 12h16M10 12v3h4v-3',
    lifestyle:'M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7', creativity:'M9 18h6M9 21h6M8 15a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3',
    operations:'M3 4h7v7H3zM14 13h7v7h-7zM10 7h7v6M7 11v6h7', settings:'M4 7h16M4 17h16M8 4v6M16 14v6',
    chevron:'m9 5 7 7-7 7', chevrondown:'m6 9 6 6 6-6', menu:'M4 6h16M4 12h16M4 18h16', globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18',
    reset:'M3 4v6h6M3 10a9 9 0 1 1 1 9', bolt:'m13 2-9 12h7l-1 8 10-12h-7l1-8', star:'m12 3 3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1 3-6'
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.sparkle}"/></svg>`;
  const categories = [
    {id:'writing',name:'Writing',color:'purple'}, {id:'marketing',name:'Marketing',color:'pink'}, {id:'product',name:'Product',color:'blue'},
    {id:'design',name:'Design',color:'purple'}, {id:'coding',name:'Coding',color:'blue'}, {id:'business',name:'Business',color:'orange'},
    {id:'sales',name:'Sales',color:'green'}, {id:'productivity',name:'Productivity',color:'orange'}, {id:'learning',name:'Learning',color:'green'},
    {id:'research',name:'Research',color:'blue'}, {id:'data',name:'Data & analytics',color:'green'}, {id:'career',name:'Career',color:'pink'},
    {id:'lifestyle',name:'Everyday life',color:'orange'}, {id:'creativity',name:'Creativity',color:'pink'}, {id:'operations',name:'Operations',color:'blue'}
  ];
  const cat = id => categories.find(c => c.id === id);
  const prompts = Array.isArray(window.PROMPTVERSE_PROMPTS) ? window.PROMPTVERSE_PROMPTS : [];
  const read = (key, fallback) => {try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}};
  const savedData = read('promptverse.saved', []);
  const initialProfile = read('promptverse.profile', null);
  let profile = initialProfile && typeof initialProfile==='object' && Array.isArray(initialProfile.goals) ? initialProfile : null;
  let saved = new Set(Array.isArray(savedData)?savedData.filter(id=>prompts.some(p=>p.id===id)):[]);
  let state = {view:'library',category:'all',query:'',difficulty:'all',sort:'featured',visible:12,mode:'all',menu:false};
  let toastTimer, activePrompt, customValues = {}, customText = '', manualEditing = false;
  let likeCounts = {}, liked = new Set(), likesStatus = 'loading';
  const pendingLikes = new Set();
  const viewLabel = () => state.view==='saved'?'Saved prompts':state.view==='popular'?'Popular prompts':'Explore library';
  let onboarding = {step:0,role:profile?.role || 'Everyone',goals:profile?.goals || [],tool:profile?.tool || 'Any AI assistant'};
  const app = $('#app'), promptDialog = $('#prompt-dialog'), onboardingDialog = $('#onboarding-dialog');
  const persist = (key, value) => {try{localStorage.setItem(key,JSON.stringify(value));}catch{toast('Your browser could not save this preference.');}};
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
  function filtered(){
    const terms=state.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return prompts.filter(p=>
      (state.view!=='saved'||saved.has(p.id)) &&
      (state.category==='all'||p.category===state.category) &&
      (state.difficulty==='all'||p.difficulty===state.difficulty) &&
      (state.mode!=='foryou'||!profile?.goals.length||profile.goals.includes(p.category)) &&
      terms.every(term=>`${p.title} ${p.description} ${cat(p.category)?.name} ${p.tags.join(' ')} ${p.prompt}`.toLowerCase().includes(term))
    ).sort((a,b)=>state.view==='popular'||state.sort==='popular'?(likeCounts[b.id]||0)-(likeCounts[a.id]||0)||a.title.localeCompare(b.title):state.sort==='az'?a.title.localeCompare(b.title):Number(b.featured)-Number(a.featured)||a.title.localeCompare(b.title));
  }
  const navButton = (name, label, view) => `<button class="nav-item ${state.view===view?'active':''}" data-view="${view}">${icon(name)}<span>${label}</span>${view==='saved'?`<span class="nav-count" id="saved-count">${saved.size}</span>`:''}</button>`;
  function render(){
    const featuredPrompt=prompts.find(p=>p.difficulty==='Advanced'&&profile?.goals.includes(p.category))||prompts.find(p=>p.difficulty==='Advanced')||prompts[0];
    app.innerHTML=`
      <div class="app-shell">
        <aside class="sidebar ${state.menu?'open':''}" id="sidebar" aria-label="Main navigation">
          <a class="brand" href="#" data-home><span class="brand-mark">&gt;_</span><span>promptverse<span class="brand-dot">.</span></span></a>
          <span class="workspace-label">YOUR WORKSPACE</span>
          <nav>${navButton('grid','Explore library','library')}${navButton('bolt','Popular prompts','popular')}${navButton('bookmark','Saved prompts','saved')}</nav>
          <div class="nav-section-label">CATEGORIES <span>${categories.length}</span></div>
          <div class="category-nav">${categories.map(c=>`<button class="category-nav-item ${state.category===c.id?'active':''}" data-category="${c.id}">${icon(c.id)}<span>${c.name}</span><span class="category-count">${prompts.filter(p=>p.category===c.id).length}</span></button>`).join('')}</div>
          <div class="sidebar-bottom"><div class="sidebar-tip">${icon('sparkle')}<span>A starting point for<br>every kind of idea.</span></div><button class="preferences" data-onboard>${icon('settings')}<span>Your preferences</span>${icon('chevron')}</button></div>
        </aside>
        <button class="sidebar-scrim ${state.menu?'visible':''}" aria-label="Close navigation" data-close-menu></button>
        <div class="main-shell">
          <header class="topbar"><div class="breadcrumb"><button class="mobile-menu icon-button" aria-label="Open navigation" aria-expanded="${state.menu}" aria-controls="sidebar" data-menu>${icon('menu')}</button><span>Workspace</span>${icon('chevron')}<strong>${viewLabel()}</strong></div><div class="topbar-right"><span class="public-badge">${icon('globe')}Free. Open to everyone.</span><button class="avatar" aria-label="Change your preferences" data-onboard>P</button></div></header>
          <main id="main" tabindex="-1">
            <div class="page-heading"><div><div class="eyebrow">PROMPTVERSE / YOUR AI ARSENAL</div><h1>${state.view==='saved'?'Your personal arsenal.':state.view==='popular'?'The community’s favorites.':'Better prompts. More power.'}</h1><p>${state.view==='saved'?'Your favorites, ready when you need them. Saved on this device.':state.view==='popular'?'Ranked by real likes. Find a favorite, or help the next one rise.':'Find the right prompt. Add your context. Put your AI to work.'}</p></div><span class="library-count">${icon('sparkle')}<strong>${prompts.length}</strong> prompts loaded</span></div>
            ${state.view==='library'&&featuredPrompt?`<section class="featured-strip" aria-label="Featured workflow"><div class="featured-strip-icon">${icon('bolt')}</div><div class="featured-strip-copy"><span>FEATURED WORKFLOW / ${cat(featuredPrompt.category).name.toUpperCase()}</span><h2>${escape(featuredPrompt.title)}</h2><p>${escape(featuredPrompt.description)}</p></div><button class="featured-open" data-open="${featuredPrompt.id}">Open prompt ${icon('chevron')}</button></section>`:''}
            <div class="search-row"><label class="search-box">${icon('search')}<input id="search" type="search" value="${escape(state.query)}" placeholder="What do you want to do? Try ‘launch a product’" aria-label="Search prompts" autocomplete="off"><kbd>/</kbd></label><label class="difficulty-select">${icon('settings')}<select id="difficulty" aria-label="Filter by experience"><option value="all">Any experience</option>${['Starter','Intermediate','Advanced'].map(d=>`<option ${state.difficulty===d?'selected':''}>${d}</option>`).join('')}</select>${icon('chevrondown')}</label></div>
            <div class="category-pills" aria-label="Filter by category"><button class="pill ${state.category==='all'?'active':''}" data-category="all">${icon('grid')}All categories</button>${categories.map(c=>`<button class="pill ${state.category===c.id?'active':''}" data-category="${c.id}">${icon(c.id)}${c.name}</button>`).join('')}</div>
            <section class="library-section" aria-labelledby="library-heading"><div class="section-header"><div><h2 id="library-heading">${state.category==='all'?(state.view==='saved'?'Your collection':state.view==='popular'?'Community ranking':'Explore the arsenal'):cat(state.category).name+' prompts'}</h2><span id="result-count" class="result-count"></span><span id="likes-status" class="likes-status"></span></div><div class="browse-controls">${state.view==='library'?`<div class="view-tabs" aria-label="Library selection"><button class="${state.mode==='all'?'active':''}" data-mode="all">All prompts</button><button class="${state.mode==='foryou'?'active':''}" data-mode="foryou">For you ${icon('sparkle')}</button></div>`:''}<label class="sort-label">Sort:<select id="sort" aria-label="Sort prompts"><option value="featured" ${state.sort==='featured'?'selected':''}>Featured first</option><option value="az" ${state.sort==='az'?'selected':''}>A–Z</option><option value="popular" ${state.sort==='popular'?'selected':''}>Most liked</option></select>${icon('chevrondown')}</label></div></div><div id="cards" class="prompt-grid"></div><div id="load-more" class="load-more"></div></section>
            <footer class="page-footer"><span>Built for curious minds. Made for everyday use.</span><span>Promptverse <span class="footer-star">✳</span> ${prompts.length} prompts · ${categories.length} categories</span></footer>
          </main>
          <nav class="mobile-bottom-nav" aria-label="Library navigation">${[['grid','Explore','library'],['bolt','Popular','popular'],['bookmark','Saved','saved']].map(([i,label,view])=>`<button class="${state.view===view?'active':''}" data-view="${view}" ${state.view===view?'aria-current="page"':''}>${icon(i)}<span>${label}</span></button>`).join('')}</nav>
        </div>
      </div>`;
    renderCards();
    if(state.view==='popular')$('.sort-label').hidden=true;
    if(state.menu)$('[data-close-menu]').focus();
  }
  function renderCards(){
    const list=filtered();
    $('#likes-status').textContent=state.view==='popular'?(likesStatus==='loading'?'Loading community votes…':likesStatus==='unavailable'?'Community likes are temporarily unavailable.':Object.values(likeCounts).some(n=>n>0)?'Equal scores are ordered alphabetically.':'The ranking starts with you. Be the first to like a prompt.'):'';
    $('#result-count').textContent=`${list.length} ${list.length===1?'prompt':'prompts'}${state.query?' found':' to make your own'}`;
    $('#cards').innerHTML=list.length?list.slice(0,state.visible).map((p,index)=>{
      const c=cat(p.category);
      return `<article class="prompt-card"><div class="card-top"><span class="category-icon ${c.color}">${icon(c.id)}</span><button class="icon-button bookmark-button ${saved.has(p.id)?'is-saved':''}" data-save="${p.id}" aria-label="${saved.has(p.id)?'Remove saved':'Save'} ${escape(p.title)}" aria-pressed="${saved.has(p.id)}">${icon('bookmark')}</button></div><div class="card-category">${state.view==='popular'?`<span class="rank-badge">#${index+1}</span>`:''}${c.name}${p.featured?`<span class="featured-label">${icon('sparkle')}Featured</span>`:''}</div><h3><button data-open="${p.id}">${escape(p.title)}</button></h3><p class="card-description">${escape(p.description)}</p><div class="card-tags">${p.tags.slice(0,2).map(t=>`<button data-tag="${escape(t)}">${escape(t)}</button>`).join('')}<span class="difficulty-tag">${p.difficulty}</span></div><div class="card-social"><button class="like-button ${liked.has(p.id)?'liked':''}" data-like="${p.id}" aria-pressed="${liked.has(p.id)}" aria-label="${liked.has(p.id)?'Unlike':'Like'} ${escape(p.title)}" ${pendingLikes.size||likesStatus!=='ready'?'disabled':''}>${icon('heart')}<span>${likeCounts[p.id]||0}</span><span class="like-label">likes</span></button><button class="share-button" data-share="${p.id}" aria-label="Share ${escape(p.title)}">${icon('share')}Share</button></div><div class="card-footer"><button class="customize-button" data-open="${p.id}">Make it yours</button><button class="copy-button" data-copy="${p.id}" aria-label="Copy ${escape(p.title)}">${icon('copy')}<span>Copy prompt</span></button></div></article>`;
    }).join(''):`<div class="empty-state">${icon(state.view==='saved'?'bookmark':'search')}<h3>${state.view==='saved'&&!saved.size?'Keep a good idea for later.':'No prompts found. Yet.'}</h3><p>${state.view==='saved'&&!saved.size?'Tap the bookmark on any prompt to add it here.':'Try a shorter search or clear your filters.'}</p><button class="primary-button" data-clear>${state.view==='saved'&&!saved.size?'Explore library':'Clear filters'}</button></div>`;
    $('#load-more').innerHTML=list.length>state.visible?`<button class="load-button" data-more>Explore ${Math.min(12,list.length-state.visible)} more prompts ${icon('chevrondown')}</button><p>Showing ${Math.min(state.visible,list.length)} of ${list.length}</p>`:list.length?`<p>You've explored all ${list.length} ${list.length===1?'prompt':'prompts'}${state.category!=='all'?' in this category':''}.</p>`:'';
  }
  function toggleSaved(id){
    if(!prompts.some(p=>p.id===id))return;
    if(saved.has(id))saved.delete(id);else saved.add(id);
    persist('promptverse.saved',[...saved]);
    const counter=$('#saved-count');if(counter)counter.textContent=saved.size;
    renderCards();
    if(activePrompt){const btn=$('[data-dialog-save]',promptDialog);if(btn){btn.innerHTML=icon('bookmark')+(saved.has(activePrompt.id)?'Saved':'Save prompt');btn.classList.toggle('is-saved',saved.has(activePrompt.id));btn.setAttribute('aria-pressed',String(saved.has(activePrompt.id)));}}
    toast(saved.has(id)?'Saved to your collection.':'Removed from your collection.');
  }
  let likesRequest = 0;
  function applyLikes(data){
    if(!data||typeof data.counts!=='object'||!Array.isArray(data.liked))throw Error('Invalid likes response');
    likeCounts=Object.fromEntries(prompts.map(p=>[p.id,Number.isSafeInteger(data.counts[p.id])&&data.counts[p.id]>=0?data.counts[p.id]:0]));
    liked=new Set(data.liked.filter(id=>prompts.some(p=>p.id===id)));likesStatus='ready';
  }
  function updateModalLike(){
    if(!activePrompt)return;
    const button=$('[data-dialog-like]',promptDialog);if(!button)return;
    button.innerHTML=icon('heart')+`<span>${likeCounts[activePrompt.id]||0}</span>`;
    button.classList.toggle('liked',liked.has(activePrompt.id));button.setAttribute('aria-pressed',String(liked.has(activePrompt.id)));
    button.setAttribute('aria-label',liked.has(activePrompt.id)?'Unlike prompt':'Like prompt');
    button.disabled=likesStatus!=='ready'||pendingLikes.size>0;
  }
  async function loadLikes(){
    if(pendingLikes.size)return;
    const version=++likesRequest;
    try{const response=await fetch('/api/likes',{credentials:'same-origin',headers:{Accept:'application/json'}});if(!response.ok)throw Error('Unavailable');const data=await response.json();if(version!==likesRequest)return;applyLikes(data);}catch{if(version===likesRequest)likesStatus='unavailable';}
    renderCards();updateModalLike();
  }
  async function toggleLike(id){
    if(likesStatus!=='ready'){toast('Community likes are temporarily unavailable.');return;}
    if(!prompts.some(p=>p.id===id)||pendingLikes.size)return;
    pendingLikes.add(id);renderCards();updateModalLike();
    const next=!liked.has(id),version=++likesRequest;
    try{const response=await fetch('/api/likes',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({id,liked:next})});if(!response.ok)throw Error('Unavailable');const data=await response.json();if(version===likesRequest)applyLikes(data);toast(next?'Liked. Your vote counts in the community ranking.':'Like removed.');}catch{toast('Your like could not be saved. Please try again.');}
    finally{pendingLikes.delete(id);renderCards();updateModalLike();}
  }
  async function sharePrompt(id){
    const p=prompts.find(p=>p.id===id);if(!p)return;
    const url=new URL(location.href);url.search='';url.searchParams.set('prompt',id);
    const live=/^https?:$/.test(location.protocol);
    const payload={title:`${p.title} · Promptverse`,text:p.description,...(live?{url:url.href}:{text:`${p.title}\n\n${p.prompt}`})};
    if(navigator.share){try{await navigator.share(payload);return;}catch(error){if(error.name==='AbortError')return;}}
    const copied=await copyText(live?url.href:`${p.title}\n\n${p.prompt}`);
    if(copied)toast(live?'Prompt link copied. Share it anywhere.':'Prompt copied, ready to share.');
  }
  async function copyText(text, button){
    let copied=false;
    try{await navigator.clipboard.writeText(text);copied=true;}catch{
      const field=document.createElement('textarea');field.value=text;field.setAttribute('aria-label','Prompt to copy');field.style.cssText='position:fixed;left:-9999px;top:0';(promptDialog.open?promptDialog:document.body).append(field);field.select();try{copied=document.execCommand('copy');}catch{}field.remove();
    }
    if(copied){toast('Prompt copied. Your next idea starts here.');if(button){const previous=button.innerHTML;button.innerHTML=icon('check')+'<span>Copied!</span>';setTimeout(()=>{if(button.isConnected)button.innerHTML=previous;},1800);}}else toast('Copy unavailable. Select the prompt text and copy it manually.');
    return copied;
  }
  function fieldsFor(prompt){return [...new Set(prompt.prompt.match(/\[([^\]]+)\]/g)||[])];}
  function fillTemplate(){if(manualEditing)return;customText=activePrompt.prompt.replace(/\[[^\]]+\]/g,key=>customValues[key]?.trim()||key);$('#prompt-text').value=customText;updateVariableCount();}
  function updateVariableCount(){const remaining=(customText.match(/\[[^\]]+\]/g)||[]).length;$('#variable-count').textContent=remaining?`${remaining} ${remaining===1?'placeholder':'placeholders'} to personalize`:'Ready to copy';}
  function openPrompt(id){
    activePrompt=prompts.find(p=>p.id===id);if(!activePrompt)return false;
    customValues={};customText=activePrompt.prompt;manualEditing=false;const p=activePrompt,c=cat(p.category),fields=fieldsFor(p);
    promptDialog.innerHTML=`<div class="prompt-modal"><div class="modal-header"><span class="modal-eyebrow">${icon(c.id)}${c.name} <span>/${p.difficulty}</span></span><div class="modal-header-actions"><button class="icon-button" aria-label="Share prompt" data-share-prompt>${icon('share')}</button><button class="icon-button" aria-label="Close prompt" data-close-prompt>${icon('close')}</button></div></div><h2 id="prompt-title">${escape(p.title)}</h2><p class="modal-description">${escape(p.description)}</p><div class="modal-columns"><section class="personalize-panel"><span class="step-number">01</span><h3>Add your context</h3><p>Small details make a better brief. Leave a field blank to keep its placeholder.</p><div class="variable-fields">${fields.map((f,i)=>`<label for="variable-${i}">${escape(f.slice(1,-1))}<input id="variable-${i}" data-variable="${escape(f)}" placeholder="Enter ${escape(f.slice(1,-1).toLowerCase())}" maxlength="2000"></label>`).join('')}</div><div class="context-tip">${icon('sparkle')}<p>Paste the finished prompt into your preferred AI assistant. Check its output before using it.</p></div></section><section class="prompt-text-panel"><div class="prompt-text-heading"><div><span class="step-number">02</span><h3>Your prompt</h3></div><button class="text-button" data-reset-prompt>${icon('reset')}Reset</button></div><label class="sr-only" for="prompt-text">Editable prompt</label><textarea id="prompt-text" spellcheck="false">${escape(p.prompt)}</textarea><p id="manual-edit-note" class="manual-edit-note" hidden>Direct editing is active. Reset to use the context fields again.</p><span id="variable-count" class="variable-count"></span></section></div><div class="modal-footer"><div class="modal-footer-left"><button class="like-button ${liked.has(p.id)?'liked':''}" data-dialog-like aria-label="Like prompt" aria-pressed="${liked.has(p.id)}" ${likesStatus!=='ready'||pendingLikes.size>0?'disabled':''}>${icon('heart')}<span>${likeCounts[p.id]||0}</span></button><button class="secondary-button ${saved.has(p.id)?'is-saved':''}" data-dialog-save aria-pressed="${saved.has(p.id)}">${icon('bookmark')}${saved.has(p.id)?'Saved':'Save prompt'}</button></div><button class="primary-button" data-copy-custom>${icon('copy')}Copy your prompt</button></div></div>`;
    updateVariableCount();promptDialog.showModal();try{const url=new URL(location.href);url.searchParams.set('prompt',id);history.replaceState(null,'',url);}catch{}return true;
  }
  function renderOnboarding(){
    const focused=document.activeElement;
    const focusKey=['role','goal','tool'].find(key=>focused?.dataset?.[key]);
    const focusValue=focusKey?focused.dataset[focusKey]:null;
    const roleOptions=[['Everyone','globe','A little of everything'],['Creator','writing','Content, words & ideas'],['Builder','coding','Products, design & code'],['Business owner','business','Strategy, sales & growth'],['Student','learning','Learn, research & explore'],['Professional','career','Work smarter every day']];
    const titles=['Make the arsenal yours.','What’s your next mission?','Your AI. Better equipped.'];
    const descriptions=['A few quick choices. A library that feels a little more like you.','Pick the things you want a head start on. You can explore every category anytime.','Your prompts are ready. Choose where you’ll use them.'];
    onboardingDialog.innerHTML=`<div class="onboarding"><div class="onboarding-brand-panel"><div class="brand"><span class="brand-mark">&gt;_</span><span>promptverse<span class="brand-dot">.</span></span></div><div class="onboarding-message"><span class="onboarding-eyebrow">INITIALIZE / YOUR ADVANTAGE</span><h2>Your AI.<br>Your edge.<br><span>Unlocked.</span></h2><p>A focused arsenal for ambitious ideas.<br>Ready when you are.</p><div class="onboarding-stats"><span><strong>${prompts.length}</strong>practical prompts</span><span><strong>${categories.length}</strong>ways to explore</span></div></div><span class="onboarding-asterisk" aria-hidden="true">✳</span><div class="onboarding-brand-footer">No account. No subscription. Just possibilities.</div></div><div class="onboarding-form-panel"><div class="onboarding-top"><span>STEP ${onboarding.step+1} OF 3</span><button class="text-button" data-skip>Skip for now</button></div><div class="onboarding-body"><div class="progress-dots">${[0,1,2].map(i=>`<span class="${i<=onboarding.step?'active':''}"></span>`).join('')}</div><h1 id="onboarding-title" tabindex="-1">${titles[onboarding.step]}</h1><p class="onboarding-description">${descriptions[onboarding.step]}</p>${onboarding.step===0?`<div class="role-options">${roleOptions.map(([r,i,d])=>`<button class="role-option ${onboarding.role===r?'selected':''}" data-role="${r}" aria-pressed="${onboarding.role===r}"><span class="role-icon">${icon(i)}</span><strong>${r}</strong><span>${d}</span>${onboarding.role===r?`<span class="selection-check">${icon('check')}</span>`:''}</button>`).join('')}</div>`:onboarding.step===1?`<div class="goal-options">${categories.map(c=>`<button class="goal-option ${onboarding.goals.includes(c.id)?'selected':''}" data-goal="${c.id}" aria-pressed="${onboarding.goals.includes(c.id)}">${icon(c.id)}${c.name}${onboarding.goals.includes(c.id)?icon('check'):''}</button>`).join('')}</div><p class="onboarding-note">Choose as many as you like. Or leave it open.</p>`:`<div class="tool-options">${['ChatGPT','Claude','Gemini','Any AI assistant'].map(t=>`<button class="tool-option ${onboarding.tool===t?'selected':''}" data-tool="${t}" aria-pressed="${onboarding.tool===t}"><span>${t}</span>${onboarding.tool===t?icon('check'):''}</button>`).join('')}</div><div class="ready-note">${icon('sparkle')}<p>Find a prompt. Add your details. Copy it.<br>That’s all you need to get started.</p></div>`}</div><div class="onboarding-bottom">${onboarding.step?'<button class="secondary-button" data-back>Back</button>':'<span class="onboarding-note">Your choices stay on this device.</span>'}<button class="primary-button" data-next>${onboarding.step===2?'Explore my library':'Continue'}</button></div></div></div>`;
    if(focusKey){[...onboardingDialog.querySelectorAll('button')].find(b=>b.dataset[focusKey]===focusValue)?.focus();}
  }
  function showOnboarding(){onboarding={step:0,role:profile?.role||'Everyone',goals:[...(profile?.goals||[])],tool:profile?.tool||'Any AI assistant'};renderOnboarding();onboardingDialog.showModal();$('#onboarding-title').focus();}
  function finishOnboarding(skip=false){profile=skip?{role:'Everyone',goals:[],tool:'Any AI assistant'}:{role:onboarding.role,goals:[...onboarding.goals],tool:onboarding.tool};persist('promptverse.profile',profile);onboardingDialog.close();state.mode=profile.goals.length?'foryou':'all';state.category='all';state.query='';state.visible=12;render();toast(skip?'Your library is ready. Explore freely.':'Your library is ready. Make something good.');}
  app.addEventListener('click',event=>{
    const b=event.target.closest('button,a');if(!b)return;
    if(b.hasAttribute('data-home')){event.preventDefault();state.view='library';state.category='all';state.mode='all';state.query='';state.visible=12;state.menu=false;render();}
    else if(b.dataset.view){state.view=b.dataset.view;state.category='all';state.mode='all';state.query='';state.visible=12;state.menu=false;render();}
    else if(b.dataset.category){state.category=b.dataset.category;state.visible=12;state.mode='all';state.menu=false;render();}
    else if(b.dataset.mode){if(b.dataset.mode==='foryou'&&!profile?.goals.length){showOnboarding();return;}state.mode=b.dataset.mode;state.visible=12;render();}
    else if(b.dataset.like)toggleLike(b.dataset.like);
    else if(b.dataset.share)sharePrompt(b.dataset.share);
    else if(b.dataset.save)toggleSaved(b.dataset.save);
    else if(b.dataset.copy){const p=prompts.find(p=>p.id===b.dataset.copy);if(p)copyText(p.prompt,b);}
    else if(b.dataset.open)openPrompt(b.dataset.open);
    else if(b.dataset.tag){state.query=b.dataset.tag;state.visible=12;$('#search').value=state.query;renderCards();}
    else if(b.hasAttribute('data-more')){state.visible+=12;renderCards();}
    else if(b.hasAttribute('data-clear')){state.category='all';state.query='';state.difficulty='all';state.mode='all';state.visible=12;if(!saved.size)state.view='library';render();}
    else if(b.hasAttribute('data-onboard'))showOnboarding();
    else if(b.hasAttribute('data-surprise')){const candidates=profile?.goals.length?prompts.filter(p=>profile.goals.includes(p.category)):prompts;openPrompt(candidates[Math.floor(Math.random()*candidates.length)]?.id);}
    else if(b.hasAttribute('data-menu')){state.menu=true;render();}
    else if(b.hasAttribute('data-close-menu')){state.menu=false;render();}
  });
  app.addEventListener('input',event=>{if(event.target.id==='search'){state.query=event.target.value;state.visible=12;renderCards();}});
  app.addEventListener('change',event=>{if(event.target.id==='difficulty'){state.difficulty=event.target.value;state.visible=12;renderCards();}if(event.target.id==='sort'){state.sort=event.target.value;renderCards();}});
  promptDialog.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.hasAttribute('data-close-prompt'))promptDialog.close();else if(b.hasAttribute('data-share-prompt'))sharePrompt(activePrompt.id);else if(b.hasAttribute('data-dialog-like'))toggleLike(activePrompt.id);else if(b.hasAttribute('data-dialog-save'))toggleSaved(activePrompt.id);else if(b.hasAttribute('data-copy-custom'))copyText($('#prompt-text').value,b);else if(b.hasAttribute('data-reset-prompt')){customValues={};customText=activePrompt.prompt;manualEditing=false;$('#manual-edit-note').hidden=true;promptDialog.querySelectorAll('[data-variable]').forEach(i=>{i.value='';i.disabled=false;});fillTemplate();}});
  promptDialog.addEventListener('input',event=>{if(event.target.dataset.variable){customValues[event.target.dataset.variable]=event.target.value;fillTemplate();}else if(event.target.id==='prompt-text'){customText=event.target.value;manualEditing=true;$('#manual-edit-note').hidden=false;promptDialog.querySelectorAll('[data-variable]').forEach(i=>i.disabled=true);updateVariableCount();}});
  promptDialog.addEventListener('close',()=>{activePrompt=null;try{const url=new URL(location.href);url.searchParams.delete('prompt');history.replaceState(null,'',url);}catch{}});
  for(const dialog of [promptDialog,onboardingDialog])dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom){if(dialog===onboardingDialog)finishOnboarding(true);else dialog.close();}}});
  onboardingDialog.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.role){onboarding.role=b.dataset.role;renderOnboarding();}else if(b.dataset.goal){onboarding.goals=onboarding.goals.includes(b.dataset.goal)?onboarding.goals.filter(g=>g!==b.dataset.goal):[...onboarding.goals,b.dataset.goal];renderOnboarding();}else if(b.dataset.tool){onboarding.tool=b.dataset.tool;renderOnboarding();}else if(b.hasAttribute('data-skip'))finishOnboarding(true);else if(b.hasAttribute('data-back')){onboarding.step--;renderOnboarding();$('#onboarding-title').focus();}else if(b.hasAttribute('data-next')){if(onboarding.step<2){onboarding.step++;renderOnboarding();$('#onboarding-title').focus();}else finishOnboarding();}});
  onboardingDialog.addEventListener('cancel',event=>{event.preventDefault();finishOnboarding(true);});
  document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)&&!onboardingDialog.open&&!promptDialog.open){event.preventDefault();$('#search')?.focus();}if(event.key==='Escape'&&state.menu){state.menu=false;render();}});
  render();
  const sharedId=new URLSearchParams(location.search).get('prompt');
  if(sharedId&&prompts.some(p=>p.id===sharedId))openPrompt(sharedId);else if(!profile)showOnboarding();
  loadLikes();
  const refreshLikes=setInterval(()=>{if(document.visibilityState==='visible'&&location.protocol!=='file:')loadLikes();},45000);
  addEventListener('pagehide',()=>clearInterval(refreshLikes),{once:true});
  if(document.modelContext?.registerTool){
    const lifecycle=new AbortController();
    const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
    register({name:'search_prompt_library',description:'Search the Promptverse library and update the visible search results.',inputSchema:{type:'object',properties:{query:{type:'string'},category:{type:'string',enum:['all',...categories.map(c=>c.id)]}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input.query!=='string'||(input.category&&!['all',...categories.map(c=>c.id)].includes(input.category)))throw Error('Provide a valid query and category.');state.query=input.query;state.category=input.category||'all';state.view='library';state.mode='all';state.visible=12;render();return filtered().map(p=>({id:p.id,title:p.title,category:p.category}));}});
    register({name:'open_prompt',description:'Open a library prompt so its template and context fields can be edited.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},execute(input){if(!input||typeof input.id!=='string'||!prompts.some(p=>p.id===input.id))throw Error('Unknown prompt.');if(onboardingDialog.open)onboardingDialog.close();if(promptDialog.open)promptDialog.close();openPrompt(input.id);return {id:activePrompt.id,title:activePrompt.title,prompt:activePrompt.prompt};}});
    addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();

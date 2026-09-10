
(function(){
'use strict';
/* ====== CONFIG — Score Keeper edits the sheets, never this ====== */
var SHEETS={
  snapshot:'1p9LIQmtu9RJLy8Q1ib42a8mw7pjMH5QjkDj8hKuxDjc',
  bots:'1cKFo8P22cIhGN5zTm42RLKExD5jR_c6IMbAlr3PMb7Y',
  fills:'1bhZz8eR8gEAf_dQqBP0lytyXDx0xq6D92TNZx8bavsA'
};
var POLL_MS=20000, OPEN_STAKE=1000, TAPE_N=20, TICKER_N=8, MOVES_N=5;
var SEED={
  snapshot:{slug:'today',updated_et:'2026-09-02 9:58 AM ET',combined_sleeve:2704.80,shared_rh_cash:1270.76,realized_pnl_all:1.37,realized_pnl_today:1.53,revenue_receipt:0,rent_deducted:108,net_vs_open:-295.20,headline:'Day 1. Three bots, one $1,000 sleeve. Rent is due every morning.'},
  bots:[
    {slug:'hustle',display_name:'Hustle Bot',sleeve_cash:901.60,rh_cash:472.43,positions:'flat',last_fill:'SELL NVDA +1.18',pnl_today:1.18,pnl_all:1.18,net_vs_open:null,status:'active',color:'#39FF14'},
    {slug:'lord',display_name:'Money Lord',sleeve_cash:901.60,rh_cash:553.50,positions:'1 SPYM',last_fill:'SELL SMCI -0.72',pnl_today:-0.72,pnl_all:-0.72,net_vs_open:null,status:'active',color:'#FFD400'},
    {slug:'finder',display_name:'Money Finder',sleeve_cash:901.60,rh_cash:244.83,positions:'flat',last_fill:'SELL MU +1.07',pnl_today:1.07,pnl_all:1.02,net_vs_open:null,status:'active',color:'#3FA9F5'}
  ],
  fills:[
    {when_et:'2026-09-02',bot:'finder',side:'buy',ticker:'SPYM',pnl:0},
    {when_et:'2026-09-02',bot:'finder',side:'sell',ticker:'SPYM',pnl:-0.05},
    {when_et:'2026-09-02',bot:'finder',side:'buy',ticker:'MU',pnl:0},
    {when_et:'2026-09-02',bot:'hustle',side:'buy',ticker:'NVDA',pnl:0},
    {when_et:'2026-09-02',bot:'lord',side:'buy',ticker:'SMCI',pnl:0},
    {when_et:'2026-09-02',bot:'hustle',side:'sell',ticker:'NVDA',pnl:1.18},
    {when_et:'2026-09-02',bot:'finder',side:'sell',ticker:'MU',pnl:1.07},
    {when_et:'2026-09-02',bot:'lord',side:'sell',ticker:'SMCI',pnl:-0.72}
  ]
};
/* ====== characters ====== */
var CHARS={
  hustle:{color:'#39FF14',tagline:'Scalps fast. Brags faster.',svg:'<svg viewBox="0 0 64 64"><g class="bolt"><path d="M34 1 L27 16 L34 15 L28 29" fill="none" style="stroke:var(--c)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></g><g style="stroke:var(--c)" stroke-width="2.5" stroke-linecap="round" opacity=".55"><line x1="2" y1="31" x2="11" y2="31"/><line x1="0" y1="39" x2="9" y2="39"/><line x1="3" y1="47" x2="11" y2="47"/></g><path d="M16 22 L45 17 L56 30 L51 53 L20 56 L14 41 Z" fill="#1b2129" style="stroke:var(--c)" stroke-width="3" stroke-linejoin="round"/><path d="M15 29 L53 24" style="stroke:var(--c)" stroke-width="4" stroke-linecap="round"/><rect class="eye" x="22" y="33" width="27" height="8" rx="4" style="fill:var(--c)"/><path d="M26 47 Q34 51 43 45" style="stroke:var(--c)" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'},
  lord:{color:'#FFD400',tagline:'Buys the dip. Wears the crown.',svg:'<svg viewBox="0 0 64 64"><g class="cape"><path d="M13 44 L9 63 L55 63 L51 44 Z" fill="#8b1a2b" stroke="#c0273e" stroke-width="2"/></g><circle cx="32" cy="37" r="20" fill="#1b2129" style="stroke:var(--c)" stroke-width="3"/><path d="M16 21 L20 6 L28 16 L32 3 L36 16 L44 6 L48 21 Z" style="fill:var(--c)" stroke="#a88600" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="9" r="2" fill="#ff3b4a"/><circle cx="32" cy="6" r="2.2" fill="#3fa9f5"/><circle cx="44" cy="9" r="2" fill="#ff3b4a"/><ellipse class="eye" cx="25" cy="35" rx="3.2" ry="3.6" style="fill:var(--c)"/><ellipse class="eye" cx="39" cy="35" rx="3.2" ry="3.6" style="fill:var(--c)"/><circle cx="39" cy="35" r="7" fill="none" stroke="#fff" stroke-width="2"/><line x1="45" y1="40" x2="49" y2="49" stroke="#fff" stroke-width="2"/><path d="M21 45 Q27 40 32 45 Q37 40 43 45 Q38 50 32 46 Q26 50 21 45 Z" style="fill:var(--c)"/></svg>'},
  finder:{color:'#3FA9F5',tagline:'Sniffs out the cheap ones.',svg:'<svg viewBox="0 0 64 64"><g class="dish"><path d="M22 9 A10 5 0 0 1 42 9 Z" style="fill:var(--c)"/><circle cx="32" cy="10" r="2" fill="#fff"/></g><line x1="32" y1="10" x2="32" y2="18" style="stroke:var(--c)" stroke-width="2.5"/><rect x="17" y="13" width="30" height="11" rx="3" style="fill:var(--c)" opacity=".85"/><path d="M9 23 L55 23 L59 27 L5 27 Z" style="fill:var(--c)"/><rect x="14" y="25" width="36" height="32" rx="10" fill="#1b2129" style="stroke:var(--c)" stroke-width="3"/><circle class="eye" cx="25" cy="39" r="3.2" style="fill:var(--c)"/><g class="lens"><circle cx="40" cy="39" r="8" fill="rgba(63,169,245,.18)" stroke="#fff" stroke-width="2.5"/><circle class="eye" cx="40" cy="39" r="4" style="fill:var(--c)"/><line x1="46" y1="45" x2="55" y2="54" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g><path d="M24 50 L35 50" style="stroke:var(--c)" stroke-width="2.5" stroke-linecap="round"/></svg>'},
  _default:{tagline:'New challenger.',svg:'<svg viewBox="0 0 64 64"><line x1="32" y1="6" x2="32" y2="16" style="stroke:var(--c)" stroke-width="2.5"/><circle class="spark" cx="32" cy="5" r="3.5" style="fill:var(--c)"/><rect x="12" y="16" width="40" height="40" rx="10" fill="#1b2129" style="stroke:var(--c)" stroke-width="3"/><circle class="eye" cx="24" cy="34" r="3.5" style="fill:var(--c)"/><circle class="eye" cx="40" cy="34" r="3.5" style="fill:var(--c)"/><rect x="24" y="44" width="16" height="4" rx="2" style="fill:var(--c)"/></svg>'}
};
var PALETTE=['#FF7AE6','#FF8C42','#B4FF00','#7C6CFF','#00E5FF'];
var EMOTES={buy:['🛒','📈','👀','💪','🎯'],win:['💸','🤑','💰','🎉','✨'],loss:['😵','💀','📉','🫠','😬']};
var $=function(id){return document.getElementById(id)};
var state=null, prevSig={}, seenFills=null, first=true, timer=null, tapeFilter='all', prevVals={}, evQueue=[], evBusy=false, liveOnce=false;

/* ====== helpers ====== */
function num(v){if(v===null||v===undefined||v==='')return null;if(typeof v==='number')return v;var s=String(v).replace(/[$,\s]/g,'').replace('−','-').replace('+','');var n=parseFloat(s);return isNaN(n)?null:n}
function str(v){if(v===null||v===undefined)return '';if(v instanceof Date)return fmtDate(v);v=String(v).trim();var m=v.match(/^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+))?/);if(m)return fmtDate(new Date(+m[1],+m[2],+m[3],+(m[4]||0),+(m[5]||0)));if(/^\d{4}-\d{2}-\d{2}T\d/.test(v)){var d=new Date(v);if(!isNaN(d))return fmtDate(d)}return v}
function fmtDate(d){var mo=d.getMonth()+1,da=d.getDate(),h=d.getHours(),m=d.getMinutes();if(h===0&&m===0)return d.getFullYear()+'-'+p2(mo)+'-'+p2(da);var ap=h>=12?'PM':'AM';h=h%12||12;return p2(mo)+'/'+p2(da)+' '+h+':'+p2(m)+' '+ap+' ET'}
function p2(n){return (n<10?'0':'')+n}
function money(v,sign){if(v===null||v===undefined)return '—';var a=Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});var s=v<0?'−':(sign&&v>0?'+':'');return s+'$'+a}
function cls(v){if(v===null||v===undefined)return 'flat';return v>0?'up':v<0?'dn':'flat'}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fillSign(f){if(!f)return 0;var m=String(f).match(/([+−-])\s*\$?\s*([\d.]+)/);if(!m)return 0;var n=parseFloat(m[2]);if(!n)return 0;return m[1]==='+'?1:-1}
function isFlat(p){p=str(p).toLowerCase();return !p||p==='flat'||p==='0'||p==='none'||p==='—'}
function shortWhen(w){w=str(w);var m=w.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);return m?m[1].toUpperCase().replace(/\s+/,''):(w.length>10?w.slice(5,10):w)}
function etParts(){var p={};try{new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value})}catch(e){var d=new Date();p.hour=d.getHours();p.minute=d.getMinutes()}return {h:(+p.hour)%24,m:+p.minute}}
function nowET(){try{return new Date().toLocaleTimeString('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'})+' ET'}catch(e){return new Date().toLocaleTimeString()}}
function toast(m){var t=$('sb-toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},2600)}
function reduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
function confetti(color){if(reduced())return;for(var i=0;i<28;i++){var d=document.createElement('i');d.className='confetti';d.style.left=Math.random()*100+'vw';d.style.background=i%3?color:'#fff';d.style.animationDelay=(Math.random()*.6)+'s';d.style.transform='rotate('+Math.random()*360+'deg)';$('sb').appendChild(d);setTimeout(function(x){x.remove()}.bind(null,d),3000)}}
function emotes(host,kind){if(reduced()||!host)return;var set=EMOTES[kind]||EMOTES.buy;for(var i=0;i<7;i++){var e=document.createElement('span');e.className='emote';e.textContent=set[i%set.length];e.style.setProperty('--dx',(Math.random()*90-45)+'px';e.style.setProperty('--dy',(-40-Math.random()*50)+'px';e.style.setProperty('--rot',(Math.random()*60-30)+'deg');e.style.animationDelay=(i*.08)+'s';host.appendChild(e);setTimeout(function(x){x.remove()}.bind(null,e),2000)}}

/* ====== gviz loader ====== */
var cbN=0;
function gvizUrl(id,cb){return 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json;responseHandler:'+cb+'&headers=1&_='+Date.now()}
function loadSheet(id){
  /* fetch with an 8s abort (gviz sends CORS headers); JSONP script tag as fallback */
  var ctl=(typeof AbortController!=='undefined')?new AbortController():null;var to=setTimeout(function(){if(ctl)ctl.abort()},8000);
  return fetch(gvizUrl(id,'sbJson'),{cache:'no-store',signal:ctl?ctl.signal:undefined}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.text()}).then(function(t){
    clearTimeout(to);var a=t.indexOf('('),b=t.lastIndexOf(')');if(a<0||b<0)throw new Error('shape');
    return parseGviz(JSON.parse(t.slice(a+1,b)));
  }).catch(function(){clearTimeout(to);return loadSheetJsonp(id)});
}
function loadSheetJsonp(id){
  return new Promise(function(res,rej){
    var cb='sbCb'+(++cbN)+'_'+Date.now();var s=document.createElement('script');var done=false;
    window[cb]=function(json){done=true;cleanup();try{res(parseGviz(json))}catch(e){rej(e)}};
    function cleanup(){delete window[cb];s.remove();clearTimeout(t)}
    var t=setTimeout(function(){if(!done){cleanup();rej(new Error('timeout'))}},9000);
    s.onerror=function(){if(!done){cleanup();rej(new Error('load'))}};
    s.src=gvizUrl(id,cb);document.head.appendChild(s);
  });
}
function parseGviz(j){
  if(!j||!j.table)throw new Error('bad');
  var cols=j.table.cols.map(function(c){return str(c.label||c.id).toLowerCase().replace(/\s+/g,'_')});
  return j.table.rows.map(function(r){var o={};r.c.forEach(function(c,i){if(!cols[i])return;if(!c){o[cols[i]]=null;return}var v=c.v;if(v instanceof Date)v=c.f||fmtDate(v);o[cols[i]]=v});return o})
    .filter(function(o){return Object.keys(o).some(function(k){return o[k]!==null&&o[k]!==''})});
}

/* ====== normalize ====== */
function normalize(raw){
  var snapRows=raw.snapshot||[];if(!Array.isArray(snapRows))snapRows=[snapRows];var s=snapRows.filter(function(r){return str(r.slug)==='today'})[0]||snapRows[0]||{};
  var snap={updated_et:str(s.updated_et),combined_sleeve:num(s.combined_sleeve),shared_rh_cash:num(s.shared_rh_cash),realized_pnl_all:num(s.realized_pnl_all),realized_pnl_today:num(s.realized_pnl_today),revenue_receipt:num(s.revenue_receipt),rent_deducted:num(s.rent_deducted),net_vs_open:num(s.net_vs_open),headline:str(s.headline)};
  var bots=(raw.bots||[]).filter(function(b){return str(b.slug)}).map(function(b,i){var slug=str(b.slug).toLowerCase();var ch=CHARS[slug]||CHARS._default;return {slug:slug,display_name:str(b.display_name)||slug,sleeve_cash:num(b.sleeve_cash),rh_cash:num(b.rh_cash),positions:str(b.positions),last_fill:str(b.last_fill),pnl_today:num(b.pnl_today),pnl_all:num(b.pnl_all),net_vs_open:num(b.net_vs_open),status:(str(b.status)||'active').toLowerCase(),color:str(b.color)||ch.color||PALETTE[i%PALETTE.length],tagline:str(b.tagline)||ch.tagline,svg:ch.svg,tip_url:str(b.tip_url)}});
  var fills=(raw.fills||[]).filter(function(f){return str(f.ticker)||str(f.bot)}).map(function(f){return {when_et:str(f.when_et),bot:str(f.bot).toLowerCase(),side:str(f.side).toLowerCase(),ticker:str(f.ticker).toUpperCase(),qty:num(f.qty),price:num(f.price),fees:num(f.fees),pnl:num(f.pnl),cash_after:num(f.cash_after)}});
  return {snapshot:snap,bots:bots,fills:fills};
}
function botOf(slug){return (state.bots.filter(function(b){return b.slug===slug})[0])||{slug:slug,display_name:slug,color:'#8b96a3',svg:CHARS._default.svg,tagline:''}}
function fillKey(f,i){return [f.when_et,f.bot,f.side,f.ticker,f.qty,f.price,f.pnl,f.cash_after,i].join('|')}
function ranked(){return state.bots.slice().sort(function(a,b){return (b.pnl_all||0)-(a.pnl_all||0)})}
function fillKind(f){return f.side==='buy'?'buy':(f.pnl>0?'win':f.pnl<0?'loss':'buy')}

/* ====== render ====== */
function avatar(b,extra){return '<div class="av '+(extra||'')+'" style="--c:'+esc(b.color)+'">'+b.svg+'</div>'}
function moodClass(b){var s=fillSign(b.last_fill);if(s===0&&b.pnl_today)s=b.pnl_today>0?1:-1;return s>0?'win':s<0?'loss':''}
function tipsHtml(b){return '<div class="tips">'+[1,5,10].map(function(a){return '<a class="tip" href="'+esc(tipHref(b,a))+'" data-bot="'+esc(b.slug)+'" '+(b.tip_url?'target="_blank" rel="noopener"':'')+'>$'+a+'</a>'}).join('')+'</div>'}
function tipHref(b,a){if(!b.tip_url)return '#tip-'+b.slug;return b.tip_url+(b.tip_url.indexOf('?')>-1?'&':'?')+'amount='+a+'&bot='+encodeURIComponent(b.slug)}

function renderRace(){
  var bots=ranked();
  var vals=bots.map(function(b){return b.pnl_all||0});var mn=Math.min.apply(null,vals.concat([0])),mx=Math.max.apply(null,vals.concat([0]));var span=(mx-mn)||1;
  $('sb-lanes').innerHTML=bots.map(function(b,i){
    var pos=12+76*(((b.pnl_all||0)-mn)/span);var hold=!isFlat(b.positions);
    return '<div class="lane" data-bot="'+esc(b.slug)+'" style="--c:'+esc(b.color)+'"><div class="who"><span class="rank r'+(i+1)+'">'+(i+1)+(i===0?'st':i===1?'nd':i===2?'rd':'th')+'</span><b>'+esc(b.display_name)+'</b> <em>'+esc(b.tagline)+'</em>'+(hold?' · holding '+esc(b.positions):'')+'</div><div class="rail"></div><div class="flag">🏁</div>'+
    '<div class="runner" style="left:'+pos.toFixed(1)+'%">'+avatar(b,(hold?'hold ':'')+moodClass(b))+'<div class="tag '+cls(b.pnl_all)+'">'+money(b.pnl_all,true)+'</div><div class="bubble">'+esc(b.last_fill||'')+'</div></div></div>';
  }).join('');
  if(first){setTimeout(function(){document.querySelectorAll('#sb .bubble').forEach(function(x){if(x.textContent)x.classList.add('show')});setTimeout(function(){document.querySelectorAll('#sb .bubble').forEach(function(x){x.classList.remove('show')})},4000)},900)}
}
function renderTicker(){
  var last=state.fills.slice(-TICKER_N).reverse();
  var items=last.length?last.map(function(f){var b=botOf(f.bot);return '<span><b style="color:'+esc(b.color)+'">'+esc(b.display_name.toUpperCase())+'</b>'+esc(f.side.toUpperCase())+' '+esc(f.ticker)+' <em class="'+cls(f.pnl)+'" style="font-style:normal">'+(f.side==='buy'?'opened':money(f.pnl,true))+'</em></span>'}).join(''):'<span>No fills booked yet</span>';
  $('sb-ticker').innerHTML=items+items;
}
function renderBackers(){
  $('sb-backers').innerHTML=ranked().map(function(b){return '<div class="backer" style="--c:'+esc(b.color)+'">'+avatar(b,'sm')+'<div style="flex:1"><div class="bn">'+esc(b.display_name)+'</div><div class="bt">'+esc(b.tagline)+' · all-time <b class="'+cls(b.pnl_all)+'">'+money(b.pnl_all,true)+'</b></div>'+tipsHtml(b)+'</div></div>'}).join('');
}
function tile(k,v,c,n,big,key){return '<div class="tile'+(big?' big':'')+'"><div class="k">'+k+'</div><div class="v '+(c||'')+'" data-key="'+key+'" data-n="'+(v===null?'':v)+'">'+money(v,!!c)+'</div>'+(n?'<div class="n">'+n+'</div>':'')+'</div>'}
function renderHouse(){
  var s=state.snapshot;
  $('sb-house').innerHTML=
    tile('Realized P/L · all-time',s.realized_pnl_all,cls(s.realized_pnl_all),'Booked, closed trades only',true,'pa')+
    tile('Net vs $'+OPEN_STAKE+' open',s.net_vs_open,cls(s.net_vs_open),'After rent. This is the real score',true,'net')+
    tile('Realized P/L · today',s.realized_pnl_today,cls(s.realized_pnl_today),'','','pt')+
    tile('Combined sleeve',s.combined_sleeve,'','Book value of the house','','sl')+
    tile('Shared RH cash',s.shared_rh_cash,'','Cash sitting in Robinhood','','rh')+
    tile('Rent deducted',s.rent_deducted!==null?-Math.abs(s.rent_deducted):null,s.rent_deducted?'dn':'','Every morning after 8am','','rent')+
    tile('Revenue receipts',s.revenue_receipt,'','No receipt = $0','','rev')+
    tile('Opening stake',OPEN_STAKE,'','What the house started with','','open')+
    '<div class="rentbar"><div class="rk"><span>Landlord clock · <b>$'+(s.rent_deducted||108)+'</b> due at 8:00 AM ET</span><span id="sb-rent-t"></span></div><div class="rt"><i id="sb-rent-i"></i><em>🏠</em></div></div>';
  document.querySelectorAll('#sb-house .v[data-key]').forEach(function(el){var k=el.getAttribute('data-key'),v=el.getAttribute('data-n');if(prevVals[k]!==undefined&&prevVals[k]!==v){el.classList.add('bump')}prevVals[k]=v});
  renderRent();
  $('sb-updated').textContent='Books as of '+(s.updated_et||'—');
  if(s.headline)$('sb-headline').textContent=s.headline;
}
function renderRent(){
  var t=etParts();var mins=(t.h*60+t.m-8*60+1440)%1440;var left=1440-mins;var i=$('sb-rent-i'),lab=$('sb-rent-t');if(!i)return;
  i.style.width=(mins/1440*100).toFixed(1)+'%';lab.textContent='next rent in '+Math.floor(left/60)+'h '+p2(left%60)+'m';
}
function botFills(slug){return state.fills.filter(function(f){return f.bot===slug})}
function nowLine(b){
  var hold=!isFlat(b.positions);var last=botFills(b.slug).slice(-1)[0];
  if(b.status==='paused'||b.status==='benched')return 'On the bench · not trading';
  if(hold)return 'Holding <b>'+esc(b.positions)+'</b> · waiting for the exit';
  if(last)return 'Flat · last move '+esc(last.side.toUpperCase())+' '+esc(last.ticker)+(last.side==='sell'?' <b class="'+cls(last.pnl)+'">'+money(last.pnl,true)+'</b>':'')+' · hunting the next one';
  return 'Flat · no fills yet';
}
function renderCards(){
  $('sb-cards').innerHTML=ranked().map(function(b,i){
    var hold=!isFlat(b.positions);var pct=b.sleeve_cash?Math.max(0,Math.min(100,(b.rh_cash||0)/b.sleeve_cash*100)):0;
    var moves=botFills(b.slug).slice(-MOVES_N).reverse();
    return '<div class="card" style="--c:'+esc(b.color)+'" data-bot="'+esc(b.slug)+'"><div class="card-h">'+avatar(b,'sm'+(hold?' hold':''))+'<div><div class="name">'+esc(b.display_name)+'</div><div class="tl">'+esc(b.tagline)+'</div><div class="meta"><span class="pill">#'+(i+1)+'</span><span class="pill st-'+esc(b.status)+'">'+esc(b.status)+'</span>'+(hold?'<span class="pill hold">Holding '+esc(b.positions)+'</span>':'<span class="pill">Flat</span>')+'</div></div></div>'+
    '<div class="now"><span class="dot"></span><span><span class="k">Now · </span>'+nowLine(b)+'</span></div>'+
    '<div class="money"><div class="k">Sleeve · this bot\'s money</div><div class="v" data-key="s-'+esc(b.slug)+'" data-n="'+(b.sleeve_cash===null?'':b.sleeve_cash)+'">'+money(b.sleeve_cash)+'</div><div class="bar"><i data-w="'+pct.toFixed(1)+'"></i></div><div class="bar-n"><span>RH cash '+money(b.rh_cash)+'</span><span>'+pct.toFixed(0)+'% in Robinhood</span></div></div>'+
    '<div class="stats"><div><div class="k">P/L today</div><div class="v '+cls(b.pnl_today)+'">'+money(b.pnl_today,true)+'</div></div><div><div class="k">P/L all-time</div><div class="v '+cls(b.pnl_all)+'">'+money(b.pnl_all,true)+'</div></div><div><div class="k">Last fill</div><div class="v sm '+cls(fillSign(b.last_fill))+'">'+esc(b.last_fill||'—')+'</div></div><div><div class="k">Net vs open</div><div class="v sm '+cls(b.net_vs_open)+'">'+money(b.net_vs_open,true)+'</div></div></div>'+
    '<div class="moves"><div class="k">'+esc(b.display_name)+'\'s last moves</div>'+(moves.length?moves.map(function(f){return '<div class="mv"><span class="t">'+esc(shortWhen(f.when_et)||'—')+'</span><span class="s '+esc(f.side)+'">'+esc(f.side.toUpperCase())+'</span><b>'+esc(f.ticker)+'</b>'+(f.qty!==null?'<span style="color:var(--mute)">×'+f.qty+'</span>':'')+'<span class="p '+(f.side==='buy'?'flat':cls(f.pnl))+'">'+(f.side==='buy'?(f.price!==null?'@ '+money(f.price):'opened'):money(f.pnl,true))+'</span></div>'}).join(''):'<div class="mv"><span class="t">—</span>No moves yet</div>')+'</div>'+
    '<div class="tips"><span class="k">Tip jar</span>'+[1,5,10].map(function(a){return '<a class="tip" href="'+esc(tipHref(b,a))+'" data-bot="'+esc(b.slug)+'" '+(b.tip_url?'target="_blank" rel="noopener"':'')+'>$'+a+'</a>'}).join('')+'</div></div>';
  }).join('');
  requestAnimationFrame(function(){document.querySelectorAll('#sb .bar i').forEach(function(x){x.style.width=x.getAttribute('data-w')+'%'})});
}
function renderTabs(){
  $('sb-tabs').innerHTML='<button class="tab'+(tapeFilter==='all'?' on':'')+'" data-f="all">All bots</button>'+ranked().map(function(b){return '<button class="tab'+(tapeFilter===b.slug?' on':'')+'" data-f="'+esc(b.slug)+'" data-c style="--c:'+esc(b.color)+'">'+esc(b.display_name)+'</button>'}).join('');
}
function renderTape(){
  var all=state.fills.map(function(f,i){f._k=fillKey(f,i);return f});
  var rows=all.filter(function(f){return tapeFilter==='all'||f.bot===tapeFilter}).slice(-TAPE_N).reverse();
  var newSet=seenFills?all.filter(function(f){return !seenFills[f._k]}):[];
  if(!rows.length){$('sb-tape').innerHTML='<div class="empty">No fills booked yet.</div>'}else{
  $('sb-tape').innerHTML='<table><thead><tr><th>When (ET)</th><th>Bot</th><th>Side</th><th>Ticker</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Fees</th><th class="r">P/L</th><th class="r">Cash after</th></tr></thead><tbody>'+
    rows.map(function(f){var b=botOf(f.bot);return '<tr class="'+(newSet.indexOf(f)>-1?'new':'')+'"><td>'+esc(f.when_et||'—')+'</td><td><span class="botname" style="--c:'+esc(b.color)+'">'+esc(b.display_name)+'</span></td><td><span class="side '+esc(f.side)+'">'+esc(f.side.toUpperCase()||'—')+'</span></td><td><b>'+esc(f.ticker||'—')+'</b></td><td class="r">'+(f.qty===null?'—':f.qty)+'</td><td class="r">'+money(f.price)+'</td><td class="r">'+money(f.fees)+'</td><td class="r '+(f.side==='buy'?'flat':cls(f.pnl))+'">'+(f.side==='buy'?'—':money(f.pnl,true))+'</td><td class="r">'+money(f.cash_after)+'</td></tr>'}).join('')+'</tbody></table>'}
  seenFills={};all.forEach(function(f){seenFills[f._k]=1});
  return newSet;
}
/* ====== events ====== */
function showEvent(f){
  var b=botOf(f.bot);var kind=fillKind(f);var el=$('sb-event');
  var title=f.side==='buy'?'Bought '+f.ticker:'Sold '+f.ticker+' '+money(f.pnl,true);
  var sub=(f.when_et?shortWhen(f.when_et)+' ET · ':'')+(f.qty!==null?f.qty+' × ':'')+(f.price!==null?money(f.price):'')+(kind==='win'?' · cha-ching':kind==='loss'?' · oof':' · position open');
  el.style.setProperty('--c',b.color);
  el.innerHTML=avatar(b,'lg '+(kind==='win'?'win':kind==='loss'?'loss':''))+'<div><div class="ev-k">'+esc(b.display_name)+'</div><div class="ev-t '+(kind==='win'?'up':kind==='loss'?'dn':'')+'">'+esc(title)+'</div><div class="ev-s">'+esc(sub)+'</div></div>';
  el.classList.add('show');
  var lane=document.querySelector('#sb .lane[data-bot="'+f.bot+'"]');
  if(lane){var av=lane.querySelector('.av'),bub=lane.querySelector('.bubble');av.classList.remove('win','loss');void av.offsetWidth;if(kind!=='buy')av.classList.add(kind);emotes(lane.querySelector('.runner'),kind);bub.textContent=title.toUpperCase();bub.classList.add('show');setTimeout(function(){bub.classList.remove('show')},5000)}
  var card=document.querySelector('#sb .card[data-bot="'+f.bot+'"]');if(card){card.classList.remove('pop');void card.offsetWidth;card.classList.add('pop');emotes(card,kind)}
  if(kind==='win')confetti(b.color);
}
function pumpEvents(){if(evBusy||!evQueue.length)return;evBusy=true;var f=evQueue.shift();showEvent(f);setTimeout(function(){$('sb-event').classList.remove('show');evBusy=false;setTimeout(pumpEvents,400)},3600)}

function render(prev){
  renderHouse();renderRace();renderTicker();renderBackers();renderCards();renderTabs();var newFills=renderTape();
  $('sb-stamp').textContent='Last checked '+nowET()+' · polls every '+(POLL_MS/1000)+'s · Score Keeper is the only writer';
  if(prev&&liveOnce&&newFills&&newFills.length){newFills.slice(-4).forEach(function(f){evQueue.push(f)});pumpEvents();toast(newFills.length+' new fill'+(newFills.length>1?'s':'')+' booked')}
  first=false;
}
function setLive(mode,text){var l=$('sb-live');l.className='live '+mode;$('sb-live-t').textContent=text}

/* ====== poll loop ====== */
function tick(){
  Promise.all([loadSheet(SHEETS.snapshot),loadSheet(SHEETS.bots),loadSheet(SHEETS.fills)]).then(function(r){
    var next=normalize({snapshot:r[0],bots:r[1],fills:r[2]});
    var sig=JSON.stringify(next);var prev=state;
    if(sig!==prevSig.s||!prev){prevSig.s=sig;state=next;render(prev)}else{$('sb-stamp').textContent='Last checked '+nowET()+' · polls every '+(POLL_MS/1000)+'s · Score Keeper is the only writer';renderRent()}
    setLive('on','Live');liveOnce=true;
  }).catch(function(e){
    if(!state){state=normalize(SEED);render(null)}
    setLive('off','Offline · last known');
  }).then(function(){timer=setTimeout(tick,POLL_MS)});
}
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('#sb .tip');if(a){if(a.getAttribute('href').charAt(0)==='#'){e.preventDefault();toast('Tip jar for '+botOf(a.getAttribute('data-bot')).display_name+' opens soon — nothing charged.')}return}
  var t=e.target.closest&&e.target.closest('#sb .tab');if(t){tapeFilter=t.getAttribute('data-f');renderTabs();var keep=seenFills;renderTape();seenFills=keep}
});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){clearTimeout(timer);tick()}});
function boot(){if(!$('sb-lanes')){return setTimeout(boot,50)}setInterval(renderRent,60000);state=normalize(SEED);render(null);setLive('sync','Syncing');tick()}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();


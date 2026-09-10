(async function(){
  var n=8, parts=[];
  for (var i=0;i<n;i++){
    var r=await fetch('https://raw.githubusercontent.com/VicenteTickle/copeland-scoreboard-assets/main/parts/p'+i+'.js.txt?t='+Date.now());
    if(!r.ok) throw new Error('part '+i);
    parts.push(await r.text());
  }
  (0,eval)(parts.join(''));
})().catch(function(e){console.error('scoreboard load', e); var t=document.getElementById('sb-live-t'); if(t)t.textContent='Script load failed';});

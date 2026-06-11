async function loadWindfieldData(){
  const candidates = ["./farm.json", "/projects/farm.json", "../farm.json"];
  const failures = [];

  for(const path of candidates){
    try{
      const response = await fetch(path);
      if(response.ok) return response.json();
      failures.push(`${path}: ${response.status}`);
    } catch(error){
      failures.push(`${path}: ${error.message}`);
    }
  }

  throw new Error(`Could not load farm.json. Tried ${failures.join(", ")}`);
}

function showWindfieldError(error){
  const message = error && error.message ? error.message : String(error);
  const info = document.getElementById("info");
  const field = document.querySelector(".field-panel");

  if(info){
    info.innerHTML = `
      <div class="eyebrow">Load error</div>
      <h2>Windfield data did not load</h2>
      <p>${message}</p>
      <p>Check that <code>farm.json</code>, <code>windfield.css</code>, and <code>windfield.js</code> are in the same <code>projects</code> folder as this page.</p>
    `;
  }

  if(field){
    field.innerHTML = `<div class="field-error"><b>Windfield could not start.</b><span>${message}</span></div>`;
  }
}

(async () => {
  "use strict";

  try {
  const FARM = await loadWindfieldData();

  const FAULT_NAMES = ["healthy","temperature","pitch","yaw","compound"];
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTH_START_DAY = [1,32,60,91,121,152,182,213,244,274,305,335];
  const TWO_PI = Math.PI*2;
  const MONO = "JetBrains Mono, monospace";

  const interpolate = (from,to,t) => from + (to-from)*t;
  const clamp = (value,low,high) => value<low ? low : value>high ? high : value;
  const byId = id => document.getElementById(id);
  const setHtml = (id,html) => { const e=byId(id); if(e) e.innerHTML=html; };
  const setText = (id,text) => { const e=byId(id); if(e) e.textContent=text; };

  function colorToRgb(color){
    if(color.startsWith("#")){
      let value=color.slice(1);
      if(value.length===3) value=value.split("").map(character=>character+character).join("");
      const number=parseInt(value.slice(0,6),16);
      return [number>>16&255, number>>8&255, number&255];
    }
    const match=color.match(/rgba?\(([^)]+)\)/);
    if(match){
      const channels=match[1].split(",").slice(0,3).map(value=>parseFloat(value));
      if(channels.every(Number.isFinite)) return channels;
    }
    const probe=document.createElement("span");
    probe.style.color=color;
    document.body.appendChild(probe);
    const computed=getComputedStyle(probe).color;
    probe.remove();
    const computedMatch=computed.match(/rgba?\(([^)]+)\)/);
    if(!computedMatch) return [0,0,0];
    return computedMatch[1].split(",").slice(0,3).map(value=>parseFloat(value));
  }
  function mixColors(first,second,t){
    const a=colorToRgb(first), b=colorToRgb(second);
    return `rgb(${Math.round(interpolate(a[0],b[0],t))},${Math.round(interpolate(a[1],b[1],t))},${Math.round(interpolate(a[2],b[2],t))})`;
  }
  function withAlpha(color,alpha){ const c=colorToRgb(color); return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`; }

  // Colors come from the page's CSS variables, so they track the active theme.
  const COLORS = {};
  const SCENE = {};
  let themeLight = false;
  function loadColors(){
    const styles=getComputedStyle(document.documentElement);
    const read=name=>styles.getPropertyValue(name).trim();
    COLORS.bg=read("--bg"); COLORS.green=read("--green"); COLORS.amber=read("--amber");
    COLORS.rose=read("--rose"); COLORS.blue=read("--blue"); COLORS.purple=read("--purple"); COLORS.yaw=read("--yaw");
    COLORS.text=read("--text"); COLORS.faint=read("--faint"); COLORS.border=read("--border");
    SCENE.skyTop=read("--sky-top"); SCENE.skyWarm=read("--sky-warm"); SCENE.skyBot=read("--sky-bot");
    SCENE.horizon=read("--horizon"); SCENE.ink=read("--ink"); SCENE.star=read("--star");
  }
  function familyColor(kind){
    if(kind.includes("temperature")) return COLORS.amber;
    if(kind.includes("pitch")) return COLORS.blue;
    if(kind.includes("yaw")) return COLORS.yaw;
    if(kind.includes("compound")) return COLORS.rose;
    return COLORS.green;
  }
  function heatColor(level){
    level = clamp(level,0,1);
    return level<0.5 ? mixColors(COLORS.green,COLORS.amber,level/0.5) : mixColors(COLORS.amber,COLORS.rose,(level-0.5)/0.5);
  }
  function glowComposite(){ return themeLight ? "source-over" : "lighter"; }
  function glowAlpha(base){ return themeLight ? Math.min(0.75, base*1.3) : base; }

  function seasonName(dayOfYear){
    if(dayOfYear<60||dayOfYear>=335) return "deep winter";
    if(dayOfYear<152) return "spring";
    if(dayOfYear<244) return "summer";
    if(dayOfYear<305) return "autumn";
    return "early winter";
  }
  function dateLabel(dayOfYear){
    let month=0;
    for(let i=0;i<12;i++){ if(dayOfYear>=MONTH_START_DAY[i]) month=i; }
    return `${MONTH_NAMES[month]} ${dayOfYear - MONTH_START_DAY[month] + 1}`;
  }
  function directionCardinal(degrees){
    const names=["N","NE","E","SE","S","SW","W","NW"];
    return names[Math.round(degrees/45)%8];
  }

  const frameCount = FARM.meta.nframes;

  FARM.turbines.forEach(turbine => {
    turbine.stress = new Float32Array(frameCount);
    for(let i=0;i<frameCount;i++){
      const fault=turbine.flt[i], warmth=turbine.warm[i]/100, yawShare=clamp(turbine.yaw[i]/28,0,1), severityShare=turbine.sev[i]/3;
      let stress=0;
      if(fault===1) stress=Math.max(0.15, warmth);
      else if(fault===2) stress=0.3 + 0.6*severityShare;
      else if(fault===3) stress=Math.max(0.2, yawShare);
      else if(fault===4) stress=Math.max(warmth, yawShare, 0.4);
      turbine.stress[i]=stress;
    }
  });

  const farmEnergyMwh = new Float32Array(frameCount);
  for(let i=1;i<frameCount;i++){
    const totalPowerKw=FARM.turbines.reduce((total,turbine)=>total + turbine.power[i]/100*FARM.meta.rated_kw,0);
    farmEnergyMwh[i]=farmEnergyMwh[i-1] + totalPowerKw*FARM.meta.cadence_hours/1000;
  }

  function frameParts(frameValue){
    frameValue=clamp(frameValue,0,frameCount-1);
    const low=Math.floor(frameValue);
    return { low, high:Math.min(frameCount-1,low+1), amount:frameValue-low };
  }
  function sampleSeries(values, frameValue){
    const parts=frameParts(frameValue);
    return interpolate(values[parts.low], values[parts.high], parts.amount);
  }
  function sampleTurbine(turbine, frameValue){
    const parts=frameParts(frameValue);
    return {
      fault:turbine.flt[parts.low],
      powerShare:sampleSeries(turbine.power, frameValue)/100,
      rotor:sampleSeries(turbine.rotor, frameValue)/10,
      yaw:sampleSeries(turbine.yaw, frameValue),
      warmth:sampleSeries(turbine.warm, frameValue)/100,
      severity:sampleSeries(turbine.sev, frameValue),
      stress:sampleSeries(turbine.stress, frameValue),
    };
  }
  function sampleFleet(frameValue){
    const totalPowerKw=FARM.turbines.reduce((total,turbine)=>total + sampleTurbine(turbine, frameValue).powerShare*FARM.meta.rated_kw,0);
    const frameIndex=Math.min(frameCount-1,Math.floor(clamp(frameValue,0,frameCount-1)));
    const activeFaults=FARM.turbines.filter(turbine=>turbine.flt[frameIndex]!==0).length;
    return {
      totalPowerKw,
      averagePowerKw:totalPowerKw/FARM.turbines.length,
      activeFaults,
      energyMwh:sampleSeries(farmEnergyMwh, frameValue),
    };
  }

  function stateAt(turbine, frameValue){
    const sample=sampleTurbine(turbine, frameValue);
    const { fault, warmth, yaw, severity } = sample;
    if(fault===0) return { ...sample, color:COLORS.green, intensity:0.16 };
    if(fault===1) return { ...sample, color:heatColor(warmth), intensity:Math.max(0.22,warmth) };
    if(fault===2) return { ...sample, color:COLORS.blue, intensity:0.32 + 0.55*(severity/3) };
    if(fault===3) return { ...sample, color:COLORS.yaw, intensity:0.30 + 0.6*clamp(yaw/28,0,1) };
    return { ...sample, color:heatColor(Math.max(warmth,0.55)), intensity:Math.max(warmth, clamp(yaw/28,0,1), 0.5) };
  }
  function faultColor(turbine, frameIndex){
    const fault=turbine.flt[frameIndex];
    if(fault===0) return COLORS.green;
    if(fault===1) return heatColor(turbine.warm[frameIndex]/100);
    if(fault===2) return COLORS.blue;
    if(fault===3) return COLORS.yaw;
    return COLORS.rose;
  }

  const canvas = byId("sky");
  const context = canvas.getContext("2d");
  let viewportWidth=0, viewportHeight=0, pixelRatio=1;
  function resize(){
    pixelRatio = Math.min(2, window.devicePixelRatio||1);
    const bounds = canvas.getBoundingClientRect();
    viewportWidth = Math.max(1, Math.round(bounds.width));
    viewportHeight = Math.max(1, Math.round(bounds.height));
    canvas.width = Math.round(viewportWidth*pixelRatio);
    canvas.height = Math.round(viewportHeight*pixelRatio);
    context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    computeLayout();
    if(windParticles.length) seedParticles();
  }
  window.addEventListener("resize", resize);

  let turbineNodes = [];



  function computeLayout(){
    const isSmall = viewportWidth <= 640;
    const padX = clamp(viewportWidth * 0.10, isSmall ? 28 : 56, isSmall ? 48 : 96);
    const padTop = clamp(viewportHeight * 0.18, isSmall ? 92 : 112, isSmall ? 130 : 170);
    const padBottom = clamp(viewportHeight * 0.07, isSmall ? 36 : 48, isSmall ? 72 : 96);
    const fieldWidth = Math.max(260, viewportWidth - padX * 2);
    const fieldHeight = Math.max(260, viewportHeight - padTop - padBottom);
    const scaleBase = clamp(viewportWidth / 1100, isSmall ? 0.72 : 0.90, isSmall ? 0.88 : 1.12);

    turbineNodes = FARM.turbines.map((turbine,index) => {
      const depth = clamp(turbine.y,0,1);
      const depthSpread = clamp((depth - 0.16) / 0.64, 0, 1);
      const verticalShare = interpolate(0.10, 1, depthSpread);
      return {
        turbine,
        index,
        x: padX + turbine.x * fieldWidth,
        y: padTop + verticalShare * fieldHeight,
        scale: interpolate(0.92,1.32,depth) * scaleBase,
        rotorAngle: Math.random() * TWO_PI,
        depth,
      };
    });
    turbineNodes.sort((a,b)=>a.depth-b.depth);
  }

  const PARTICLE_COUNT = 260;
  let windParticles = [];
  function seedParticles(){
    windParticles = [];
    for(let i=0;i<PARTICLE_COUNT;i++){
      windParticles.push({ x:Math.random()*viewportWidth, y:Math.random()*viewportHeight, length:6+Math.random()*16, alpha:0.04+Math.random()*0.10 });
    }
  }

  // Meteorological direction is where wind comes from, so the flow points the opposite way.
  function windVector(directionDegrees){
    const radians=(directionDegrees+180)*Math.PI/180;
    return { vx:Math.sin(radians), vy:-Math.cos(radians) };
  }

  const glowSpriteCache = new Map();
  function glowSprite(color){
    if(glowSpriteCache.has(color)) return glowSpriteCache.get(color);
    const size=128, sprite=document.createElement("canvas");
    sprite.width=sprite.height=size;
    const spriteContext=sprite.getContext("2d");
    const gradient=spriteContext.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
    gradient.addColorStop(0, withAlpha(color,0.9));
    gradient.addColorStop(0.25, withAlpha(color,0.45));
    gradient.addColorStop(1, withAlpha(color,0));
    spriteContext.fillStyle=gradient; spriteContext.fillRect(0,0,size,size);
    glowSpriteCache.set(color,sprite);
    return sprite;
  }

  function drawRotor(node, state, spinAngle){
    const scale=node.scale, bladeLength=46*scale;
    const yawShare=clamp(state.yaw/40,0,1);
    const foreshorten=interpolate(1,0.32,yawShare);
    const lean=(state.fault===3||state.fault===4) ? state.yaw*Math.PI/180*0.5 : 0;
    const widthScale=clamp(0.55 + 0.45*state.powerShare, 0.55, 1);
    const tipColor=withAlpha(state.fault===0?COLORS.green:state.color, themeLight?0.95:0.78);

    context.save();
    context.translate(node.hubX, node.hubY);
    context.rotate(lean);
    context.scale(foreshorten,1);
    for(let blade=0;blade<3;blade++){
      let angle=spinAngle + blade*(TWO_PI/3);
      let length=bladeLength;
      if(state.fault===2 && blade===1){
        length *= 0.82 + 0.10*Math.sin(performance.now()/180);
        angle += 0.14*Math.sin(performance.now()/150);
      }
      const tipX=Math.cos(angle)*length, tipY=Math.sin(angle)*length;
      const gradient=context.createLinearGradient(0,0,tipX,tipY);
      gradient.addColorStop(0, withAlpha(state.fault===0?COLORS.green:state.color,0));
      gradient.addColorStop(1, tipColor);
      context.strokeStyle=gradient;
      context.lineWidth=Math.max(1.6, 3.4*scale*widthScale);
      context.lineCap="round";
      context.beginPath(); context.moveTo(0,0); context.lineTo(tipX,tipY); context.stroke();
    }
    context.restore();
  }

  function drawTurbine(node, state, isSelected, spinAngle){
    const scale=node.scale;
    const towerHeight=92*scale, hubRadius=5.5*scale, bladeLength=46*scale;
    const glow=glowSprite(state.color);

    context.save();
    context.globalCompositeOperation=glowComposite();
    const poolRadius=(40 + 70*state.powerShare)*scale*(0.7+0.6*state.intensity);
    context.globalAlpha=glowAlpha((0.18 + 0.55*state.intensity)*0.5);
    context.drawImage(glow, node.x-poolRadius, node.y-poolRadius*0.5, poolRadius*2, poolRadius);
    context.restore();

    context.save();
    context.strokeStyle=withAlpha(SCENE.ink, themeLight?0.55:0.40);
    context.lineWidth=Math.max(1.4, 2.4*scale);
    context.lineCap="round";
    context.beginPath(); context.moveTo(node.x,node.y); context.lineTo(node.x,node.y-towerHeight); context.stroke();
    context.restore();

    node.hubX=node.x;
    node.hubY=node.y-towerHeight;

    context.save();
    context.globalCompositeOperation=glowComposite();
    const haloRadius=(16 + 40*state.powerShare)*scale*(0.8+0.9*state.intensity);
    context.globalAlpha=glowAlpha(0.22 + 0.6*state.intensity);
    context.drawImage(glow, node.hubX-haloRadius, node.hubY-haloRadius, haloRadius*2, haloRadius*2);
    context.restore();

    drawRotor(node, state, spinAngle);

    context.save();
    context.fillStyle=state.fault===0 ? withAlpha(COLORS.green,0.95) : state.color;
    context.beginPath(); context.arc(node.hubX,node.hubY,hubRadius,0,TWO_PI); context.fill();
    if(!themeLight && state.intensity>0.35){
      context.globalCompositeOperation="lighter";
      context.globalAlpha=state.intensity*0.7;
      context.beginPath(); context.arc(node.hubX,node.hubY,hubRadius*1.8,0,TWO_PI); context.fill();
    }
    context.restore();

    if(isSelected){
      context.save();
      context.strokeStyle=withAlpha(COLORS.text,0.85);
      context.lineWidth=1.5;
      context.setLineDash([3,4]);
      context.beginPath(); context.arc(node.hubX,node.hubY, bladeLength+12, 0, TWO_PI); context.stroke();
      context.restore();
    }
    node.hubHit={ x:node.hubX, y:node.hubY, radius:bladeLength+12 };
  }

  let stars = [];
  function seedStars(){
    stars = [];
    for(let i=0;i<90;i++) stars.push({ x:Math.random(), y:Math.random()*0.5, radius:Math.random()*1.1+0.2, phase:Math.random()*TWO_PI });
  }
  function drawSky(temperature){
    const warmth=clamp((temperature+5)/35,0,1);
    const top=mixColors(SCENE.skyTop, SCENE.skyWarm, warmth*0.6);
    const gradient=context.createLinearGradient(0,0,0,viewportHeight);
    gradient.addColorStop(0, top);
    gradient.addColorStop(0.6, COLORS.bg);
    gradient.addColorStop(1, SCENE.skyBot);
    context.fillStyle=gradient; context.fillRect(0,0,viewportWidth,viewportHeight);

    if(!themeLight){
      const seconds=performance.now()/1000;
      context.save();
      for(const star of stars){
        context.fillStyle=withAlpha(SCENE.star, 0.18 + 0.18*Math.sin(seconds*0.8 + star.phase));
        context.beginPath(); context.arc(star.x*viewportWidth, star.y*viewportHeight, star.radius, 0, TWO_PI); context.fill();
      }
      context.restore();
    }

    const horizonY=viewportHeight*0.70;
    const horizonGlow=context.createLinearGradient(0,horizonY-90,0,horizonY+90);
    horizonGlow.addColorStop(0, withAlpha(SCENE.horizon,0));
    horizonGlow.addColorStop(0.5, withAlpha(SCENE.horizon, themeLight ? 0.22 : 0.16));
    horizonGlow.addColorStop(1, withAlpha(SCENE.horizon,0));
    context.fillStyle=horizonGlow; context.fillRect(0,horizonY-90,viewportWidth,180);
  }

  function drawWind(vector, speed){
    const speedShare=clamp(speed/22,0.05,1);
    const stride=interpolate(0.4,2.6,speedShare);
    const additive=!themeLight;
    context.save();
    context.globalCompositeOperation=additive ? "lighter" : "source-over";
    for(const particle of windParticles){
      const curl=Math.sin((particle.y*0.012) + performance.now()*0.0004)*0.25;
      const vx=vector.vx + curl, vy=vector.vy + curl*0.3;
      particle.x += vx * stride * (0.8 + particle.length*0.04);
      particle.y += vy * stride * (0.8 + particle.length*0.04);
      if(particle.x<-20) particle.x=viewportWidth+20;
      if(particle.x>viewportWidth+20) particle.x=-20;
      if(particle.y<-20) particle.y=viewportHeight+20;
      if(particle.y>viewportHeight+20) particle.y=-20;
      const tailX=particle.x - vx*particle.length, tailY=particle.y - vy*particle.length;
      const gradient=context.createLinearGradient(tailX,tailY,particle.x,particle.y);
      const alpha=particle.alpha*(0.5+speedShare)*(additive?1:1.5);
      gradient.addColorStop(0, withAlpha(SCENE.ink,0));
      gradient.addColorStop(1, withAlpha(SCENE.ink, alpha));
      context.strokeStyle=gradient; context.lineWidth=1; context.lineCap="round";
      context.beginPath(); context.moveTo(tailX,tailY); context.lineTo(particle.x,particle.y); context.stroke();
    }
    context.restore();
  }

  let frame = 0;
  let playing = true;
  let speedMultiplier = 1;
  let lastFrameTime = performance.now();
  const FRAMES_PER_SECOND = 8;
  let selection = [];
  let compareMode = false;

  function interpolateAngle(from,to,t){
    const delta=((to-from+540)%360)-180;
    return (from + delta*t + 360)%360;
  }
  function sampleSite(frameValue){
    frameValue=clamp(frameValue,0,frameCount-1);
    const i0=Math.floor(frameValue), i1=Math.min(frameCount-1,i0+1), t=frameValue-i0;
    return {
      direction:interpolateAngle(FARM.site.dir[i0], FARM.site.dir[i1], t),
      wind:interpolate(FARM.site.wind[i0], FARM.site.wind[i1], t),
      temperature:interpolate(FARM.site.temp[i0], FARM.site.temp[i1], t),
      dayOfYear:FARM.site.doy[Math.round(frameValue)] || FARM.site.doy[i0],
    };
  }

  function render(now){
    const elapsed=clamp((now-lastFrameTime)/1000, 0, 0.05);
    lastFrameTime=now;
    if(playing){
      frame += elapsed * FRAMES_PER_SECOND * speedMultiplier;
      if(frame >= frameCount-1) frame=0;
    }
    const site=sampleSite(frame);
    drawSky(site.temperature);
    drawWind(windVector(site.direction), site.wind);
    for(const node of turbineNodes){
      const state=stateAt(node.turbine, frame);
      node.rotorAngle = (node.rotorAngle + elapsed*(1.2 + state.rotor*0.22))%TWO_PI;
      drawTurbine(node, state, selection.includes(node.index), node.rotorAngle);
    }
    updateChrome(site);
    requestAnimationFrame(render);
  }

  const windEl=byId("cWind"), fillEl=byId("fill"), thumbEl=byId("thumb"), fleetSummaryEl=byId("fleetSummary");
  let fleetSummaryMarkup = "";
  function updateChrome(site){
    setText("cDate", dateLabel(site.dayOfYear));
    setText("cSeason", seasonName(site.dayOfYear));
    windEl.innerHTML=`wind <b>${site.wind.toFixed(1)} m/s</b> from ${directionCardinal(site.direction)}`;
    const fleet=sampleFleet(frame);
    if(fleetSummaryEl){
      const faultLabel=fleet.activeFaults===1 ? "1 active fault" : `${fleet.activeFaults} active faults`;
      const nextSummary=`<b>${FARM.turbines.length} turbines</b><span class="summary-divider">·</span><span>${faultLabel}</span>`;
      if(nextSummary!==fleetSummaryMarkup){
        fleetSummaryMarkup=nextSummary;
        fleetSummaryEl.innerHTML=nextSummary;
      }
    }
    setHtml("kPower", `${Math.round(fleet.totalPowerKw).toLocaleString()} <small>kW</small>`);
    setHtml("kAvg", `${Math.round(fleet.averagePowerKw).toLocaleString()} <small>kW</small>`);
    setHtml("kFaults", `${fleet.activeFaults} <small>of ${FARM.turbines.length}</small>`);
    setHtml("kEnergy", `${Math.round(fleet.energyMwh).toLocaleString()} <small>MWh</small>`);
    const percent=(frame/(frameCount-1))*100;
    fillEl.style.width=percent+"%";
    thumbEl.style.left=percent+"%";
    if(fleetDots.length){
      FARM.turbines.forEach((turbine,i)=>{
        const state=stateAt(turbine, frame);
        const dot=fleetDots[i];
        if(dot){
          dot.style.setProperty("--dot-color", state.color);
          dot.style.setProperty("--dot-glow", withAlpha(state.color,0.55));
        }
      });
    }
    if(selection.length>0){ paintCardCharts(); refreshReadouts(); }
  }

  const fleetEl=byId("fleet");
  const deviceControls=byId("deviceControls");
  const devicePicker=byId("devicePicker");
  const deviceMenuButton=byId("deviceMenuButton");
  const deviceSelectLabel=deviceMenuButton.querySelector(".device-select-label");
  const deviceSelectCount=deviceMenuButton.querySelector(".device-select-count");
  let fleetDots=[];

  function openDeviceMenu(){
    devicePicker.classList.add("open");
    deviceControls.classList.add("menu-open");
    deviceMenuButton.setAttribute("aria-expanded", "true");
  }

  function closeDeviceMenu(){
    devicePicker.classList.remove("open");
    deviceControls.classList.remove("menu-open");
    deviceMenuButton.setAttribute("aria-expanded", "false");
  }

  function toggleDeviceMenu(){
    deviceControls.classList.contains("menu-open") ? closeDeviceMenu() : openDeviceMenu();
  }

  FARM.turbines.forEach((turbine,index)=>{
    const option=document.createElement("button");
    option.type="button";
    option.className="device-option";
    option.title=turbine.name;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.innerHTML=`<span class="device-code">${turbine.id}</span><span class="device-name">${turbine.name}</span>`;
    option.addEventListener("click",()=>{
      toggleSelection(index);
      if(!compareMode) closeDeviceMenu();
    });
    option.addEventListener("mouseenter",event=>showTooltip(event, turbine.name));
    option.addEventListener("mouseleave",hideTooltip);
    fleetEl.appendChild(option);
    fleetDots.push(option);
  });

  deviceMenuButton.addEventListener("click", toggleDeviceMenu);
  document.addEventListener("click", event=>{
    if(!deviceControls.contains(event.target)) closeDeviceMenu();
  });
  document.addEventListener("keydown", event=>{
    if(event.code==="Escape") closeDeviceMenu();
  });

  const infoEl=byId("info");

  function toggleSelection(index){
    const at=selection.indexOf(index);
    if(at!==-1 && compareMode){
      selection.splice(at,1);
    } else if(at===-1) {
      selection.push(index);
    } else {
      selection=[index];
    }
    const maximum=compareMode ? FARM.turbines.length : 1;
    while(selection.length>maximum) selection.shift();
    updateSelectionUi();
  }

  const modeToggle=byId("modeToggle");
  function setCompareMode(on){
    compareMode=on;
    modeToggle.classList.toggle("on", on);
    modeToggle.textContent=on ? "Comparing" : "Compare devices";
    fleetEl.setAttribute("aria-multiselectable", on ? "true" : "false");
    if(!on && selection.length>1) selection=selection.slice(-1);
    updateSelectionUi();
    if(on) openDeviceMenu();
  }
  modeToggle.addEventListener("click", ()=>setCompareMode(!compareMode));

  function updateDeviceSelectLabel(){
    if(selection.length===0){
      deviceSelectLabel.textContent=compareMode ? "Choose devices" : "Choose device";
      deviceSelectCount.textContent="";
      return;
    }
    if(compareMode){
      deviceSelectLabel.textContent=selection.map(index=>FARM.turbines[index].id).join(", ");
      deviceSelectCount.textContent=`${selection.length} selected`;
      return;
    }
    const turbine=FARM.turbines[selection[0]];
    deviceSelectLabel.textContent=`${turbine.id} · ${turbine.name}`;
    deviceSelectCount.textContent="";
  }

  function updateSelectionUi(){
    fleetDots.forEach((option,i)=>{
      const selected=selection.includes(i);
      option.classList.toggle("sel", selected);
      option.setAttribute("aria-selected", selected ? "true" : "false");
    });
    updateDeviceSelectLabel();
    if(selection.length===0){ showDefaultInfo(); return; }
    if(compareMode && selection.length>1){ buildCompareCard(); return; }
    buildSingleCard(selection[0]);
  }

  let card = null;

  function showDefaultInfo(){
    card=null;
    const prompt = compareMode ? "Use the dropdown or tap turbines in the field to compare them together." :
      "Watch the field breathe. Choose a turbine from the dropdown or tap one in the field to follow its story: a slow fever, a blade slipping out of true, a drift off the wind, and the repairs that bring some of them home.";
    infoEl.innerHTML=`<div class="hint"><span class="big">Ten turbines, one year.</span>${prompt}</div>`;
  }

  function buildSingleCard(index){
    const turbine=FARM.turbines[index];
    const family=familyColor(turbine.kind);
    const compareHint = compareMode ? `<div class="hintLine">pick more turbines to compare</div>` : "";
    infoEl.innerHTML=`
      <div class="eyebrow"><span>${turbine.id}</span><span class="tag" style="color:${family}">${turbine.kind}</span></div>
      <h2>${turbine.name}</h2>
      <div class="blurb">${turbine.blurb}</div>
      <div class="readouts">
        <div class="ro"><div class="k">POWER</div><div class="v" id="roPow"></div></div>
        <div class="ro"><div class="k">ROTOR</div><div class="v" id="roRot"></div></div>
        <div class="ro"><div class="k">YAW ERROR</div><div class="v" id="roYaw"></div></div>
        <div class="ro"><div class="k">STATUS</div><div class="v" id="roSt"></div></div>
      </div>${compareHint}`;
    buildCard([index]);
  }

  function buildCompareCard(){
    const indices=selection.slice();
    const chips=indices.map((index,order)=>{
      const turbine=FARM.turbines[index];
      const ringClass=order===0 ? "" : " ring";
      const style=order===0 ? `background:${familyColor(turbine.kind)}` : `border-color:${familyColor(turbine.kind)}`;
      return `<div class="cmpName"><span class="cmpDot${ringClass}" style="${style}"></span><span class="cid">${turbine.id}</span> ${turbine.name}</div>`;
    }).join("");
    infoEl.innerHTML=`
      <div class="eyebrow"><span>COMPARE</span><span class="tag" style="color:var(--purple)">${indices.length} turbines</span></div>
      <div class="cmpHead">${chips}</div>
      <div class="cmpRead">
        <div class="cmpRow head"><span class="cl">DEVICE</span><span class="cv">POWER</span><span class="cv">ROTOR</span><span class="cv">YAW</span></div>
        ${indices.map(index=>`<div class="cmpRow" data-compare-index="${index}"><span class="cl">${FARM.turbines[index].id}</span><span class="cv cmpPower"></span><span class="cv cmpRotor"></span><span class="cv cmpYaw"></span></div>`).join("")}
      </div>`;
    buildCard(indices);
  }

  function buildCard(indices){
    card = {
      indices,
      sparkCanvas: byId("spark"),
      cloudCanvas: byId("cloud"),
      sparkSprite: buildSparklineSprite(indices),
      cloudSprite: buildPowerCloudSprite(indices),
    };
    refreshChartLabels(indices);
    paintCardCharts();
    refreshReadouts();
  }

  function refreshChartLabels(indices){
    const selectedCount = indices.length;
    if(selectedCount>1){
      setText("spkNow", "color by turbine");
      setText("cloudNow", "current points marked");
      return;
    }
    const turbine = FARM.turbines[indices[0]];
    setText("spkNow", `${turbine.id}`);
    setText("cloudNow", "output vs wind");
  }

  const SPARK_WIDTH=620, SPARK_HEIGHT=112;
  const CLOUD_WIDTH=680, CLOUD_HEIGHT=164;
  const CLOUD_LEFT=12, CLOUD_RIGHT=12, CLOUD_TOP=12, CLOUD_BOTTOM=22;
  const WIND_MAX=26, POWER_MAX=120;

  function offscreen(width,height){ const c=document.createElement("canvas"); c.width=width; c.height=height; return c; }
  function sparkY(stress){ return SPARK_HEIGHT-2 - stress*(SPARK_HEIGHT-8); }
  function cloudX(wind){ return CLOUD_LEFT + clamp(wind/WIND_MAX,0,1)*(CLOUD_WIDTH-CLOUD_LEFT-CLOUD_RIGHT); }
  function cloudY(power){ return CLOUD_TOP + (1-clamp(power/POWER_MAX,0,1))*(CLOUD_HEIGHT-CLOUD_TOP-CLOUD_BOTTOM); }

  function buildSparklineSprite(indices){
    const sprite=offscreen(SPARK_WIDTH,SPARK_HEIGHT);
    const g=sprite.getContext("2d");
    indices.forEach(index=>{
      const turbine=FARM.turbines[index];
      const family=familyColor(turbine.kind);
      FARM.events.filter(event=>event.device===turbine.id).forEach(event=>{
        const startX=(event.start/(frameCount-1))*SPARK_WIDTH;
        const endX=((event.end==null?frameCount-1:event.end)/(frameCount-1))*SPARK_WIDTH;
        g.fillStyle=withAlpha(family,0.12); g.fillRect(startX,0,endX-startX,SPARK_HEIGHT);
        g.fillStyle=withAlpha(family,0.5); g.fillRect(startX,0,1.2,SPARK_HEIGHT);
        if(event.end!=null){ g.fillStyle=withAlpha(COLORS.green,0.5); g.fillRect(endX-1.2,0,1.2,SPARK_HEIGHT); }
      });
    });
    g.strokeStyle=COLORS.border; g.lineWidth=1;
    g.beginPath(); g.moveTo(0,SPARK_HEIGHT-2); g.lineTo(SPARK_WIDTH,SPARK_HEIGHT-2); g.stroke();
    indices.forEach((index,order)=>{
      const turbine=FARM.turbines[index];
      const family=familyColor(turbine.kind);
      if(order===0){
        g.beginPath(); g.moveTo(0,SPARK_HEIGHT);
        for(let i=0;i<frameCount;i++) g.lineTo((i/(frameCount-1))*SPARK_WIDTH, sparkY(turbine.stress[i]));
        g.lineTo(SPARK_WIDTH,SPARK_HEIGHT); g.closePath();
        const area=g.createLinearGradient(0,0,0,SPARK_HEIGHT);
        area.addColorStop(0, withAlpha(family,0.35)); area.addColorStop(1, withAlpha(family,0.02));
        g.fillStyle=area; g.fill();
      }
      g.beginPath();
      for(let i=0;i<frameCount;i++){ const x=(i/(frameCount-1))*SPARK_WIDTH, y=sparkY(turbine.stress[i]); i?g.lineTo(x,y):g.moveTo(x,y); }
      g.strokeStyle=family; g.lineWidth=1.6;
      if(order>0) g.setLineDash(order%2 ? [4,3] : [2,3]);
      g.stroke();
      g.setLineDash([]);
    });
    return sprite;
  }

  function buildPowerCloudSprite(indices){
    const sprite=offscreen(CLOUD_WIDTH,CLOUD_HEIGHT);
    const g=sprite.getContext("2d");
    g.font=`9px ${MONO}`; g.textBaseline="alphabetic";
    [5,10,15,20,25].forEach(speed=>{
      const x=cloudX(speed);
      g.strokeStyle=withAlpha(COLORS.border,0.8); g.lineWidth=1;
      g.beginPath(); g.moveTo(x,CLOUD_TOP); g.lineTo(x,CLOUD_HEIGHT-CLOUD_BOTTOM); g.stroke();
      g.fillStyle=COLORS.faint; g.textAlign="center"; g.fillText(speed, x, CLOUD_HEIGHT-6);
    });
    const ratedY=cloudY(100);
    g.strokeStyle=withAlpha(COLORS.faint,0.6); g.setLineDash([3,3]);
    g.beginPath(); g.moveTo(CLOUD_LEFT,ratedY); g.lineTo(CLOUD_WIDTH-CLOUD_RIGHT,ratedY); g.stroke();
    g.setLineDash([]);
    g.fillStyle=COLORS.faint; g.textAlign="left"; g.fillText("rated", CLOUD_LEFT+2, ratedY-3);
    g.textAlign="right"; g.fillText("m/s", CLOUD_WIDTH-CLOUD_RIGHT, CLOUD_HEIGHT-6);
    indices.forEach((index,order)=>{
      const turbine=FARM.turbines[index];
      for(let i=0;i<frameCount;i++){
        const x=cloudX(FARM.site.wind[i]), y=cloudY(turbine.power[i]);
        const color=faultColor(turbine,i);
        if(order>0){ g.strokeStyle=withAlpha(color,0.55); g.lineWidth=1; g.beginPath(); g.arc(x,y,1.45,0,TWO_PI); g.stroke(); }
        else { g.fillStyle=withAlpha(color,0.6); g.beginPath(); g.arc(x,y,1.3,0,TWO_PI); g.fill(); }
      }
    });
    return sprite;
  }

  function drawStressMarker(g,x,y,hollow,color){
    if(hollow){ g.strokeStyle=color; g.lineWidth=1.4; g.beginPath(); g.arc(x,y,3,0,TWO_PI); g.stroke(); }
    else { g.fillStyle=COLORS.text; g.beginPath(); g.arc(x,y,2.6,0,TWO_PI); g.fill(); }
  }
  function drawCloudMarker(g,x,y,color){
    g.save();
    g.globalCompositeOperation=glowComposite();
    g.strokeStyle=withAlpha(color,0.95); g.lineWidth=2;
    g.beginPath(); g.arc(x,y,5,0,TWO_PI); g.stroke();
    g.restore();
    g.fillStyle=COLORS.text; g.beginPath(); g.arc(x,y,1.6,0,TWO_PI); g.fill();
  }

  function paintCardCharts(){
    if(!card) return;
    const frameIndex=Math.min(frameCount-1, Math.floor(frame));
    const sparkContext=card.sparkCanvas.getContext("2d");
    sparkContext.clearRect(0,0,SPARK_WIDTH,SPARK_HEIGHT);
    sparkContext.drawImage(card.sparkSprite,0,0);
    const playheadX=(frame/(frameCount-1))*SPARK_WIDTH;
    sparkContext.strokeStyle=withAlpha(COLORS.text,0.8); sparkContext.lineWidth=1;
    sparkContext.beginPath(); sparkContext.moveTo(playheadX,0); sparkContext.lineTo(playheadX,SPARK_HEIGHT); sparkContext.stroke();
    card.indices.forEach((index,order)=>{
      drawStressMarker(sparkContext, playheadX, sparkY(sampleTurbine(FARM.turbines[index], frame).stress), order>0, familyColor(FARM.turbines[index].kind));
    });
    const cloudContext=card.cloudCanvas.getContext("2d");
    cloudContext.clearRect(0,0,CLOUD_WIDTH,CLOUD_HEIGHT);
    cloudContext.drawImage(card.cloudSprite,0,0);
    const wind=sampleSeries(FARM.site.wind, frame);
    card.indices.forEach(index=>{
      const turbine=FARM.turbines[index];
      drawCloudMarker(cloudContext, cloudX(wind), cloudY(sampleTurbine(turbine, frame).powerShare*100), faultColor(turbine,frameIndex));
    });
  }

  function refreshReadouts(){
    if(selection.length===0) return;
    if(compareMode && selection.length>1){
      fillCompareRows();
      return;
    }
    const turbine=FARM.turbines[selection[0]];
    const sample=sampleTurbine(turbine, frame);
    const state=stateAt(turbine, frame);
    setHtml("roPow", `${Math.round(sample.powerShare*FARM.meta.rated_kw)} <small>kW</small>`);
    setHtml("roRot", `${sample.rotor.toFixed(1)} <small>rpm</small>`);
    setHtml("roYaw", `${Math.round(sample.yaw)}<small>&deg;</small>`);
    const status = state.fault===0 ? "healthy" : (state.fault===4 ? "two faults" : FAULT_NAMES[state.fault]);
    setHtml("roSt", `<span style="color:${state.color}">${status}</span>`);
    setText("spkNow", `${Math.round(state.intensity*100)}%`);
  }
  function fillCompareRows(){
    document.querySelectorAll("[data-compare-index]").forEach(row=>{
      const index=Number(row.dataset.compareIndex);
      const sample=sampleTurbine(FARM.turbines[index], frame);
      row.querySelector(".cmpPower").textContent=`${Math.round(sample.powerShare*FARM.meta.rated_kw)} kW`;
      row.querySelector(".cmpRotor").textContent=`${sample.rotor.toFixed(1)} rpm`;
      row.querySelector(".cmpYaw").textContent=`${Math.round(sample.yaw)}\u00b0`;
    });
  }

  function canvasPoint(event){
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener("mousemove", event=>{
    const point = canvasPoint(event);
    let hit=null;
    for(const node of turbineNodes){
      const target=node.hubHit;
      if(!target) continue;
      const dx=point.x-target.x, dy=point.y-target.y;
      if(dx*dx+dy*dy < target.radius*target.radius) hit=node;
    }
    if(hit){ canvas.style.cursor="pointer"; showTooltip(event, hit.turbine.name); }
    else { canvas.style.cursor="default"; hideTooltip(); }
  });
  canvas.addEventListener("click", event=>{
    const point = canvasPoint(event);
    for(const node of turbineNodes){
      const target=node.hubHit;
      if(!target) continue;
      const dx=point.x-target.x, dy=point.y-target.y;
      if(dx*dx+dy*dy < target.radius*target.radius){ toggleSelection(node.index); return; }
    }
  });

  const tooltip=byId("tip");
  function showTooltip(event,text){ tooltip.textContent=text; tooltip.style.left=event.clientX+"px"; tooltip.style.top=event.clientY+"px"; tooltip.style.opacity=1; }
  function hideTooltip(){ tooltip.style.opacity=0; }

  const playButton=byId("play");
  const ICON_PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  function setPlaying(value){ playing=value; playButton.innerHTML=value?ICON_PAUSE:ICON_PLAY; }
  playButton.addEventListener("click", ()=>setPlaying(!playing));

  document.querySelectorAll(".spd").forEach(button=>button.addEventListener("click", ()=>{
    speedMultiplier=parseFloat(button.dataset.s);
    document.querySelectorAll(".spd").forEach(other=>other.classList.toggle("on", other===button));
  }));

  const track=byId("track");
  const trackWrap=track.parentElement;
  let scrubbing=false;
  function scrubTo(clientX){
    const rect=track.getBoundingClientRect();
    frame=clamp((clientX-rect.left)/rect.width,0,1)*(frameCount-1);
  }
  trackWrap.addEventListener("pointerdown", event=>{ scrubbing=true; setPlaying(false); scrubTo(event.clientX); trackWrap.setPointerCapture(event.pointerId); });
  trackWrap.addEventListener("pointermove", event=>{ if(scrubbing) scrubTo(event.clientX); });
  trackWrap.addEventListener("pointerup", ()=>{ scrubbing=false; });
  trackWrap.addEventListener("pointercancel", ()=>{ scrubbing=false; });

  const monthsEl=byId("months");
  function buildMonths(){
    MONTH_NAMES.forEach((name,i)=>{
      const tick=document.createElement("div");
      tick.className="mtick";
      tick.style.left=(MONTH_START_DAY[i]-1)/365*100+"%";
      tick.textContent=name;
      monthsEl.appendChild(tick);
    });
    FARM.events.forEach(event=>{
      if(event.start==null) return;
      const color=familyColor(event.type);
      const marker=document.createElement("div");
      marker.className="ev";
      marker.style.left=(event.start/(frameCount-1))*100+"%";
      marker.style.background=color;
      marker.style.boxShadow=`0 0 6px ${withAlpha(color,0.8)}`;
      track.appendChild(marker);
    });
  }

  function paintLegend(){
    const makeSwatch=(id,draw)=>{
      const host=byId(id); host.innerHTML="";
      const swatch=document.createElement("canvas");
      swatch.width=swatch.height=22;
      draw(swatch.getContext("2d"));
      host.appendChild(swatch);
    };
    makeSwatch("lgSpin",g=>{
      g.strokeStyle=COLORS.text; g.lineWidth=1.4; g.lineCap="round";
      for(let blade=0;blade<3;blade++){ const angle=blade*2.09+0.4; g.beginPath(); g.moveTo(11,11); g.lineTo(11+Math.cos(angle)*8,11+Math.sin(angle)*8); g.stroke(); }
      g.fillStyle=COLORS.text; g.beginPath(); g.arc(11,11,2,0,TWO_PI); g.fill();
    });
    makeSwatch("lgHalo",g=>{
      const gradient=g.createRadialGradient(11,11,0,11,11,11);
      gradient.addColorStop(0, withAlpha(COLORS.green,0.9)); gradient.addColorStop(1, withAlpha(COLORS.green,0));
      g.fillStyle=gradient; g.fillRect(0,0,22,22);
    });
    makeSwatch("lgWarm",g=>{
      const gradient=g.createRadialGradient(11,11,0,11,11,11);
      gradient.addColorStop(0, withAlpha(COLORS.rose,0.95)); gradient.addColorStop(0.5, withAlpha(COLORS.amber,0.5)); gradient.addColorStop(1, withAlpha(COLORS.amber,0));
      g.fillStyle=gradient; g.fillRect(0,0,22,22);
    });
    makeSwatch("lgYaw",g=>{
      g.strokeStyle=COLORS.yaw; g.lineWidth=1.6; g.lineCap="round";
      g.save(); g.translate(11,11); g.rotate(0.5);
      for(let blade=0;blade<3;blade++){ const angle=blade*2.09; g.beginPath(); g.moveTo(0,0); g.lineTo(Math.cos(angle)*8*0.4, Math.sin(angle)*8); g.stroke(); }
      g.restore();
    });
    makeSwatch("lgPitch",g=>{
      g.strokeStyle=COLORS.blue; g.lineWidth=1.6; g.lineCap="round";
      for(let blade=0;blade<3;blade++){ const angle=blade*2.09+(blade===1?0.5:0); const length=blade===1?5:8; g.beginPath(); g.moveTo(11,11); g.lineTo(11+Math.cos(angle)*length,11+Math.sin(angle)*length); g.stroke(); }
    });
  }

  function refreshWindfieldTheme(){
    themeLight = document.documentElement.getAttribute("data-theme") !== "dark";
    loadColors();
    glowSpriteCache.clear();
    paintLegend();
    if(selection.length>0) updateSelectionUi();
  }

  document.addEventListener("click", event=>{
    if(!event.target.closest(".theme-toggle")) return;
    window.requestAnimationFrame(() => {
      refreshWindfieldTheme();
      resize();
    });
  });

  const themeObserver = new MutationObserver(() => {
    refreshWindfieldTheme();
    resize();
  });
  themeObserver.observe(document.documentElement, { attributes:true, attributeFilter:["data-theme"] });

  window.addEventListener("storage", event=>{
    if(event.key==="preferred-theme"){
      refreshWindfieldTheme();
      resize();
    }
  });

  window.addEventListener("keydown", event=>{
    if(event.code==="Space"){ event.preventDefault(); setPlaying(!playing); }
    else if(event.code==="ArrowRight"){ frame=Math.min(frameCount-1, frame + (event.shiftKey?40:8)); }
    else if(event.code==="ArrowLeft"){ frame=Math.max(0, frame - (event.shiftKey?40:8)); }
    else if(event.code==="KeyC"){ setCompareMode(!compareMode); }
  });

  refreshWindfieldTheme();
  resize();
  seedParticles();
  seedStars();
  buildMonths();
  setPlaying(true);
  selection=[0];
  updateSelectionUi();
  requestAnimationFrame(render);
  } catch(error) {
    showWindfieldError(error);
    console.error(error);
  }
})();

(function () {
    const canvas = document.getElementById('singularityCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy, R;

    function resize() {
        W = canvas.width = canvas.parentElement.clientWidth;
        H = canvas.height = canvas.parentElement.clientHeight;
        cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.115;
    }
    resize();
    window.addEventListener('resize', () => { resize(); buildNodes(); });

    const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
    const TD = [
        { n: 'HTML5', c: '#e34f26', s: BASE + 'html5/html5-original.svg' },
        { n: 'CSS3', c: '#1572b6', s: BASE + 'css3/css3-original.svg' },
        { n: 'JavaScript', c: '#f7df1e', s: BASE + 'javascript/javascript-original.svg' },
        { n: 'React', c: '#61dafb', s: BASE + 'react/react-original.svg' },
        { n: 'Tailwind', c: '#06b6d4', s: BASE + 'tailwindcss/tailwindcss-original.svg' },
        { n: 'Node.js', c: '#339933', s: BASE + 'nodejs/nodejs-original.svg' },
        { n: 'Express', c: '#aaaaaa', s: BASE + 'express/express-original.svg' },
        { n: 'Java', c: '#f89820', s: BASE + 'java/java-original.svg' },
        { n: 'Python', c: '#3776ab', s: BASE + 'python/python-original.svg' },
        { n: 'MongoDB', c: '#47a248', s: BASE + 'mongodb/mongodb-original.svg' },
        { n: 'MySQL', c: '#4479a1', s: BASE + 'mysql/mysql-original.svg' },
        { n: 'Git', c: '#f05032', s: BASE + 'git/git-original.svg' },
        { n: 'GitHub', c: '#e0e0e0', s: BASE + 'github/github-original.svg' },
        { n: 'Linux', c: '#fcc624', s: BASE + 'linux/linux-original.svg' },
        { n: 'C', c: '#a8b9cc', s: BASE + 'c/c-original.svg' },
        { n: 'Socket.io', c: '#a78bfa', s: null },
        { n: 'ML', c: '#ff9500', s: null },
        { n: 'IoT', c: '#00d4aa', s: null },
        { n: 'MERN', c: '#764abc', s: null },
        { n: 'OOP', c: '#ec4899', s: null },
        { n: 'DSA', c: '#f97316', s: null },
        { n: 'REST API', c: '#ff6b6b', s: null },
    ];
    TD.forEach(t => { if (t.s) { t.img = new Image(); t.img.crossOrigin = 'anonymous'; t.img.src = t.s; } });

    let nodes = [], tick = 0;
    function buildNodes() {
        nodes = TD.map((t, i) => {
            const ring = i % 3, slot = Math.floor(i / 3), per = Math.ceil(TD.length / 3);
            const maxR = R * (2.4 + ring * 1.25) + Math.random() * 25;
            return {
                ...t, angle: (slot / per) * Math.PI * 2 + ring * 1.2, r: maxR, maxR,
                dir: ring % 2 ? -1 : 1, os: .003 + Math.random() * .003,
                sr: .0004 + Math.random() * .0002, ns: Math.min(W, H) * .038 + Math.random() * 5,
                ph: Math.random() * Math.PI * 2, ab: false, at: 1
            };
        });
    }
    buildNodes();

    const DISK = Array.from({ length: 400 }, () => ({ a: Math.random() * Math.PI * 2, r: R * .93 + Math.random() * R * 1.7, sp: .009 + Math.random() * .022, sz: Math.random() * 1.9 + .2, h: 230 + Math.random() * 90, b: 55 + Math.random() * 40, o: .35 + Math.random() * .65 }));
    const STARS = Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5, tw: Math.random() * Math.PI * 2, sp: .003 + Math.random() * .009 }));
    const FX = [];

    function bg() { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .75); g.addColorStop(0, 'rgba(18,5,45,1)'); g.addColorStop(.5, 'rgba(8,2,22,1)'); g.addColorStop(1, 'rgba(2,1,8,1)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    function stars() { STARS.forEach(s => { s.tw += s.sp; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${.1 + Math.abs(Math.sin(s.tw)) * .8})`; ctx.fill(); }); }
    function hole() {
        for (let i = 0; i < 4; i++) { const g = ctx.createRadialGradient(cx, cy, R, cx, cy, R * (2.8 + i)); g.addColorStop(0, `rgba(110,35,255,${(.18 - i * .03) * (.75 + Math.sin(tick * .45) * .25)})`); g.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(cx, cy, R * (2.8 + i), 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); }
        for (let r = 0; r < 6; r++) { const r1 = R * (1.03 + r * .21), r2 = R * (1.22 + r * .23), al = (0.52 - r * .06) * (.8 + Math.sin(tick + r) * .2); ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .26); const dg = ctx.createRadialGradient(0, 0, r1, 0, 0, r2 + 14); dg.addColorStop(0, `hsla(${220 + r * 18},80%,82%,${al})`); dg.addColorStop(.5, `hsla(${250 + r * 15},75%,65%,${al * .7})`); dg.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(0, 0, r2 + 14, 0, Math.PI * 2); ctx.arc(0, 0, r1, 0, Math.PI * 2, true); ctx.fillStyle = dg; ctx.fill(); ctx.restore(); }
        ctx.save(); ctx.shadowBlur = 55; ctx.shadowColor = `rgba(190,120,255,${.7 + Math.sin(tick * 1.4) * .3})`; ctx.strokeStyle = `rgba(210,140,255,${.6 + Math.sin(tick * 1.4) * .2})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R * 1.015, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        const bh = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); bh.addColorStop(0, 'rgba(0,0,0,1)'); bh.addColorStop(.83, 'rgba(0,0,0,1)'); bh.addColorStop(.94, 'rgba(12,4,42,.97)'); bh.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = bh; ctx.fill();
    }
    function disk() { DISK.forEach(p => { p.a += p.sp; const px = cx + Math.cos(p.a) * p.r, py = cy + Math.sin(p.a) * p.r * .27; const d = Math.hypot(px - cx, (py - cy) / .27); const fade = Math.min(1, Math.max(0, (d - R * .88) / (R * .55))); ctx.beginPath(); ctx.arc(px, py, p.sz, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.h},70%,${p.b}%,${p.o * fade})`; ctx.fill(); }); }
    function spiral() { for (let arm = 0; arm < 2; arm++) { ctx.beginPath(); for (let i = 0; i < 260; i++) { const f = i / 260, a = f * Math.PI * 3.2 + tick * .14 + arm * Math.PI, r = R * 1.04 + f * R * 4; const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * .29; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = `rgba(130,55,255,${.07 + Math.sin(tick * .4 + arm) * .035})`; ctx.lineWidth = 1.8; ctx.stroke(); } }
    function effects() { for (let i = FX.length - 1; i >= 0; i--) { const f = FX[i]; f.l -= .045; if (f.l <= 0) { FX.splice(i, 1); continue; } const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * f.l); g.addColorStop(0, `rgba(255,255,255,${f.l})`); g.addColorStop(.4, `rgba(180,110,255,${f.l * .7})`); g.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(f.x, f.y, f.r * f.l, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); } }
    function nodeDraw() {
        nodes.forEach(nd => {
            if (!nd.ab) { nd.angle += nd.os * nd.dir; nd.r -= nd.sr * (nd.r * .004 + .08); if (nd.r < R * 1.3) { nd.ab = true; nd.at = 1; } }
            else { nd.at -= .05; nd.r = Math.max(R * .9, nd.r - 1.2); if (nd.at <= 0) { FX.push({ x: cx + Math.cos(nd.angle) * nd.r, y: cy + Math.sin(nd.angle) * nd.r * .65, r: 50, l: 1 }); nd.r = nd.maxR + Math.random() * 35; nd.angle = Math.random() * Math.PI * 2; nd.ab = false; nd.at = 1; } }
            const nr = nd.r + Math.sin(tick * .85 + nd.ph) * 7, nx = cx + Math.cos(nd.angle) * nr, ny = cy + Math.sin(nd.angle) * nr * .65;
            if (Math.hypot(nx - cx, ny - cy) < R * .82) return;
            const sc = nd.ab ? Math.max(.05, nd.at) : 1, ns = nd.ns * sc;
            ctx.save(); ctx.globalAlpha = (ny > cy + R * .12 ? .52 : 1) * sc; ctx.shadowBlur = 22; ctx.shadowColor = nd.c;
            const gl = ctx.createRadialGradient(nx, ny, 0, nx, ny, ns * 1.6); gl.addColorStop(0, nd.c + 'aa'); gl.addColorStop(.5, nd.c + '33'); gl.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(nx, ny, ns * 1.6, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();
            const ok = nd.img && nd.img.complete && nd.img.naturalWidth > 0;
            if (ok) { ctx.beginPath(); ctx.arc(nx, ny, ns * .88, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(nd.img, nx - ns * .88, ny - ns * .88, ns * 1.76, ns * 1.76); }
            else { ctx.beginPath(); ctx.arc(nx, ny, ns * .72, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,.78)'; ctx.fill(); ctx.strokeStyle = nd.c + 'cc'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.font = `600 ${Math.max(8, Math.round(ns * .4))}px 'Space Grotesk',sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.shadowBlur = 0; ctx.fillText(nd.n, nx, ny); }
            ctx.restore();
        });
    }
    function loop() { ctx.clearRect(0, 0, W, H); tick += .016; bg(); stars(); spiral(); disk(); hole(); effects(); nodeDraw(); requestAnimationFrame(loop); }
    loop();

    // ── Interstellar — Cornfield Chase Piano ──
    let AC = null, MG = null, REV = null, on = false, seqId = null;
    const B = 60 / 66; // BPM 66

    // Cornfield Chase melody [Hz, beats]
    const MELODY = [
        [329.63, 1], [392, .5], [440, 1.5], [523.25, 1], [493.88, .5], [440, 1], [392, 1], [329.63, 2],
        [293.66, .5], [329.63, .5], [392, 1], [440, 2], [392, 1], [329.63, 2], [293.66, 4],
        [329.63, 1], [392, .5], [440, 1.5], [523.25, 1], [493.88, .5], [440, 1], [392, 1], [440, 1],
        [392, 1], [329.63, 2], [349.23, 1], [329.63, 1], [293.66, 4],
        [440, 1], [523.25, .5], [659.25, 1.5], [783.99, 1], [698.46, .5], [659.25, 1], [587.33, 1], [523.25, 1],
        [493.88, 1], [440, 2], [392, 1], [440, 1], [493.88, 1], [523.25, 2], [493.88, 2], [440, 4],
    ];
    // Left hand bass Am-C-G-F
    const BASS = [[110, 4], [130.81, 4], [98, 4], [87.31, 4], [110, 4], [130.81, 4], [98, 4], [87.31, 4], [110, 4], [130.81, 4], [98, 4], [87.31, 4], [110, 8], [87.31, 8]];

    function mkRev() { const cv = AC.createConvolver(), len = AC.sampleRate * 5, buf = AC.createBuffer(2, len, AC.sampleRate); for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++)d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6); } cv.buffer = buf; return cv; }

    function pNote(freq, t0, beats, vol = 0.4) {
        const dur = beats * B, atk = .008, dec = .35, sus = .18, rel = Math.max(dur * .6, .3);
        [[freq, vol], [freq * 2, vol * .22], [freq * 3, vol * .09], [freq * .5, vol * .12]].forEach(([f, v]) => {
            const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + atk);
            g.gain.exponentialRampToValueAtTime(v * sus, t0 + atk + dec); g.gain.setValueAtTime(v * sus, t0 + dur - rel);
            g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
            o.connect(g); g.connect(REV); g.connect(MG); o.start(t0); o.stop(t0 + dur + .1);
        });
    }
    function bNote(freq, t0, beats) {
        const dur = beats * B, o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(), lp = AC.createBiquadFilter();
        o.type = 'sine'; o.frequency.value = freq; o2.type = 'sine'; o2.frequency.value = freq * 2; lp.type = 'lowpass'; lp.frequency.value = 280;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.13, t0 + .04); g.gain.setValueAtTime(.08, t0 + dur - .5); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
        [o, o2].forEach(x => { x.connect(lp); lp.connect(g); }); g.connect(REV); g.connect(MG);
        o.start(t0); o2.start(t0); o.stop(t0 + dur); o2.stop(t0 + dur);
    }
    function sched() {
        let t = AC.currentTime + .1;
        MELODY.forEach(([f, b]) => { pNote(f, t, b); t += b * B; });
        let bt = AC.currentTime + .1;
        BASS.forEach(([f, b]) => { bNote(f, bt, b); bt += b * B; });
        const tot = MELODY.reduce((s, [, b]) => s + b, 0) * B;
        seqId = setTimeout(sched, (tot - .5) * 1000);
    }
    function startPiano() {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        MG = AC.createGain(); MG.gain.value = 0; MG.connect(AC.destination);
        REV = mkRev(); REV.connect(MG);
        const dly = AC.createDelay(.3); dly.delayTime.value = .18;
        const dfb = AC.createGain(); dfb.gain.value = .12;
        REV.connect(dly); dly.connect(dfb); dfb.connect(dly); dfb.connect(MG);
        MG.gain.setTargetAtTime(.55, AC.currentTime, 1.2);
        sched(); on = true;
    }
    function stopPiano() {
        if (!MG) return; clearTimeout(seqId);
        MG.gain.setTargetAtTime(0, AC.currentTime, .8);
        setTimeout(() => { if (AC) { AC.close(); AC = null; } }, 2000); on = false;
    }
    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.innerHTML = "<i class='bx bx-music'></i><span>Interstellar Piano ♫</span>";
        btn.addEventListener('click', () => {
            if (!on) { startPiano(); btn.innerHTML = "<i class='bx bx-music'></i><span>Playing ♫</span>"; btn.classList.add('active'); }
            else { stopPiano(); btn.innerHTML = "<i class='bx bx-music'></i><span>Interstellar Piano ♫</span>"; btn.classList.remove('active'); }
        });
    }
})();

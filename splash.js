(function () {
    const splash = document.getElementById('splash');
    if (!splash) return;
    const cv = document.getElementById('splashCanvas');
    const ctx = cv.getContext('2d');
    let W, H, bhR = 0, growing = false, entered = false, t = 0;

    function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    // Stars for splash bg
    const stars = Array.from({ length: 180 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4, tw: Math.random() * Math.PI * 2, sp: .004 + Math.random() * .008 }));

    function drawSplash() {
        ctx.clearRect(0, 0, W, H);
        // Deep purple-teal gradient bg
        const bg = ctx.createRadialGradient(W * .3, H * .4, 0, W * .6, H * .6, Math.max(W, H));
        bg.addColorStop(0, 'rgba(40,10,80,1)'); bg.addColorStop(.5, 'rgba(10,5,40,1)'); bg.addColorStop(1, 'rgba(5,20,40,1)');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // Stars
        stars.forEach(s => { s.tw += s.sp; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${.1 + Math.abs(Math.sin(s.tw)) * .7})`; ctx.fill(); });

        const cx = W / 2, cy = H * .42;
        // Growing black hole effect
        const r = growing ? Math.min(bhR, Math.max(W, H) * 1.5) : Math.min(60 + Math.sin(t * .8) * 4, 64);

        if (growing) {
            // Expanding white flash then black
            const exp = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            exp.addColorStop(0, 'rgba(255,255,255,1)');
            exp.addColorStop(.1, 'rgba(180,100,255,0.9)');
            exp.addColorStop(.5, 'rgba(0,0,0,.95)');
            exp.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = exp; ctx.fill();
            if (r >= Math.max(W, H) * 1.5 && !entered) { entered = true; hideSplash(); }
        } else {
            // Outer purple aura glow
            const aura = ctx.createRadialGradient(cx, cy, r * .5, cx, cy, r * 4);
            aura.addColorStop(0, `rgba(80,30,200,${.2 + Math.sin(t * .6) * .08})`);
            aura.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(cx, cy, r * 4, 0, Math.PI * 2); ctx.fillStyle = aura; ctx.fill();
            // Lensing ring
            ctx.save(); ctx.shadowBlur = 40; ctx.shadowColor = `rgba(100,200,255,${.7 + Math.sin(t * 1.2) * .3})`;
            ctx.strokeStyle = `rgba(120,210,255,${.5 + Math.sin(t * 1.2) * .2})`; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
            // Black hole body
            const bh = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            bh.addColorStop(0, 'rgba(0,0,0,1)'); bh.addColorStop(.8, 'rgba(0,0,0,1)');
            bh.addColorStop(.93, 'rgba(20,8,60,.95)'); bh.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = bh; ctx.fill();
        }
        t += .016;
        if (growing) bhR += bhR < 80 ? 3 : bhR < 300 ? 8 : 30;
        requestAnimationFrame(drawSplash);
    }
    drawSplash();

    // Typewriter for heading
    const heading = document.getElementById('splashHeading');
    const full = 'Macrocosm';
    let ci2 = 0;
    function typeHeading() { if (heading && ci2 <= full.length) { heading.innerHTML = `Initializing <span>${full.substring(0, ci2)}</span><span class="cursor2">|</span>`; ci2++; setTimeout(typeHeading, 90); } }
    setTimeout(typeHeading, 400);

    // Enter button
    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) enterBtn.addEventListener('click', () => {
        if (growing) return;
        playWhoosh();
        enterBtn.style.transform = 'scale(1.15)';
        enterBtn.style.opacity = '0';
        growing = true; bhR = 64;
    });

    function hideSplash() {
        splash.style.transition = 'opacity .6s ease';
        splash.style.opacity = '0';
        setTimeout(() => { splash.style.display = 'none'; }, 700);
    }

    function playWhoosh() {
        try {
            const AC = new (window.AudioContext || window.webkitAudioContext)();
            const mg = AC.createGain(); mg.gain.value = .5; mg.connect(AC.destination);
            // Deep swoosh
            [{ f: 80, g: .4, t: 'sine' }, { f: 40, g: .3, t: 'sine' }, { f: 120, g: .2, t: 'triangle' }].forEach(h => {
                const o = AC.createOscillator(), g = AC.createGain();
                o.type = h.t; o.frequency.setValueAtTime(h.f * 3, AC.currentTime);
                o.frequency.exponentialRampToValueAtTime(h.f * .2, AC.currentTime + 1.5);
                g.gain.setValueAtTime(h.g, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + 1.8);
                o.connect(g); g.connect(mg); o.start(); o.stop(AC.currentTime + 2);
            });
            // White noise burst
            const buf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate), d = buf.getChannelData(0);
            for (let i = 0; i < d.length; i++)d[i] = Math.random() * 2 - 1;
            const ns = AC.createBufferSource(); ns.buffer = buf;
            const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 200;
            const ng = AC.createGain(); ng.gain.setValueAtTime(.15, AC.currentTime); ng.gain.exponentialRampToValueAtTime(.001, AC.currentTime + 1.5);
            ns.connect(lp); lp.connect(ng); ng.connect(mg); ns.start();
        } catch (e) { }
    }
})();

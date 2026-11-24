/* ADN Developer — Animações otimizadas para Desktop, Notebook e Mobile */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const R = document.documentElement;
  const raf = requestAnimationFrame;

  const calm = () =>
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    R.classList.contains('nm');

  const start = !calm();
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => innerWidth < 768;
  const ease = t => 1 - Math.pow(1 - t, 3);

  if (start) R.classList.add('anim');

  const set = (s, c) => $$(s).forEach(e => e.classList.add(c));

  /* Ordem de entrada escalonada (stagger) */
  $$('.sv, .pj, .dl, .gl, .ps4, .sg').forEach(p =>
    [...p.children].forEach((c, i) => c.style.setProperty('--i', i))
  );

  /* Direções de entrada apenas em telas maiores para evitar overflow horizontal no mobile */
  if (!isMobile()) {
    set('.dg > .rv:first-child, .ct > .rv:first-child', 'rv-l');
    set('.dv, .cta2', 'rv-r');
  }
  set('.sg > .rv', 'rv-z');

  $('#orcamento .cta .btn.p')?.classList.add('pulse');
  $$('.card svg *, .dl svg *').forEach(e => e.setAttribute('pathLength', 1));

  /* Títulos palavra por palavra */
  function split(el) {
    if (!el) return;
    let i = 0;
    el.setAttribute('aria-label', el.textContent.trim());
    (function walk(node) {
      [...node.childNodes].forEach(c => {
        if (c.nodeType !== 3) return walk(c);
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const wrap = document.createElement('span');
          const inner = document.createElement('span');
          wrap.className = 'w';
          wrap.setAttribute('aria-hidden', 'true');
          inner.className = 'wi';
          inner.textContent = part;
          inner.style.setProperty('--i', i++);
          wrap.append(inner);
          frag.append(wrap);
        });
        c.replaceWith(frag);
      });
    })(el);
  }

  if (start) {
    const sio = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('sp-in');
            sio.unobserve(e.target);
          }
        }),
      { threshold: 0.25 }
    );
    $$('main h2').forEach(h => {
      split(h);
      sio.observe(h);
    });
    split($('h1'));
  }

  /* Preloader fluido → entrada do Hero */
  const pre = $('#pre');
  const bar = $('#pre i');
  const go = () => {
    $('.hero')?.classList.add('in');
    $('h1')?.classList.add('sp-in');
  };

  if (!start || !pre) {
    pre?.remove();
    go();
  } else {
    const t0 = performance.now();
    (function tick() {
      const elapsed = performance.now() - t0;
      const ok = document.readyState === 'complete';
      const duration = isMobile() ? 750 : 950;
      bar?.style.setProperty('--p', Math.min(elapsed / duration, ok ? 1 : 0.92));

      if ((ok && elapsed > duration) || elapsed > 3200) {
        pre.classList.add('out');
        setTimeout(() => pre.remove(), 950);
        setTimeout(go, 320);
      } else {
        raf(tick);
      }
    })();
  }

  /* Palavra digitada (Typewriter) */
  const rw = $('.rot-w');
  if (rw) {
    const words = [
      'restaurantes',
      'barbearias',
      'escritórios de arquitetura',
      'lojas e comércios',
      'profissionais autônomos'
    ];
    let wi = 0, ci = 0, del = false;

    if (!start) {
      rw.textContent = 'negócios de todo tipo';
    } else {
      (function type() {
        if (calm()) {
          rw.textContent = 'negócios de todo tipo';
          return;
        }
        const word = words[wi];
        ci += del ? -1 : 1;
        rw.textContent = word.slice(0, ci);

        let delay = del ? 32 : 65;
        if (!del && ci === word.length) {
          del = true;
          delay = 1500;
        } else if (del && ci === 0) {
          del = false;
          wi = (wi + 1) % words.length;
          delay = 300;
        }
        setTimeout(type, delay);
      })();
    }
  }

  /* Partículas otimizadas no Hero (menor densidade no mobile) */
  const cv = $('#fx');
  const hero = $('.hero');
  if (cv && hero && start) {
    const ctx = cv.getContext('2d');
    const mouse = { x: -999, y: -999 };
    let W = 0, H = 0, P = [], vis = true;

    const getCols = () =>
      ['--g1', '--g2', '--g3'].map(v =>
        getComputedStyle(R).getPropertyValue(v).trim()
      );
    let C = getCols();
    new MutationObserver(() => (C = getCols())).observe(R, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const maxParticles = isMobile() ? 24 : 58;
      const density = isMobile() ? 24000 : 18000;
      const count = Math.min(maxParticles, Math.max(14, Math.round((W * H) / density)));

      P = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 1.4 + Math.random() * 1.8,
        c: i % 3
      }));
    };

    resize();
    let resizeTimer;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    if (finePointer) {
      hero.addEventListener('pointermove', e => {
        const b = cv.getBoundingClientRect();
        mouse.x = e.clientX - b.left;
        mouse.y = e.clientY - b.top;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => (mouse.x = -999));
    }

    new IntersectionObserver(e => (vis = e[0].isIntersecting)).observe(hero);

    const linkDist = isMobile() ? 95 : 120;
    (function loop() {
      raf(loop);
      if (!vis || document.hidden || calm()) return;
      ctx.clearRect(0, 0, W, H);

      for (const p of P) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        if (finePointer && mouse.x > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 130) {
            p.x += (dx / d) * 1.4;
            p.y += (dy / d) * 1.4;
          }
        }

        ctx.globalAlpha = 0.65;
        ctx.fillStyle = C[p.c];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const a = P[i], b = P[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            ctx.globalAlpha = (1 - d / linkDist) * 0.3;
            ctx.strokeStyle = C[a.c];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    })();
  }

  /* Mockup do Hero acompanha o mouse (apenas desktop/notebook com mouse) */
  const st = $('.stage');
  if (st && hero && start && finePointer) {
    hero.addEventListener('pointermove', e => {
      if (calm()) return;
      st.style.setProperty('--ry', ((e.clientX / innerWidth - 0.5) * 12).toFixed(2) + 'deg');
      st.style.setProperty('--rx', ((0.5 - e.clientY / innerHeight) * 9).toFixed(2) + 'deg');
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      st.style.setProperty('--rx', '0deg');
      st.style.setProperty('--ry', '0deg');
    });
  }

  /* Barra de progresso + Botão WhatsApp */
  const pg = $('#prog');
  const wa = $('#wa');
  const wl = $('[data-wa]');
  if (wl && wa) wa.href = wl.href;

  addEventListener('scroll', () => {
    const maxScroll = R.scrollHeight - innerHeight;
    pg?.style.setProperty('--s', maxScroll > 0 ? scrollY / maxScroll : 0);
    wa?.classList.toggle('on', scrollY > 450);
  }, { passive: true });

  /* Contadores numéricos */
  const cio = new IntersectionObserver(
    entries =>
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const n = +el.dataset.n;
        const s = el.dataset.s || '';
        cio.unobserve(el);
        if (!start) {
          el.textContent = n + s;
          return;
        }
        const t0 = performance.now();
        (function count(t) {
          const k = Math.min(1, (t - t0) / 1400);
          el.textContent = Math.round(n * ease(k)) + s;
          if (k < 1) raf(count);
        })(t0);
      }),
    { threshold: 0.5 }
  );
  $$('[data-n]').forEach(e => {
    if (start) e.textContent = '0';
    cio.observe(e);
  });

  /* Tilt 3D + Brilho radial imediato (sem delay travado) */
  if (finePointer) {
    $$('.pc, .card, .gt').forEach(el => {
      el.classList.add('tl3');
      el.addEventListener('pointermove', e => {
        const b = el.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        if (calm()) return;
        el.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
      }, { passive: true });

      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* Botões magnéticos (mouse) + Ondas ao clicar (todos dispositivos) */
  if (finePointer) {
    $$('.btn.p, .cta .btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        if (calm()) return;
        const r = b.getBoundingClientRect();
        const tx = ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1);
        const ty = ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1);
        b.style.translate = `${tx}px ${ty}px`;
      }, { passive: true });
      b.addEventListener('pointerleave', () => (b.style.translate = ''));
    });
  }

  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn, .db');
    if (!b || calm()) return;
    const r = b.getBoundingClientRect();
    const s = Math.max(r.width, r.height) / 2;
    const rip = document.createElement('i');
    rip.className = 'rip';
    rip.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.append(rip);
    setTimeout(() => rip.remove(), 620);
  });

  /* Cursor personalizado com rastro suave (apenas desktop/notebook com mouse) */
  const cu = $('#cur');
  if (cu && start && finePointer) {
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false;
    addEventListener('pointermove', e => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        cx = tx;
        cy = ty;
        active = true;
      }
      cu.classList.add('on');
      cu.classList.toggle('h', !!e.target.closest('a, button, input, select, textarea, label'));
    }, { passive: true });

    R.addEventListener('pointerleave', () => cu.classList.remove('on'));

    (function follow() {
      raf(follow);
      if (!active || calm()) return;
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cu.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    })();
  }

  /* Menu de exemplo alterna sozinho */
  $$('.mn').forEach(m => {
    const btns = [...m.children];
    const pick = x => {
      btns.forEach(y => y.classList.remove('on'));
      x.classList.add('on');
    };
    let i = 0;
    btns.forEach(x =>
      x.addEventListener('click', () => {
        pick(x);
        i = btns.indexOf(x);
      })
    );
    setInterval(() => {
      if (!calm() && !m.matches(':hover')) {
        i = (i + 1) % btns.length;
        pick(btns[i]);
      }
    }, 1900);
  });

  /* Confete quando a mensagem do formulário é gerada */
  const res = $('#res');
  function boom() {
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:400';
    c.width = innerWidth;
    c.height = innerHeight;
    document.body.append(c);
    const x = c.getContext('2d');
    const P = Array.from({ length: isMobile() ? 65 : 110 }, () => ({
      x: c.width / 2,
      y: c.height * 0.6,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 15 - 4,
      s: 4 + Math.random() * 6,
      r: Math.random() * 6,
      c: `hsl(${Math.random() * 80 + 300}, 80%, 65%)`
    }));
    let n = 0;
    (function frame() {
      x.clearRect(0, 0, c.width, c.height);
      P.forEach(p => {
        p.vy += 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.r += 0.2;
        x.save();
        x.translate(p.x, p.y);
        x.rotate(p.r);
        x.fillStyle = p.c;
        x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        x.restore();
      });
      ++n < 125 ? raf(frame) : c.remove();
    })();
  }

  if (res && start) {
    new MutationObserver(() => {
      if (/^Tudo certo/.test(res.textContent.trim())) boom();
    }).observe(res, { childList: true });
  }
})();
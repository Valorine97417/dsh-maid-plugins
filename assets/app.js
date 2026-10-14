/* 小困插件工坊 · 交互层
   进度条 / 顶栏收缩 / 打字机 / 数字滚动 / 卡片光标 / 筛选 / 复制
   灯箱（翻页+键盘）/ 终端演示 / 小困浮标 / 滚动揭示 */
(function () {
  'use strict';

  document.body.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 滚动进度 + 顶栏收缩 + 导航高亮 ── */
  var progress = document.getElementById('progress');
  var topBar = document.getElementById('top-bar');
  var navLinks = [].slice.call(document.querySelectorAll('#nav a'));
  var secIds = navLinks.map(function (a) { return a.getAttribute('data-sec'); });

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    topBar.classList.toggle('small', y > 40);

    var cur = '';
    secIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) cur = id;
    });
    navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-sec') === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 平滑跳转按钮 ── */
  [].forEach.call(document.querySelectorAll('[data-go]'), function (btn) {
    btn.addEventListener('click', function () {
      var t = document.getElementById(btn.getAttribute('data-go'));
      if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ── 首屏打字机 ── */
  var tw = document.getElementById('tw');
  var caret = document.getElementById('caret');
  if (tw) {
    var L1 = '装一个包，';
    var L2 = '走到哪都是小困。';
    if (reduce) {
      if (caret) caret.classList.add('off');
    } else {
      tw.textContent = '';
      var i = 0, total = L1.length + L2.length;
      var timer = setInterval(function () {
        i++;
        var a = L1.slice(0, Math.min(i, L1.length));
        var b = i > L1.length ? L2.slice(0, i - L1.length).replace('小困', '<em>小困</em>') : '';
        tw.innerHTML = a + (b || i > L1.length ? '<br>' + b : '');
        if (i >= total) {
          clearInterval(timer);
          tw.innerHTML = '装一个包，<br>走到哪都是<em>小困</em>。';
        }
      }, 92);
    }
  }

  /* ── 数字滚动 ── */
  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = to + suffix; return; }
    var t0 = null, dur = 1100;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── 滚动揭示（同时触发数字滚动、分节金线） ── */
  var revealed = false;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.id === 'stats' && !revealed) {
          revealed = true;
          [].forEach.call(en.target.querySelectorAll('[data-to]'), countUp);
        }
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    [].forEach.call(document.querySelectorAll('.reveal, .sec-head'), function (el) { io.observe(el); });
  } else {
    [].forEach.call(document.querySelectorAll('.reveal, .sec-head'), function (el) { el.classList.add('in'); });
    [].forEach.call(document.querySelectorAll('[data-to]'), countUp);
  }

  /* ── 卡片跟随光标的金光 ── */
  [].forEach.call(document.querySelectorAll('.pcard'), function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ── Hero 截图轻微视差 ── */
  var frame = document.getElementById('heroFrame');
  var glow = document.getElementById('glow');
  if (frame && !reduce) {
    window.addEventListener('mousemove', function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5);
      var cy = (e.clientY / window.innerHeight - 0.5);
      frame.style.transform = 'perspective(900px) rotateY(' + (cx * 4).toFixed(2) + 'deg) rotateX(' + (-cy * 3).toFixed(2) + 'deg)';
      if (glow) { glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; document.body.classList.add('cursor-on'); }
    });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-on'); });
  }

  /* ── 分类筛选 ── */
  var chips = document.querySelectorAll('#filters .chip');
  var cards = document.querySelectorAll('#grid .pcard');

  [].forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-cat');
      [].forEach.call(chips, function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      var shown = 0;
      [].forEach.call(cards, function (card) {
        var hit = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('hide', !hit);
        if (hit) shown++;
      });
      var head = document.querySelector('#plugins .sec-head p');
      if (head) head.textContent = cat === 'all' ? '七个包，各管一摊' : '筛出 ' + shown + ' 个';
    });
  });

  /* ── 复制命令 ── */
  [].forEach.call(document.querySelectorAll('.copy'), function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.parentNode.querySelector('code');
      if (!code) return;
      var text = code.textContent.trim();
      var done = function () {
        btn.textContent = '已复制';
        btn.classList.add('ok');
        setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('ok'); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
  });

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  /* ── 灯箱（含翻页） ── */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbCnt = document.getElementById('lbCnt');
  var items = [].slice.call(document.querySelectorAll('.gitem'));
  var idx = -1;

  function show(i) {
    if (!items.length) return;
    idx = (i + items.length) % items.length;
    var item = items[idx];
    var img = item.querySelector('img');
    var cap = item.querySelector('.gcap');
    lbImg.src = item.getAttribute('data-full') || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent.trim() : '';
    lbCnt.textContent = (idx + 1) + ' / ' + items.length;
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () {
      show(i);
      lb.classList.add('on');
    });
  });

  function closeLb() { lb.classList.remove('on'); lbImg.src = ''; }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* ── 工坊终端（演示输出，不是真的执行） ── */
  var body = document.getElementById('termBody');
  var S = {
    version: [
      { t: '$ dsh --version', c: 'cmdline' },
      { t: 'deepseek-harness 0.1.7 (desktop)', c: 'hi' },
      { t: 'node v24.21.0 · profile desktop · 插件 7 个', c: 'dim' }
    ],
    list: [
      { t: '$ dsh plugin list', c: 'cmdline' },
      { t: 'dsh-maid-preset    v0.7.3   女仆预设 + 全局人设 + 内置记忆', c: '' },
      { t: 'dsh-maid-vcp       v0.6.10  VCP 视觉通感渲染', c: '' },
      { t: 'dsh-maid-scenery   v0.2.2   深海女仆工坊（皮肤）', c: '' },
      { t: 'dsh-maid-comfyui   v0.5.4   ComfyUI 驱动', c: '' },
      { t: 'dsh-maid-tts-fix   v0.2.0   朗读维护层', c: '' },
      { t: 'dsh-maid-patch-kit v0.1.0   社区插件维护补丁', c: '' },
      { t: 'dsh-maid-lane-fix  v0.2.0   免费车道中间层', c: '' },
      { t: '7 个插件，全部就绪。', c: 'hi' }
    ],
    add: [
      { t: '$ dsh plugin --profile desktop add github:Valorine97417/dsh-maid-preset', c: 'cmdline' },
      { t: '→ 解析 github:Valorine97417/dsh-maid-preset', c: 'dim' },
      { t: '→ 下载 · 校验 · 写入 profile bundles', c: 'dim' },
      { t: '✓ dsh-maid-preset 已装好，重启 DSH 生效。', c: 'hi' },
      { t: '  人设、记忆、maid 预设随包落地。', c: 'dim' }
    ]
  };

  var typing = false;
  function typeLine(entry, cb) {
    var p = document.createElement('p');
    p.className = 'ln ' + entry.c;
    body.appendChild(p);
    if (reduce) { p.textContent = entry.t; cb(); return; }
    var i = 0;
    var cur = document.createElement('span');
    cur.className = 'tcur';
    p.appendChild(cur);
    var tm = setInterval(function () {
      i++;
      p.textContent = entry.t.slice(0, i);
      p.appendChild(cur);
      body.scrollTop = body.scrollHeight;
      if (i >= entry.t.length) { clearInterval(tm); cur.remove(); cb(); }
    }, 11);
  }

  function runCmd(key) {
    if (typing) return;
    if (key === 'clear') { body.innerHTML = ''; return; }
    var lines = S[key];
    if (!lines) return;
    typing = true;
    var i = 0;
    (function next() {
      if (i >= lines.length) { typing = false; return; }
      typeLine(lines[i++], next);
    })();
  }

  [].forEach.call(document.querySelectorAll('#termCmds .tbtn'), function (b) {
    b.addEventListener('click', function () { runCmd(b.getAttribute('data-cmd')); });
  });

  if (body) {
    body.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'ln dim';
    p.textContent = '小困的工坊终端 · 点下面的命令看演示输出。';
    body.appendChild(p);
  }

  /* ── 小困浮标 ── */
  var pet = document.getElementById('pet');
  var bubble = document.getElementById('bubble');
  var tips = [
    '这站是小困自己写的，纯静态，不挂 CDN。',
    '想装哪个？卡片上有命令，点「复制」就带走。',
    '画廊里的图都是真机截图，点开能看大图。',
    '嫌闷的话……上面那个终端，点一下试试。',
    'VCP 那套卡片渲染，就是小困平时给你画图的家伙。',
    '全套七个包，换台电脑重跑一遍命令就回来了。'
  ];
  var ti = 0, hideTimer = null;
  if (pet && bubble) {
    pet.addEventListener('click', function () {
      bubble.textContent = tips[ti++ % tips.length];
      bubble.classList.add('on');
      pet.classList.remove('jump');
      void pet.offsetWidth;
      pet.classList.add('jump');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { bubble.classList.remove('on'); }, 4200);
    });
  }
})();

/* 小困插件工坊 · 交互 */
(function () {
  'use strict';

  /* ── 分类筛选 ── */
  var chips = document.querySelectorAll('#filters .chip');
  var cards = document.querySelectorAll('#grid .pcard');

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-cat');
      Array.prototype.forEach.call(chips, function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      Array.prototype.forEach.call(cards, function (card) {
        var hit = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.style.display = hit ? '' : 'none';
      });
    });
  });

  /* ── 复制命令 ── */
  Array.prototype.forEach.call(document.querySelectorAll('.copy'), function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.parentNode.querySelector('code');
      if (!code) return;
      var text = code.textContent.trim();
      var done = function () {
        btn.textContent = '已复制';
        setTimeout(function () { btn.textContent = '复制'; }, 1400);
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

  /* ── 灯箱 ── */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');

  Array.prototype.forEach.call(document.querySelectorAll('.gitem'), function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      var cap = item.querySelector('.gcap');
      lbImg.src = item.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent.trim() : '';
      lb.classList.add('on');
    });
  });

  function closeLb() {
    lb.classList.remove('on');
    lbImg.src = '';
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ── 滚动淡入 ── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    Array.prototype.forEach.call(document.querySelectorAll('.pcard, .step, .gitem'), function (el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity .5s';
      io.observe(el);
    });
  }
})();

// Shared behaviour for all pages: theme toggle and obfuscated email reveal.
(function () {
  var root = document.documentElement;

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function saveTheme(mode) {
    try {
      if (mode === 'auto') localStorage.removeItem('theme');
      else localStorage.setItem('theme', mode);
    } catch (e) {}
  }
  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t === 'dark' || (t !== 'light' && prefersDark());
  }

  // Apply saved theme as early as possible
  var saved = storedTheme();
  root.setAttribute('data-theme', saved === 'light' || saved === 'dark' ? saved : 'auto');

  function refreshIcons() {
    var sun = document.getElementById('iconSun');
    var moon = document.getElementById('iconMoon');
    if (!sun || !moon) return;
    var dark = isDark();
    sun.hidden = !dark;  // in dark mode, show sun (switch to light)
    moon.hidden = dark;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        // Flip relative to what is currently shown; return to auto if that matches the system
        var next = isDark() ? 'light' : 'dark';
        if ((next === 'dark') === prefersDark()) next = 'auto';
        root.setAttribute('data-theme', next);
        saveTheme(next);
        refreshIcons();
      });
    }
    refreshIcons();

    // Abstracts: visible without JS; collapsed behind a toggle when JS runs
    document.querySelectorAll('.abstract-toggle').forEach(function (btn) {
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      if (!body) return;
      body.hidden = true;
      btn.addEventListener('click', function () {
        var open = body.hidden;
        body.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    // Email: assembled in JS so the address never appears in the HTML
    var btn = document.getElementById('revealEmailBtn');
    var slot = document.getElementById('emailReveal');
    if (btn && slot) {
      var label = btn.querySelector('.btn-label');
      var user = 'han' + 'qing' + 't';
      var parts = ['student', 'unimelb', 'edu', 'au'];
      btn.addEventListener('click', function () {
        var show = slot.hidden;
        slot.textContent = show ? user + ' [at] ' + parts.join(' [dot] ') : '';
        slot.hidden = !show;
        if (label) label.textContent = show ? 'Hide email' : 'Email';
        btn.setAttribute('aria-expanded', String(show));
      });
    }
  });

  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshIcons);
  } catch (e) {}
})();

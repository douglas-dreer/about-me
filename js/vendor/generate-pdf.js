(function () {
  'use strict';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function downloadCV() {
    var modal = document.getElementById('cvLoadingModal');
    if (modal) modal.setAttribute('aria-hidden', 'false');

    try {
      await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js');

      if (!window.marked) throw new Error('marked not loaded');
      if (!window.html2pdf) throw new Error('html2pdf not loaded');

      var res = await fetch('curriculo.md');
      if (!res.ok) throw new Error('curriculo.md not found');
      var md = await res.text();

      var container = document.getElementById('cv-pdf-content');
      container.innerHTML = window.marked.parse(md);

      var opt = {
        margin:      [15, 15, 15, 15],
        filename:    'curriculo-douglas-dreer.pdf',
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:   { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await window.html2pdf().set(opt).from(container).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      var fallback = document.createElement('a');
      fallback.href = 'curriculo.md';
      fallback.download = 'curriculo-douglas-dreer.md';
      document.body.appendChild(fallback);
      fallback.click();
      fallback.remove();
    } finally {
      var m = document.getElementById('cvLoadingModal');
      if (m) m.setAttribute('aria-hidden', 'true');
      var container = document.getElementById('cv-pdf-content');
      if (container) container.innerHTML = '';
    }
  }

  window.downloadCV = downloadCV;
})();

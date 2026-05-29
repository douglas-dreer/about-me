/* ==========================================================================
   Portfolio Douglas Dreer — Currículo MD → PDF
   Dependências (carregadas sob demanda via CDN):
     - marked:         parser Markdown → HTML
     - html2pdf.js:    HTML → PDF
   ========================================================================== */

(function () {
  'use strict';

  window.downloadCV = function () {

    var btn = document.querySelector('[onclick="downloadCV()"], #downloadCv');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Gerando PDF...';
    }

    function restoreBtn() {
      if (!btn) return;
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-download me-1"></i><span class="btn-label">Baixar CV</span>';
    }

    // ------------------------------------------------------------------------
    // 1. Load marked from CDN
    // ------------------------------------------------------------------------
    function loadMarked() {
      return new Promise(function (resolve, reject) {
        if (typeof marked !== 'undefined') return resolve();
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        s.onload = function () {
          // Configure marked
          if (marked.setOptions) {
            marked.setOptions({ breaks: true, gfm: true });
          }
          resolve();
        };
        s.onerror = function () { reject(new Error('Falha ao carregar marked')); };
        document.head.appendChild(s);
      });
    }

    // ------------------------------------------------------------------------
    // 2. Load html2pdf from CDN
    // ------------------------------------------------------------------------
    function loadHtml2pdf() {
      return new Promise(function (resolve, reject) {
        if (typeof html2pdf !== 'undefined') return resolve();
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        s.onload = function () { resolve(); };
        s.onerror = function () { reject(new Error('Falha ao carregar html2pdf')); };
        document.head.appendChild(s);
      });
    }

    // ------------------------------------------------------------------------
    // 3. Fetch markdown
    // ------------------------------------------------------------------------
    function fetchMarkdown() {
      return fetch('./curriculo.md').then(function (res) {
        if (!res.ok) throw new Error('Erro ao carregar curriculo.md');
        return res.text();
      });
    }

    // ------------------------------------------------------------------------
    // 4. Render markdown → styled HTML
    // ------------------------------------------------------------------------
    function renderPDF(md) {
      var html = marked.parse(md);

      var wrapper = document.createElement('div');
      wrapper.id = 'cv-pdf-render';
      wrapper.style.cssText =
        'position:fixed;top:0;left:0;width:210mm;padding:20mm 18mm;' +
        'background:#fff;color:#1a1a2e;font-family:Helvetica,Arial,sans-serif;' +
        'font-size:11pt;line-height:1.6;' +
        'opacity:0.01;pointer-events:none;z-index:-1;';

      wrapper.innerHTML =
        '<style>' +
        'body{margin:0;padding:0}' +
        'h1{font-size:22pt;margin:0 0 2px;color:#1a1a2e}' +
        'h2{font-size:13pt;color:#6d28d9;border-bottom:1.5px solid #1a1a2e;padding-bottom:3px;margin-top:18px;margin-bottom:6px}' +
        'h3{font-size:11pt;margin:4px 0 2px;color:#1a1a2e}' +
        'p{margin:3px 0;font-size:10pt;color:#333}' +
        'ul{margin:3px 0;padding-left:18px}' +
        'li{margin-bottom:2px;font-size:10pt;color:#333}' +
        'li::marker{color:#6d28d9}' +
        'a{color:#6d28d9;text-decoration:none}' +
        'hr{border:none;border-top:1px solid #ddd;margin:10px 0}' +
        'strong{color:#1a1a2e}' +
        '.contact-line{font-size:9pt;color:#555;margin:2px 0}' +
        '.skill-tag,.badge,.project-status,.timeline-date{display:none}' +
        '.sub-client-item{border-left:2px solid #6d28d9;padding-left:10px;margin:6px 0}' +
        '.sub-client-item strong{font-size:10pt}' +
        '.timeline-date{display:none}' +
        '</style>';

      wrapper.innerHTML +=
        '<div style="margin-bottom:14px">' +
        '<h1 style="margin:0">Douglas Dreer</h1>' +
        '<div class="contact-line">Londrina/PR · douglasdreer@gmail.com · (43) 99649-0584</div>' +
        '<div class="contact-line">linkedin.com/in/douglas-dreer · gitlab.com/douglas-dreer</div>' +
        '</div>';

      wrapper.innerHTML += html;

      document.body.appendChild(wrapper);

      return wrapper;
    }

    // ------------------------------------------------------------------------
    // 5. Convert to PDF and download
    // ------------------------------------------------------------------------
    function generatePDF(element) {
      var opt = {
        margin:        [10, 10, 10, 10], // mm
        filename:      'curriculo-douglas-dreer.pdf',
        image:         { type: 'jpeg', quality: 0.95 },
        html2canvas:   { scale: 2, letterRendering: true, useCORS: true, logging: false },
        jsPDF:         { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:     { mode: ['avoid-all', 'css', 'legacy'] },
      };

      return html2pdf().set(opt).from(element).save();
    }

    // ------------------------------------------------------------------------
    // Execute pipeline
    // ------------------------------------------------------------------------
    Promise.all([loadMarked(), loadHtml2pdf()])
      .then(fetchMarkdown)
      .then(function (md) {
        var wrapper = renderPDF(md);
        return generatePDF(wrapper);
      })
      .then(function () {
        var el = document.getElementById('cv-pdf-render');
        if (el) el.remove();
        restoreBtn();
      })
      .catch(function (err) {
        console.error('Erro ao gerar PDF:', err);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i>Erro — tente novamente';
        }
        var el = document.getElementById('cv-pdf-render');
        if (el) el.remove();
      });
  };
})();

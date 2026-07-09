/* ==========================================================================
   pdf.js — download the report as a PDF (html2pdf.js, with print fallback)
   ========================================================================== */

const MartinPDF = (() => {
  function download() {
    const el = document.getElementById('reportDoc');
    if (!el) return;
    const rep = App.lastReport || {};
    const name = `MartinEdu-SEAG-${(rep.subjectName || 'report')}-${(rep.modeLabel || '').replace(/\s+/g, '')}.pdf`;

    if (typeof html2pdf === 'undefined') {
      // Offline / CDN blocked — fall back to the browser's print-to-PDF
      alert('Opening your browser print dialog — choose “Save as PDF”.');
      window.print();
      return;
    }
    const opt = {
      margin: [10, 10, 12, 10],
      filename: name,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'avoid-all'] },
    };
    html2pdf().set(opt).from(el).save().catch(() => window.print());
  }
  return { download };
})();

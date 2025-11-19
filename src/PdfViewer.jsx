import React, { useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// ✔ FIXED WORKER IMPORT (works with react-pdf v7)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.js`;

export default function PdfViewer({ file, refs, activeRef }) {
  const docRef = useRef(null);
  const textLayerSelector = '.react-pdf__Page__textContent';

  useEffect(() => {
    // remove old highlights
    const removeHighlights = () => {
      document.querySelectorAll('.pdf-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });
    };

    removeHighlights();

    if (!activeRef) return;

    const { phrase, page } = refs[activeRef];

    // delay ensures text layer fully loaded
    setTimeout(() => {
      let found = false;

      const pageContainers = document.querySelectorAll(
        `.react-pdf__Page[data-page-number="${page}"] ${textLayerSelector}`
      );

      const containers =
        pageContainers.length > 0
          ? pageContainers
          : document.querySelectorAll(textLayerSelector);

      // try simple same-span highlight
      containers.forEach(container => {
        const spans = Array.from(container.querySelectorAll('span'));
        spans.forEach(span => {
          const text = span.textContent || '';
          const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
          if (idx !== -1 && !found) {
            found = true;

            const before = text.slice(0, idx);
            const match = text.slice(idx, idx + phrase.length);
            const after = text.slice(idx + phrase.length);

            const frag = document.createDocumentFragment();

            if (before) frag.appendChild(document.createTextNode(before));

            const highlight = document.createElement('span');
            highlight.className = 'pdf-highlight';
            highlight.textContent = match;
            frag.appendChild(highlight);

            if (after) frag.appendChild(document.createTextNode(after));

            span.innerHTML = '';
            span.appendChild(frag);

            highlight.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        });
      });

      // try multi-span highlight if not found
      if (!found) {
        containers.forEach(container => {
          const spans = Array.from(container.querySelectorAll('span'));
          const fullText = spans.map(s => s.textContent || '').join('');
          const idx = fullText.toLowerCase().indexOf(phrase.toLowerCase());

          if (idx !== -1 && !found) {
            found = true;
            let remaining = phrase.length;
            let charCount = 0;

            for (const s of spans) {
              const sText = s.textContent || '';
              const sLen = sText.length;

              if (charCount + sLen <= idx) {
                charCount += sLen;
                continue;
              }

              const start = Math.max(0, idx - charCount);
              const take = Math.min(remaining, sLen - start);

              const before = sText.slice(0, start);
              const match = sText.slice(start, start + take);
              const after = sText.slice(start + take);

              const frag = document.createDocumentFragment();

              if (before) frag.appendChild(document.createTextNode(before));

              const highlight = document.createElement('span');
              highlight.className = 'pdf-highlight';
              highlight.textContent = match;
              frag.appendChild(highlight);

              if (after) frag.appendChild(document.createTextNode(after));

              s.innerHTML = '';
              s.appendChild(frag);

              remaining -= take;
              charCount += sLen;
              if (remaining <= 0) break;
            }

            const firstHighlight = container.querySelector('.pdf-highlight');
            if (firstHighlight) {
              firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }
        });
      }
    }, 300);

    return () => {
      document
        .querySelectorAll('.pdf-highlight')
        .forEach(el => el.replaceWith(document.createTextNode(el.textContent)));
    };
  }, [activeRef, refs]);

  return (
    <div className="pdf-wrapper">
      <Document
        file={file}
        onLoadError={err => console.error('PDF load error:', err)}
        ref={docRef}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            width={600}
            renderTextLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ file, refs, activeRef, onClearFromPanel }) {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(1000);
  const [zoom, setZoom] = useState(1);

  /* ---------------- AUTO WIDTH ---------------- */
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setPageWidth(Math.max(400, w - 30));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- HANDLE HIGHLIGHTS ---------------- */
  useEffect(() => {
    removePdfHighlights();

    if (!activeRef) return;

    setTimeout(() => {
      const { phrase, page } = refs[activeRef];
      highlightPhraseOnPage(phrase, page);
    }, 450);
  }, [activeRef]);

  const removePdfHighlights = () => {
    document.querySelectorAll(".pdf-highlight").forEach(h => {
      const parent = h.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(h.textContent), h);
      parent.normalize();
    });
  };

  /* ---------------- HIGHLIGHT EXACT PHRASE ---------------- */
  const highlightPhraseOnPage = (phrase, pageNumber) => {
    const selector = `.react-pdf__Page[data-page-number="${pageNumber}"] .react-pdf__Page__textContent`;
    const layer = document.querySelector(selector);
    if (!layer) return;

    const spans = [...layer.querySelectorAll("span")];
    let fullText = "";
    let map = [];

    spans.forEach((s, i) => {
      map.push({ index: fullText.length, span: s });
      fullText += s.textContent;
    });

    const lower = fullText.toLowerCase();
    const term = phrase.toLowerCase();
    const idx = lower.indexOf(term);
    if (idx === -1) return;

    const end = idx + term.length;

    for (let i = 0; i < map.length; i++) {
      const { index, span } = map[i];
      const nextIndex = i < map.length - 1 ? map[i + 1].index : fullText.length;

      if (end <= index || idx >= nextIndex) continue;

      const localStart = Math.max(0, idx - index);
      const localEnd = Math.min(span.textContent.length, end - index);

      const before = span.textContent.slice(0, localStart);
      const match = span.textContent.slice(localStart, localEnd);
      const after = span.textContent.slice(localEnd);

      const frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));

      const h = document.createElement("span");
      h.className = "pdf-highlight";
      h.textContent = match;
      frag.appendChild(h);

      if (after) frag.appendChild(document.createTextNode(after));

      span.innerHTML = "";
      span.appendChild(frag);
    }

    const first = layer.querySelector(".pdf-highlight");
    if (first) scrollToHighlight(first);
  };

  const scrollToHighlight = (el) => {
    const cont = containerRef.current;
    if (!cont) return;

    const elRect = el.getBoundingClientRect();
    const cRect = cont.getBoundingClientRect();

    const pos = cont.scrollTop + (elRect.top - cRect.top) - cont.clientHeight / 3;

    cont.scrollTo({ top: pos, behavior: "smooth" });
  };

  /* ---------------- ZOOM ---------------- */
  const zoomIn = () => setZoom(z => Math.min(1, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const resetZoom = () => setZoom(1);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="pdf-wrapper">

      {/* TOOLBAR */}
      <div className="pdf-toolbar">
        <strong>PDF</strong>
        <button className="tb-btn" onClick={zoomOut}>-</button>
        <button className="tb-btn" onClick={resetZoom}>100%</button>
        <button className="tb-btn" onClick={zoomIn}>+</button>
        <span style={{ marginLeft: 8 }}>Zoom: {(zoom * 100).toFixed(0)}%</span>
      </div>

      {/* PDF Pages */}
      <div ref={containerRef} className="pdf-left-container">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <div className="page-frame" key={i}>
              <Page
                pageNumber={i + 1}
                width={Math.round(pageWidth * zoom)}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="react-pdf__Page"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

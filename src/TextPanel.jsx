import React, { useState, useRef, useEffect } from "react";

export default function TextPanel({ refs, setActiveRef }) {
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  // Highlight search inside right panel
  useEffect(() => {
    if (!panelRef.current) return;

    const root = panelRef.current;

    // Remove old highlights
    root.querySelectorAll(".right-highlight").forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });

    if (!query.trim()) return;

    const textNodes = [];
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null
    );

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let firstMatchElement = null;

    textNodes.forEach((node) => {
      const val = node.nodeValue;
      const idx = val.toLowerCase().indexOf(query.toLowerCase());

      if (idx !== -1) {
        const before = val.slice(0, idx);
        const match = val.slice(idx, idx + query.length);
        const after = val.slice(idx + query.length);

        const highlight = document.createElement("span");
        highlight.className = "right-highlight";
        highlight.textContent = match;

        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(highlight);
        if (after) frag.appendChild(document.createTextNode(after));

        node.parentNode.replaceChild(frag, node);

        if (!firstMatchElement) firstMatchElement = highlight;
      }
    });

    if (firstMatchElement) {
      firstMatchElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [query]);

  return (
    <div className="text-wrapper" ref={panelRef}>
      <h2 className="section-title">
        Analysis / Findings / Supporting Evidence
      </h2>

      <p className="analysis-text">
        No extraordinary or one-off items affecting EBITDA were reported in
        Maersk’s Q2 2025 results. The report shows that EBITDA improvements
        came mainly from operational performance — including volume growth, cost
        control, and better margins across Ocean, Logistics & Services, and
        Terminals segments.
        <span className="ref" onClick={() => setActiveRef(1)}> [1]</span>
        <span className="ref" onClick={() => setActiveRef(2)}> [2]</span>.
        Gains or losses from asset sales that qualify as extraordinary items
        are shown separately under EBIT, not EBITDA. The gain on sale of
        non-current assets was USD 25m in Q2 2025 — far lower than USD 208m in
        Q2 2024 — affecting EBIT but not EBITDA.
        <span className="ref" onClick={() => setActiveRef(3)}> [3]</span>.
      </p>

      <h3 className="section-subtitle">Findings</h3>

      <p className="analysis-text">
        ● Page 3 — EBITDA increased due to better operational performance,
        volume growth, and cost control. No extraordinary items.
        <span className="ref" onClick={() => setActiveRef(1)}> [1]</span>
      </p>

      <p className="analysis-text">
        ● Page 5 — Review of Q2 2025 shows steady revenue improvement and stable
        segment performance.
        <span className="ref" onClick={() => setActiveRef(2)}> [2]</span>
      </p>

      <p className="analysis-text">
        ● Page 15 — Asset sale gain (USD 25m) shown under EBIT, confirming it is
        not part of EBITDA.
        <span className="ref" onClick={() => setActiveRef(3)}> [3]</span>
      </p>

      {/* 🔍 SEARCH BAR AT BOTTOM */}
      <input
        type="text"
        placeholder="Search in notes..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

import React from 'react'

export default function TextPanel({ refs, activeRef, onClickRef }) {
  // the right-hand transcript text; replace / extend with real transcript you want
  const transcript = `
Analysis
No extraordinary or one-off items affecting EBITDA were reported in Maersk’s Q2 2025 results.
The report explicitly notes that EBITDA improvements stemmed from operational performance — including volume growth, cost control, and margin improvement across Ocean, Logistics & Services, and Terminals segments [1][2]. Gains or losses from asset sales, which could qualify as extraordinary items, are shown separately under EBIT and not included in EBITDA. The gain on sale of non-current assets was USD 25 m in Q2 2025, significantly lower than USD 208 m in Q2 2024, but these affect EBIT, not EBITDA [3]. Hence, Q2 2025 EBITDA reflects core operating activities without one-off extraordinary adjustments.
  `

  const renderRefLinks = () => {
    return Object.keys(refs).map(k => {
      const num = Number(k)
      const isActive = activeRef === num
      return (
        <button
          key={k}
          className={`ref-btn ${isActive ? 'active' : ''}`}
          onClick={() => onClickRef(num)}
          title={`Jump to reference [${k}]`}
        >
          [{k}]
        </button>
      )
    })
  }

  // highlight phrase in the right panel if active
  const getHighlightedTranscript = () => {
    if (!activeRef) return transcript
    const p = refs[activeRef].phrase
    const regex = new RegExp(`(${escapeRegExp(p)})`, 'ig')
    return transcript.replace(regex, '<span class="text-highlight">$1</span>')
  }

  return (
    <div className="text-panel">
      <div className="ref-links">{renderRefLinks()}</div>
      <div
        className="transcript"
        dangerouslySetInnerHTML={{ __html: getHighlightedTranscript() }}
      />
      <div className="references">
        <p><strong>References (click to highlight in PDF)</strong></p>
        <ul>
          <li>[1] Page 3 — Highlights Q2 2025</li>
          <li>[2] Page 5 — Review Q2 2025</li>
          <li>[3] Page 15 — Condensed Income Statement — Gain on sale of non-current assets</li>
        </ul>
      </div>
    </div>
  )
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


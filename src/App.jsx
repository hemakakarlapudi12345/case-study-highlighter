import React, { useState } from 'react'
import PdfViewer from './PdfViewer'
import TextPanel from './TextPanel'

export default function App() {
  // mapping of reference numbers to search phrases & page number
  const refs = {
    1: { phrase: 'EBITDA increase (USD 2.3 bn vs USD 2.1 bn prior year)', page: 1 },
    2: { phrase: 'EBITDA increased to USD 2.3 bn', page: 1 },
    3: { phrase: 'Gain on sale of non-current assets', page: 15 } // adjust page if needed
  }

  const [activeRef, setActiveRef] = useState(null)

  return (
    <div className="app">
      <h2 className="title">Case Study — PDF ↔ Text Highlighter</h2>
      <div className="container">
        <PdfViewer
          file="/Maersk_Q2_2025_Interim_Report.pdf"
          refs={refs}
          activeRef={activeRef}
        />
        <TextPanel refs={refs} activeRef={activeRef} onClickRef={setActiveRef} />
      </div>
      <div className="footer">
        <p>Click a reference like <strong>[3]</strong> on the right — corresponding phrase in the PDF will be highlighted.</p>
      </div>
    </div>
  )
}

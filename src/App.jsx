import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import TextPanel from "./TextPanel";
import "./styles.css";

export default function App() {
  const pdfFile = "/Maersk_Q2_2025_Interim_Report.pdf"; // CORRECT file path

  const refs = {
    1: { page: 3, phrase: "Highlights Q2 2025" },
    2: { page: 5, phrase: "Review Q2 2025" },
    3: { page: 15, phrase: "gain on sale of non-current assets" },
  };

  const [activeRef, setActiveRef] = useState(null);

  return (
    <div className="container">
      <h1 className="title">Case Study — PDF ↔ Smart Highlighter</h1>

      <div className="main-content">
        <div className="pdf-column">
          <PdfViewer file={pdfFile} refs={refs} activeRef={activeRef} />
        </div>

        <div className="text-column">
          <TextPanel refs={refs} setActiveRef={setActiveRef} />
        </div>
      </div>
    </div>
  );
}

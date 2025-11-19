Case Study PDF Highlighter (Vite + React)
----------------------------------------
Files included:
- A small React app that renders a PDF and highlights phrases on reference clicks.
- The Maersk PDF has been copied to public/Maersk_Q2_2025_Interim_Report.pdf (found: True)

Quick start (locally):
1. cd case-study-highlighter
2. npm install
3. npm run dev
4. open http://localhost:5173
5. Click [3] in the right panel to highlight the "Gain on sale of non-current assets" phrase in the PDF.
Notes:
- If the highlight doesn't show, the PDF might be scanned image pages. Then OCR is required.
- To deploy to Vercel: push this repo to GitHub and import to Vercel. Build command: npm run build. Output: dist

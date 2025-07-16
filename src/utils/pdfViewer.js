export const pdfViewer = async (file, ref) => {
  const pdfJs = await import("pdfjs-dist");
  pdfJs.GlobalWorkerOptions.workerSrc =
    window.location.origin + "/pdf.worker.min.mjs";
  pdfJs.GlobalWorkerOptions.standardFontDataUrl =
    window.location.origin + "/standard_fonts/";

  const pdf = await pdfJs.getDocument(file).promise;
  const pages = pdf.numPages;
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i);
    const scale = 1;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    ref.current.appendChild(canvas);
  }
};

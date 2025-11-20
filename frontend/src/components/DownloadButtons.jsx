import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { marked } from "marked";
import { Download } from "lucide-react";

function DownloadButtons({ analysis, cvFileName }) {
  const hasAnalysis = Boolean(analysis && analysis.trim().length);

  const handleDownloadMD = () => {
    if (!hasAnalysis) return;
    const blob = new Blob([analysis], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cvFileName || "cv"}_analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!hasAnalysis) return;

    // Convert markdown → HTML
    const html = marked.parse(analysis);

    // Hidden container to render HTML for conversion
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.width = "900px";
    container.style.padding = "20px";
    container.style.background = "#ffffff";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.lineHeight = "1.6";
    container.style.fontSize = "14px";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add more pages if needed
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${cvFileName || "cv"}_analysis.pdf`);

    document.body.removeChild(container);
  };

  return (
    <div className="m-4 flex flex-col gap-3 sm:flex-row justify-center">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadMD}
        disabled={!hasAnalysis}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] px-6 py-4 font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="w-5 h-5" />
        Download Analysis (MD)
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadPDF}
        disabled={!hasAnalysis}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B9C] to-[#9C4DFF] px-6 py-4 font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="w-5 h-5" />
        Download Analysis (PDF)
      </motion.button>
    </div>
  );
}

export default DownloadButtons;
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

function DownloadButtons({ analysis, cvFileName }) {
  const handleDownloadMD = () => {
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvFileName || 'cv'}_optimization.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    analysis.split('\n').forEach((line) => {
      if (line.trim() === '') {
        y += 5; // Add space for empty lines
        return;
      }

      let fontSize = 12;
      let fontStyle = 'normal';
      let text = line;

      if (line.startsWith('# ')) {
        fontSize = 20;
        fontStyle = 'bold';
        text = line.slice(2);
      } else if (line.startsWith('## ')) {
        fontSize = 16;
        fontStyle = 'bold';
        text = line.slice(3);
      } else if (line.startsWith('### ')) {
        fontSize = 14;
        fontStyle = 'bold';
        text = line.slice(4);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        text = '• ' + line.slice(2);
      }

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);

      const wrappedText = doc.splitTextToSize(text, 180);
      doc.text(wrappedText, 10, y);
      y += wrappedText.length * (fontSize / 2 + 2);
    });

    doc.save(`${cvFileName || 'cv'}_optimization.pdf`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadMD}
        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold rounded-xl transition-all shadow-lg"
      >
        <Download className="w-5 h-5" />
        Download as Markdown
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadPDF}
        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF6B9C] to-[#9C4DFF] text-white font-semibold rounded-xl transition-all shadow-lg"
      >
        <Download className="w-5 h-5" />
        Download as PDF
      </motion.button>
    </div>
  );
}

export default DownloadButtons;
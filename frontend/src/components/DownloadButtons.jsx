import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FileDown, BookOpen } from 'lucide-react';

function DownloadButtons({ analysis, cvFileName }) {
  const downloadMarkdown = () => {
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Analysis_${cvFileName || 'result'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Markdown file downloaded!');
  };
  const downloadDocx = () => {
    // Simple DOCX-like format (HTML that Word can open)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CV Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 20px; }
          p { margin: 10px 0; }
          pre { background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>CV Optimization Analysis Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <pre>${analysis}</pre>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Analysis_${cvFileName || 'result'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document file downloaded!');
  };
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadMarkdown}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg border border-slate-600"
      >
        <FileDown className="w-5 h-5" />
        Download Markdown
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadDocx}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg border border-slate-600"
      >
        <BookOpen className="w-5 h-5" />
        Download Document
      </motion.button>
    </div>
  );
}

export default DownloadButtons;
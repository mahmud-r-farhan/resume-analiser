import jsPDF from 'jspdf';

const templateStyles = {
  classic: {
    headingColor: [32, 32, 32],
    accentColor: [72, 115, 255],
    font: 'helvetica',
  },
  modern: {
    headingColor: [49, 86, 216],
    accentColor: [126, 216, 255],
    font: 'helvetica',
  },
  functional: {
    headingColor: [24, 24, 24],
    accentColor: [100, 210, 173],
    font: 'helvetica',
  },
};

const cleanFileName = (fileName, template) =>
  `${fileName || 'optimized_resume'}_${template}.pdf`.replace(/\s+/g, '_');

const renderBlock = (doc, textLines, options) => {
  const { fontSize, fontStyle = 'normal', textColor = [33, 33, 33], margin, maxWidth, lineHeight } =
    options;

  doc.setFont(options.fontFamily || 'helvetica', fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...textColor);

  textLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, maxWidth);
    wrapped.forEach((wrappedLine) => {
      if (options.y > doc.internal.pageSize.height - margin.bottom) {
        doc.addPage();
        options.y = margin.top;
      }
      doc.text(wrappedLine, margin.left, options.y);
      options.y += lineHeight;
    });
  });
};

export const exportResumeMarkdownToPdf = ({
  markdown,
  template = 'classic',
  fileName,
}) => {
  if (!markdown) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const margin = { top: 48, right: 48, bottom: 48, left: 48 };
  const maxWidth = doc.internal.pageSize.width - margin.left - margin.right;
  const style = templateStyles[template] || templateStyles.classic;

  const options = {
    y: margin.top,
    margin,
    maxWidth,
    fontFamily: style.font,
  };

  // Improved markdown parsing - handle sections more intelligently
  const lines = markdown.split('\n');
  let currentSection = null;
  let currentContent = [];

  const flushSection = () => {
    if (currentSection && currentContent.length > 0) {
      // Render section heading
      if (currentSection.level === 1) {
        renderBlock(doc, [currentSection.title.toUpperCase()], {
          ...options,
          fontSize: 18,
          fontStyle: 'bold',
          textColor: style.headingColor,
          lineHeight: 26,
        });
        options.y += 8;
      } else if (currentSection.level === 2) {
        renderBlock(doc, [currentSection.title], {
          ...options,
          fontSize: 14,
          fontStyle: 'bold',
          textColor: style.headingColor,
          lineHeight: 20,
        });
        options.y += 6;
      } else if (currentSection.level === 3) {
        renderBlock(doc, [currentSection.title], {
          ...options,
          fontSize: 12,
          fontStyle: 'bold',
          textColor: style.headingColor,
          lineHeight: 18,
        });
        options.y += 4;
      }

      // Render section content
      currentContent.forEach((line) => {
        if (!line.trim()) {
          options.y += 6;
          return;
        }

        // Clean markdown formatting
        let cleanLine = line
          .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
          .replace(/\*(.*?)\*/g, '$1') // Italic
          .replace(/`(.*?)`/g, '$1') // Code
          .trim();

        if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
          renderBlock(
            doc,
            [`• ${cleanLine.replace(/^[-*]\s*/, '')}`],
            {
              ...options,
              fontSize: 11,
              fontStyle: 'normal',
              textColor: [55, 55, 55],
              lineHeight: 18,
            },
          );
        } else if (cleanLine.match(/^\d+\.\s/)) {
          // Numbered list
          renderBlock(
            doc,
            [cleanLine],
            {
              ...options,
              fontSize: 11,
              fontStyle: 'normal',
              textColor: [55, 55, 55],
              lineHeight: 18,
            },
          );
        } else {
          renderBlock(
            doc,
            [cleanLine],
            {
              ...options,
              fontSize: 11,
              textColor: [60, 60, 60],
              lineHeight: 18,
            },
          );
        }
      });

      options.y += 12;
      currentContent = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      flushSection();
      currentSection = { level: 1, title: trimmed.replace(/^#\s*/, '') };
      currentContent = [];
    } else if (trimmed.startsWith('## ')) {
      flushSection();
      currentSection = { level: 2, title: trimmed.replace(/^##\s*/, '') };
      currentContent = [];
    } else if (trimmed.startsWith('### ')) {
      flushSection();
      currentSection = { level: 3, title: trimmed.replace(/^###\s*/, '') };
      currentContent = [];
    } else if (trimmed) {
      currentContent.push(line);
    } else if (currentContent.length > 0) {
      // Empty line within content - add spacing
      currentContent.push('');
    }
  });

  // Flush remaining section
  flushSection();

  doc.save(cleanFileName(fileName, template));
};


const clampScore = (value) => {
  if (Number.isNaN(Number(value))) return null;
  return Math.max(0, Math.min(100, Number(value)));
};

export const parseAnalysisSections = (analysis = '') => {
  if (!analysis) return [];

  const sections = [];
  const sectionRegex =
    /^\s*(\d+)\.\s+\*\*(.+?)\*\*:\s*([\s\S]*?)(?=^\s*\d+\.\s+\*\*|\s*$)/gm;

  let match;
  while ((match = sectionRegex.exec(analysis)) !== null) {
    const [, order, title, body] = match;
    sections.push({
      id: Number(order),
      title: title.trim(),
      body: body.trim(),
    });
  }

  if (!sections.length) {
    sections.push({
      id: 0,
      title: 'Premium Analysis',
      body: analysis.trim(),
    });
  }

  return sections.sort((a, b) => a.id - b.id);
};

export const extractFitScore = (analysis = '', fallback) => {
  const scoreMatch = analysis.match(/FIT\s*SCORE:?\s*(\d{1,3})/i);
  if (scoreMatch) return clampScore(scoreMatch[1]);
  return typeof fallback === 'number' ? clampScore(fallback) : null;
};


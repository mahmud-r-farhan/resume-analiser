import AnalysisSectionCard from './AnalysisSectionCard';

const accentMap = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('strength')) return 'strengths';
  if (lower.includes('gap') || lower.includes('improvement')) return 'gaps';
  if (lower.includes('keyword')) return 'keywords';
  if (lower.includes('ats')) return 'ats';
  if (lower.includes('summary')) return 'summary';
  return 'default';
};

const AnalysisHighlights = ({ sections }) => {
  if (!sections?.length) return null;

  const summarySection = sections.find((sec) =>
    sec.title.toLowerCase().includes('summary'),
  );
  const remainingSections = sections.filter((sec) => sec !== summarySection);

  return (
    <div className="space-y-6">
      {summarySection && (
        <AnalysisSectionCard
          key={summarySection.id}
          title={summarySection.title}
          content={summarySection.body}
          accent={accentMap(summarySection.title)}
          index={0}
        />
      )}

      {remainingSections.length > 0 && (
        <div className="">
          {remainingSections.map((section, idx) => (
            <AnalysisSectionCard
              key={section.id}
              title={section.title}
              content={section.body}
              accent={accentMap(section.title)}
              index={idx + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHighlights;


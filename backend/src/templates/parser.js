const parseResumeMarkdown = (markdown) => {
  if (!markdown) return { 
    header: { name: '', title: '', contact: [] }, 
    sections: [],
    isValid: false,
    errors: ['Empty markdown provided']
  };

  const lines = markdown.split('\n');
  const result = {
    header: { name: '', title: '', contact: [] },
    sections: [],
    isValid: true,
    errors: [],
    warnings: []
  };

  let currentSection = null;
  let currentJob = null;
  let inJobBlock = false;

  const cleanText = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();
  };

  const extractContactInfo = (text) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex = /[\d\s()+-]{10,}/g;
    const urlRegex = /https?:\/\/[^\s]+/g;

    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    const urls = text.match(urlRegex) || [];

    return [...new Set([...emails, ...phones, ...urls.map((u) => u.replace(/[()]/g, ''))])];
  };

  // Extract name from first non-empty line if no # found
  let nameFound = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // # Name or ## Name (fallback for different heading levels)
    if ((trimmed.startsWith('# ') || trimmed.startsWith('## ')) && !nameFound) {
      result.header.name = cleanText(trimmed.replace(/^#+\s*/, ''));
      nameFound = true;
      if (!result.header.name) {
        result.warnings.push(`Line ${index + 1}: Name is empty after cleaning`);
      }
      return;
    }

    // ## Title or ### Title (if name already found)
    if ((trimmed.startsWith('## ') || trimmed.startsWith('### ')) && nameFound && !result.header.title) {
      result.header.title = cleanText(trimmed.replace(/^#+\s*/, ''));
      return;
    }

    // Contact info (emails, phones, URLs)
    if (
      (trimmed.includes('@') || trimmed.includes('linkedin') || trimmed.includes('github') || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(trimmed)) &&
      result.sections.length === 0
    ) {
      const contacts = extractContactInfo(trimmed);
      result.header.contact.push(...contacts);
      return;
    }

    // ### Section Header or #### or even numbered sections
    if (trimmed.match(/^#{2,4}\s+/) || trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*/)) {
      let sectionTitle = trimmed;
      
      // Handle numbered format: "1. **Section Name**"
      const numberedMatch = trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*/);
      if (numberedMatch) {
        sectionTitle = numberedMatch[1];
      } else {
        sectionTitle = trimmed.replace(/^#+\s*/, '');
      }

      currentSection = {
        title: cleanText(sectionTitle),
        items: [],
      };
      
      if (currentSection.title) {
        result.sections.push(currentSection);
      }
      currentJob = null;
      inJobBlock = false;
      return;
    }

    if (!currentSection) return;

    // Job/Experience pattern: Role at Company | Date
    const jobPattern = /(.+?)\s+(?:at|@|\|)\s+(.+?)(?:\s*\|\s*(.+))?$/;

    if (
      trimmed.match(jobPattern) &&
      (trimmed.includes(' at ') || trimmed.includes(' | '))
    ) {
      const match = trimmed.match(jobPattern);
      if (match) {
        let role = cleanText(match[1]);
        let company = cleanText(match[2]);
        let date = match[3] ? cleanText(match[3]) : '';

        if (!role || !company) {
          result.warnings.push(`Line ${index + 1}: Job entry missing role or company`);
        }

        currentJob = {
          type: 'job',
          role: role || 'Unknown Role',
          company: company || 'Unknown Company',
          date: date || 'Present',
          bullets: [],
        };
        currentSection.items.push(currentJob);
        inJobBlock = true;
      }
      return;
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      const bulletText = cleanText(trimmed.replace(/^[-•*]\s*/, ''));
      if (bulletText) {
        if (currentJob && inJobBlock) {
          currentJob.bullets.push(bulletText);
        } else {
          currentSection.items.push({ type: 'bullet', text: bulletText });
        }
      }
      return;
    }

    // Skills section
    if (currentSection && currentSection.title.toLowerCase().includes('skill')) {
      const categoryMatch = trimmed.match(/\*\*(.+?):\*\*\s*(.+)/);
      if (categoryMatch) {
        const skills = categoryMatch[2]
          .split(/[,;]/)
          .map((s) => cleanText(s))
          .filter(Boolean);
        if (skills.length > 0) {
          currentSection.items.push({
            type: 'skill_category',
            category: cleanText(categoryMatch[1]),
            skills
          });
        }
        return;
      }

      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        const skills = trimmed
          .replace(/^[-•*]\s*/, '')
          .split(/[,;]/)
          .map((s) => cleanText(s))
          .filter(Boolean);
        skills.forEach((skill) => {
          currentSection.items.push({ type: 'skill', text: skill });
        });
      }
      return;
    }

    // Regular text
    if (trimmed && !trimmed.startsWith('#') && !trimmed.match(/^\d+\./)) {
      const cleanedText = cleanText(trimmed);
      if (cleanedText && currentSection) {
        currentSection.items.push({ type: 'text', text: cleanedText });
      }
    }
  });

  // Validation
  if (!result.header.name) {
    // FALLBACK: If no name found, use first line as name
    const firstContent = lines.find(l => l.trim() && !l.trim().startsWith('#'));
    if (firstContent) {
      result.header.name = cleanText(firstContent.trim()).slice(0, 100);
      result.warnings.push('No # heading found for name; using first line');
    } else {
      result.errors.push('Resume name is missing - no valid name found');
      result.isValid = false;
    }
  }

  if (result.sections.length === 0) {
    result.errors.push('No resume sections found - check markdown formatting');
    result.isValid = false;
  }

  result.sections = result.sections.filter((s) => s.items.length > 0);

  return result;
};

module.exports = { parseResumeMarkdown };

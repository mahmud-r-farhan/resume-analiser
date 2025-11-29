export const parseResumeMarkdown = (markdown) => {
  if (!markdown) return { header: { name: '', title: '', contact: [] }, sections: [] };
  
  const lines = markdown.split('\n');
  const result = { 
    header: { name: '', title: '', contact: [] }, 
    sections: [] 
  };
  
  let currentSection = null;
  let currentJob = null;
  let inJobBlock = false;

  const cleanText = (text) => {
    // Remove markdown formatting but preserve the text
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
      .replace(/\*(.+?)\*/g, '$1') // Italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
      .trim();
  };

  const extractContactInfo = (text) => {
    // Extract email, phone, LinkedIn, GitHub, etc.
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex = /[\d\s()+-]{10,}/g;
    const urlRegex = /https?:\/\/[^\s]+/g;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    const urls = text.match(urlRegex) || [];
    
    return [...emails, ...phones, ...urls.map(u => u.replace(/[()]/g, ''))];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Header: # Name
    if (trimmed.startsWith('# ')) {
      result.header.name = cleanText(trimmed.slice(2));
      return;
    }

    // Title/Tagline: ## Title
    if (trimmed.startsWith('## ') && !result.header.title) {
      result.header.title = cleanText(trimmed.slice(3));
      return;
    }

    // Contact info (various formats)
    if ((trimmed.includes('@') || trimmed.includes('linkedin') || 
         trimmed.includes('github') || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(trimmed)) &&
        result.sections.length === 0) {
      const contacts = extractContactInfo(trimmed);
      result.header.contact.push(...contacts);
      return;
    }

    // Section headers: ### Section Name
    if (trimmed.startsWith('### ')) {
      currentSection = { 
        title: cleanText(trimmed.slice(4)), 
        items: [] 
      };
      result.sections.push(currentSection);
      currentJob = null;
      inJobBlock = false;
      return;
    }

    if (!currentSection) return;

    // Job/Experience entry patterns
    // Pattern 1: **Role** at **Company** | Date
    // Pattern 2: **Role** | Company | Date
    // Pattern 3: Role at Company | Date
    // Enhanced to handle location: **Role** at **Company**, Location | Date
    const jobPattern = /(.+?)\s+(?:at|@|\|)\s+(.+?)(?:\s*\|\s*(.+))?$/;
    const datePattern = /\d{4}|present|current/i;
    
    if (trimmed.match(jobPattern) && (trimmed.includes(' at ') || trimmed.includes(' | ')) && 
        (datePattern.test(trimmed) || index + 1 < lines.length && datePattern.test(lines[index + 1]))) {
      
      const match = trimmed.match(jobPattern);
      let role = cleanText(match[1]);
      let companyLocation = cleanText(match[2]);
      let date = match[3] ? cleanText(match[3]) : '';

      // Check if date is on the next line
      if (!date && index + 1 < lines.length) {
        const nextLine = lines[index + 1].trim();
        if (datePattern.test(nextLine) && !nextLine.startsWith('-') && !nextLine.startsWith('•')) {
          date = cleanText(nextLine);
        }
      }

      // Split company and location if comma present
      const companyParts = companyLocation.split(',').map(p => p.trim());
      let company = companyParts[0];
      let location = companyParts.slice(1).join(', ');

      currentJob = { 
        type: 'job', 
        role, 
        company, 
        location: location || '',
        date: date || 'Present', 
        bullets: [] 
      };
      currentSection.items.push(currentJob);
      inJobBlock = true;
      return;
    }

    // Education entry: **Degree** | University | Date
    // Enhanced to handle location: **Degree** | University, Location | Date
    if ((currentSection.title.toLowerCase().includes('education') || 
         currentSection.title.toLowerCase().includes('certification')) &&
        (trimmed.includes('University') || trimmed.includes('College') || 
         trimmed.includes('Bachelor') || trimmed.includes('Master') || 
         trimmed.includes('PhD') || trimmed.includes('Certificate'))) {
      
      const parts = trimmed.split('|').map(p => cleanText(p));
      if (parts.length >= 2) {
        let institutionLocation = parts[1];
        const institutionParts = institutionLocation.split(',').map(p => p.trim());
        let institution = institutionParts[0];
        let location = institutionParts.slice(1).join(', ');
        currentJob = {
          type: 'education',
          degree: parts[0],
          institution,
          location: location || '',
          date: parts[2] || '',
          bullets: []
        };
        currentSection.items.push(currentJob);
        inJobBlock = true;
        return;
      }
    }

    // Bullet points
    if ((trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* '))) {
      const bulletText = cleanText(trimmed.replace(/^[-•*]\s*/, ''));
      
      if (currentJob && inJobBlock) {
        currentJob.bullets.push(bulletText);
      } else {
        currentSection.items.push({ 
          type: 'bullet', 
          text: bulletText 
        });
      }
      return;
    }

    // Skills section - handle comma-separated or tagged format
    if (currentSection.title.toLowerCase().includes('skill')) {
      // Check if it's a categorized skill (e.g., "**Languages:** Python, Java")
      const categoryMatch = trimmed.match(/\*\*(.+?):\*\*\s*(.+)/);
      if (categoryMatch) {
        currentSection.items.push({
          type: 'skill_category',
          category: cleanText(categoryMatch[1]),
          skills: categoryMatch[2].split(',').map(s => cleanText(s)).filter(Boolean)
        });
        return;
      }
      
      // Regular bullet or comma-separated skills
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        const skills = cleanText(trimmed.replace(/^[-•]\s*/, '')).split(',').map(s => s.trim()).filter(Boolean);
        skills.forEach(skill => {
          currentSection.items.push({ type: 'skill', text: skill });
        });
      } else if (trimmed.includes(',')) {
        const skills = trimmed.split(',').map(s => cleanText(s)).filter(Boolean);
        skills.forEach(skill => {
          currentSection.items.push({ type: 'skill', text: skill });
        });
      }
      return;
    }

    // Regular paragraph text
    if (trimmed && !trimmed.startsWith('#')) {
      currentSection.items.push({ 
        type: 'text', 
        text: cleanText(trimmed) 
      });
    }
  });

  // Clean up empty sections
  result.sections = result.sections.filter(s => s.items.length > 0);

  return result;
};

// Helper to format text with inline styles
export const parseInlineFormatting = (text) => {
  const parts = [];
  let lastIndex = 0;
  
  // Bold pattern: **text**
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    parts.push({ text: match[1], bold: true });
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), bold: false });
  }
  
  return parts.length > 0 ? parts : [{ text, bold: false }];
};
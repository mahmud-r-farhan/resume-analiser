import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles } from './BaseStyles';
import { parseResumeMarkdown } from './parser';

export const ClassicTemplate = ({ data }) => {
  const { header, sections } = parseResumeMarkdown(data);

  // Render contact info with separators
  const renderContact = () => {
    if (!header.contact || header.contact.length === 0) return null;
    
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
        {header.contact.map((contact, i) => (
          <Text 
            key={i} 
            style={[
              baseStyles.contactItem,
              i === header.contact.length - 1 && baseStyles.contactItemLast
            ]}
          >
            {contact}
          </Text>
        ))}
      </View>
    );
  };

  // Render different item types
  const renderItem = (item, sectionType) => {
    switch (item.type) {
      case 'job':
        return (
          <View style={baseStyles.jobContainer}>
            <View style={baseStyles.jobHeader}>
              <Text style={baseStyles.jobTitle}>{item.role}</Text>
              <Text style={baseStyles.date}>{item.date}</Text>
            </View>
            <Text style={baseStyles.company}>{item.company}</Text>
            {item.location && (
              <Text style={baseStyles.location}>{item.location}</Text>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <View style={{ marginTop: 6 }}>
                {item.bullets.map((bullet, i) => (
                  <View key={i} style={baseStyles.bulletRow}>
                    <View style={{ ...baseStyles.bulletPoint, backgroundColor: '#60a5fa' }} />
                    <Text style={baseStyles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'education':
        return (
          <View style={baseStyles.educationContainer}>
            <View style={baseStyles.jobHeader}>
              <Text style={baseStyles.degree}>{item.degree}</Text>
              <Text style={baseStyles.date}>{item.date}</Text>
            </View>
            <Text style={baseStyles.institution}>{item.institution}</Text>
            {item.location && (
              <Text style={baseStyles.location}>{item.location}</Text>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <View style={{ marginTop: 6 }}>
                {item.bullets.map((bullet, i) => (
                  <View key={i} style={baseStyles.bulletRow}>
                    <View style={baseStyles.bulletPoint} />
                    <Text style={baseStyles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'skill':
        return null; // Skills are handled separately in renderSkillsSection

      case 'skill_category':
        return (
          <View key={item.category} style={{ marginBottom: 8 }}>
            <Text style={baseStyles.skillCategory}>{item.category}:</Text>
            <Text style={baseStyles.skillText}>
              {item.skills.join(' • ')}
            </Text>
          </View>
        );

      case 'bullet':
        return (
          <View style={baseStyles.bulletRow}>
            <View style={baseStyles.bulletPoint} />
            <Text style={baseStyles.bulletText}>{item.text}</Text>
          </View>
        );

      case 'text':
        return (
          <Text style={baseStyles.paragraph}>{item.text}</Text>
        );

      default:
        return null;
    }
  };

  // Handle skills section specially
  const renderSkillsSection = (section) => {
    const skills = section.items.filter(item => item.type === 'skill');
    const categories = section.items.filter(item => item.type === 'skill_category');
    const others = section.items.filter(item => 
      item.type !== 'skill' && item.type !== 'skill_category'
    );

    return (
      <View style={baseStyles.section}>
        <Text style={baseStyles.sectionTitle}>{section.title}</Text>
        
        {/* Categorized skills */}
        {categories.length > 0 && (
          <View>
            {categories.map((cat, i) => (
              <View key={i}>
                {renderItem(cat, 'skills')}
              </View>
            ))}
          </View>
        )}
        
        {/* Regular skills as tags */}
        {skills.length > 0 && (
          <View style={baseStyles.skillsContainer}>
            {skills.map((skill, i) => (
              <Text key={i} style={baseStyles.skillTag}>
                {skill.text}
              </Text>
            ))}
          </View>
        )}
        
        {/* Other items (bullets, text, etc.) */}
        {others.map((item, i) => (
          <View key={`other-${i}`}>
            {renderItem(item, 'skills')}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header Section */}
        <View style={baseStyles.header}>
          {header.name && <Text style={baseStyles.name}>{header.name}</Text>}
          {header.title && <Text style={baseStyles.title}>{header.title}</Text>}
          {renderContact()}
        </View>

        {/* Resume Sections */}
        {sections.map((section, i) => {
          // Special handling for skills section
          if (section.title.toLowerCase().includes('skill')) {
            return <View key={i}>{renderSkillsSection(section)}</View>;
          }

          // Regular sections (Experience, Education, etc.)
          return (
            <View key={i} style={baseStyles.section}>
              <Text style={baseStyles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, j) => (
                <View key={j}>
                  {renderItem(item, section.title.toLowerCase())}
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
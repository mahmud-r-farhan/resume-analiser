import { Document, Page, Text, View, Svg, Path } from '@react-pdf/renderer';
import { baseStyles } from './BaseStyles';
import { parseResumeMarkdown } from './parser';

// Gradient accent bar
const accentBar = (
  <Svg width="8" height="100%" viewBox="0 0 8 842" style={{ position: 'absolute', left: 0, top: 0 }}>
    <Path d="M0 0 H8 V842 H0 Z" fill="#4DCFFF" />
    <Path d="M0 0 H8 L0 842 Z" fill="#FF6B9C" opacity="0.6" />
  </Svg>
);

export const ModernTemplate = ({ data }) => {
  const { header, sections } = parseResumeMarkdown(data);
  
  // Separate skills and other sections
  const skillsSection = sections.find(s => s.title.toLowerCase().includes('skill'));
  const summarySection = sections.find(s => 
    s.title.toLowerCase().includes('summary') || 
    s.title.toLowerCase().includes('profile') ||
    s.title.toLowerCase().includes('about')
  );
  const otherSections = sections.filter(s => 
    !s.title.toLowerCase().includes('skill') &&
    !s.title.toLowerCase().includes('summary') &&
    !s.title.toLowerCase().includes('profile') &&
    !s.title.toLowerCase().includes('about')
  );

  const renderContact = () => {
    if (header.contact.length === 0) return null;
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {header.contact.map((contact, i) => (
          <Text 
            key={i} 
            style={{
              fontSize: 9.5,
              color: '#64748b',
              marginRight: i < header.contact.length - 1 ? 14 : 0,
              paddingRight: i < header.contact.length - 1 ? 14 : 0,
              borderRightWidth: i < header.contact.length - 1 ? 1 : 0,
              borderRightColor: i < header.contact.length - 1 ? '#cbd5e1' : 'transparent'
            }}
          >
            {contact}
          </Text>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!skillsSection) return null;

    const skills = skillsSection.items.filter(item => item.type === 'skill');
    const categories = skillsSection.items.filter(item => item.type === 'skill_category');

    return (
      <>
        <Text style={{ 
          fontSize: 12.5, 
          fontWeight: 700, 
          color: '#FF6B9C', 
          marginBottom: 12,
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}>
          {skillsSection.title}
        </Text>
        
        {/* Categorized skills */}
        {categories.map((cat, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={{ 
              fontSize: 10, 
              fontWeight: 700, 
              color: '#334155',
              marginBottom: 6
            }}>
              {cat.category}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {cat.skills.map((skill, j) => (
                <Text key={j} style={{
                  backgroundColor: '#fef3f2',
                  color: '#FF6B9C',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 4,
                  fontSize: 9.5,
                  fontWeight: 600,
                  marginRight: 6,
                  marginBottom: 6,
                  borderWidth: 1,
                  borderColor: '#fecdd3'
                }}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        ))}
        
        {/* Regular skills */}
        {skills.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {skills.map((skill, i) => (
              <Text key={i} style={{
                backgroundColor: '#eff6ff',
                color: '#4DCFFF',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 4,
                fontSize: 9.5,
                fontWeight: 600,
                marginRight: 6,
                marginBottom: 6,
                borderWidth: 1,
                borderColor: '#bae6fd'
              }}>
                {skill.text}
              </Text>
            ))}
          </View>
        )}
      </>
    );
  };

  const renderItem = (item) => {
    switch (item.type) {
      case 'job':
        return (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', flex: 1 }}>
                {item.role}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginLeft: 14 }}>
                {item.date}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: 600, color: '#4DCFFF', marginBottom: 6 }}>
              {item.company}
            </Text>
            {item.location && (
              <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 6, fontStyle: 'italic' }}>
                {item.location}
              </Text>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <View>
                {item.bullets.map((bullet, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ width: 6, marginRight: 10, color: '#4DCFFF', fontSize: 12 }}>•</Text>
                    <Text style={{ fontSize: 11, lineHeight: 1.65, color: '#475569', flex: 1 }}>
                      {bullet}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'education':
        return (
          <View style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 11.5, fontWeight: 700, color: '#0f172a' }}>
                {item.degree}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                {item.date}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: 600, color: '#4DCFFF' }}>
              {item.institution}
            </Text>
            {item.location && (
              <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 6, fontStyle: 'italic' }}>
                {item.location}
              </Text>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <View style={{ marginTop: 6 }}>
                {item.bullets.map((bullet, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text style={{ width: 6, marginRight: 10, color: '#4DCFFF' }}>•</Text>
                    <Text style={{ fontSize: 10.5, lineHeight: 1.65, color: '#475569' }}>
                      {bullet}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'bullet':
        return (
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ width: 6, marginRight: 10, color: '#4DCFFF' }}>•</Text>
            <Text style={{ fontSize: 11, lineHeight: 1.65, color: '#475569' }}>
              {item.text}
            </Text>
          </View>
        );

      case 'text':
        return (
          <Text style={{ fontSize: 11, lineHeight: 1.65, color: '#475569', marginBottom: 8 }}>
            {item.text}
          </Text>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={{ ...baseStyles.page, paddingLeft: 52, position: 'relative' }}>
        {accentBar}

        {/* Header */}
        <View style={{ marginLeft: 16, marginBottom: 25, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: '#e2e8f0' }}>
          {header.name && (
            <Text style={{ fontSize: 30, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: -0.5 }}>
              {header.name}
            </Text>
          )}
          {header.title && (
            <Text style={{ fontSize: 15.5, fontWeight: 600, color: '#4DCFFF', marginBottom: 10 }}>
              {header.title}
            </Text>
          )}
          {renderContact()}
        </View>

        {/* Summary Section (Full Width) */}
        {summarySection && (
          <View style={{ marginLeft: 16, marginBottom: 18 }}>
            <Text style={{ 
              fontSize: 12.5, 
              fontWeight: 700, 
              color: '#FF6B9C', 
              marginBottom: 10,
              letterSpacing: 1,
              textTransform: 'uppercase'
            }}>
              {summarySection.title}
            </Text>
            {summarySection.items.map((item, i) => (
              <Text key={i} style={{ 
                fontSize: 11, 
                lineHeight: 1.75, 
                color: '#475569',
                textAlign: 'justify'
              }}>
                {item.text}
              </Text>
            ))}
          </View>
        )}

        {/* Two Column Layout */}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {/* Left Column - Skills */}
          <View style={{ width: '38%', paddingRight: 18, marginLeft: 16 }}>
            {renderSkills()}
          </View>

          {/* Right Column - Experience, Education, etc. */}
          <View style={{ width: '62%', paddingLeft: 10 }}>
            {otherSections.map((section, i) => (
              <View key={i} style={{ marginBottom: 18 }}>
                <Text style={{ 
                  fontSize: 12.5, 
                  fontWeight: 700, 
                  color: '#4DCFFF', 
                  marginBottom: 12,
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: '#bae6fd',
                  letterSpacing: 1,
                  textTransform: 'uppercase'
                }}>
                  {section.title}
                </Text>
                {section.items.map((item, j) => (
                  <View key={j}>
                    {renderItem(item)}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
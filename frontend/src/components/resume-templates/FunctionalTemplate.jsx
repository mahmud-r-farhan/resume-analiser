import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles } from './BaseStyles';
import { parseResumeMarkdown } from './parser';

export const FunctionalTemplate = ({ data }) => {
  const { header, sections } = parseResumeMarkdown(data);

  // Organize sections
  const skillsSection = sections.find(s => s.title.toLowerCase().includes('skill'));
  const experienceSection = sections.find(s => 
    s.title.toLowerCase().includes('experience') || 
    s.title.toLowerCase().includes('work')
  );
  const educationSection = sections.find(s => s.title.toLowerCase().includes('education'));
  const summarySection = sections.find(s => 
    s.title.toLowerCase().includes('summary') || 
    s.title.toLowerCase().includes('profile')
  );
  const otherSections = sections.filter(s => 
    !['skill', 'experience', 'work', 'education', 'summary', 'profile'].some(
      keyword => s.title.toLowerCase().includes(keyword)
    )
  );

  const renderContact = () => {
    if (header.contact.length === 0) return null;
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, justifyContent: 'center' }}>
        {header.contact.map((contact, i) => (
          <Text 
            key={i} 
            style={{
              fontSize: 9.5,
              color: '#6b21a8',
              marginHorizontal: 10,
              paddingHorizontal: 10,
              borderRight: i < header.contact.length - 1 ? '1pt solid #d8b4fe' : 'none'
            }}
          >
            {contact}
          </Text>
        ))}
      </View>
    );
  };

  const renderSkillsGrid = () => {
    if (!skillsSection) return null;

    const skills = skillsSection.items.filter(item => item.type === 'skill');
    const categories = skillsSection.items.filter(item => item.type === 'skill_category');

    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 13.5, 
          fontWeight: 700, 
          color: '#7c3aed', 
          marginBottom: 14,
          textAlign: 'center',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          paddingBottom: 8,
          borderBottom: '2pt solid #e9d5ff'
        }}>
          Core Competencies
        </Text>
        
        {/* Categorized Skills */}
        {categories.length > 0 && (
          <View>
            {categories.map((cat, i) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  color: '#6b21a8',
                  marginBottom: 8,
                  paddingLeft: 10,
                  borderLeft: '3pt solid #c084fc'
                }}>
                  {cat.category}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 10 }}>
                  {cat.skills.map((skill, j) => (
                    <View key={j} style={{ width: '33.33%', padding: 5 }}>
                      <Text style={{ 
                        fontSize: 10, 
                        backgroundColor: '#faf5ff', 
                        paddingHorizontal: 12, 
                        paddingVertical: 7, 
                        borderRadius: 6, 
                        textAlign: 'center', 
                        color: '#6b21a8',
                        fontWeight: 600,
                        border: '1pt solid #e9d5ff'
                      }}>
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Regular Skills Grid */}
        {skills.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: categories.length > 0 ? 10 : 0 }}>
            {skills.slice(0, 24).map((skill, i) => (
              <View key={i} style={{ width: '33.33%', padding: 5 }}>
                <Text style={{ 
                  fontSize: 10, 
                  backgroundColor: '#faf5ff', 
                  paddingHorizontal: 12, 
                  paddingVertical: 7, 
                  borderRadius: 6, 
                  textAlign: 'center', 
                  color: '#6b21a8',
                  fontWeight: 600,
                  border: '1pt solid #e9d5ff'
                }}>
                  {skill.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderExperience = () => {
    if (!experienceSection) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ 
          fontSize: 12.5, 
          fontWeight: 700, 
          color: '#7c3aed', 
          marginBottom: 12,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          paddingBottom: 5,
          borderBottom: '1pt solid #c084fc'
        }}>
          {experienceSection.title}
        </Text>
        {experienceSection.items.map((item, i) => {
          if (item.type === 'job') {
            return (
              <View key={i} style={{ marginBottom: 16, paddingLeft: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                  <Text style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', flex: 1 }}>
                    {item.role}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, marginLeft: 14 }}>
                    {item.date}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', marginBottom: 6 }}>
                  {item.company}
                </Text>
                {item.location && (
                  <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6, fontStyle: 'italic' }}>
                    {item.location}
                  </Text>
                )}
                {item.bullets && item.bullets.length > 0 && (
                  <View>
                    {item.bullets.map((bullet, j) => (
                      <View key={j} style={{ flexDirection: 'row', marginBottom: 8 }}>
                        <View style={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: 2, 
                          backgroundColor: '#a78bfa', 
                          marginTop: 7, 
                          marginRight: 12 
                        }} />
                        <Text style={{ fontSize: 11, lineHeight: 1.65, color: '#374151', flex: 1 }}>
                          {bullet}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderEducation = () => {
    if (!educationSection) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ 
          fontSize: 12.5, 
          fontWeight: 700, 
          color: '#7c3aed', 
          marginBottom: 12,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          paddingBottom: 5,
          borderBottom: '1pt solid #c084fc'
        }}>
          {educationSection.title}
        </Text>
        {educationSection.items.map((item, i) => {
          if (item.type === 'education') {
            return (
              <View key={i} style={{ marginBottom: 12, paddingLeft: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 11.5, fontWeight: 700, color: '#1f2937' }}>
                    {item.degree}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6b7280', fontWeight: 600 }}>
                    {item.date}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed' }}>
                  {item.institution}
                </Text>
                {item.location && (
                  <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6, fontStyle: 'italic' }}>
                    {item.location}
                  </Text>
                )}
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderOtherSection = (section) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ 
        fontSize: 12.5, 
        fontWeight: 700, 
        color: '#7c3aed', 
        marginBottom: 10,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        paddingBottom: 5,
        borderBottom: '1pt solid #c084fc'
      }}>
        {section.title}
      </Text>
      {section.items.map((item, i) => {
        if (item.type === 'bullet') {
          return (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 8, paddingLeft: 5 }}>
              <View style={{ 
                width: 4, 
                height: 4, 
                borderRadius: 2, 
                backgroundColor: '#a78bfa', 
                marginTop: 7, 
                marginRight: 12 
              }} />
              <Text style={{ fontSize: 11, lineHeight: 1.65, color: '#374151' }}>
                {item.text}
              </Text>
            </View>
          );
        }
        if (item.type === 'text') {
          return (
            <Text key={i} style={{ fontSize: 11, lineHeight: 1.65, color: '#374151', marginBottom: 8, paddingLeft: 5 }}>
              {item.text}
            </Text>
          );
        }
        return null;
      })}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header - Centered */}
        <View style={{ marginBottom: 25, paddingBottom: 14, borderBottom: '2pt solid #e9d5ff', textAlign: 'center' }}>
          {header.name && (
            <Text style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', marginBottom: 6, letterSpacing: -0.5 }}>
              {header.name}
            </Text>
          )}
          {header.title && (
            <Text style={{ fontSize: 16, fontWeight: 600, color: '#7c3aed', marginBottom: 10 }}>
              {header.title}
            </Text>
          )}
          {renderContact()}
        </View>

        {/* Professional Summary (if exists) */}
        {summarySection && (
          <View style={{ marginBottom: 20, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#faf5ff', borderRadius: 8, border: '1pt solid #e9d5ff' }}>
            <Text style={{ 
              fontSize: 11.5, 
              fontWeight: 700, 
              color: '#7c3aed', 
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              {summarySection.title}
            </Text>
            {summarySection.items.map((item, i) => (
              <Text key={i} style={{ fontSize: 11, lineHeight: 1.75, color: '#4b5563', textAlign: 'justify' }}>
                {item.text}
              </Text>
            ))}
          </View>
        )}

        {/* Skills Grid at Top */}
        {renderSkillsGrid()}

        {/* Professional Experience */}
        {renderExperience()}

        {/* Education */}
        {renderEducation()}

        {/* Other Sections */}
        {otherSections.map((section, i) => (
          <View key={i}>
            {renderOtherSection(section)}
          </View>
        ))}
      </Page>
    </Document>
  );
};
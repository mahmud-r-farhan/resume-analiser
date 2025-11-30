const React = require('react');
const { Document, Page, Text, View } = require('@react-pdf/renderer');
const { baseStyles } = require('./BaseStyles');
const { parseResumeMarkdown } = require('./parser');

const FunctionalTemplate = ({ data }) => {
  const { header, sections } = parseResumeMarkdown(data);

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
    return React.createElement(
      View,
      { style: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, justifyContent: 'center' } },
      header.contact.map((contact, i) => 
        React.createElement(
          Text,
          { 
            key: i,
            style: {
              fontSize: 9.5,
              color: '#6b21a8',
              marginHorizontal: 10,
              paddingHorizontal: 10,
              borderRight: i < header.contact.length - 1 ? '1pt solid #d8b4fe' : 'none'
            }
          },
          contact
        )
      )
    );
  };

  const renderSkillsGrid = () => {
    if (!skillsSection) return null;

    const skills = skillsSection.items.filter(item => item.type === 'skill');
    const categories = skillsSection.items.filter(item => item.type === 'skill_category');

    return React.createElement(
      View,
      { style: { marginBottom: 24 } },
      React.createElement(
        Text,
        { 
          style: { 
            fontSize: 13.5, 
            fontWeight: 700, 
            color: '#7c3aed', 
            marginBottom: 14,
            textAlign: 'center',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            paddingBottom: 8,
            borderBottom: '2pt solid #e9d5ff'
          }
        },
        'Core Competencies'
      ),
      categories.length > 0 && React.createElement(
        View,
        null,
        categories.map((cat, i) => 
          React.createElement(
            View,
            { key: i, style: { marginBottom: 14 } },
            React.createElement(
              Text,
              { 
                style: { 
                  fontSize: 11, 
                  fontWeight: 700, 
                  color: '#6b21a8',
                  marginBottom: 8,
                  paddingLeft: 10,
                  borderLeft: '3pt solid #c084fc'
                }
              },
              cat.category
            ),
            React.createElement(
              View,
              { style: { flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 10 } },
              cat.skills.map((skill, j) => 
                React.createElement(
                  View,
                  { key: j, style: { width: '33.33%', padding: 5 } },
                  React.createElement(
                    Text,
                    { 
                      style: { 
                        fontSize: 10, 
                        backgroundColor: '#faf5ff', 
                        paddingHorizontal: 12, 
                        paddingVertical: 7, 
                        borderRadius: 6, 
                        textAlign: 'center', 
                        color: '#6b21a8',
                        fontWeight: 600,
                        border: '1pt solid #e9d5ff'
                      }
                    },
                    skill
                  )
                )
              )
            )
          )
        )
      ),
      skills.length > 0 && React.createElement(
        View,
        { style: { flexDirection: 'row', flexWrap: 'wrap', marginTop: categories.length > 0 ? 10 : 0 } },
        skills.slice(0, 24).map((skill, i) => 
          React.createElement(
            View,
            { key: i, style: { width: '33.33%', padding: 5 } },
            React.createElement(
              Text,
              { 
                style: { 
                  fontSize: 10, 
                  backgroundColor: '#faf5ff', 
                  paddingHorizontal: 12, 
                  paddingVertical: 7, 
                  borderRadius: 6, 
                  textAlign: 'center', 
                  color: '#6b21a8',
                  fontWeight: 600,
                  border: '1pt solid #e9d5ff'
                }
              },
              skill.text
            )
          )
        )
      )
    );
  };

  const renderExperience = () => {
    if (!experienceSection) return null;

    return React.createElement(
      View,
      { style: { marginBottom: 20 } },
      React.createElement(
        Text,
        { 
          style: { 
            fontSize: 12.5, 
            fontWeight: 700, 
            color: '#7c3aed', 
            marginBottom: 12,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            paddingBottom: 5,
            borderBottom: '1pt solid #c084fc'
          }
        },
        experienceSection.title
      ),
      experienceSection.items.map((item, i) => {
        if (item.type === 'job') {
          return React.createElement(
            View,
            { key: i, style: { marginBottom: 16, paddingLeft: 5 } },
            React.createElement(
              View,
              { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 } },
              React.createElement(
                Text,
                { style: { fontSize: 12, fontWeight: 700, color: '#1f2937', flex: 1 } },
                item.role
              ),
              React.createElement(
                Text,
                { style: { fontSize: 10, color: '#6b7280', fontWeight: 600, marginLeft: 14 } },
                item.date
              )
            ),
            React.createElement(
              Text,
              { style: { fontSize: 11, fontWeight: 600, color: '#7c3aed', marginBottom: 6 } },
              item.company
            ),
            item.location && React.createElement(
              Text,
              { style: { fontSize: 10, color: '#9ca3af', marginBottom: 6, fontStyle: 'italic' } },
              item.location
            ),
            item.bullets && item.bullets.length > 0 && React.createElement(
              View,
              null,
              item.bullets.map((bullet, j) => 
                React.createElement(
                  View,
                  { key: j, style: { flexDirection: 'row', marginBottom: 8 } },
                  React.createElement(
                    View,
                    { 
                      style: { 
                        width: 4, 
                        height: 4, 
                        borderRadius: 2, 
                        backgroundColor: '#a78bfa', 
                        marginTop: 7, 
                        marginRight: 12 
                      } 
                    }
                  ),
                  React.createElement(
                    Text,
                    { style: { fontSize: 11, lineHeight: 1.65, color: '#374151', flex: 1 } },
                    bullet
                  )
                )
              )
            )
          );
        }
        return null;
      })
    );
  };

  const renderEducation = () => {
    if (!educationSection) return null;

    return React.createElement(
      View,
      { style: { marginBottom: 20 } },
      React.createElement(
        Text,
        { 
          style: { 
            fontSize: 12.5, 
            fontWeight: 700, 
            color: '#7c3aed', 
            marginBottom: 12,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            paddingBottom: 5,
            borderBottom: '1pt solid #c084fc'
          }
        },
        educationSection.title
      ),
      educationSection.items.map((item, i) => {
        if (item.type === 'education') {
          return React.createElement(
            View,
            { key: i, style: { marginBottom: 12, paddingLeft: 5 } },
            React.createElement(
              View,
              { style: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 } },
              React.createElement(
                Text,
                { style: { fontSize: 11.5, fontWeight: 700, color: '#1f2937' } },
                item.degree
              ),
              React.createElement(
                Text,
                { style: { fontSize: 10, color: '#6b7280', fontWeight: 600 } },
                item.date
              )
            ),
            React.createElement(
              Text,
              { style: { fontSize: 11, fontWeight: 600, color: '#7c3aed' } },
              item.institution
            ),
            item.location && React.createElement(
              Text,
              { style: { fontSize: 10, color: '#9ca3af', marginBottom: 6, fontStyle: 'italic' } },
              item.location
            )
          );
        }
        return null;
      })
    );
  };

  const renderOtherSection = (section) => 
    React.createElement(
      View,
      { style: { marginBottom: 18 } },
      React.createElement(
        Text,
        { 
          style: { 
            fontSize: 12.5, 
            fontWeight: 700, 
            color: '#7c3aed', 
            marginBottom: 10,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            paddingBottom: 5,
            borderBottom: '1pt solid #c084fc'
          }
        },
        section.title
      ),
      section.items.map((item, i) => {
        if (item.type === 'bullet') {
          return React.createElement(
            View,
            { key: i, style: { flexDirection: 'row', marginBottom: 8, paddingLeft: 5 } },
            React.createElement(
              View,
              { 
                style: { 
                  width: 4, 
                  height: 4, 
                  borderRadius: 2, 
                  backgroundColor: '#a78bfa', 
                  marginTop: 7, 
                  marginRight: 12 
                } 
              }
            ),
            React.createElement(
              Text,
              { style: { fontSize: 11, lineHeight: 1.65, color: '#374151' } },
              item.text
            )
          );
        }
        if (item.type === 'text') {
          return React.createElement(
            Text,
            { key: i, style: { fontSize: 11, lineHeight: 1.65, color: '#374151', marginBottom: 8, paddingLeft: 5 } },
            item.text
          );
        }
        return null;
      })
    );

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: baseStyles.page },
      React.createElement(
        View,
        { style: { marginBottom: 25, paddingBottom: 14, borderBottom: '2pt solid #e9d5ff', textAlign: 'center' } },
        header.name && React.createElement(
          Text,
          { style: { fontSize: 26, fontWeight: 700, color: '#1f2937', marginBottom: 6, letterSpacing: -0.5 } },
          header.name
        ),
        header.title && React.createElement(
          Text,
          { style: { fontSize: 16, fontWeight: 600, color: '#7c3aed', marginBottom: 10 } },
          header.title
        ),
        renderContact()
      ),
      summarySection && React.createElement(
        View,
        { style: { marginBottom: 20, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#faf5ff', borderRadius: 8, border: '1pt solid #e9d5ff' } },
        React.createElement(
          Text,
          { 
            style: { 
              fontSize: 11.5, 
              fontWeight: 700, 
              color: '#7c3aed', 
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1
            }
          },
          summarySection.title
        ),
        summarySection.items.map((item, i) => 
          React.createElement(
            Text,
            { key: i, style: { fontSize: 11, lineHeight: 1.75, color: '#4b5563', textAlign: 'justify' } },
            item.text
          )
        )
      ),
      renderSkillsGrid(),
      renderExperience(),
      renderEducation(),
      otherSections.map((section, i) => 
        React.createElement(
          View,
          { key: i },
          renderOtherSection(section)
        )
      )
    )
  );
};

module.exports = { FunctionalTemplate };
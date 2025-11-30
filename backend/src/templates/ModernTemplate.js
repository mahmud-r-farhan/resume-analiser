const React = require('react');
const { Document, Page, Text, View, Svg, Path } = require('@react-pdf/renderer');
const { baseStyles } = require('./BaseStyles');
const { parseResumeMarkdown } = require('./parser');

const accentBar = React.createElement(
  Svg,
  { width: '8', height: '100%', viewBox: '0 0 8 842', style: { position: 'absolute', left: 0, top: 0 } },
  React.createElement(Path, { d: 'M0 0 H8 V842 H0 Z', fill: '#4DCFFF' }),
  React.createElement(Path, { d: 'M0 0 H8 L0 842 Z', fill: '#FF6B9C', opacity: '0.6' })
);

const ModernTemplate = ({ data }) => {
  const { header, sections } = parseResumeMarkdown(data);
  
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
    return React.createElement(
      View,
      { style: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 } },
      header.contact.map((contact, i) => 
        React.createElement(
          Text,
          { 
            key: i,
            style: {
              fontSize: 9.5,
              color: '#64748b',
              marginRight: i < header.contact.length - 1 ? 14 : 0,
              paddingRight: i < header.contact.length - 1 ? 14 : 0,
              borderRightWidth: i < header.contact.length - 1 ? 1 : 0,
              borderRightColor: i < header.contact.length - 1 ? '#cbd5e1' : 'transparent'
            }
          },
          contact
        )
      )
    );
  };

  const renderSkills = () => {
    if (!skillsSection) return null;

    const skills = skillsSection.items.filter(item => item.type === 'skill');
    const categories = skillsSection.items.filter(item => item.type === 'skill_category');

    return [
      React.createElement(
        Text,
        { 
          style: { 
            fontSize: 12.5, 
            fontWeight: 700, 
            color: '#FF6B9C', 
            marginBottom: 12,
            letterSpacing: 1,
            textTransform: 'uppercase'
          }
        },
        skillsSection.title
      ),
      categories.map((cat, i) => 
        React.createElement(
          View,
          { key: i, style: { marginBottom: 12 } },
          React.createElement(
            Text,
            { 
              style: { 
                fontSize: 10, 
                fontWeight: 700, 
                color: '#334155',
                marginBottom: 6
              }
            },
            cat.category
          ),
          React.createElement(
            View,
            { style: { flexDirection: 'row', flexWrap: 'wrap' } },
            cat.skills.map((skill, j) => 
              React.createElement(
                Text,
                { 
                  key: j,
                  style: {
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
                  }
                },
                skill
              )
            )
          )
        )
      ),
      skills.length > 0 && React.createElement(
        View,
        { style: { flexDirection: 'row', flexWrap: 'wrap' } },
        skills.map((skill, i) => 
          React.createElement(
            Text,
            { 
              key: i,
              style: {
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
              }
            },
            skill.text
          )
        )
      )
    ];
  };

  const renderItem = (item) => {
    switch (item.type) {
      case 'job':
        return React.createElement(
          View,
          { style: { marginBottom: 16 } },
          React.createElement(
            View,
            { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 } },
            React.createElement(
              Text,
              { style: { fontSize: 12, fontWeight: 700, color: '#0f172a', flex: 1 } },
              item.role
            ),
            React.createElement(
              Text,
              { style: { fontSize: 10, color: '#64748b', fontWeight: 600, marginLeft: 14 } },
              item.date
            )
          ),
          React.createElement(
            Text,
            { style: { fontSize: 11, fontWeight: 600, color: '#4DCFFF', marginBottom: 6 } },
            item.company
          ),
          item.location && React.createElement(
            Text,
            { style: { fontSize: 10, color: '#64748b', marginBottom: 6, fontStyle: 'italic' } },
            item.location
          ),
          item.bullets && item.bullets.length > 0 && React.createElement(
            View,
            null,
            item.bullets.map((bullet, i) => 
              React.createElement(
                View,
                { key: i, style: { flexDirection: 'row', marginBottom: 8 } },
                React.createElement(
                  Text,
                  { style: { width: 6, marginRight: 10, color: '#4DCFFF', fontSize: 12 } },
                  '•'
                ),
                React.createElement(
                  Text,
                  { style: { fontSize: 11, lineHeight: 1.65, color: '#475569', flex: 1 } },
                  bullet
                )
              )
            )
          )
        );

      case 'education':
        return React.createElement(
          View,
          { style: { marginBottom: 14 } },
          React.createElement(
            View,
            { style: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 } },
            React.createElement(
              Text,
              { style: { fontSize: 11.5, fontWeight: 700, color: '#0f172a' } },
              item.degree
            ),
            React.createElement(
              Text,
              { style: { fontSize: 10, color: '#64748b', fontWeight: 600 } },
              item.date
            )
          ),
          React.createElement(
            Text,
            { style: { fontSize: 11, fontWeight: 600, color: '#4DCFFF' } },
            item.institution
          ),
          item.location && React.createElement(
            Text,
            { style: { fontSize: 10, color: '#64748b', marginBottom: 6, fontStyle: 'italic' } },
            item.location
          ),
          item.bullets && item.bullets.length > 0 && React.createElement(
            View,
            { style: { marginTop: 6 } },
            item.bullets.map((bullet, i) => 
              React.createElement(
                View,
                { key: i, style: { flexDirection: 'row', marginBottom: 6 } },
                React.createElement(
                  Text,
                  { style: { width: 6, marginRight: 10, color: '#4DCFFF' } },
                  '•'
                ),
                React.createElement(
                  Text,
                  { style: { fontSize: 10.5, lineHeight: 1.65, color: '#475569' } },
                  bullet
                )
              )
            )
          )
        );

      case 'bullet':
        return React.createElement(
          View,
          { style: { flexDirection: 'row', marginBottom: 8 } },
          React.createElement(
            Text,
            { style: { width: 6, marginRight: 10, color: '#4DCFFF' } },
            '•'
          ),
          React.createElement(
            Text,
            { style: { fontSize: 11, lineHeight: 1.65, color: '#475569' } },
            item.text
          )
        );

      case 'text':
        return React.createElement(
          Text,
          { style: { fontSize: 11, lineHeight: 1.65, color: '#475569', marginBottom: 8 } },
          item.text
        );

      default:
        return null;
    }
  };

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: { ...baseStyles.page, paddingLeft: 52, position: 'relative' } },
      accentBar,
      React.createElement(
        View,
        { style: { marginLeft: 16, marginBottom: 25, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: '#e2e8f0' } },
        header.name && React.createElement(
          Text,
          { style: { fontSize: 30, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: -0.5 } },
          header.name
        ),
        header.title && React.createElement(
          Text,
          { style: { fontSize: 15.5, fontWeight: 600, color: '#4DCFFF', marginBottom: 10 } },
          header.title
        ),
        renderContact()
      ),
      summarySection && React.createElement(
        View,
        { style: { marginLeft: 16, marginBottom: 18 } },
        React.createElement(
          Text,
          { 
            style: { 
              fontSize: 12.5, 
              fontWeight: 700, 
              color: '#FF6B9C', 
              marginBottom: 10,
              letterSpacing: 1,
              textTransform: 'uppercase'
            }
          },
          summarySection.title
        ),
        summarySection.items.map((item, i) => 
          React.createElement(
            Text,
            { 
              key: i,
              style: { 
                fontSize: 11, 
                lineHeight: 1.75, 
                color: '#475569',
                textAlign: 'justify'
              }
            },
            item.text
          )
        )
      ),
      React.createElement(
        View,
        { style: { flexDirection: 'row', marginTop: 10 } },
        React.createElement(
          View,
          { style: { width: '38%', paddingRight: 18, marginLeft: 16 } },
          renderSkills()
        ),
        React.createElement(
          View,
          { style: { width: '62%', paddingLeft: 10 } },
          otherSections.map((section, i) => 
            React.createElement(
              View,
              { key: i, style: { marginBottom: 18 } },
              React.createElement(
                Text,
                { 
                  style: { 
                    fontSize: 12.5, 
                    fontWeight: 700, 
                    color: '#4DCFFF', 
                    marginBottom: 12,
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#bae6fd',
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }
                },
                section.title
              ),
              section.items.map((item, j) => 
                React.createElement(
                  View,
                  { key: j },
                  renderItem(item)
                )
              )
            )
          )
        )
      )
    )
  );
};

module.exports = { ModernTemplate };
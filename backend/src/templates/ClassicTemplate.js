const React = require('react');
const { Document, Page, Text, View } = require('@react-pdf/renderer');
const { baseStyles } = require('./BaseStyles');
const { parseResumeMarkdown } = require('./parser');

const ClassicTemplate = ({ data }) => {
  const { header, sections } = parseResumeMarkdown(data);

  const renderContact = () => {
    if (!header.contact || header.contact.length === 0) return null;
    return React.createElement(
      View,
      { style: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 } },
      header.contact.map((contact, i) =>
        React.createElement(
          Text,
          {
            key: i,
            style: [
              baseStyles.contactItem,
              i === header.contact.length - 1 && baseStyles.contactItemLast,
            ],
          },
          contact
        )
      )
    );
  };

  const renderItem = (item) => {
    switch (item.type) {
      case 'job':
        return React.createElement(
          View,
          { key: item.role, style: baseStyles.jobContainer },
          React.createElement(
            View,
            { style: baseStyles.jobHeader },
            React.createElement(Text, { style: baseStyles.jobTitle }, item.role),
            React.createElement(Text, { style: baseStyles.date }, item.date)
          ),
          React.createElement(Text, { style: baseStyles.company }, item.company),
          item.location &&
            React.createElement(Text, { style: baseStyles.location }, item.location),
          item.bullets &&
            item.bullets.length > 0 &&
            React.createElement(
              View,
              { style: { marginTop: 4 } },
              item.bullets.map((bullet, i) =>
                React.createElement(
                  View,
                  { key: i, style: baseStyles.bulletRow },
                  React.createElement(View, {
                    style: { ...baseStyles.bulletPoint, backgroundColor: '#60a5fa' },
                  }),
                  React.createElement(Text, { style: baseStyles.bulletText }, bullet)
                )
              )
            )
        );

      case 'education':
        return React.createElement(
          View,
          { key: item.degree, style: baseStyles.educationContainer },
          React.createElement(
            View,
            { style: baseStyles.jobHeader },
            React.createElement(Text, { style: baseStyles.degree }, item.degree),
            React.createElement(Text, { style: baseStyles.date }, item.date)
          ),
          React.createElement(Text, { style: baseStyles.institution }, item.institution),
          item.bullets &&
            item.bullets.length > 0 &&
            React.createElement(
              View,
              { style: { marginTop: 4 } },
              item.bullets.map((bullet, i) =>
                React.createElement(
                  View,
                  { key: i, style: baseStyles.bulletRow },
                  React.createElement(View, { style: baseStyles.bulletPoint }),
                  React.createElement(Text, { style: baseStyles.bulletText }, bullet)
                )
              )
            )
        );

      case 'bullet':
        return React.createElement(
          View,
          { key: `bullet-${Math.random()}`, style: baseStyles.bulletRow },
          React.createElement(View, { style: baseStyles.bulletPoint }),
          React.createElement(Text, { style: baseStyles.bulletText }, item.text)
        );

      case 'text':
        return React.createElement(
          Text,
          { key: `text-${Math.random()}`, style: baseStyles.paragraph },
          item.text
        );

      default:
        return null;
    }
  };

  const renderSkillsSection = (section) => {
    const skills = section.items.filter((item) => item.type === 'skill');
    const categories = section.items.filter((item) => item.type === 'skill_category');
    const others = section.items.filter(
      (item) => item.type !== 'skill' && item.type !== 'skill_category'
    );

    return React.createElement(
      View,
      { style: baseStyles.section },
      React.createElement(Text, { style: baseStyles.sectionTitle }, section.title),
      categories.length > 0 &&
        React.createElement(
          View,
          null,
          categories.map((cat, i) =>
            React.createElement(
              View,
              { key: i },
              renderItem(cat)
            )
          )
        ),
      skills.length > 0 &&
        React.createElement(
          View,
          { style: baseStyles.skillsContainer },
          skills.map((skill, i) =>
            React.createElement(Text, { key: i, style: baseStyles.skillTag }, skill.text)
          )
        ),
      others.map((item, i) =>
        React.createElement(
          View,
          { key: `other-${i}` },
          renderItem(item)
        )
      )
    );
  };

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: baseStyles.page },
      React.createElement(
        View,
        { style: baseStyles.header },
        header.name && React.createElement(Text, { style: baseStyles.name }, header.name),
        header.title && React.createElement(Text, { style: baseStyles.title }, header.title),
        renderContact()
      ),
      sections.map((section, i) => {
        if (section.title.toLowerCase().includes('skill')) {
          return React.createElement(View, { key: i }, renderSkillsSection(section));
        }
        return React.createElement(
          View,
          { key: i, style: baseStyles.section },
          React.createElement(Text, { style: baseStyles.sectionTitle }, section.title),
          section.items.map((item, j) =>
            React.createElement(View, { key: j }, renderItem(item))
          )
        );
      })
    )
  );
};

module.exports = { ClassicTemplate };

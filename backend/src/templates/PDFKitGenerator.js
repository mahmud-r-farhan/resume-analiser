/**
 * PDFKit Resume Generator
 * Generates professional PDF resumes from markdown using PDFKit
 */

const PDFDocument = require('pdfkit');
const { parseResumeMarkdown } = require('./parser');
const { colors, fonts, spacing, classicStyles, modernStyles, functionalStyles } = require('./PDFKitStyles');

/**
 * Helper to draw a rounded rectangle
 */
function drawRoundedRect(doc, x, y, width, height, radius) {
    doc.moveTo(x + radius, y)
        .lineTo(x + width - radius, y)
        .quadraticCurveTo(x + width, y, x + width, y + radius)
        .lineTo(x + width, y + height - radius)
        .quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        .lineTo(x + radius, y + height)
        .quadraticCurveTo(x, y + height, x, y + height - radius)
        .lineTo(x, y + radius)
        .quadraticCurveTo(x, y, x + radius, y)
        .closePath();
}

/**
 * Draw text with automatic word wrap and return new Y position
 */
function drawWrappedText(doc, text, x, y, options = {}) {
    const {
        width = 500,
        fontSize = fonts.sizes.body,
        color = colors.text,
        lineGap = 3,
        align = 'left',
        font = 'Helvetica',
    } = options;

    doc.font(font)
        .fontSize(fontSize)
        .fillColor(color);

    doc.text(text, x, y, {
        width,
        lineGap,
        align,
    });

    return doc.y;
}

/**
 * Draw a bullet point
 */
function drawBullet(doc, x, y, text, options = {}) {
    const {
        width = 480,
        bulletColor = colors.primary,
        textColor = colors.text,
        bulletRadius = 2,
        fontSize = fonts.sizes.body,
    } = options;

    // Draw bullet point
    doc.circle(x + 3, y + 5, bulletRadius)
        .fill(bulletColor);

    // Draw text
    doc.font('Helvetica')
        .fontSize(fontSize)
        .fillColor(textColor);

    doc.text(text, x + 12, y, {
        width: width - 12,
        lineGap: 2,
    });

    return doc.y;
}

/**
 * Classic Template - Traditional professional resume
 */
function generateClassicTemplate(doc, parsed) {
    const styles = classicStyles;
    const pageWidth = doc.page.width - spacing.page.left - spacing.page.right;
    let y = spacing.page.top;

    // Header
    if (parsed.header.name) {
        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.name)
            .fillColor(colors.text);
        doc.text(parsed.header.name, spacing.page.left, y);
        y = doc.y + 4;
    }

    if (parsed.header.title) {
        doc.font('Helvetica')
            .fontSize(fonts.sizes.title)
            .fillColor(colors.textLight);
        doc.text(parsed.header.title, spacing.page.left, y);
        y = doc.y + 4;
    }

    // Contact info
    if (parsed.header.contact && parsed.header.contact.length > 0) {
        doc.font('Helvetica')
            .fontSize(fonts.sizes.contact)
            .fillColor(colors.textMuted);

        const contactText = parsed.header.contact.join('  |  ');
        doc.text(contactText, spacing.page.left, y);
        y = doc.y + 8;
    }

    // Header border
    if (styles.headerBorder) {
        y += 4;
        doc.strokeColor(colors.border)
            .lineWidth(1.5)
            .moveTo(spacing.page.left, y)
            .lineTo(doc.page.width - spacing.page.right, y)
            .stroke();
        y += spacing.headerBottom;
    }

    // Sections
    for (const section of parsed.sections) {
        // Check if we need a new page
        if (y > doc.page.height - 100) {
            doc.addPage();
            y = spacing.page.top;
        }

        // Section title
        y += spacing.section;
        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.sectionTitle)
            .fillColor(styles.colors.primary);
        doc.text(section.title.toUpperCase(), spacing.page.left, y, {
            characterSpacing: 1.2,
        });
        y = doc.y + 4;

        // Section underline
        doc.strokeColor(styles.colors.sectionBorder)
            .lineWidth(1)
            .moveTo(spacing.page.left, y)
            .lineTo(spacing.page.left + 100, y)
            .stroke();
        y += 10;

        // Section items
        for (const item of section.items) {
            // Check for page break
            if (y > doc.page.height - 80) {
                doc.addPage();
                y = spacing.page.top;
            }

            switch (item.type) {
                case 'job':
                    y = renderJobEntry(doc, item, y, pageWidth, styles);
                    break;

                case 'education':
                    y = renderEducationEntry(doc, item, y, pageWidth, styles);
                    break;

                case 'skill_category':
                    y = renderSkillCategory(doc, item, y, pageWidth, styles);
                    break;

                case 'skill':
                    y = renderSkillTag(doc, item, y, styles);
                    break;

                case 'bullet':
                    y = drawBullet(doc, spacing.page.left, y, item.text, {
                        bulletColor: styles.colors.bulletColor,
                        textColor: colors.text,
                        width: pageWidth,
                    });
                    y += spacing.bullet;
                    break;

                case 'text':
                    y = drawWrappedText(doc, item.text, spacing.page.left, y, {
                        width: pageWidth,
                        color: colors.textLight,
                    });
                    y += spacing.paragraph;
                    break;
            }
        }
    }

    return doc;
}

/**
 * Modern Template - Contemporary two-column layout
 */
function generateModernTemplate(doc, parsed) {
    const styles = modernStyles;
    const pageWidth = doc.page.width - spacing.page.left - spacing.page.right;
    let y = spacing.page.top;

    // Draw accent bar on the left
    if (styles.accentBar) {
        // Gradient effect using two overlapping rects
        doc.rect(0, 0, styles.accentBarWidth, doc.page.height)
            .fill('#4DCFFF');
        doc.save();
        doc.path(`M0,0 L${styles.accentBarWidth},0 L0,${doc.page.height} Z`)
            .fill('#FF6B9C')
            .opacity(0.6);
        doc.restore();
    }

    const leftMargin = styles.accentBar ? spacing.page.left + 12 : spacing.page.left;

    // Header
    if (parsed.header.name) {
        doc.font('Helvetica-Bold')
            .fontSize(30)
            .fillColor('#0f172a');
        doc.text(parsed.header.name, leftMargin, y);
        y = doc.y + 6;
    }

    if (parsed.header.title) {
        doc.font('Helvetica-Bold')
            .fontSize(15)
            .fillColor(styles.colors.accent);
        doc.text(parsed.header.title, leftMargin, y);
        y = doc.y + 8;
    }

    // Contact info
    if (parsed.header.contact && parsed.header.contact.length > 0) {
        doc.font('Helvetica')
            .fontSize(fonts.sizes.contact)
            .fillColor('#64748b');

        const contactText = parsed.header.contact.join('  |  ');
        doc.text(contactText, leftMargin, y);
        y = doc.y + 10;
    }

    // Header border
    doc.strokeColor('#e2e8f0')
        .lineWidth(2)
        .moveTo(leftMargin, y)
        .lineTo(doc.page.width - spacing.page.right, y)
        .stroke();
    y += 20;

    // Find skills and summary sections
    const skillsSection = parsed.sections.find(s => s.title.toLowerCase().includes('skill'));
    const summarySection = parsed.sections.find(s =>
        s.title.toLowerCase().includes('summary') ||
        s.title.toLowerCase().includes('profile') ||
        s.title.toLowerCase().includes('about')
    );
    const otherSections = parsed.sections.filter(s =>
        !s.title.toLowerCase().includes('skill') &&
        !s.title.toLowerCase().includes('summary') &&
        !s.title.toLowerCase().includes('profile') &&
        !s.title.toLowerCase().includes('about')
    );

    // Summary section (full width)
    if (summarySection) {
        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.sectionTitle)
            .fillColor(styles.colors.accentAlt);
        doc.text(summarySection.title.toUpperCase(), leftMargin, y, { characterSpacing: 1 });
        y = doc.y + 8;

        for (const item of summarySection.items) {
            if (item.type === 'text') {
                y = drawWrappedText(doc, item.text, leftMargin, y, {
                    width: pageWidth - 12,
                    color: '#475569',
                    lineGap: 4,
                });
            }
        }
        y += 16;
    }

    // Two-column layout: skills on left, experience on right
    const leftColWidth = (pageWidth - 12) * 0.35;
    const rightColWidth = (pageWidth - 12) * 0.62;
    const rightColX = leftMargin + leftColWidth + 18;
    const savedY = y;

    // Left column - Skills
    let leftY = y;
    if (skillsSection) {
        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.sectionTitle)
            .fillColor(styles.colors.accentAlt);
        doc.text(skillsSection.title.toUpperCase(), leftMargin, leftY, { characterSpacing: 1 });
        leftY = doc.y + 10;

        for (const item of skillsSection.items) {
            if (item.type === 'skill_category') {
                doc.font('Helvetica-Bold')
                    .fontSize(10)
                    .fillColor('#334155');
                doc.text(item.category, leftMargin, leftY);
                leftY = doc.y + 6;

                // Skills as tags
                for (const skill of item.skills) {
                    if (leftY > doc.page.height - 60) break;

                    doc.font('Helvetica')
                        .fontSize(9)
                        .fillColor('#4DCFFF');

                    const skillWidth = doc.widthOfString(skill) + 16;

                    doc.roundedRect(leftMargin, leftY, Math.min(skillWidth, leftColWidth - 10), 18, 3)
                        .fillAndStroke('#eff6ff', '#bae6fd');

                    doc.fillColor('#4DCFFF')
                        .text(skill, leftMargin + 8, leftY + 5, { width: leftColWidth - 26 });
                    leftY = doc.y + 8;
                }
                leftY += 6;
            } else if (item.type === 'skill') {
                doc.font('Helvetica')
                    .fontSize(9)
                    .fillColor('#4DCFFF');

                const skillWidth = doc.widthOfString(item.text) + 16;

                doc.roundedRect(leftMargin, leftY, Math.min(skillWidth, leftColWidth - 10), 18, 3)
                    .fillAndStroke('#eff6ff', '#bae6fd');

                doc.fillColor('#4DCFFF')
                    .text(item.text, leftMargin + 8, leftY + 5, { width: leftColWidth - 26 });
                leftY = doc.y + 8;
            }
        }
    }

    // Right column - Other sections
    let rightY = savedY;
    for (const section of otherSections) {
        if (rightY > doc.page.height - 100) {
            doc.addPage();
            rightY = spacing.page.top;
        }

        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.sectionTitle)
            .fillColor(styles.colors.accent);
        doc.text(section.title.toUpperCase(), rightColX, rightY, {
            characterSpacing: 1,
            width: rightColWidth,
        });
        rightY = doc.y + 4;

        // Section underline
        doc.strokeColor('#bae6fd')
            .lineWidth(1)
            .moveTo(rightColX, rightY)
            .lineTo(rightColX + 80, rightY)
            .stroke();
        rightY += 10;

        for (const item of section.items) {
            if (rightY > doc.page.height - 80) {
                doc.addPage();
                rightY = spacing.page.top;
            }

            if (item.type === 'job') {
                rightY = renderJobEntryModern(doc, item, rightY, rightColWidth, rightColX, styles);
            } else if (item.type === 'education') {
                rightY = renderEducationEntryModern(doc, item, rightY, rightColWidth, rightColX, styles);
            } else if (item.type === 'bullet') {
                rightY = drawBullet(doc, rightColX, rightY, item.text, {
                    bulletColor: styles.colors.bulletColor,
                    width: rightColWidth,
                });
                rightY += 4;
            } else if (item.type === 'text') {
                rightY = drawWrappedText(doc, item.text, rightColX, rightY, {
                    width: rightColWidth,
                    color: '#475569',
                });
                rightY += 6;
            }
        }
        rightY += 12;
    }

    return doc;
}

/**
 * Functional Template - Skills-focused layout
 */
function generateFunctionalTemplate(doc, parsed) {
    const styles = functionalStyles;
    const pageWidth = doc.page.width - spacing.page.left - spacing.page.right;
    let y = spacing.page.top;

    // Centered Header
    if (parsed.header.name) {
        doc.font('Helvetica-Bold')
            .fontSize(26)
            .fillColor('#1f2937');
        doc.text(parsed.header.name, spacing.page.left, y, {
            width: pageWidth,
            align: 'center',
        });
        y = doc.y + 6;
    }

    if (parsed.header.title) {
        doc.font('Helvetica-Bold')
            .fontSize(16)
            .fillColor(styles.colors.accent);
        doc.text(parsed.header.title, spacing.page.left, y, {
            width: pageWidth,
            align: 'center',
        });
        y = doc.y + 8;
    }

    // Contact info centered
    if (parsed.header.contact && parsed.header.contact.length > 0) {
        doc.font('Helvetica')
            .fontSize(fonts.sizes.contact)
            .fillColor('#6b21a8');

        const contactText = parsed.header.contact.join('  |  ');
        doc.text(contactText, spacing.page.left, y, {
            width: pageWidth,
            align: 'center',
        });
        y = doc.y + 10;
    }

    // Header border
    doc.strokeColor('#e9d5ff')
        .lineWidth(2)
        .moveTo(spacing.page.left + 50, y)
        .lineTo(doc.page.width - spacing.page.right - 50, y)
        .stroke();
    y += 20;

    // Find sections
    const skillsSection = parsed.sections.find(s => s.title.toLowerCase().includes('skill'));
    const summarySection = parsed.sections.find(s =>
        s.title.toLowerCase().includes('summary') ||
        s.title.toLowerCase().includes('profile')
    );

    // Summary in a box
    if (summarySection) {
        const boxPadding = 14;
        const boxY = y;

        doc.roundedRect(spacing.page.left, boxY, pageWidth, 80, 8)
            .fillAndStroke('#faf5ff', '#e9d5ff');

        y = boxY + boxPadding;
        doc.font('Helvetica-Bold')
            .fontSize(11)
            .fillColor('#7c3aed');
        doc.text(summarySection.title.toUpperCase(), spacing.page.left + boxPadding, y, {
            characterSpacing: 1,
        });
        y = doc.y + 6;

        for (const item of summarySection.items) {
            if (item.type === 'text') {
                doc.font('Helvetica')
                    .fontSize(10)
                    .fillColor('#4b5563');
                doc.text(item.text, spacing.page.left + boxPadding, y, {
                    width: pageWidth - boxPadding * 2,
                    align: 'justify',
                });
                y = doc.y;
            }
        }
        y = boxY + 90;
    }

    // Core Competencies / Skills Grid
    if (skillsSection) {
        doc.font('Helvetica-Bold')
            .fontSize(13)
            .fillColor('#7c3aed');
        doc.text('CORE COMPETENCIES', spacing.page.left, y, {
            width: pageWidth,
            align: 'center',
            characterSpacing: 1.5,
        });
        y = doc.y + 6;

        // Underline
        doc.strokeColor('#e9d5ff')
            .lineWidth(2)
            .moveTo(spacing.page.left + pageWidth / 3, y)
            .lineTo(spacing.page.left + pageWidth * 2 / 3, y)
            .stroke();
        y += 14;

        // Skills grid (3 columns)
        const colWidth = pageWidth / 3 - 10;
        let skillX = spacing.page.left;
        let skillRowY = y;
        let colIndex = 0;

        for (const item of skillsSection.items) {
            if (item.type === 'skill_category') {
                // Reset to new row for category
                if (colIndex !== 0) {
                    skillRowY += 25;
                    colIndex = 0;
                    skillX = spacing.page.left;
                }

                doc.font('Helvetica-Bold')
                    .fontSize(10)
                    .fillColor('#6b21a8');
                doc.text(item.category, spacing.page.left + 10, skillRowY);
                skillRowY = doc.y + 8;

                // Skills in grid
                for (const skill of item.skills) {
                    if (skillRowY > doc.page.height - 100) {
                        doc.addPage();
                        skillRowY = spacing.page.top;
                    }

                    const tagWidth = colWidth - 10;
                    doc.roundedRect(skillX + 5, skillRowY, tagWidth, 22, 6)
                        .fillAndStroke('#faf5ff', '#e9d5ff');

                    doc.font('Helvetica')
                        .fontSize(9)
                        .fillColor('#6b21a8');
                    doc.text(skill, skillX + 10, skillRowY + 6, {
                        width: tagWidth - 10,
                        align: 'center',
                    });

                    colIndex++;
                    if (colIndex >= 3) {
                        colIndex = 0;
                        skillX = spacing.page.left;
                        skillRowY += 28;
                    } else {
                        skillX += colWidth + 5;
                    }
                }
                skillRowY += 10;
                skillX = spacing.page.left;
                colIndex = 0;
            } else if (item.type === 'skill') {
                const tagWidth = colWidth - 10;
                doc.roundedRect(skillX + 5, skillRowY, tagWidth, 22, 6)
                    .fillAndStroke('#faf5ff', '#e9d5ff');

                doc.font('Helvetica')
                    .fontSize(9)
                    .fillColor('#6b21a8');
                doc.text(item.text, skillX + 10, skillRowY + 6, {
                    width: tagWidth - 10,
                    align: 'center',
                });

                colIndex++;
                if (colIndex >= 3) {
                    colIndex = 0;
                    skillX = spacing.page.left;
                    skillRowY += 28;
                } else {
                    skillX += colWidth + 5;
                }
            }
        }
        y = skillRowY + 20;
    }

    // Other sections
    const remainingSections = parsed.sections.filter(s =>
        !s.title.toLowerCase().includes('skill') &&
        !s.title.toLowerCase().includes('summary') &&
        !s.title.toLowerCase().includes('profile')
    );

    for (const section of remainingSections) {
        if (y > doc.page.height - 100) {
            doc.addPage();
            y = spacing.page.top;
        }

        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('#7c3aed');
        doc.text(section.title.toUpperCase(), spacing.page.left, y, {
            characterSpacing: 1.2,
        });
        y = doc.y + 4;

        doc.strokeColor('#c084fc')
            .lineWidth(1)
            .moveTo(spacing.page.left, y)
            .lineTo(spacing.page.left + 80, y)
            .stroke();
        y += 10;

        for (const item of section.items) {
            if (y > doc.page.height - 80) {
                doc.addPage();
                y = spacing.page.top;
            }

            if (item.type === 'job') {
                y = renderJobEntryFunctional(doc, item, y, pageWidth, styles);
            } else if (item.type === 'education') {
                y = renderEducationEntryFunctional(doc, item, y, pageWidth, styles);
            } else if (item.type === 'bullet') {
                y = drawBullet(doc, spacing.page.left + 5, y, item.text, {
                    bulletColor: '#a78bfa',
                    width: pageWidth - 10,
                });
                y += 4;
            } else if (item.type === 'text') {
                y = drawWrappedText(doc, item.text, spacing.page.left + 5, y, {
                    width: pageWidth - 10,
                    color: '#374151',
                });
                y += 6;
            }
        }
        y += 14;
    }

    return doc;
}

// Helper render functions

function renderJobEntry(doc, job, startY, width, styles) {
    let y = startY;
    const x = spacing.page.left;

    // Job title and date on same line
    doc.font('Helvetica-Bold')
        .fontSize(fonts.sizes.jobTitle)
        .fillColor(colors.text);

    const dateWidth = doc.widthOfString(job.date || '');
    const titleWidth = width - dateWidth - 20;

    doc.text(job.role, x, y, { width: titleWidth, continued: false });

    if (job.date) {
        doc.font('Helvetica')
            .fontSize(fonts.sizes.small)
            .fillColor(colors.textMuted);
        doc.text(job.date, x + titleWidth + 10, y);
    }
    y = doc.y + 2;

    // Company
    if (job.company) {
        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.body)
            .fillColor(colors.textLight);
        doc.text(job.company, x, y);
        y = doc.y + 2;
    }

    // Location
    if (job.location) {
        doc.font('Helvetica-Oblique')
            .fontSize(fonts.sizes.small)
            .fillColor(colors.textSubtle);
        doc.text(job.location, x, y);
        y = doc.y + 4;
    }

    // Bullets
    if (job.bullets && job.bullets.length > 0) {
        for (const bullet of job.bullets) {
            y = drawBullet(doc, x, y, bullet, {
                bulletColor: styles.colors.bulletColor || styles.colors.accent,
                width: width,
            });
            y += 2;
        }
    }

    return y + spacing.jobEntry;
}

function renderJobEntryModern(doc, job, startY, width, x, styles) {
    let y = startY;

    // Job title and date
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#0f172a');
    doc.text(job.role, x, y, { width: width - 80 });

    if (job.date) {
        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#64748b');
        doc.text(job.date, x + width - 70, y, { width: 70, align: 'right' });
    }
    y = doc.y + 4;

    // Company
    if (job.company) {
        doc.font('Helvetica-Bold')
            .fontSize(11)
            .fillColor(styles.colors.accent);
        doc.text(job.company, x, y, { width });
        y = doc.y + 2;
    }

    // Location
    if (job.location) {
        doc.font('Helvetica-Oblique')
            .fontSize(10)
            .fillColor('#64748b');
        doc.text(job.location, x, y, { width });
        y = doc.y + 4;
    }

    // Bullets
    if (job.bullets && job.bullets.length > 0) {
        for (const bullet of job.bullets) {
            doc.font('Helvetica')
                .fontSize(11)
                .fillColor(styles.colors.bulletColor);
            doc.text('•', x, y);
            doc.fillColor('#475569')
                .text(bullet, x + 12, y - 11, { width: width - 12, lineGap: 3 });
            y = doc.y + 4;
        }
    }

    return y + 10;
}

function renderJobEntryFunctional(doc, job, startY, width, styles) {
    let y = startY;
    const x = spacing.page.left + 5;

    // Job title and date
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#1f2937');
    doc.text(job.role, x, y, { width: width - 100 });

    if (job.date) {
        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#6b7280');
        doc.text(job.date, x + width - 90, y, { width: 80, align: 'right' });
    }
    y = doc.y + 4;

    // Company
    if (job.company) {
        doc.font('Helvetica-Bold')
            .fontSize(11)
            .fillColor('#7c3aed');
        doc.text(job.company, x, y, { width });
        y = doc.y + 2;
    }

    // Location
    if (job.location) {
        doc.font('Helvetica-Oblique')
            .fontSize(10)
            .fillColor('#9ca3af');
        doc.text(job.location, x, y, { width });
        y = doc.y + 4;
    }

    // Bullets
    if (job.bullets && job.bullets.length > 0) {
        for (const bullet of job.bullets) {
            doc.circle(x + 3, y + 5, 2).fill('#a78bfa');
            doc.font('Helvetica')
                .fontSize(11)
                .fillColor('#374151');
            doc.text(bullet, x + 14, y, { width: width - 20, lineGap: 3 });
            y = doc.y + 4;
        }
    }

    return y + 10;
}

function renderEducationEntry(doc, edu, startY, width, styles) {
    let y = startY;
    const x = spacing.page.left;

    // Degree and date
    doc.font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(colors.text);
    doc.text(edu.degree, x, y, { width: width - 80 });

    if (edu.date) {
        doc.font('Helvetica')
            .fontSize(fonts.sizes.small)
            .fillColor(colors.textMuted);
        doc.text(edu.date, x + width - 70, y, { width: 70, align: 'right' });
    }
    y = doc.y + 2;

    // Institution
    if (edu.institution) {
        doc.font('Helvetica-Bold')
            .fontSize(fonts.sizes.body)
            .fillColor(colors.textLight);
        doc.text(edu.institution, x, y);
        y = doc.y + 2;
    }

    // Location
    if (edu.location) {
        doc.font('Helvetica-Oblique')
            .fontSize(fonts.sizes.small)
            .fillColor(colors.textSubtle);
        doc.text(edu.location, x, y);
        y = doc.y;
    }

    // Bullets
    if (edu.bullets && edu.bullets.length > 0) {
        y += 4;
        for (const bullet of edu.bullets) {
            y = drawBullet(doc, x, y, bullet, {
                bulletColor: styles.colors.bulletColor,
                width: width,
            });
            y += 2;
        }
    }

    return y + 12;
}

function renderEducationEntryModern(doc, edu, startY, width, x, styles) {
    let y = startY;

    // Degree and date
    doc.font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#0f172a');
    doc.text(edu.degree, x, y, { width: width - 80 });

    if (edu.date) {
        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#64748b');
        doc.text(edu.date, x + width - 70, y, { width: 70, align: 'right' });
    }
    y = doc.y + 3;

    // Institution
    if (edu.institution) {
        doc.font('Helvetica-Bold')
            .fontSize(11)
            .fillColor(styles.colors.accent);
        doc.text(edu.institution, x, y, { width });
        y = doc.y;
    }

    return y + 10;
}

function renderEducationEntryFunctional(doc, edu, startY, width, styles) {
    let y = startY;
    const x = spacing.page.left + 5;

    // Degree and date
    doc.font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#1f2937');
    doc.text(edu.degree, x, y, { width: width - 100 });

    if (edu.date) {
        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#6b7280');
        doc.text(edu.date, x + width - 90, y, { width: 80, align: 'right' });
    }
    y = doc.y + 3;

    // Institution
    if (edu.institution) {
        doc.font('Helvetica-Bold')
            .fontSize(11)
            .fillColor('#7c3aed');
        doc.text(edu.institution, x, y, { width });
        y = doc.y;
    }

    return y + 10;
}

function renderSkillCategory(doc, category, startY, width, styles) {
    let y = startY;
    const x = spacing.page.left;

    doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(styles.colors.primary);
    doc.text(category.category + ':', x, y);
    y = doc.y + 4;

    // Skills as comma-separated text or tags
    doc.font('Helvetica')
        .fontSize(fonts.sizes.body)
        .fillColor(colors.textLight);
    doc.text(category.skills.join(', '), x + 10, y, { width: width - 10 });

    return doc.y + 8;
}

function renderSkillTag(doc, skill, startY, styles) {
    // Simple inline skill rendering
    doc.font('Helvetica')
        .fontSize(fonts.sizes.body)
        .fillColor(colors.textLight);
    doc.text('• ' + skill.text, spacing.page.left, startY);

    return doc.y + 4;
}

/**
 * Main PDF generation function
 * @param {string} markdown - Markdown resume content
 * @param {string} template - Template name (classic, modern, functional)
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generatePDF(markdown, template = 'classic') {
    return new Promise((resolve, reject) => {
        try {
            const parsed = parseResumeMarkdown(markdown);

            if (!parsed.isValid && parsed.errors.length > 0) {
                console.warn('Resume parsing warnings:', parsed.errors);
            }

            const doc = new PDFDocument({
                size: 'A4',
                margins: {
                    top: spacing.page.top,
                    bottom: spacing.page.bottom,
                    left: spacing.page.left,
                    right: spacing.page.right,
                },
                info: {
                    Title: parsed.header.name ? `${parsed.header.name} - Resume` : 'Resume',
                    Author: parsed.header.name || 'Resume Builder',
                    Creator: 'Premium Resume Optimizer',
                },
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Generate based on template
            switch (template) {
                case 'modern':
                    generateModernTemplate(doc, parsed);
                    break;
                case 'functional':
                    generateFunctionalTemplate(doc, parsed);
                    break;
                case 'classic':
                default:
                    generateClassicTemplate(doc, parsed);
                    break;
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generatePDF,
    generateClassicTemplate,
    generateModernTemplate,
    generateFunctionalTemplate,
};

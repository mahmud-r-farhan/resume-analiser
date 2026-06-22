/**
 * PDFKit Style Configuration for Resume Templates
 * Professional styling for ATS-friendly resume PDFs
 */

const colors = {
    // Primary colors
    primary: '#1e40af',      // Blue
    primaryLight: '#3b82f6',
    primaryDark: '#1e3a8a',

    // Accent colors
    accent: '#4DCFFF',       // Cyan
    accentAlt: '#FF6B9C',    // Pink
    purple: '#7c3aed',       // Purple

    // Text colors
    text: '#1f2937',
    textLight: '#4b5563',
    textMuted: '#6b7280',
    textSubtle: '#9ca3af',

    // Background & borders
    background: '#ffffff',
    backgroundLight: '#f9fafb',
    backgroundAccent: '#eff6ff',
    border: '#e5e7eb',
    borderLight: '#d1d5db',
};

const fonts = {
    sizes: {
        name: 28,
        title: 14,
        sectionTitle: 12,
        jobTitle: 11,
        body: 10,
        small: 9,
        contact: 9,
    },
    lineHeight: {
        normal: 1.5,
        relaxed: 1.65,
        tight: 1.3,
    },
};

const spacing = {
    page: {
        top: 40,
        bottom: 40,
        left: 45,
        right: 45,
    },
    section: 16,
    paragraph: 8,
    bullet: 6,
    jobEntry: 14,
    headerBottom: 18,
};

// Template-specific styles
const classicStyles = {
    colors: {
        primary: colors.primary,
        primaryLight: colors.primaryLight,
        accent: '#60a5fa',
        sectionBorder: '#93c5fd',
        bulletColor: colors.primary,
    },
    headerBorder: true,
    sectionAccent: 'underline',
};

const modernStyles = {
    colors: {
        primary: '#0f172a',
        accent: '#4DCFFF',
        accentAlt: '#FF6B9C',
        sectionTitle: '#4DCFFF',
        sectionBorder: '#bae6fd',
        bulletColor: '#4DCFFF',
    },
    accentBar: true,
    accentBarWidth: 8,
    sectionAccent: 'underline',
};

const functionalStyles = {
    colors: {
        primary: '#1f2937',
        accent: '#7c3aed',
        accentAlt: '#a78bfa',
        sectionTitle: '#7c3aed',
        sectionBorder: '#c084fc',
        bulletColor: '#a78bfa',
        skillBg: '#faf5ff',
        skillBorder: '#e9d5ff',
    },
    centered: true,
    sectionAccent: 'underline',
};

const executiveStyles = {
    colors: {
        primary: '#0f172a',    // Dark Slate
        secondary: '#1e293b',
        accent: '#1e3a8a',     // Navy Blue
        border: '#94a3b8',
        bulletColor: '#1e3a8a',
        background: '#ffffff',
    },
    fonts: {
        header: 'Times-Bold',
        body: 'Times-Roman',
        italic: 'Times-Italic',
    },
    spacing: {
        page: {
            top: 50,
            bottom: 50,
            left: 55,
            right: 55,
        },
        section: 22,
        headerBottom: 25,
    }
};

module.exports = {
    colors,
    fonts,
    spacing,
    classicStyles,
    modernStyles,
    functionalStyles,
    executiveStyles,
};

import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.otf', fontWeight: 400 },
    { src: '/fonts/Inter-SemiBold.otf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.otf', fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback(word => [word]);

export const baseStyles = StyleSheet.create({
  // Page
  page: { 
    padding: 50, 
    fontFamily: 'Inter', 
    fontSize: 11, 
    color: '#1f2937', 
    backgroundColor: '#ffffff',
    lineHeight: 1.65
  },
  
  // Header Section
  header: { 
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e5e7eb'
  },
  name: { 
    fontSize: 26, 
    fontWeight: 700, 
    color: '#111827', 
    marginBottom: 6,
    letterSpacing: -0.5
  },
  title: { 
    fontSize: 13.5, 
    fontWeight: 600,
    color: '#4b5563', 
    marginBottom: 10,
    letterSpacing: 0.3
  },
  contact: { 
    fontSize: 9.5, 
    color: '#6b7280', 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginTop: 8
  },
  contactItem: {
    marginRight: 14,
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
    paddingLeft: 0
  },
  contactItemLast: {
    marginRight: 0,
    paddingRight: 0,
    borderRightWidth: 0,
    borderRightColor: 'transparent'
  },
  
  // Section Styles
  section: {
    marginTop: 20,
    marginBottom: 14
  },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: 700, 
    color: '#1e40af', 
    marginBottom: 12,
    paddingBottom: 5,
    textTransform: 'uppercase', 
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: '#93c5fd'
  },
  
  // Text Elements
  text: { 
    fontSize: 11, 
    lineHeight: 1.65, 
    marginBottom: 5,
    color: '#374151'
  },
  textBold: {
    fontWeight: 700,
    color: '#1f2937'
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.65,
    marginBottom: 10,
    color: '#4b5563',
    textAlign: 'justify'
  },
  
  // Bullet Points
  bulletRow: { 
    flexDirection: 'row', 
    marginBottom: 8,
    marginLeft: 4
  },
  bulletPoint: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#1e40af', 
    marginTop: 7, 
    marginRight: 12,
    flexShrink: 0
  },
  bulletText: {
    fontSize: 11,
    lineHeight: 1.65,
    color: '#374151',
    flex: 1
  },
  
  // Job/Experience Entries
  jobContainer: {
    marginBottom: 16
  },
  jobHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 5
  },
  jobTitle: { 
    fontSize: 12, 
    fontWeight: 700,
    color: '#111827',
    flex: 1
  },
  company: { 
    fontSize: 11, 
    fontWeight: 600, 
    color: '#4b5563',
    marginBottom: 8
  },
  date: { 
    fontSize: 10, 
    color: '#6b7280',
    fontWeight: 600,
    marginLeft: 14,
    flexShrink: 0
  },
  location: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 6,
    fontStyle: 'italic'
  },
  
  // Education Entries
  educationContainer: {
    marginBottom: 14
  },
  degree: {
    fontSize: 11.5,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4
  },
  institution: {
    fontSize: 11,
    fontWeight: 600,
    color: '#4b5563',
    marginBottom: 4
  },
  
  // Skills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8
  },
  skillCategory: {
    fontSize: 10.5,
    fontWeight: 700,
    color: '#1e40af',
    marginBottom: 6,
    marginTop: 10
  },
  skillTag: { 
    backgroundColor: '#eff6ff', 
    color: '#1e40af', 
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4, 
    fontSize: 9.5, 
    fontWeight: 600,
    marginRight: 8, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe'
  },
  skillText: {
    fontSize: 10.5,
    color: '#374151',
    marginBottom: 6
  },
  
  // Links
  link: {
    color: '#2563eb',
    textDecoration: 'underline'
  },
  
  // Lists
  orderedList: {
    marginLeft: 14,
    marginBottom: 10
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6
  },
  listNumber: {
    width: 18,
    fontSize: 10.5,
    color: '#6b7280',
    fontWeight: 600
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14
  },
  
  // Summary/Profile Section
  summary: {
    fontSize: 11,
    lineHeight: 1.75,
    color: '#4b5563',
    marginBottom: 14,
    textAlign: 'justify',
    paddingHorizontal: 6
  }
});
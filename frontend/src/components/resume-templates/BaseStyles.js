import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.otf', fontWeight: 400 },
    { src: '/fonts/Inter-SemiBold.otf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.otf', fontWeight: 700 },
  ],
});

export const baseStyles = StyleSheet.create({
  // Page
  page: { 
    padding: 40, 
    fontFamily: 'Inter', 
    fontSize: 10.5, 
    color: '#1f2937', 
    backgroundColor: '#ffffff',
    lineHeight: 1.5
  },
  
  // Header Section
  header: { 
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e5e7eb'
  },
  name: { 
    fontSize: 28, 
    fontWeight: 700, 
    color: '#111827', 
    marginBottom: 4,
    letterSpacing: -0.5
  },
  title: { 
    fontSize: 13, 
    fontWeight: 600,
    color: '#4b5563', 
    marginBottom: 8,
    letterSpacing: 0.3
  },
  contact: { 
    fontSize: 9.5, 
    color: '#6b7280', 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginTop: 6
  },
  contactItem: {
    marginRight: 12,
    paddingRight: 12,
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
    marginTop: 18,
    marginBottom: 12
  },
  sectionTitle: { 
    fontSize: 12.5, 
    fontWeight: 700, 
    color: '#1e40af', 
    marginBottom: 10,
    paddingBottom: 4,
    textTransform: 'uppercase', 
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: '#93c5fd'
  },
  
  // Text Elements
  text: { 
    fontSize: 10.5, 
    lineHeight: 1.6, 
    marginBottom: 4,
    color: '#374151'
  },
  textBold: {
    fontWeight: 700,
    color: '#1f2937'
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.6,
    marginBottom: 8,
    color: '#4b5563',
    textAlign: 'justify'
  },
  
  // Bullet Points
  bulletRow: { 
    flexDirection: 'row', 
    marginBottom: 6,
    marginLeft: 4
  },
  bulletPoint: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#1e40af', 
    marginTop: 6, 
    marginRight: 10,
    flexShrink: 0
  },
  bulletText: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: '#374151',
    flex: 1
  },
  
  // Job/Experience Entries
  jobContainer: {
    marginBottom: 14
  },
  jobHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 4
  },
  jobTitle: { 
    fontSize: 11.5, 
    fontWeight: 700,
    color: '#111827',
    flex: 1
  },
  company: { 
    fontSize: 10.5, 
    fontWeight: 600, 
    color: '#4b5563',
    marginBottom: 6
  },
  date: { 
    fontSize: 9.5, 
    color: '#6b7280',
    fontWeight: 600,
    marginLeft: 12,
    flexShrink: 0
  },
  location: {
    fontSize: 9.5,
    color: '#9ca3af',
    marginBottom: 4,
    fontStyle: 'italic'
  },
  
  // Education Entries
  educationContainer: {
    marginBottom: 12
  },
  degree: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 3
  },
  institution: {
    fontSize: 10.5,
    fontWeight: 600,
    color: '#4b5563',
    marginBottom: 2
  },
  
  // Skills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 6
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1e40af',
    marginBottom: 4,
    marginTop: 8
  },
  skillTag: { 
    backgroundColor: '#eff6ff', 
    color: '#1e40af', 
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
    borderColor: '#bfdbfe'
  },
  skillText: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4
  },
  
  // Links (displayed as text since PDFs don't support clickable links in react-pdf)
  link: {
    color: '#2563eb',
    textDecoration: 'underline'
  },
  
  // Lists
  orderedList: {
    marginLeft: 12,
    marginBottom: 8
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4
  },
  listNumber: {
    width: 16,
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 600
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12
  },
  
  // Summary/Profile Section
  summary: {
    fontSize: 10.5,
    lineHeight: 1.7,
    color: '#4b5563',
    marginBottom: 12,
    textAlign: 'justify',
    paddingHorizontal: 4
  }
});
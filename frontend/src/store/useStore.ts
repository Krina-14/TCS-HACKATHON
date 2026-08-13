import { create } from 'zustand';

// Types
export type UserRole = 'admin' | 'hod' | 'faculty' | 'student';

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  designation: string;
  joinDate: string;
  subjects: string[];
  workloadCurrent: number;
  workloadMax: number;
  availability: {
    [day: string]: ('available' | 'unavailable' | 'preferred' | 'optional')[];
  };
  expertise: { [subject: string]: number }; // percentage expertise
  status: 'online' | 'away' | 'busy' | 'offline';
  todayStatus: 'available' | 'unavailable' | 'leave';
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  type: 'Theory' | 'Lab';
  lecturesPerWeek: number;
  preferredPeriod: 'Morning' | 'Afternoon' | 'No preference';
  requiredRoom: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  department: string;
  prerequisites: string[];
  topics: string[];
}

export interface Division {
  id: string; // IT-A, IT-B, CSE-A
  semester: number;
  studentsCount: number;
  subjects: string[];
  assignedFaculty: string[];
}

export interface Room {
  id: string; // B-204, B-202, Lab-1
  building: string;
  capacity: number;
  type: 'Classroom' | 'Lab';
  equipment: string[];
  occupancy: 'low' | 'medium' | 'high' | 'maintenance' | 'free';
  currentClass?: string;
  currentFaculty?: string;
  timeRemaining?: string; // in minutes
}

export interface TimetableCell {
  id: string;
  day: string; // 'Monday' - 'Friday'
  timeSlot: string; // '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
  subject: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  roomId: string;
  divisionId: string;
  color: string;
  isAbsentSimulated?: boolean;
  isSubstituteApplied?: boolean;
  isLunch?: boolean;
}

export interface SystemConflict {
  id: string;
  type: 'Faculty Conflict' | 'Room Conflict' | 'Workload Warning';
  severity: 'critical' | 'warning' | 'resolved';
  description: string;
  affectedEntities: string;
  studentsAffected: number;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: 'absence' | 'substitute' | 'conflict' | 'info' | 'ai';
}

export interface TimetableVersion {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  reason: string;
  changesCount: number;
  status: 'Current' | 'Previous' | 'Draft';
}

export interface AcademicEvent {
  id: string;
  title: string;
  type: 'Holiday' | 'Workshop' | 'Seminar' | 'Hackathon' | 'Exam' | 'Sports' | 'Maintenance';
  startDate: string;
  endDate: string;
  allDay: boolean;
  affectedDivisions: string[];
  affectedRooms: string[];
  description: string;
  color: string;
}

// Initial Mock Data
const initialFaculty: Faculty[] = [
  {
    id: 'FAC-2023-014',
    name: 'Prof. Ananya Shah',
    email: 'ananya.shah@smartsched.edu',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    department: 'Information Technology',
    designation: 'Associate Professor',
    joinDate: '2023-06-15',
    subjects: ['Artificial Intelligence', 'Machine Learning', 'Python Programming'],
    workloadCurrent: 14,
    workloadMax: 20,
    availability: {
      Monday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Tuesday: ['available', 'preferred', 'preferred', 'available', 'available', 'optional', 'optional', 'available'],
      Wednesday: ['preferred', 'preferred', 'available', 'available', 'available', 'available', 'available', 'available'],
      Thursday: ['available', 'available', 'available', 'available', 'optional', 'optional', 'available', 'available'],
      Friday: ['available', 'available', 'preferred', 'preferred', 'available', 'available', 'available', 'available'],
    },
    expertise: {
      'Artificial Intelligence': 95,
      'Machine Learning': 92,
      'Python Programming': 90,
      'Deep Learning': 72,
    },
    status: 'online',
    todayStatus: 'available',
  },
  {
    id: 'FAC-2021-008',
    name: 'Prof. Amit Mehta',
    email: 'amit.mehta@smartsched.edu',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    department: 'Information Technology',
    designation: 'Professor & HOD',
    joinDate: '2021-02-10',
    subjects: ['Artificial Intelligence', 'Data Structures', 'Database Management'],
    workloadCurrent: 18,
    workloadMax: 20,
    availability: {
      Monday: ['available', 'available', 'unavailable', 'available', 'available', 'available', 'available', 'available'],
      Tuesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Wednesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Thursday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Friday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
    },
    expertise: {
      'Artificial Intelligence': 98,
      'Data Structures': 95,
      'Database Management': 90,
    },
    status: 'online',
    todayStatus: 'available', // Will toggle to 'leave' in demo Step 6
  },
  {
    id: 'FAC-2022-045',
    name: 'Prof. Rahul Patel',
    email: 'rahul.patel@smartsched.edu',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    joinDate: '2022-07-22',
    subjects: ['Artificial Intelligence', 'Web Development', 'Discrete Mathematics'],
    workloadCurrent: 16,
    workloadMax: 20,
    availability: {
      Monday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Tuesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Wednesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Thursday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Friday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
    },
    expertise: {
      'Artificial Intelligence': 83,
      'Web Development': 88,
      'Discrete Mathematics': 75,
    },
    status: 'away',
    todayStatus: 'available',
  },
  {
    id: 'FAC-2023-089',
    name: 'Prof. Neha Joshi',
    email: 'neha.joshi@smartsched.edu',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    joinDate: '2023-11-01',
    subjects: ['Computer Networks', 'Operating Systems', 'Artificial Intelligence'],
    workloadCurrent: 12,
    workloadMax: 20,
    availability: {
      Monday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Tuesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Wednesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Thursday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Friday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
    },
    expertise: {
      'Artificial Intelligence': 76,
      'Computer Networks': 90,
      'Operating Systems': 85,
    },
    status: 'online',
    todayStatus: 'available',
  },
];

// Seed other faculty up to 8 for the mock displays
for (let i = 5; i <= 24; i++) {
  const depts = ['Information Technology', 'Computer Science', 'Electronics & Comm.', 'Mechanical Eng.'];
  const names = ['Sharma', 'Gupta', 'Iyer', 'Sen', 'Verma', 'Singh', 'Das', 'Reddy', 'Rao', 'Nair'];
  const firstNames = ['Vikram', 'Rajesh', 'Siddharth', 'Priyanka', 'Sanjay', 'Karan', 'Aditi', 'Divya', 'Rohan', 'Sneha'];
  const dept = depts[i % depts.length];
  const name = `Dr. ${firstNames[i % firstNames.length]} ${names[i % names.length]}`;
  initialFaculty.push({
    id: `FAC-2022-0${i + 20}`,
    name,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${names[i % names.length].toLowerCase()}@smartsched.edu`,
    phone: `+91 98765 432${i + 20}`,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&q=80&w=120`,
    department: dept,
    designation: i % 3 === 0 ? 'Professor' : 'Assistant Professor',
    joinDate: '2022-03-12',
    subjects: ['Data Structures', 'Software Engineering', 'System Design'],
    workloadCurrent: 10 + (i % 8),
    workloadMax: 20,
    availability: {
      Monday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Tuesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Wednesday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Thursday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
      Friday: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
    },
    expertise: { 'Data Structures': 85, 'Software Engineering': 78 },
    status: i % 4 === 0 ? 'online' : i % 4 === 1 ? 'away' : 'offline',
    todayStatus: 'available',
  });
}

const initialSubjects: Subject[] = [
  {
    code: 'IT501',
    name: 'Artificial Intelligence',
    credits: 4,
    type: 'Theory',
    lecturesPerWeek: 4,
    preferredPeriod: 'Morning',
    requiredRoom: 'Classroom',
    difficulty: 'Hard',
    department: 'Information Technology',
    prerequisites: ['Python Programming', 'Probability'],
    topics: ['Search Algorithms', 'Machine Learning', 'Neural Networks', 'Natural Language Processing'],
  },
  {
    code: 'IT502',
    name: 'Database Management',
    credits: 4,
    type: 'Theory',
    lecturesPerWeek: 4,
    preferredPeriod: 'Afternoon',
    requiredRoom: 'Classroom',
    difficulty: 'Medium',
    department: 'Information Technology',
    prerequisites: ['Data Structures'],
    topics: ['SQL', 'Normalization', 'Indexing', 'Transactions'],
  },
  {
    code: 'CS503',
    name: 'Computer Networks',
    credits: 3,
    type: 'Theory',
    lecturesPerWeek: 3,
    preferredPeriod: 'Morning',
    requiredRoom: 'Classroom',
    difficulty: 'Hard',
    department: 'Computer Science',
    prerequisites: ['Operating Systems'],
    topics: ['TCP/IP', 'Routing Protocols', 'Application Layer', 'Network Security'],
  },
  {
    code: 'IT504',
    name: 'Machine Learning Lab',
    credits: 2,
    type: 'Lab',
    lecturesPerWeek: 4,
    preferredPeriod: 'Afternoon',
    requiredRoom: 'Lab',
    difficulty: 'Hard',
    department: 'Information Technology',
    prerequisites: ['Python Programming'],
    topics: ['Regression', 'Classification', 'Clustering', 'TensorFlow Basics'],
  },
];

// Populate more subjects
const extraSubjects = [
  { code: 'IT301', name: 'Python Programming', credits: 3, type: 'Theory', dept: 'Information Technology' },
  { code: 'CS302', name: 'Data Structures', credits: 4, type: 'Theory', dept: 'Computer Science' },
  { code: 'CS401', name: 'Operating Systems', credits: 4, type: 'Theory', dept: 'Computer Science' },
  { code: 'EC302', name: 'Digital Logic', credits: 3, type: 'Theory', dept: 'Electronics & Comm.' },
  { code: 'ME304', name: 'Thermodynamics', credits: 4, type: 'Theory', dept: 'Mechanical Eng.' },
];
extraSubjects.forEach((s) => {
  initialSubjects.push({
    code: s.code,
    name: s.name,
    credits: s.credits,
    type: s.type as 'Theory' | 'Lab',
    lecturesPerWeek: s.type === 'Lab' ? 4 : 3,
    preferredPeriod: 'No preference',
    requiredRoom: s.type === 'Lab' ? 'Lab' : 'Classroom',
    difficulty: 'Medium',
    department: s.dept,
    prerequisites: [],
    topics: ['Intro', 'Fundamentals', 'Applications'],
  });
});

const initialDivisions: Division[] = [
  { id: 'IT-A', semester: 5, studentsCount: 62, subjects: ['IT501', 'IT502', 'IT504', 'IT301'], assignedFaculty: ['FAC-2021-008', 'FAC-2023-014'] },
  { id: 'IT-B', semester: 5, studentsCount: 59, subjects: ['IT501', 'IT502', 'IT504'], assignedFaculty: ['FAC-2023-014'] },
  { id: 'IT-C', semester: 5, studentsCount: 61, subjects: ['IT501', 'IT502', 'IT301'], assignedFaculty: ['FAC-2022-045'] },
  { id: 'CSE-A', semester: 5, studentsCount: 65, subjects: ['CS503', 'CS302', 'CS401'], assignedFaculty: ['FAC-2023-089'] },
  { id: 'ECE-A', semester: 3, studentsCount: 58, subjects: ['EC302'], assignedFaculty: [] },
];

const initialRooms: Room[] = [
  { id: 'B-204', building: 'Building B', capacity: 70, type: 'Classroom', equipment: ['Projector', 'Air Conditioner', 'Speakers'], occupancy: 'medium', currentClass: 'Artificial Intelligence', currentFaculty: 'Prof. Mehta', timeRemaining: '35' },
  { id: 'B-202', building: 'Building B', capacity: 60, type: 'Classroom', equipment: ['Projector', 'Whiteboard'], occupancy: 'free' },
  { id: 'Lab-1', building: 'Building A', capacity: 40, type: 'Lab', equipment: ['High-End Computers', 'Projector', 'Ethernet Switch'], occupancy: 'high', currentClass: 'ML Lab', currentFaculty: 'Prof. Shah', timeRemaining: '45' },
  { id: 'B-205', building: 'Building B', capacity: 75, type: 'Classroom', equipment: ['Smartboard', 'Microphone System'], occupancy: 'free' },
  { id: 'C-101', building: 'Building C', capacity: 80, type: 'Classroom', equipment: ['Projector'], occupancy: 'low' },
  { id: 'C-102', building: 'Building C', capacity: 80, type: 'Classroom', equipment: ['Projector'], occupancy: 'maintenance' },
];

const initialTimetable: TimetableCell[] = [
  // LUNCH rows (12:00-1:00)
  { id: 'lunch-mon', day: 'Monday', timeSlot: '12:00-1:00', subject: '', subjectCode: '', facultyId: '', facultyName: '', roomId: '', divisionId: 'ALL', color: '', isLunch: true },
  { id: 'lunch-tue', day: 'Tuesday', timeSlot: '12:00-1:00', subject: '', subjectCode: '', facultyId: '', facultyName: '', roomId: '', divisionId: 'ALL', color: '', isLunch: true },
  { id: 'lunch-wed', day: 'Wednesday', timeSlot: '12:00-1:00', subject: '', subjectCode: '', facultyId: '', facultyName: '', roomId: '', divisionId: 'ALL', color: '', isLunch: true },
  { id: 'lunch-thu', day: 'Thursday', timeSlot: '12:00-1:00', subject: '', subjectCode: '', facultyId: '', facultyName: '', roomId: '', divisionId: 'ALL', color: '', isLunch: true },
  { id: 'lunch-fri', day: 'Friday', timeSlot: '12:00-1:00', subject: '', subjectCode: '', facultyId: '', facultyName: '', roomId: '', divisionId: 'ALL', color: '', isLunch: true },

  // Monday Schedule for IT-A (Demo Anchor: 11:00-12:00 is AI with Prof. Mehta in B-204)
  { id: 'm1', day: 'Monday', timeSlot: '9:00-10:00', subject: 'Python Programming', subjectCode: 'IT301', facultyId: 'FAC-2023-014', facultyName: 'Prof. Ananya Shah', roomId: 'B-204', divisionId: 'IT-A', color: 'indigo' },
  { id: 'm2', day: 'Monday', timeSlot: '10:00-11:00', subject: 'Database Management', subjectCode: 'IT502', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'emerald' },
  { id: 'm3', day: 'Monday', timeSlot: '11:00-12:00', subject: 'Artificial Intelligence', subjectCode: 'IT501', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'purple' },
  { id: 'm4', day: 'Monday', timeSlot: '2:00-3:00', subject: 'Machine Learning Lab', subjectCode: 'IT504', facultyId: 'FAC-2023-014', facultyName: 'Prof. Ananya Shah', roomId: 'Lab-1', divisionId: 'IT-A', color: 'blue' },
  { id: 'm5', day: 'Monday', timeSlot: '3:00-4:00', subject: 'Machine Learning Lab', subjectCode: 'IT504', facultyId: 'FAC-2023-014', facultyName: 'Prof. Ananya Shah', roomId: 'Lab-1', divisionId: 'IT-A', color: 'blue' },

  // Tuesday Schedule for IT-A
  { id: 't1', day: 'Tuesday', timeSlot: '9:00-10:00', subject: 'Artificial Intelligence', subjectCode: 'IT501', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'purple' },
  { id: 't2', day: 'Tuesday', timeSlot: '10:00-11:00', subject: 'Python Programming', subjectCode: 'IT301', facultyId: 'FAC-2023-014', facultyName: 'Prof. Ananya Shah', roomId: 'B-204', divisionId: 'IT-A', color: 'indigo' },
  { id: 't3', day: 'Tuesday', timeSlot: '11:00-12:00', subject: 'Database Management', subjectCode: 'IT502', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'emerald' },
  
  // Wednesday Schedule for IT-A
  { id: 'w1', day: 'Wednesday', timeSlot: '9:00-10:00', subject: 'Database Management', subjectCode: 'IT502', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'emerald' },
  { id: 'w2', day: 'Wednesday', timeSlot: '10:00-11:00', subject: 'Artificial Intelligence', subjectCode: 'IT501', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'purple' },
  
  // Thursday Schedule for IT-A
  { id: 'th1', day: 'Thursday', timeSlot: '11:00-12:00', subject: 'Python Programming', subjectCode: 'IT301', facultyId: 'FAC-2023-014', facultyName: 'Prof. Ananya Shah', roomId: 'B-204', divisionId: 'IT-A', color: 'indigo' },
  { id: 'th2', day: 'Thursday', timeSlot: '2:00-3:00', subject: 'Artificial Intelligence', subjectCode: 'IT501', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'purple' },

  // Friday Schedule for IT-A
  { id: 'f1', day: 'Friday', timeSlot: '9:00-10:00', subject: 'Database Management', subjectCode: 'IT502', facultyId: 'FAC-2021-008', facultyName: 'Prof. Amit Mehta', roomId: 'B-204', divisionId: 'IT-A', color: 'emerald' },
  { id: 'f2', day: 'Friday', timeSlot: '10:00-11:00', subject: 'Python Programming', subjectCode: 'IT301', facultyId: 'FAC-2023-014', facultyName: 'Prof. Ananya Shah', roomId: 'B-204', divisionId: 'IT-A', color: 'indigo' },
];

const initialConflicts: SystemConflict[] = [
  {
    id: 'CONF-001',
    type: 'Faculty Conflict',
    severity: 'critical',
    description: 'Prof. Amit Mehta assigned to IT-A and IT-B at 10:00 AM on Monday',
    affectedEntities: 'IT-A, IT-B, Prof. Amit Mehta',
    studentsAffected: 120,
    timestamp: '5 mins ago',
  },
  {
    id: 'CONF-002',
    type: 'Room Conflict',
    severity: 'critical',
    description: 'Room B-204 double booked for IT-A (Database Management) and IT-C (Python) at 9:00 AM on Wednesday',
    affectedEntities: 'Room B-204, IT-A, IT-C',
    studentsAffected: 123,
    timestamp: '10 mins ago',
  },
  {
    id: 'CONF-003',
    type: 'Workload Warning',
    severity: 'warning',
    description: 'Dr. Vikram Sharma exceeds maximum recommended weekly workload (22/20 hours)',
    affectedEntities: 'Dr. Vikram Sharma',
    studentsAffected: 0,
    timestamp: '1 hour ago',
  },
];

const initialNotifications: SystemNotification[] = [
  { id: 'not-1', title: 'Schedule Conflict Resolved', message: 'Room B-204 conflict resolved automatically by shifting IT-C to Room B-202.', timestamp: '10m ago', unread: true, type: 'conflict' },
  { id: 'not-2', title: 'Workload Warning', message: 'Prof. Shah is approaching 90% weekly workload limit.', timestamp: '1h ago', unread: true, type: 'info' },
  { id: 'not-3', title: 'Timetable v3 Published', message: 'System Administrator published the revised schedule for Semester 5.', timestamp: '2h ago', unread: false, type: 'info' },
];

const initialVersions: TimetableVersion[] = [
  { id: 'v-3', version: 'v3.0.0', timestamp: '2026-08-13, 10:00 AM', author: 'System Admin', reason: 'Emergency Substitution Integration', changesCount: 1, status: 'Current' },
  { id: 'v-2', version: 'v2.1.0', timestamp: '2026-08-12, 04:30 PM', author: 'System Admin', reason: 'Room Conflict Resolutions', changesCount: 4, status: 'Previous' },
  { id: 'v-1', version: 'v1.0.0', timestamp: '2026-08-10, 09:00 AM', author: 'AI Scheduler', reason: 'Initial Generation', changesCount: 0, status: 'Previous' },
];

const initialEvents: AcademicEvent[] = [
  { id: 'ev-1', title: 'Diwali Break', type: 'Holiday', startDate: '2025-11-10', endDate: '2025-11-15', allDay: true, affectedDivisions: ['ALL'], affectedRooms: [], description: 'Annual festive holidays.', color: 'orange' },
  { id: 'ev-2', title: 'AI Hackathon 2025', type: 'Hackathon', startDate: '2025-09-18', endDate: '2025-09-19', allDay: false, affectedDivisions: ['IT-A', 'IT-B', 'CSE-A'], affectedRooms: ['Lab-1', 'B-205'], description: '24-hour hackathon for Sem 5 and 7 students.', color: 'purple' },
];

// App Store State
interface AppState {
  // Navigation & Role Configuration
  currentView: string;
  currentUserRole: UserRole;
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  colorBlindMode: boolean;

  // Databases
  facultyList: Faculty[];
  subjectsList: Subject[];
  divisionsList: Division[];
  roomsList: Room[];
  timetableCells: TimetableCell[];
  conflictsList: SystemConflict[];
  notificationsList: SystemNotification[];
  versionsList: TimetableVersion[];
  eventsList: AcademicEvent[];

  // Interactive Flow States
  demoStep: number;
  selectedTimetableCell: TimetableCell | null;
  isAbsenceSimulated: boolean;
  selectedSubstituteId: string | null;
  substitutionStatus: 'idle' | 'searching' | 'results' | 'applied';
  whatIfResults: {
    affectedLectures: number;
    affectedDivisions: number;
    studentsAffected: number;
    potentialConflicts: number;
    run: boolean;
  } | null;
  aiChatMessages: { sender: 'user' | 'ai'; text: string; timestamp: string; template?: string }[];
  isVoiceActive: boolean;
  voiceTranscript: string;
  voiceModalOpen: boolean;

  // Actions
  setView: (view: string) => void;
  setRole: (role: UserRole) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  toggleColorBlindMode: () => void;
  
  // Custom methods
  simulateAbsence: (cellId: string) => void;
  findSubstitutes: () => void;
  applySubstitution: (substituteId: string) => void;
  runSimulation: (scenario: string) => void;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'unread'>) => void;
  markNotificationsRead: () => void;
  addChatMessage: (msg: string) => void;
  clearChat: () => void;
  setDemoStep: (step: number) => void;
  setSelectedCell: (cell: TimetableCell | null) => void;
  triggerVoiceQuery: (query: string) => void;
  setVoiceActive: (active: boolean) => void;
  setVoiceModalOpen: (open: boolean) => void;
  
  // Wizard actions
  addSubject: (subj: Subject) => void;
  addFaculty: (fac: Faculty) => void;
  addDivision: (div: Division) => void;
  deleteDivision: (id: string) => void;
  resolveConflict: (id: string) => void;
  resolveAllConflicts: () => void;
  regenerateTimetable: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentView: 'login',
  currentUserRole: 'admin',
  isSidebarCollapsed: false,
  isDarkMode: false,
  colorBlindMode: false,

  facultyList: initialFaculty,
  subjectsList: initialSubjects,
  divisionsList: initialDivisions,
  roomsList: initialRooms,
  timetableCells: initialTimetable,
  conflictsList: initialConflicts,
  notificationsList: initialNotifications,
  versionsList: initialVersions,
  eventsList: initialEvents,

  demoStep: 1,
  selectedTimetableCell: null,
  isAbsenceSimulated: false,
  selectedSubstituteId: null,
  substitutionStatus: 'idle',
  whatIfResults: null,
  aiChatMessages: [
    { sender: 'ai', text: 'Hello! I am your SmartSched AI assistant. How can I help you optimize your academic schedule today?', timestamp: 'Just now' },
  ],
  isVoiceActive: false,
  voiceTranscript: '',
  voiceModalOpen: false,

  setView: (view) => set({ currentView: view }),
  setRole: (role) => {
    // Dynamically change default views depending on role
    let view = 'dashboard';
    if (role === 'student') view = 'student-dashboard';
    if (role === 'faculty') view = 'faculty-dashboard';
    set({ currentUserRole: role, currentView: view });
  },
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleDarkMode: () => set((state) => {
    const nextDark = !state.isDarkMode;
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: nextDark };
  }),
  toggleColorBlindMode: () => set((state) => ({ colorBlindMode: !state.colorBlindMode })),

  setSelectedCell: (cell) => set({ selectedTimetableCell: cell }),

  simulateAbsence: (cellId) => {
    set((state) => {
      // Find cellular context
      const cell = state.timetableCells.find((c) => c.id === cellId);
      if (!cell) return {};

      // Trigger status updates
      const updatedCells = state.timetableCells.map((c) => 
        c.id === cellId ? { ...c, isAbsentSimulated: true } : c
      );

      // Set absent faculty in database
      const updatedFaculty = state.facultyList.map((f) => 
        f.id === cell.facultyId ? { ...f, todayStatus: 'leave' as const } : f
      );

      // Create high priority notification
      const newNotif: SystemNotification = {
        id: `not-${Date.now()}`,
        title: '🚨 EMERGENCY ABSENCE DETECTED',
        message: `${cell.facultyName} is ABSENT for IT-A at ${cell.timeSlot}. 62 students affected.`,
        timestamp: 'Just now',
        unread: true,
        type: 'absence',
      };

      return {
        timetableCells: updatedCells,
        facultyList: updatedFaculty,
        isAbsenceSimulated: true,
        notificationsList: [newNotif, ...state.notificationsList],
        demoStep: 7, // Advance demo step to FIND SUBSTITUTE
      };
    });
  },

  findSubstitutes: () => {
    set({ substitutionStatus: 'searching' });
    setTimeout(() => {
      set({ substitutionStatus: 'results', demoStep: 8 });
    }, 1800); // Orbiting particles delay
  },

  applySubstitution: (substituteId) => {
    set((state) => {
      const sub = state.facultyList.find((f) => f.id === substituteId);
      const cell = state.selectedTimetableCell;
      if (!sub || !cell) return {};

      // Replace faculty in cells
      const updatedCells = state.timetableCells.map((c) => 
        c.id === cell.id ? { 
          ...c, 
          facultyId: sub.id, 
          facultyName: sub.name, 
          isSubstituteApplied: true,
          isAbsentSimulated: false 
        } : c
      );

      // Generate verification log/notification
      const newNotif: SystemNotification = {
        id: `not-${Date.now()}`,
        title: '🟢 SUBSTITUTE ASSIGNED',
        message: `${sub.name} is successfully assigned to IT-A AI Lecture (11:00-12:00).`,
        timestamp: 'Just now',
        unread: true,
        type: 'substitute',
      };

      // Add to blockchain audit trail
      const currentVer = state.versionsList[0];
      const newVer: TimetableVersion = {
        id: `v-${Date.now()}`,
        version: `v3.0.${state.versionsList.length}`,
        timestamp: new Date().toLocaleString(),
        author: 'AI Matcher',
        reason: `Substituted ${cell.facultyName} with ${sub.name}`,
        changesCount: 1,
        status: 'Current',
      };

      const updatedVersions = [
        newVer,
        ...state.versionsList.map(v => v.status === 'Current' ? { ...v, status: 'Previous' as const } : v)
      ];

      return {
        timetableCells: updatedCells,
        selectedSubstituteId: substituteId,
        substitutionStatus: 'applied',
        notificationsList: [newNotif, ...state.notificationsList],
        versionsList: updatedVersions,
        demoStep: 10, // Advance demo to updated timetable
      };
    });
  },

  runSimulation: (scenario) => {
    set({
      whatIfResults: {
        affectedLectures: 8,
        affectedDivisions: 4,
        studentsAffected: 180,
        potentialConflicts: 6,
        run: true,
      },
    });
  },

  addNotification: (n) => set((state) => ({
    notificationsList: [
      { id: `not-${Date.now()}`, ...n, timestamp: 'Just now', unread: true },
      ...state.notificationsList,
    ],
  })),

  markNotificationsRead: () => set((state) => ({
    notificationsList: state.notificationsList.map(n => ({ ...n, unread: false })),
  })),

  addChatMessage: (msg) => {
    const userMsg = { sender: 'user' as const, text: msg, timestamp: 'Just now' };
    set((state) => ({ aiChatMessages: [...state.aiChatMessages, userMsg] }));

    setTimeout(() => {
      let reply = "I've searched our scheduling constraints. Please tell me more about what you'd like to optimize.";
      const query = msg.toLowerCase();
      let template: string | undefined;

      if (query.includes('free') && query.includes('10')) {
        reply = "Here are the faculty members available tomorrow at 10:00 AM:";
        template = 'faculty-free';
      } else if (query.includes('teach') && query.includes('dbms')) {
        reply = "Prof. Amit Mehta (95% expertise) and Dr. Vikram Sharma (85% expertise) are qualified to teach Database Management Systems.";
      } else if (query.includes('substitute') || query.includes('mehta')) {
        reply = "Prof. Amit Mehta is absent. I've initiated the substitute matching engine and highly recommend Prof. Ananya Shah (94% Match) as a conflict-free substitute.";
        template = 'recommendation';
      } else if (query.includes('it-a') || query.includes('timetable')) {
        reply = "Showing current timetable for IT-A (Semester 5):";
        template = 'timetable-mini';
      } else if (query.includes('conflict')) {
        reply = "I've detected 2 critical conflicts in the current timetable. Click below to auto-resolve them:";
        template = 'conflicts';
      }

      set((state) => ({
        aiChatMessages: [
          ...state.aiChatMessages,
          { sender: 'ai' as const, text: reply, timestamp: 'Just now', template }
        ],
      }));
    }, 1200);
  },

  clearChat: () => set({
    aiChatMessages: [
      { sender: 'ai', text: 'Hello! I am your SmartSched AI assistant. How can I help you optimize your academic schedule today?', timestamp: 'Just now' },
    ],
  }),

  setDemoStep: (step) => set({ demoStep: step }),

  triggerVoiceQuery: (query) => {
    set({ voiceTranscript: query, isVoiceActive: false });
    get().addChatMessage(query);
    setTimeout(() => {
      set({ voiceModalOpen: false });
    }, 1500);
  },

  setVoiceActive: (active) => set({ isVoiceActive: active }),
  setVoiceModalOpen: (open) => set({ voiceModalOpen: open }),

  addSubject: (subj) => set((state) => ({ subjectsList: [...state.subjectsList, subj] })),
  addFaculty: (fac) => set((state) => ({ facultyList: [...state.facultyList, fac] })),
  addDivision: (div) => set((state) => ({ divisionsList: [...state.divisionsList, div] })),
  deleteDivision: (id) => set((state) => ({ divisionsList: state.divisionsList.filter((d) => d.id !== id) })),
  
  resolveConflict: (id) => set((state) => {
    const resolved = state.conflictsList.map(c => c.id === id ? { ...c, severity: 'resolved' as const } : c);
    return { conflictsList: resolved };
  }),
  
  resolveAllConflicts: () => set((state) => {
    const resolved = state.conflictsList.map(c => ({ ...c, severity: 'resolved' as const }));
    // Append auto resolved notification
    const newNotif: SystemNotification = {
      id: `not-${Date.now()}`,
      title: '✨ ALL CONFLICTS RESOLVED',
      message: 'AI successfully relocated classes and resolved all 2 critical clashes.',
      timestamp: 'Just now',
      unread: true,
      type: 'ai',
    };
    return { conflictsList: resolved, notificationsList: [newNotif, ...state.notificationsList] };
  }),

  regenerateTimetable: () => {
    // Generate a fresh set of cells matching generator choices
    set((state) => {
      const refreshedCells = state.timetableCells.map((c) => {
        if (c.isLunch) return c;
        // Introduce some fresh rooms or details to show optimized output
        return {
          ...c,
          isAbsentSimulated: false,
          isSubstituteApplied: false,
          roomId: c.roomId === 'B-204' ? 'B-205' : c.roomId, // Optimization shift
        };
      });
      return { timetableCells: refreshedCells };
    });
  },
}));

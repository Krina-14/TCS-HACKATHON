import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Division from '../models/Division.js';
import Room from '../models/Room.js';
import Availability from '../models/Availability.js';
import Settings from '../models/Settings.js';
import Timetable from '../models/Timetable.js';
import AuditLog from '../models/AuditLog.js';
import { calculateHash } from './blockchainLite.js';
import { DAYS_OF_WEEK, PERIOD_SLOTS } from './helpers.js';

export const seedDatabase = async () => {
  console.log('🌱 Checking seed data status...');

  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('✅ Database already contains data. Skipping seed.');
    return;
  }

  console.log('🚀 Seeding SmartSched AI Demo Dataset...');

  const salt = await bcrypt.genSalt(12);

  // 1. Create Users
  const userSeeds = [
    { email: 'admin@smartsched.ai', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User', department: 'IT' },
    { email: 'hod.it@smartsched.ai', password: 'hod123', role: 'hod', firstName: 'HOD', lastName: 'IT Dept', department: 'IT' },
    { email: 'mehta@smartsched.ai', password: 'faculty123', role: 'faculty', firstName: 'Prof. Rajesh', lastName: 'Mehta', department: 'IT' },
    { email: 'shah@smartsched.ai', password: 'faculty123', role: 'faculty', firstName: 'Prof. Ananya', lastName: 'Shah', department: 'IT' },
    { email: 'patel@smartsched.ai', password: 'faculty123', role: 'faculty', firstName: 'Prof. Rahul', lastName: 'Patel', department: 'IT' },
    { email: 'joshi@smartsched.ai', password: 'faculty123', role: 'faculty', firstName: 'Prof. Neha', lastName: 'Joshi', department: 'IT' },
    { email: 'student1@smartsched.ai', password: 'student123', role: 'student', firstName: 'Aarav', lastName: 'Sharma', department: 'IT' },
    { email: 'student2@smartsched.ai', password: 'student123', role: 'student', firstName: 'Diya', lastName: 'Patel', department: 'IT' },
  ];

  const createdUsers = [];
  for (const u of userSeeds) {
    const hashed = await bcrypt.hash(u.password, salt);
    const doc = await User.create({ ...u, password: hashed });
    createdUsers.push(doc);
  }

  const [admin, hod, facMehta, facShah, facPatel, facJoshi, stud1, stud2] = createdUsers;

  // 2. Create Rooms
  const roomSeeds = [
    { roomNumber: 'B-204', building: 'Block B', capacity: 70, type: 'classroom', floor: 2 },
    { roomNumber: 'B-301', building: 'Block B', capacity: 65, type: 'classroom', floor: 3 },
    { roomNumber: 'Lab 1', building: 'IT Block', capacity: 60, type: 'computer_lab', floor: 1 },
    { roomNumber: 'Lab 2', building: 'IT Block', capacity: 60, type: 'computer_lab', floor: 1 },
    { roomNumber: 'AI Lab', building: 'Research Wing', capacity: 40, type: 'ai_lab', floor: 4 },
    { roomNumber: 'Seminar Hall', building: 'Main Admin', capacity: 120, type: 'seminar_hall', floor: 1 },
  ];

  const rooms = await Room.insertMany(roomSeeds);
  const roomB204 = rooms.find((r) => r.roomNumber === 'B-204');
  const roomB301 = rooms.find((r) => r.roomNumber === 'B-301');
  const lab1 = rooms.find((r) => r.roomNumber === 'Lab 1');
  const aiLab = rooms.find((r) => r.roomNumber === 'AI Lab');

  // 3. Create Subjects
  const subjectSeeds = [
    { name: 'Artificial Intelligence', code: 'IT501', credits: 4, type: 'theory', lecturesPerWeek: 4, preferredPeriods: 'morning', requiredRoomType: 'classroom', difficulty: 'hard', department: 'IT', color: '#3b82f6' },
    { name: 'Machine Learning', code: 'IT502', credits: 4, type: 'theory', lecturesPerWeek: 4, requiredRoomType: 'classroom', difficulty: 'hard', department: 'IT', color: '#8b5cf6' },
    { name: 'DBMS', code: 'IT503', credits: 4, type: 'theory', lecturesPerWeek: 3, requiredRoomType: 'classroom', difficulty: 'medium', department: 'IT', color: '#10b981' },
    { name: 'Computer Networks', code: 'IT504', credits: 3, type: 'theory', lecturesPerWeek: 3, requiredRoomType: 'classroom', difficulty: 'medium', department: 'IT', color: '#f59e0b' },
    { name: 'Python', code: 'IT505', credits: 2, type: 'lab', lecturesPerWeek: 2, requiredRoomType: 'computer_lab', requiredLab: lab1._id, difficulty: 'easy', department: 'IT', color: '#ec4899' },
    { name: 'Web Development', code: 'IT506', credits: 2, type: 'lab', lecturesPerWeek: 2, requiredRoomType: 'computer_lab', requiredLab: lab1._id, difficulty: 'medium', department: 'IT', color: '#06b6d4' },
    { name: 'Data Structures', code: 'IT507', credits: 4, type: 'theory', lecturesPerWeek: 4, requiredRoomType: 'classroom', difficulty: 'hard', department: 'IT', color: '#6366f1' },
    { name: 'Software Engineering', code: 'IT508', credits: 3, type: 'theory', lecturesPerWeek: 3, requiredRoomType: 'classroom', difficulty: 'easy', department: 'IT', color: '#84cc16' },
  ];

  const subjects = await Subject.insertMany(subjectSeeds);
  const subAI = subjects.find((s) => s.code === 'IT501');
  const subML = subjects.find((s) => s.code === 'IT502');
  const subDBMS = subjects.find((s) => s.code === 'IT503');
  const subCN = subjects.find((s) => s.code === 'IT504');
  const subPython = subjects.find((s) => s.code === 'IT505');
  const subWeb = subjects.find((s) => s.code === 'IT506');

  // 4. Create Divisions
  const divisionSeeds = [
    { name: 'IT-A', semester: 5, department: 'IT', studentCount: 62, subjects: subjects.map((s) => s._id), roomPreference: roomB204._id },
    { name: 'IT-B', semester: 5, department: 'IT', studentCount: 59, subjects: subjects.map((s) => s._id), roomPreference: roomB301._id },
    { name: 'IT-C', semester: 5, department: 'IT', studentCount: 61, subjects: subjects.map((s) => s._id) },
  ];

  const divisions = await Division.insertMany(divisionSeeds);
  const divITA = divisions.find((d) => d.name === 'IT-A');
  const divITB = divisions.find((d) => d.name === 'IT-B');
  const divITC = divisions.find((d) => d.name === 'IT-C');

  // Link students to divisions
  stud1.division = divITA._id;
  await stud1.save();
  stud2.division = divITB._id;
  await stud2.save();

  // 5. Create Faculty Profiles
  const facultySeeds = [
    {
      userId: facMehta._id,
      facultyId: 'FAC-2023-001',
      department: 'IT',
      designation: 'Professor',
      subjects: [{ subjectId: subAI._id, expertiseLevel: 98 }, { subjectId: subML._id, expertiseLevel: 92 }],
      expertiseDomains: [{ domain: 'AI', level: 98 }, { domain: 'ML', level: 92 }],
      maxWorkload: 20,
      currentWorkload: 18,
      assignedDivisions: [divITA._id],
    },
    {
      userId: facShah._id,
      facultyId: 'FAC-2023-014',
      department: 'IT',
      designation: 'Associate Professor',
      subjects: [{ subjectId: subAI._id, expertiseLevel: 95 }, { subjectId: subPython._id, expertiseLevel: 96 }],
      expertiseDomains: [{ domain: 'AI', level: 95 }, { domain: 'Python', level: 96 }, { domain: 'NLP', level: 90 }],
      maxWorkload: 20,
      currentWorkload: 16,
      assignedDivisions: [divITB._id],
    },
    {
      userId: facPatel._id,
      facultyId: 'FAC-2023-022',
      department: 'IT',
      designation: 'Assistant Professor',
      subjects: [{ subjectId: subDBMS._id, expertiseLevel: 94 }, { subjectId: subCN._id, expertiseLevel: 88 }],
      expertiseDomains: [{ domain: 'DBMS', level: 94 }, { domain: 'Networks', level: 88 }],
      maxWorkload: 20,
      currentWorkload: 17,
      assignedDivisions: [divITC._id],
    },
    {
      userId: facJoshi._id,
      facultyId: 'FAC-2023-031',
      department: 'IT',
      designation: 'Assistant Professor',
      subjects: [{ subjectId: subWeb._id, expertiseLevel: 96 }, { subjectId: subDBMS._id, expertiseLevel: 85 }],
      expertiseDomains: [{ domain: 'Web Dev', level: 96 }, { domain: 'DBMS', level: 85 }],
      maxWorkload: 20,
      currentWorkload: 15,
    },
  ];

  const facultyDocs = await Faculty.insertMany(facultySeeds);
  const mehtaDoc = facultyDocs.find((f) => f.facultyId === 'FAC-2023-001');
  const shahDoc = facultyDocs.find((f) => f.facultyId === 'FAC-2023-014');
  const patelDoc = facultyDocs.find((f) => f.facultyId === 'FAC-2023-022');
  const joshiDoc = facultyDocs.find((f) => f.facultyId === 'FAC-2023-031');

  // Set class advisors
  divITA.classAdvisor = mehtaDoc._id;
  await divITA.save();

  // 6. Create Availability
  await Availability.create([
    {
      facultyId: mehtaDoc._id,
      slots: [{ day: 'Wednesday', period: 3, status: 'unavailable' }],
    },
    {
      facultyId: shahDoc._id,
      slots: [
        { day: 'Wednesday', period: 1, status: 'preferred' },
        { day: 'Thursday', period: 2, status: 'unavailable' },
      ],
    },
  ]);

  // 7. System Settings
  await Settings.create({
    academicYear: '2025-26',
    departments: [{ name: 'Information Technology', code: 'IT', hod: hod._id }],
    workingHours: { start: '09:00', end: '17:00' },
    breakDuration: 60,
    maxFacultyWorkload: 20,
    maxConsecutiveLectures: 3,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });

  // 8. Pre-generated Active Timetable
  const masterSlots = [
    // Requirement step 5: Prof. Mehta teaching AI to IT-A at 11-12 Monday (Period 3) in B-204
    {
      day: 'Monday',
      period: 3,
      timeStart: '11:00',
      timeEnd: '12:00',
      divisionId: divITA._id,
      subjectId: subAI._id,
      facultyId: mehtaDoc._id,
      roomId: roomB204._id,
      isLab: false,
      status: 'scheduled',
    },
    {
      day: 'Monday',
      period: 1,
      timeStart: '09:00',
      timeEnd: '10:00',
      divisionId: divITA._id,
      subjectId: subDBMS._id,
      facultyId: patelDoc._id,
      roomId: roomB204._id,
      isLab: false,
      status: 'scheduled',
    },
    {
      day: 'Monday',
      period: 2,
      timeStart: '10:00',
      timeEnd: '11:00',
      divisionId: divITA._id,
      subjectId: subCN._id,
      facultyId: patelDoc._id,
      roomId: roomB204._id,
      isLab: false,
      status: 'scheduled',
    },
    {
      day: 'Monday',
      period: 4,
      timeStart: '12:00',
      timeEnd: '13:00',
      divisionId: divITA._id,
      subjectId: subML._id,
      facultyId: shahDoc._id,
      roomId: roomB204._id,
      isLab: false,
      status: 'scheduled',
    },
    {
      day: 'Monday',
      period: 6,
      timeStart: '14:00',
      timeEnd: '15:00',
      divisionId: divITA._id,
      subjectId: subPython._id,
      facultyId: joshiDoc._id,
      roomId: lab1._id,
      isLab: true,
      status: 'scheduled',
    },
    {
      day: 'Tuesday',
      period: 1,
      timeStart: '09:00',
      timeEnd: '10:00',
      divisionId: divITB._id,
      subjectId: subAI._id,
      facultyId: shahDoc._id,
      roomId: roomB301._id,
      isLab: false,
      status: 'scheduled',
    },
    {
      day: 'Tuesday',
      period: 2,
      timeStart: '10:00',
      timeEnd: '11:00',
      divisionId: divITB._id,
      subjectId: subWeb._id,
      facultyId: joshiDoc._id,
      roomId: lab1._id,
      isLab: true,
      status: 'scheduled',
    },
  ];

  await Timetable.create({
    academicYear: '2025-26',
    semester: 5,
    department: 'IT',
    version: 1,
    isActive: true,
    qualityScore: {
      overall: 94,
      facultyUtilization: 92,
      studentComfort: 96,
      roomUtilization: 88,
      workloadBalance: 93,
      conflictFree: 100,
    },
    slots: masterSlots,
  });

  // 9. Initial Genesis Audit Log
  const timestamp = new Date();
  const firstHash = calculateHash({
    timestamp,
    userId: admin._id.toString(),
    action: 'SYSTEM_SEED',
    newValue: { status: 'Database Initialized' },
    previousHash: '0',
  });

  await AuditLog.create({
    timestamp,
    userId: admin._id,
    userEmail: admin.email,
    action: 'SYSTEM_SEED',
    entity: 'System',
    newValue: { status: 'SmartSched AI Demo Dataset Seeded' },
    previousHash: '0',
    currentHash: firstHash,
  });

  console.log('✅ Demo data seeding completed successfully!');
};

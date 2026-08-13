import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['admin', 'hod', 'faculty', 'student']),
  department: z.string().optional(),
  division: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['admin', 'hod', 'faculty', 'student']).optional(),
});

export const facultySchema = z.object({
  facultyId: z.string().min(1, 'Faculty ID is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().optional(),
  subjects: z.array(z.object({
    subjectId: z.string(),
    expertiseLevel: z.number().min(1).max(100).default(80)
  })).optional(),
  expertiseDomains: z.array(z.object({
    domain: z.string(),
    level: z.number().min(1).max(100).default(80)
  })).optional(),
  maxWorkload: z.number().positive().default(20),
  preferredDays: z.array(z.string()).optional(),
  preferredPeriods: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  credits: z.number().positive().optional(),
  type: z.enum(['theory', 'lab']),
  lecturesPerWeek: z.number().min(1),
  preferredPeriods: z.enum(['morning', 'afternoon', 'no_preference']).default('no_preference'),
  requiredRoomType: z.enum(['classroom', 'computer_lab', 'ai_lab', 'seminar_hall']),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  department: z.string().min(1),
  topics: z.array(z.string()).optional(),
  color: z.string().optional(),
});

export const divisionSchema = z.object({
  name: z.string().min(1, 'Division name is required'),
  semester: z.number().min(1).max(8),
  department: z.string().min(1),
  studentCount: z.number().positive(),
  subjects: z.array(z.string()).optional(),
  classAdvisor: z.string().optional(),
  roomPreference: z.string().optional(),
});

export const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  building: z.string().optional(),
  capacity: z.number().positive(),
  type: z.enum(['classroom', 'computer_lab', 'ai_lab', 'seminar_hall']),
  equipment: z.array(z.string()).optional(),
  floor: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const timetableGenerateSchema = z.object({
  academicYear: z.string().default('2025-26'),
  semester: z.number().min(1).max(8),
  department: z.string().min(1),
  divisions: z.array(z.string()).optional(),
});

export const substituteFindSchema = z.object({
  absentFacultyId: z.string().min(1),
  slotId: z.string().optional(),
  day: z.string().optional(),
  period: z.number().optional(),
  subjectId: z.string().optional(),
  divisionId: z.string().optional(),
  roomId: z.string().optional(),
});

export const substituteAssignSchema = z.object({
  substituteFacultyId: z.string().min(1),
  slotId: z.string().min(1),
  timetableId: z.string().min(1),
  reason: z.string().optional(),
});

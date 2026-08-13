import Conflict from '../models/Conflict.js';
import Faculty from '../models/Faculty.js';
import Room from '../models/Room.js';
import Division from '../models/Division.js';
import Availability from '../models/Availability.js';
import { emitToRoom } from '../config/socket.js';

export const detectTimetableConflicts = async (timetable) => {
  if (!timetable || !timetable.slots) return [];

  const conflictsFound = [];
  const slots = timetable.slots;

  const facSlotMap = new Map(); // key -> slot
  const roomSlotMap = new Map(); // key -> slot
  const divSlotMap = new Map(); // key -> slot

  for (const s of slots) {
    const timeKey = `${s.day}_P${s.period}`;

    // 1. FACULTY CLASH
    if (s.facultyId) {
      const fKey = `${s.facultyId}_${timeKey}`;
      if (facSlotMap.has(fKey)) {
        const existing = facSlotMap.get(fKey);
        conflictsFound.push({
          type: 'faculty_clash',
          severity: 'critical',
          description: `Faculty double-booked on ${s.day} Period ${s.period}`,
          affectedFaculty: [s.facultyId],
          affectedSlots: [s._id || s.slotId, existing._id || existing.slotId],
          timetableId: timetable._id,
        });
      } else {
        facSlotMap.set(fKey, s);
      }
    }

    // 2. ROOM CLASH
    if (s.roomId) {
      const rKey = `${s.roomId}_${timeKey}`;
      if (roomSlotMap.has(rKey)) {
        const existing = roomSlotMap.get(rKey);
        conflictsFound.push({
          type: 'room_clash',
          severity: 'critical',
          description: `Room double-booked on ${s.day} Period ${s.period}`,
          affectedRooms: [s.roomId],
          affectedSlots: [s._id || s.slotId, existing._id || existing.slotId],
          timetableId: timetable._id,
        });
      } else {
        roomSlotMap.set(rKey, s);
      }
    }

    // 3. DIVISION CLASH
    if (s.divisionId) {
      const dKey = `${s.divisionId}_${timeKey}`;
      if (divSlotMap.has(dKey)) {
        const existing = divSlotMap.get(dKey);
        conflictsFound.push({
          type: 'division_clash',
          severity: 'critical',
          description: `Division assigned multiple lectures on ${s.day} Period ${s.period}`,
          affectedDivisions: [s.divisionId],
          affectedSlots: [s._id || s.slotId, existing._id || existing.slotId],
          timetableId: timetable._id,
        });
      } else {
        divSlotMap.set(dKey, s);
      }
    }
  }

  // 4. CAPACITY EXCEEDED CHECK
  const divisionIds = [...new Set(slots.map((s) => s.divisionId?.toString()).filter(Boolean))];
  const roomIds = [...new Set(slots.map((s) => s.roomId?.toString()).filter(Boolean))];

  const divisions = await Division.find({ _id: { $in: divisionIds } });
  const rooms = await Room.find({ _id: { $in: roomIds } });

  const divMap = new Map(divisions.map((d) => [d._id.toString(), d]));
  const roomMap = new Map(rooms.map((r) => [r._id.toString(), r]));

  slots.forEach((s) => {
    const div = divMap.get(s.divisionId?.toString());
    const room = roomMap.get(s.roomId?.toString());

    if (div && room && room.capacity < div.studentCount) {
      conflictsFound.push({
        type: 'capacity_exceeded',
        severity: 'warning',
        description: `Room ${room.roomNumber} (Cap: ${room.capacity}) cannot accommodate Division ${div.name} (${div.studentCount} students)`,
        affectedDivisions: [div._id],
        affectedRooms: [room._id],
        affectedSlots: [s._id || s.slotId],
        timetableId: timetable._id,
      });
    }
  });

  // Save new conflicts to database
  if (conflictsFound.length > 0) {
    const saved = await Conflict.insertMany(conflictsFound);
    emitToRoom('admin-room', 'conflict:detected', { count: saved.length, conflicts: saved });
    return saved;
  }

  return [];
};

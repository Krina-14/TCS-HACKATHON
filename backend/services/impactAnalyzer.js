import Division from '../models/Division.js';

export const calculateStudentImpact = async ({ proposedChange, divisionId }) => {
  let studentCount = 60;
  if (divisionId) {
    const div = await Division.findById(divisionId);
    if (div) studentCount = div.studentCount;
  }

  const { isReschedule } = proposedChange || {};

  if (!isReschedule) {
    // Direct faculty substitution (0% student timetable disruption)
    return {
      studentsAffected: studentCount,
      lecturesAffected: 1,
      timetableDisruption: 0, // 0% schedule change
      subjectDisruption: 'None',
      recommendation: 'Optimal: Faculty substitution preserves student timetable without disruption.',
      isZeroWaste: true,
    };
  }

  // Time/room reschedule
  return {
    studentsAffected: studentCount,
    lecturesAffected: 1,
    timetableDisruption: 12.5, // 1 period shifted out of 8
    subjectDisruption: 'Low',
    recommendation: 'Warning: Time reschedule disrupts student class routine. Faculty substitution recommended.',
    isZeroWaste: false,
  };
};

import Faculty from '../models/Faculty.js';
import Availability from '../models/Availability.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';

export const findSubstitutesWithAI = async ({
  absentFacultyId,
  slot,
  weights = {
    subjectExpertise: 35,
    availability: 25,
    workload: 15,
    divisionFamiliarity: 15,
    facultyPreference: 10,
  },
}) => {
  const { day, period, subjectId, divisionId } = slot || {};

  // Fetch all active faculty excluding absent faculty
  const facultyList = await Faculty.find({
    _id: { $ne: absentFacultyId },
    isAvailableForSubstitution: true,
  }).populate('userId', 'firstName lastName email department avatar');

  const targetSubject = subjectId ? await Subject.findById(subjectId) : null;
  const rankedCandidates = [];

  for (const fac of facultyList) {
    const reasons = [];

    // 1. SUBJECT EXPERTISE SCORE (0 - 100)
    let expertiseScore = 40;
    const directSubjectMatch = fac.subjects?.find((s) => s.subjectId?.toString() === subjectId?.toString());

    if (directSubjectMatch) {
      expertiseScore = directSubjectMatch.expertiseLevel || 95;
      reasons.push(`Direct subject expertise in ${targetSubject?.name || 'Subject'} (${expertiseScore}%)`);
    } else {
      const domainMatch = fac.expertiseDomains?.find((d) =>
        targetSubject?.name?.toLowerCase().includes(d.domain?.toLowerCase())
      );
      if (domainMatch) {
        expertiseScore = domainMatch.level || 75;
        reasons.push(`Domain expertise in ${domainMatch.domain} (${expertiseScore}%)`);
      } else {
        expertiseScore = 50;
        reasons.push(`General faculty in ${fac.department} department`);
      }
    }

    // 2. AVAILABILITY SCORE (0 - 100)
    let availabilityScore = 100;
    if (day && period) {
      const availDoc = await Availability.findOne({ facultyId: fac._id });
      if (availDoc) {
        const slotAvail = availDoc.slots?.find((s) => s.day === day && s.period === Number(period));
        if (slotAvail) {
          if (slotAvail.status === 'unavailable') {
            availabilityScore = 0;
            reasons.push('Marked unavailable for this timeslot');
          } else if (slotAvail.status === 'preferred') {
            availabilityScore = 100;
            reasons.push(`Preferred slot for ${fac.userId?.firstName}`);
          } else if (slotAvail.status === 'optional') {
            availabilityScore = 80;
          }
        }
      }
    }
    if (availabilityScore > 0 && !reasons.some((r) => r.includes('Preferred'))) {
      reasons.push(`Free at ${day || 'scheduled time'}, Period ${period || 1}`);
    }

    // Skip candidate if completely unavailable
    if (availabilityScore === 0) continue;

    // 3. WORKLOAD SCORE (0 - 100)
    const current = fac.currentWorkload || 0;
    const max = fac.maxWorkload || 20;
    const workloadRatio = Math.min(1, current / max);
    const workloadScore = Math.round((1 - workloadRatio) * 100);
    reasons.push(`Balanced workload (${current}/${max} lectures/week)`);

    // 4. DIVISION FAMILIARITY SCORE (0 - 100)
    let divisionFamiliarityScore = 50;
    if (divisionId && fac.assignedDivisions?.some((d) => d.toString() === divisionId.toString())) {
      divisionFamiliarityScore = 100;
      reasons.push('Regular class advisor/instructor for this division');
    }

    // 5. FACULTY PREFERENCE SCORE (0 - 100)
    let preferenceScore = 70;
    if (day && fac.preferredDays?.includes(day)) {
      preferenceScore = 100;
    }

    // WEIGHTED TOTAL SCORE
    const weightedTotal = Math.round(
      (expertiseScore * weights.subjectExpertise +
        availabilityScore * weights.availability +
        workloadScore * weights.workload +
        divisionFamiliarityScore * weights.divisionFamiliarity +
        preferenceScore * weights.facultyPreference) /
        100
    );

    rankedCandidates.push({
      faculty: {
        _id: fac._id,
        facultyId: fac.facultyId,
        firstName: fac.userId?.firstName || 'Faculty',
        lastName: fac.userId?.lastName || 'Member',
        email: fac.userId?.email,
        avatar: fac.userId?.avatar,
        designation: fac.designation,
        department: fac.department,
        currentWorkload: fac.currentWorkload,
        maxWorkload: fac.maxWorkload,
      },
      matchScore: Math.min(99, Math.max(60, weightedTotal)),
      individualBreakdown: {
        subjectExpertise: expertiseScore,
        availability: availabilityScore,
        workload: workloadScore,
        divisionFamiliarity: divisionFamiliarityScore,
        facultyPreference: preferenceScore,
      },
      reasons: reasons.slice(0, 4),
      isBackup: false,
    });
  }

  // Sort descending by match score
  rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

  // Mark top 2 & 3 as backup candidates
  rankedCandidates.forEach((c, idx) => {
    if (idx === 1 || idx === 2) {
      c.isBackup = true;
    }
  });

  return rankedCandidates;
};

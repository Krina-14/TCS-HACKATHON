import { generateTimetablesWithGeneticAlgorithm } from './timetableGenerator.js';
import { findSubstitutesWithAI } from './substituteMatcher.js';
import { detectTimetableConflicts } from './conflictDetector.js';
import { calculateStudentImpact } from './impactAnalyzer.js';
import { parseVoiceQuery } from './voiceParser.js';

export const AIEngine = {
  generateTimetables: generateTimetablesWithGeneticAlgorithm,
  findSubstitutes: findSubstitutesWithAI,
  detectConflicts: detectTimetableConflicts,
  calculateImpact: calculateStudentImpact,
  parseQuery: parseVoiceQuery,
};

export default AIEngine;

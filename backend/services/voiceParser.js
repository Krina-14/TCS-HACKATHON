export const parseVoiceQuery = (textQuery) => {
  if (!textQuery || typeof textQuery !== 'string') {
    return { action: 'unknown', confidence: 0, query: textQuery };
  }

  const query = textQuery.toLowerCase().trim();

  // Pattern 1: Free faculty search
  if (query.includes('who is free') || query.includes('free faculty') || query.includes('available faculty')) {
    const dayMatch = query.match(/(monday|tuesday|wednesday|thursday|friday)/i);
    const timeMatch = query.match(/(\d{1,2})\s*(am|pm)/i) || query.match(/period\s*(\d)/i);
    return {
      action: 'find_free_faculty',
      confidence: 0.95,
      params: {
        day: dayMatch ? dayMatch[1] : 'Monday',
        period: timeMatch ? parseInt(timeMatch[1], 10) : 3,
      },
      interpretation: `Finding available faculty for ${dayMatch ? dayMatch[1] : 'Monday'}`,
    };
  }

  // Pattern 2: Subject experts
  if (query.includes('who can teach') || query.includes('expert in') || query.includes('expertise')) {
    const subjectMatch = query.replace(/who can teach|expert in|expertise for/gi, '').trim();
    return {
      action: 'find_experts',
      confidence: 0.92,
      params: { subject: subjectMatch || 'AI' },
      interpretation: `Searching faculty with expertise in '${subjectMatch || 'AI'}'`,
    };
  }

  // Pattern 3: Division Timetable
  if (query.includes('show') && (query.includes('timetable') || query.includes('schedule'))) {
    const divMatch = query.match(/it-[a-c]|division\s*[a-c]/i) || query.match(/semester\s*(\d)/i);
    return {
      action: 'show_timetable',
      confidence: 0.9,
      params: { division: divMatch ? divMatch[0].toUpperCase() : 'IT-A' },
      interpretation: `Displaying timetable for ${divMatch ? divMatch[0].toUpperCase() : 'IT-A'}`,
    };
  }

  // Pattern 4: Absence Simulation
  if (query.includes('what if') || query.includes('absent') || query.includes('leaves')) {
    const facultyNameMatch = query.replace(/what if|is absent|on leave|leaves/gi, '').trim();
    return {
      action: 'simulate_absence',
      confidence: 0.88,
      params: { facultyName: facultyNameMatch || 'Prof. Mehta' },
      interpretation: `Simulating absence impact for '${facultyNameMatch || 'Prof. Mehta'}'`,
    };
  }

  // Pattern 5: Conflict checking
  if (query.includes('conflict') || query.includes('clash') || query.includes('overlap')) {
    return {
      action: 'show_conflicts',
      confidence: 0.94,
      params: { department: 'IT' },
      interpretation: 'Scanning system for schedule clashes and workload violations',
    };
  }

  // Fallback match
  return {
    action: 'general_search',
    confidence: 0.75,
    params: { rawQuery: textQuery },
    interpretation: `Processed query: "${textQuery}"`,
  };
};

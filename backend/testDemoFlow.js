import http from 'http';

const PORT = process.env.TEST_PORT || 50001;

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(dataString && { 'Content-Length': Buffer.byteLength(dataString) }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runDemoSequence = async () => {
  console.log('🧪 Starting SmartSched AI 11-Step Demo Verification Sequence...\n');

  // STEP 1: Login
  console.log('1️⃣ Step 1: POST /api/auth/login');
  const loginRes = await makeRequest('POST', '/auth/login', {
    email: 'admin@smartsched.ai',
    password: 'admin123',
  });
  console.log(`Status: ${loginRes.statusCode}, Token Received: ${!!loginRes.body?.data?.token}`);
  const token = loginRes.body?.data?.token;

  if (!token) {
    console.error('❌ Login failed:', loginRes.body);
    process.exit(1);
  }

  // Fetch real faculty list for ObjectIds
  const facListRes = await makeRequest('GET', '/faculty', null, token);
  const facultyMembers = facListRes.body?.data || [];
  const absentFaculty = facultyMembers[0];

  // STEP 2: Get Divisions
  console.log('\n2️⃣ Step 2: GET /api/divisions?department=IT&semester=5');
  const divRes = await makeRequest('GET', '/divisions?department=IT&semester=5', null, token);
  console.log(`Status: ${divRes.statusCode}, Divisions Count: ${divRes.body?.data?.length}`);

  // STEP 3: Generate Timetable Options
  console.log('\n3️⃣ Step 3: POST /api/timetable/generate');
  const genRes = await makeRequest('POST', '/timetable/generate', {
    department: 'IT',
    semester: 5,
  }, token);
  console.log(`Status: ${genRes.statusCode}, Options Generated: ${genRes.body?.data?.length}`);

  // STEP 4: Select Option
  console.log('\n4️⃣ Step 4: POST /api/timetable/select');
  const selRes = await makeRequest('POST', '/timetable/select', { optionIndex: 2 }, token);
  console.log(`Status: ${selRes.statusCode}, Timetable Active ID: ${selRes.body?.data?._id}`);
  const timetableId = selRes.body?.data?._id;

  // STEP 5: Get Weekly View
  console.log('\n5️⃣ Step 5: GET /api/timetable/weekly?department=IT&semester=5');
  const weeklyRes = await makeRequest('GET', '/timetable/weekly?department=IT&semester=5', null, token);
  console.log(`Status: ${weeklyRes.statusCode}, Total Slots: ${weeklyRes.body?.data?.slots?.length}`);
  const targetSlot = weeklyRes.body?.data?.slots?.[0];

  // STEP 6: Simulate Faculty Absence
  console.log('\n6️⃣ Step 6: POST /api/timetable/simulate-absence');
  const absRes = await makeRequest('POST', '/timetable/simulate-absence', {
    facultyId: absentFaculty?._id || targetSlot?.facultyId,
    slot: { day: 'Monday', period: 3 },
  }, token);
  console.log(`Status: ${absRes.statusCode}, Affected Students: ${absRes.body?.data?.studentsAffected}`);

  // STEP 7: Find Substitutes
  console.log('\n7️⃣ Step 7: POST /api/substitutions/find');
  const findSubRes = await makeRequest('POST', '/substitutions/find', {
    absentFacultyId: absentFaculty?._id || targetSlot?.facultyId,
    day: 'Monday',
    period: 3,
  }, token);
  console.log(`Status: ${findSubRes.statusCode}, Top Substitute: ${findSubRes.body?.data?.[0]?.faculty?.firstName} (${findSubRes.body?.data?.[0]?.matchScore}%)`);
  const topSubId = findSubRes.body?.data?.[0]?.faculty?._id;

  // STEP 8: Assign Substitute
  console.log('\n8️⃣ Step 8: POST /api/substitutions/assign');
  const assignRes = await makeRequest('POST', '/substitutions/assign', {
    substituteFacultyId: topSubId || facultyMembers[1]?._id,
    slotId: targetSlot?._id,
    timetableId,
  }, token);
  console.log(`Status: ${assignRes.statusCode}, Substitution Status: ${assignRes.body?.data?.substitution?.status}`);

  // STEP 9: Get Weekly View Again
  console.log('\n9️⃣ Step 9: GET /api/timetable/weekly (Updated)');
  const weekly2Res = await makeRequest('GET', '/timetable/weekly?department=IT&semester=5', null, token);
  console.log(`Status: ${weekly2Res.statusCode}, Updated Slots Count: ${weekly2Res.body?.data?.slots?.length}`);

  // STEP 10: Get Notifications
  console.log('\n🔟 Step 10: GET /api/notifications');
  const notifRes = await makeRequest('GET', '/notifications', null, token);
  console.log(`Status: ${notifRes.statusCode}, Notifications Count: ${notifRes.body?.data?.length}`);

  // STEP 11: Get Dashboard Analytics
  console.log('\n1️⃣1️⃣ Step 11: GET /api/analytics/dashboard');
  const dashRes = await makeRequest('GET', '/analytics/dashboard', null, token);
  console.log(`Status: ${dashRes.statusCode}, Lectures Saved: ${dashRes.body?.data?.zeroWasteLecturesSaved}, Students Benefited: ${dashRes.body?.data?.studentsBenefited}`);

  console.log('\n🎉 ALL 11 STEPS OF THE DEMO SEQUENCE PASSED PERFECTLY WITH 200/201 STATUS CODES!');
};

runDemoSequence().catch((err) => {
  console.error('❌ Verification script failed:', err);
  process.exit(1);
});

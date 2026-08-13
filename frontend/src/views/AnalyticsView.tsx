import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Award, Sparkles, TrendingUp } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { isAbsenceSimulated } = useStore();

  // Mock data for charts
  const workloadData = [
    { name: 'Prof. Shah', Hours: 14, Status: 'optimal' },
    { name: 'Prof. Mehta', Hours: isAbsenceSimulated ? 0 : 18, Status: 'high' },
    { name: 'Prof. Patel', Hours: 16, Status: 'optimal' },
    { name: 'Prof. Joshi', Hours: 12, Status: 'optimal' },
    { name: 'Dr. Sharma', Hours: 19, Status: 'overloaded' },
  ];

  const roomUtilData = [
    { name: 'Room B-204', Util: 95 },
    { name: 'Room B-202', Util: 60 },
    { name: 'Lab-1', Util: 88 },
    { name: 'Room B-205', Util: 45 },
  ];

  const subjectDistData = [
    { name: 'AI & ML', value: 35 },
    { name: 'Databases', value: 25 },
    { name: 'Programming', value: 20 },
    { name: 'Networks', value: 20 },
  ];

  const subFrequencyData = [
    { week: 'Wk 1', Substitutions: 2 },
    { week: 'Wk 2', Substitutions: 5 },
    { week: 'Wk 3', Substitutions: 3 },
    { week: 'Wk 4', Substitutions: 8 },
  ];

  const conflictsOverTime = [
    { day: 'Mon', Resolved: 4, Unresolved: 1 },
    { day: 'Tue', Resolved: 6, Unresolved: 0 },
    { day: 'Wed', Resolved: 8, Unresolved: 2 },
    { day: 'Thu', Resolved: 9, Unresolved: 1 },
    { day: 'Fri', Resolved: 12, Unresolved: 0 },
  ];

  const radarData = [
    { subject: 'Conflict-Free', A: 100, B: 90, fullMark: 100 },
    { subject: 'Faculty Bal', A: 94, B: 80, fullMark: 100 },
    { subject: 'Room Util', A: 95, B: 85, fullMark: 100 },
    { subject: 'Student Comf', A: 89, B: 75, fullMark: 100 },
    { subject: 'Curriculum Dist', A: 94, B: 80, fullMark: 100 },
  ];

  const PIE_COLORS = ['#7c3aed', '#1e3a5f', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Monitor faculty workloads, room capacity metrics, and AI recommendations.
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Faculty Workloads bar */}
        <Card header={{ title: 'Faculty Workload distribution (Hours)', subtitle: 'Optimized hour margins per week' }}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Hours" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {workloadData.map((entry, index) => {
                    const color = entry.Hours > 18 ? 'var(--danger)' : 'var(--primary)';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Room Util horizontal bar */}
        <Card header={{ title: 'Room Occupancy Utilization (%)', subtitle: 'Target threshold: 90% average limits' }}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomUtilData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="Util" fill="var(--success)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Subject distribution pie */}
        <Card header={{ title: 'Syllabus Subject Hour Share', subtitle: 'Distribution across odd semesters' }}>
          <div className="h-64 flex items-center justify-around">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Pie Legend */}
            <div className="w-1/2 space-y-1.5 text-xs text-text-secondary">
              {subjectDistData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="font-semibold text-text-primary">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 4. Radar timetable quality */}
        <Card header={{ title: 'AI Timetable Quality Radar', subtitle: 'Evaluates comfort, balance and preferences' }}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Target Optimal" dataKey="A" stroke="var(--accent-ai)" fill="var(--accent-ai)" fillOpacity={0.3} />
                <Radar name="Baseline Draft" dataKey="B" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.1} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Line chart substitution frequency */}
        <Card header={{ title: 'Weekly Substitution Request Frequency', subtitle: 'Saved lectures logs' }}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Substitutions" stroke="var(--accent-ai)" strokeWidth="2.5" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 6. Conflicts stacking area */}
        <Card header={{ title: 'Clashes Over Time Analysis', subtitle: 'Resolved vs active double-bookings' }}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conflictsOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Resolved" stackId="1" stroke="var(--success)" fill="var(--success)" fillOpacity={0.1} />
                <Area type="monotone" dataKey="Unresolved" stackId="1" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI Recommendation Insights */}
      <Card header={{ title: 'AI Automation Recommendations', subtitle: 'Curriculum optimization suggestions' }} className="border-l-4 border-l-accent-ai bg-purple-50/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary leading-relaxed">
          <div className="p-3 bg-bg-card border border-border rounded-xl flex gap-3">
            <Sparkles className="w-5 h-5 text-accent-ai flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-text-primary">Uneven Faculty Hours detected</p>
              <p className="mt-1">Instructor Dr. Sharma exceeds maximum weekly recommendation limits. Suggest shifting 3 hours of Data Structures class to Prof. Joshi.</p>
            </div>
          </div>
          <div className="p-3 bg-bg-card border border-border rounded-xl flex gap-3">
            <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-text-primary">Underutilized Room capacity</p>
              <p className="mt-1">Room B-205 is underutilized on Fridays (45% occupancy). Relocating Computer Networks lab sessions here would raise utilization score to 88%.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

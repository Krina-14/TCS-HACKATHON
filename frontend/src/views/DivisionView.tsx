import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export const DivisionView: React.FC = () => {
  const { divisionsList, addDivision, deleteDivision, setView } = useStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  // Form fields
  const [id, setId] = useState('');
  const [semester, setSemester] = useState(5);
  const [students, setStudents] = useState(60);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    addDivision({
      id,
      semester,
      studentsCount: students,
      subjects: ['IT501', 'IT502'],
      assignedFaculty: ['FAC-2023-014'],
    });
    setAddModalOpen(false);
    setId('');
  };

  const columns = [
    { key: 'id', header: 'Division / Class ID', sortable: true },
    { key: 'semester', header: 'Semester', sortable: true, render: (row: any) => <span>Semester {row.semester}</span> },
    { key: 'studentsCount', header: 'Students Enrolled', sortable: true, render: (row: any) => <span className="font-mono">{row.studentsCount} Students</span> },
    { key: 'subjects', header: 'Course Count', render: (row: any) => <span>{row.subjects.length} Subjects</span> },
    {
      key: 'timetable',
      header: 'Timetable Link',
      render: () => (
        <button
          onClick={() => setView('timetable-view')}
          className="text-xs font-bold text-accent-ai hover:underline"
        >
          View Timetable
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Class Divisions
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Configure semesters and class headcount metrics.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Division
        </Button>
      </div>

      {/* Grid divisions list */}
      <Table
        columns={columns}
        data={divisionsList}
        rowIdKey="id"
        actions={(row) => [
          { label: 'Edit Class parameters', onClick: () => {} },
          { label: 'Delete division', onClick: () => deleteDivision(row.id), danger: true },
        ]}
      />

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register Class Division"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input label="Division Name (e.g. IT-C)" value={id} onChange={setId} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Semester</label>
              <input
                type="number"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full h-12 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Student Count</label>
              <input
                type="number"
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full h-12 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary"
              />
            </div>
          </div>
          <div className="pt-6 border-t border-border flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Division</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

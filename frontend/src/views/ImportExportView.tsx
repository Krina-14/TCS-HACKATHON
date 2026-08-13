import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { Download, UploadCloud, FileSpreadsheet, Check, AlertCircle, AlertTriangle } from 'lucide-react';

export const ImportExportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  
  // Import states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<any | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setImportResults({
              valid: 46,
              invalid: 2,
              total: 48,
              errors: [
                { row: 14, col: 'Email', err: 'Invalid academic domain format (ananya.shah@outlook.com)' },
                { row: 27, col: 'Workload', err: 'Value exceeds allowed constraints limit (26)' },
              ]
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Data Import & Export Center
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Synchronize university data records or download compliance reports.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-sm font-semibold select-none">
        <button
          onClick={() => setActiveTab('import')}
          className={`pb-3 px-1 transition-colors relative focus:outline-none
            ${activeTab === 'import' ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          Import Faculty/Subjects CSV
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`pb-3 px-1 transition-colors relative focus:outline-none
            ${activeTab === 'export' ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          Export Timetables & PDF Reports
        </button>
      </div>

      {activeTab === 'import' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Upload zone */}
          <div className="lg:col-span-2 space-y-6">
            <Card header={{ title: 'CSV/Excel Upload Zone', subtitle: 'Import faculty registry or subject listings' }}>
              {!isProcessing && !importResults && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={simulateUpload}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-normal flex flex-col items-center justify-center min-h-[220px]
                    ${isDragging ? 'border-accent-ai bg-purple-50/10' : 'border-border hover:border-text-muted'}
                  `}
                >
                  <UploadCloud className="w-12 h-12 text-text-muted mb-4 animate-float" />
                  <p className="font-bold text-sm text-text-primary">Drag & drop files here or click to browse</p>
                  <p className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-wider">Supports CSV, XLS, XLSX formats</p>
                </div>
              )}

              {isProcessing && (
                <div className="py-12 space-y-4 max-w-sm mx-auto text-center">
                  <FileSpreadsheet className="w-10 h-10 mx-auto text-accent-ai animate-pulse" />
                  <p className="text-xs font-bold text-text-primary">Parsing database records...</p>
                  <ProgressBar value={uploadProgress} color="ai" showLabel useGradient />
                </div>
              )}

              {importResults && (
                <div className="space-y-6">
                  {/* Results counts alerts */}
                  <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                      <div className="text-xs text-text-secondary">
                        <p className="font-bold text-text-primary">48 records detected. Validation checks concluded.</p>
                        <p className="mt-0.5"><span className="text-success font-bold">{importResults.valid} records valid</span>, <span className="text-danger font-bold">{importResults.invalid} records require attention</span>.</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setImportResults(null)}>Reset</Button>
                  </div>

                  {/* Errors table */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Rows requiring manual resolution</span>
                    <table className="w-full text-left border border-border border-collapse text-xs">
                      <thead>
                        <tr className="bg-bg-elevated/40 border-b border-border text-xs font-bold text-text-secondary uppercase">
                          <th className="p-3">Excel Row</th>
                          <th className="p-3">Clash Column</th>
                          <th className="p-3">Error description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-text-secondary">
                        {importResults.errors.map((err: any, idx: number) => (
                          <tr key={idx} className="hover:bg-bg-elevated/10">
                            <td className="p-3 font-bold font-mono">Row {err.row}</td>
                            <td className="p-3 font-semibold text-text-primary"><Badge variant="danger" size="sm">{err.col}</Badge></td>
                            <td className="p-3 text-text-secondary">{err.err}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border-light pt-4">
                    <Button variant="outline" size="sm">Proceed with Valid ({importResults.valid})</Button>
                    <Button variant="primary" size="sm">Fix Manually</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right column: Formats information */}
          <div className="space-y-6">
            <Card header={{ title: 'Required Format Guide', subtitle: 'CSV field definitions mapping' }}>
              <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
                <p>Import files must contain the following exact header column strings:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-[10px] text-text-muted font-bold font-mono">
                  <li>ID (FAC-XXXX or SUBJ-XXX)</li>
                  <li>Name (Instructor/Subject title)</li>
                  <li>Email (Academic address)</li>
                  <li>Department (IT, CSE, etc.)</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* EXPORT SETTINGS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card header={{ title: 'Report Downloader Parameters', subtitle: 'Select scope and formats' }}>
              <div className="space-y-4 text-xs text-text-secondary">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Export Format</label>
                  <select className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary">
                    <option>PDF (Print ready, colored grid style)</option>
                    <option>Microsoft Excel Workbook (.xlsx)</option>
                    <option>Standard CSV Comma-Delimited (.csv)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Export Scope</label>
                  <select className="w-full h-10 border border-border bg-bg-card rounded-md px-3 text-sm text-text-primary">
                    <option>Complete Semester 5 Timetable (All Divisions)</option>
                    <option>Faculty Workload Utilization Report</option>
                    <option>Emergency substitution chains history</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <Button variant="ai" leftIcon={<Download className="w-4 h-4" />}>
                    Generate Report Downloader
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

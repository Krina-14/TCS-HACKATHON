import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  rowIdKey: keyof T;
  actions?: (row: T) => { label: string; onClick: () => void; danger?: boolean }[];
  onBulkAction?: (selectedIds: string[]) => void;
  bulkActionLabel?: string;
}

export function Table<T>({
  columns,
  data,
  isLoading,
  emptyTitle = 'No records found',
  emptyDescription = 'There is currently no data in this table.',
  pageSize = 8,
  rowIdKey,
  actions,
  onBulkAction,
  bulkActionLabel = 'Bulk Action',
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeActionsRowId, setActiveActionsRowId] = useState<string | null>(null);

  // Sorting
  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data];
    sorted.sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [data, sortKey, sortOrder]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map((row: any) => String(row[rowIdKey])));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="w-full bg-bg-card rounded-lg border border-border overflow-hidden">
      {/* Bulk Action Header */}
      {selectedIds.length > 0 && onBulkAction && (
        <div className="bg-purple-50 dark:bg-purple-950/20 px-6 py-3 flex items-center justify-between border-b border-border">
          <span className="text-xs font-semibold text-accent-ai">
            {selectedIds.length} items selected
          </span>
          <button
            onClick={() => onBulkAction(selectedIds)}
            className="text-xs font-bold text-white bg-accent-ai hover:bg-opacity-90 px-3 py-1.5 rounded"
          >
            {bulkActionLabel}
          </button>
        </div>
      )}

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-elevated/50 border-b border-border text-xs font-bold text-text-secondary uppercase">
              {onBulkAction && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-border text-accent-ai focus:ring-accent-ai"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-4 select-none ${col.sortable ? 'cursor-pointer hover:bg-bg-elevated transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 w-16 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  {onBulkAction && <td className="px-6 py-4"><Skeleton className="w-4 h-4" /></td>}
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-6 py-4">
                      <Skeleton className="w-24 h-4" />
                    </td>
                  ))}
                  {actions && <td className="px-6 py-4"><Skeleton className="w-4 h-4" /></td>}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onBulkAction ? 1 : 0) + (actions ? 1 : 0)} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row: any, rIdx) => {
                const rowId = String(row[rowIdKey]);
                return (
                  <tr
                    key={rowId}
                    className="hover:bg-bg-elevated/40 transition-colors group relative border-l-2 border-l-transparent hover:border-l-primary"
                  >
                    {onBulkAction && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(rowId)}
                          onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                          className="w-4 h-4 rounded border-border text-accent-ai focus:ring-accent-ai"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key as string} className="px-6 py-4 text-sm text-text-secondary">
                        {col.render ? col.render(row, rIdx) : String(row[col.key] || '')}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionsRowId(activeActionsRowId === rowId ? null : rowId);
                          }}
                          className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-bg-elevated transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeActionsRowId === rowId && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveActionsRowId(null)}
                            />
                            <div className="absolute right-6 top-12 z-20 bg-bg-card border border-border shadow-lg rounded-md py-1 min-w-[120px] text-left">
                              {actions(row).map((act, actIdx) => (
                                <button
                                  key={actIdx}
                                  onClick={() => {
                                    act.onClick();
                                    setActiveActionsRowId(null);
                                  }}
                                  className={`w-full px-4 py-2 text-xs font-semibold hover:bg-bg-elevated block
                                    ${act.danger ? 'text-danger hover:bg-red-50' : 'text-text-secondary'}
                                  `}
                                >
                                  {act.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && data.length > pageSize && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-elevated/10">
          <span className="text-xs text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs font-semibold px-3 py-1.5 border border-border rounded hover:bg-bg-elevated disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`text-xs font-semibold w-8 h-8 rounded border transition-colors
                  ${currentPage === idx + 1 ? 'bg-primary text-white border-primary' : 'border-border hover:bg-bg-elevated'}
                `}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs font-semibold px-3 py-1.5 border border-border rounded hover:bg-bg-elevated disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

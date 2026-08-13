import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface SelectProps {
  className?: string;
  options: SelectOption[];
  value: string | string[];
  onChange: (value: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  className = '',
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  isMulti = false,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const isSelected = (val: string) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const handleSelect = (val: string) => {
    if (isMulti) {
      const arr = Array.isArray(value) ? [...value] : [];
      if (arr.includes(val)) {
        onChange(arr.filter((item) => item !== val));
      } else {
        onChange([...arr, val]);
      }
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter((item) => item !== val));
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(isMulti ? [] : '');
  };

  // Filter options based on search query
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group options if applicable
  const groups: { [key: string]: SelectOption[] } = {};
  filteredOptions.forEach((opt) => {
    const groupName = opt.group || 'General';
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(opt);
  });

  const selectedLabels = isMulti
    ? options.filter((opt) => Array.isArray(value) && value.includes(opt.value))
    : options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</label>}

      {/* Select Box Input Area */}
      <div
        onClick={handleToggle}
        className={`w-full min-h-[44px] bg-bg-card border border-border rounded-md px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer transition-all duration-normal
          ${isOpen ? 'border-accent-ai shadow-[0_0_0_2px_rgba(124,58,237,0.15)]' : ''}
        `}
      >
        <div className="flex flex-wrap gap-1 items-center flex-grow">
          {isMulti && Array.isArray(value) && value.length > 0 ? (
            (selectedLabels as SelectOption[]).map((opt) => (
              <span
                key={opt.value}
                className="bg-purple-100 text-accent-ai text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 dark:bg-purple-950/60 dark:text-accent-ai-glow"
              >
                {opt.label}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-danger"
                  onClick={(e) => handleRemoveTag(opt.value, e)}
                />
              </span>
            ))
          ) : !isMulti && value ? (
            <span className="text-sm text-text-primary">{(selectedLabels as SelectOption)?.label}</span>
          ) : (
            <span className="text-sm text-text-muted">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-text-muted">
          {(isMulti && Array.isArray(value) && value.length > 0) || (!isMulti && value) ? (
            <X className="w-4 h-4 hover:text-text-primary cursor-pointer" onClick={handleClearAll} />
          ) : null}
          <ChevronDown className={`w-4 h-4 transition-transform duration-normal ${isOpen ? 'rotate-185' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 w-full bg-bg-card border border-border shadow-xl rounded-lg overflow-hidden max-h-60 flex flex-col"
          >
            {/* Search Input inside Dropdown */}
            <div className="p-2 border-b border-border flex items-center gap-2 bg-bg-primary/50">
              <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-text-primary border-none outline-none focus:ring-0 p-0"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-grow py-1">
              {Object.keys(groups).length === 0 ? (
                <div className="text-sm text-text-muted p-4 text-center">No results found</div>
              ) : (
                Object.keys(groups).map((groupName) => (
                  <div key={groupName}>
                    {groupName !== 'General' && (
                      <div className="text-[10px] uppercase font-bold text-text-muted px-3 py-1 bg-bg-primary/30">
                        {groupName}
                      </div>
                    )}
                    {groups[groupName].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(opt.value);
                        }}
                        className={`px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated cursor-pointer flex items-center justify-between
                          ${isSelected(opt.value) ? 'bg-purple-50 text-accent-ai font-medium dark:bg-purple-950/20' : ''}
                        `}
                      >
                        <span>{opt.label}</span>
                        {isSelected(opt.value) && <Check className="w-4 h-4 text-accent-ai" />}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

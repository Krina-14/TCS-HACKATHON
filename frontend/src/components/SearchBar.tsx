import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

interface SearchBarProps {
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { facultyList, subjectsList, divisionsList, roomsList, setVoiceModalOpen, setView } = useStore();

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter lists based on search
  const filteredFaculty = query
    ? facultyList.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];
  const filteredSubjects = query
    ? subjectsList.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];
  const filteredDivisions = query
    ? divisionsList.filter(d => d.id.toLowerCase().includes(query.toLowerCase())).slice(0, 2)
    : [];
  const filteredRooms = query
    ? roomsList.filter(r => r.id.toLowerCase().includes(query.toLowerCase())).slice(0, 2)
    : [];

  const hasResults = query && (
    filteredFaculty.length > 0 || 
    filteredSubjects.length > 0 || 
    filteredDivisions.length > 0 || 
    filteredRooms.length > 0
  );

  const handleSelectResult = (view: string) => {
    setView(view);
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input Container */}
      <motion.div
        animate={{ width: isFocused ? 320 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`flex items-center h-10 bg-bg-elevated border border-border-light rounded-full px-3 transition-colors duration-normal
          ${isFocused ? 'border-accent-ai bg-bg-card shadow-sm' : 'hover:border-border'}
        `}
      >
        <Search className="w-4 h-4 text-text-muted mr-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search faculty, rooms... (⌘K)"
          className="w-full bg-transparent text-sm border-none outline-none focus:ring-0 p-0 text-text-primary placeholder-text-muted"
        />

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={() => setVoiceModalOpen(true)}
          className="text-text-muted hover:text-accent-ai p-1 rounded-full hover:bg-bg-elevated transition-colors ml-1"
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showDropdown && query && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-full z-50 w-[350px] bg-bg-card border border-border shadow-xl rounded-xl overflow-hidden py-2"
          >
            {hasResults ? (
              <div className="max-h-[320px] overflow-y-auto divide-y divide-border">
                {/* Faculty Results */}
                {filteredFaculty.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase px-2 py-1 block">Faculty</span>
                    {filteredFaculty.map(f => (
                      <div
                        key={f.id}
                        onClick={() => handleSelectResult('faculty-list')}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-bg-elevated cursor-pointer"
                      >
                        <img src={f.avatar} alt={f.name} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{f.name}</p>
                          <p className="text-[10px] text-text-secondary">{f.designation} • {f.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subjects Results */}
                {filteredSubjects.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase px-2 py-1 block">Subjects</span>
                    {filteredSubjects.map(s => (
                      <div
                        key={s.code}
                        onClick={() => handleSelectResult('subjects')}
                        className="p-2 rounded-lg hover:bg-bg-elevated cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-text-primary">{s.name}</p>
                        <p className="text-[10px] text-text-secondary">{s.code} • {s.credits} Credits</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Divisions Results */}
                {filteredDivisions.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase px-2 py-1 block">Divisions</span>
                    {filteredDivisions.map(d => (
                      <div
                        key={d.id}
                        onClick={() => handleSelectResult('divisions')}
                        className="p-2 rounded-lg hover:bg-bg-elevated cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{d.id}</p>
                          <p className="text-[10px] text-text-secondary">Semester {d.semester} • {d.studentsCount} Students</p>
                        </div>
                        <span className="text-[10px] bg-bg-elevated px-2 py-0.5 rounded text-text-muted">Divisions</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rooms Results */}
                {filteredRooms.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase px-2 py-1 block">Rooms</span>
                    {filteredRooms.map(r => (
                      <div
                        key={r.id}
                        onClick={() => handleSelectResult('rooms')}
                        className="p-2 rounded-lg hover:bg-bg-elevated cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <p className="text-xs font-semibold text-text-primary">Room {r.id}</p>
                          <p className="text-[10px] text-text-secondary">{r.building} • Cap {r.capacity}</p>
                        </div>
                        <span className="text-[10px] bg-bg-elevated px-2 py-0.5 rounded text-text-muted">{r.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs font-semibold text-text-primary">No results match your query</p>
                <p className="text-[10px] text-text-muted mt-1">Try searching for "Mehta", "B-204" or "AI"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

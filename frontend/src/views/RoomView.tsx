import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, LayoutGrid, BrainCircuit, Maximize2, Compass, Layers, Check, X, Shield, Cpu, Sparkles } from 'lucide-react';
import { useStore, Room } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Drawer } from '../components/Drawer';

export const RoomView: React.FC = () => {
  const { roomsList } = useStore();
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // 3D Map controls
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState(2);
  const [dragHoverRoomId, setDragHoverRoomId] = useState<string | null>(null);
  const [isClassMoved, setIsClassMoved] = useState(false);

  const handleBuildingClick = (bName: string) => {
    setSelectedBuilding(selectedBuilding === bName ? null : bName);
  };

  const handleDragOver = (e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    setDragHoverRoomId(roomId);
  };

  const handleDrop = (roomId: string) => {
    setDragHoverRoomId(null);
    if (roomId === 'B-205') {
      setIsClassMoved(true);
    }
  };

  // Occupancy classes
  const occupancyColors = {
    free: 'bg-emerald-500',
    low: 'bg-emerald-400',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
    maintenance: 'bg-slate-400',
  };

  return (
    <div className="space-y-6 font-sans select-none relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">
            Rooms & Campus Map
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Optimize classroom capacity and view occupancy heatmaps.
          </p>
        </div>

        {/* Layout Selector */}
        <div className="flex bg-bg-elevated p-1 rounded-lg border border-border-light text-xs font-semibold">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'list' ? 'bg-bg-card text-text-primary shadow-sm font-bold' : 'text-text-secondary'
            }`}
          >
            Room Utilization List
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'map' ? 'bg-bg-card text-text-primary shadow-sm font-bold animate-pulse-glow' : 'text-text-secondary'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> 3D Campus Map
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        /* Regular grid room cards list */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsList.map((room) => (
            <Card
              key={room.id}
              variant="interactive"
              padding="compact"
              onClick={() => setSelectedRoom(room)}
              className="flex flex-col justify-between min-h-[170px]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="neutral" size="sm">{room.building}</Badge>
                  <h4 className="font-extrabold text-sm text-text-primary dark:text-white mt-2">Room {room.id}</h4>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${occupancyColors[room.occupancy]}`} title={room.occupancy} />
              </div>

              <div className="mt-4 text-xs text-text-secondary space-y-1">
                <p>Capacity: {room.capacity} seats</p>
                <p>Type: {room.type}</p>
                {room.currentClass && (
                  <p className="font-semibold text-accent-ai mt-2">
                    Occupied: {room.currentClass} (Ends in {room.timeRemaining}m)
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Interactive 3D campus map layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-bg-card border border-border rounded-xl p-5 shadow-md flex flex-col items-center justify-center relative min-h-[480px]">
            {/* Guide Info */}
            <div className="absolute top-4 left-4 text-left space-y-1">
              <h3 className="font-bold text-sm text-text-primary dark:text-white">Campus Building blocks</h3>
              <p className="text-[10px] text-text-muted">Click building A or B to expand floor plan layout</p>
            </div>

            {/* Floor selector HUD (only visible if building selected) */}
            {selectedBuilding && (
              <div className="absolute right-4 top-4 z-20 bg-bg-card border border-border p-1 rounded shadow-sm flex flex-col text-[10px] font-bold">
                {[3, 2, 1].map((fl) => (
                  <button
                    key={fl}
                    onClick={() => setActiveFloor(fl)}
                    className={`py-1.5 px-3 rounded transition-colors ${
                      activeFloor === fl ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-elevated'
                    }`}
                  >
                    Floor {fl}
                  </button>
                ))}
              </div>
            )}

            {/* 3D Buildings Render Container */}
            <div className="relative w-full max-w-[500px] h-[320px] flex items-center justify-center select-none">
              {!selectedBuilding ? (
                /* Main Isometric Buildings blocks */
                <div className="relative w-full h-full flex items-center justify-center gap-12">
                  {/* Building A */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => handleBuildingClick('Building A')}
                    className="w-36 h-48 bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 shadow-xl rounded-xl cursor-pointer flex flex-col items-center justify-center text-center p-4 relative"
                    style={{ transform: 'rotateX(45deg) rotateZ(-30deg)' }}
                  >
                    <DoorOpen className="w-8 h-8 text-primary mb-2" />
                    <p className="font-bold text-xs text-text-primary">Building A</p>
                    <p className="text-[9px] text-text-muted mt-1">High Occupancy</p>
                    <Badge variant="danger" size="sm" className="mt-2.5">85% Full</Badge>
                  </motion.div>

                  {/* Building B */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => handleBuildingClick('Building B')}
                    className="w-36 h-48 bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 shadow-xl rounded-xl cursor-pointer flex flex-col items-center justify-center text-center p-4 relative"
                    style={{ transform: 'rotateX(45deg) rotateZ(-30deg)' }}
                  >
                    <DoorOpen className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="font-bold text-xs text-text-primary">Building B</p>
                    <p className="text-[9px] text-text-muted mt-1">Low Occupancy</p>
                    <Badge variant="success" size="sm" className="mt-2.5">34% Full</Badge>
                  </motion.div>
                </div>
              ) : (
                /* Floor layout view (if building selected) */
                <div className="w-full text-center space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2 px-4 mb-4">
                    <span className="text-xs font-bold text-text-secondary uppercase">{selectedBuilding} — Floor {activeFloor} Plan</span>
                    <button 
                      onClick={() => setSelectedBuilding(null)}
                      className="text-xs font-semibold text-accent-ai hover:underline"
                    >
                      ← Back to Campus View
                    </button>
                  </div>

                  {/* Grid of rooms on this floor */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    {roomsList.filter(r => r.building === selectedBuilding).map((room) => {
                      const isHovered = dragHoverRoomId === room.id;
                      
                      return (
                        <div
                          key={room.id}
                          onDragOver={(e) => handleDragOver(e, room.id)}
                          onDrop={() => handleDrop(room.id)}
                          onClick={() => setSelectedRoom(room)}
                          className={`p-4 border rounded-xl shadow-sm text-center cursor-pointer transition-all duration-normal relative
                            ${isHovered ? 'ring-2 ring-accent-ai border-accent-ai bg-purple-50/10' : 'border-border'}
                            ${room.occupancy === 'free' ? 'bg-emerald-50/10 hover:bg-emerald-50/20' : 
                              room.occupancy === 'maintenance' ? 'bg-slate-50/40 opacity-50' : 'bg-red-50/5 hover:bg-red-50/10'}
                          `}
                        >
                          <p className="font-bold text-xs text-text-primary">Room {room.id}</p>
                          <p className="text-[9px] text-text-muted mt-1">{room.capacity} seats • {room.type}</p>
                          
                          {/* Occupancy Indicator badge */}
                          <div className="mt-2 flex justify-center">
                            <Badge 
                              variant={room.occupancy === 'free' ? 'success' : room.occupancy === 'maintenance' ? 'neutral' : 'danger'} 
                              size="sm"
                            >
                              {room.occupancy === 'free' ? 'Free' : room.occupancy === 'maintenance' ? 'Maint' : 'Occupied'}
                            </Badge>
                          </div>

                          {/* Moved class demo highlight */}
                          {isClassMoved && room.id === 'B-205' && (
                            <div className="absolute inset-0 bg-purple-100/90 dark:bg-purple-950/90 flex flex-col justify-center items-center text-center p-2 rounded-xl border border-accent-ai animate-float">
                              <Sparkles className="w-4 h-4 text-accent-ai animate-pulse" />
                              <span className="text-[9px] font-bold text-accent-ai uppercase mt-1">IT501 Relocated</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Draggable panel mockup */}
            {selectedBuilding && !isClassMoved && (
              <div className="mt-6 border-t border-border pt-4 w-full text-center flex items-center justify-center gap-4">
                <span className="text-[10px] font-bold text-text-muted uppercase">Drag and drop class card to relocate:</span>
                <div
                  draggable
                  className="bg-purple-100 border border-purple-200 text-accent-ai text-xs font-bold px-3 py-1.5 rounded-lg cursor-grab hover:bg-purple-200 select-none shadow-sm dark:bg-purple-950 dark:border-purple-800"
                >
                  🏫 IT501 AI Lecture
                </div>
              </div>
            )}
          </div>

          {/* Right Legend panel */}
          <div className="space-y-6">
            <Card header={{ title: 'Occupancy Legend', subtitle: 'Live capacity heatmaps indicators' }}>
              <div className="space-y-3 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Free / Vacant slot</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span>Medium occupancy (50%-80% full)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-red-500" />
                  <span>High occupancy (&gt;80% capacity limit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-400" />
                  <span>Closed / Maintenance scheduled</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Room Detail Drawer */}
      <Drawer
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        title={selectedRoom ? `Room ${selectedRoom.id}` : 'Room Details'}
      >
        {selectedRoom && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border pb-4">
              <Badge variant="neutral" size="sm">{selectedRoom.building}</Badge>
              <h3 className="text-xl font-bold text-text-primary dark:text-white">Room {selectedRoom.id}</h3>
            </div>

            <div className="space-y-4 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Room Type</span>
                <span className="font-bold text-text-primary">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Capacity</span>
                <span className="font-bold text-text-primary">{selectedRoom.capacity} seats</span>
              </div>
              <div className="flex justify-between">
                <span>Occupancy Status</span>
                <span className="font-bold text-text-primary capitalize">{selectedRoom.occupancy}</span>
              </div>
            </div>

            {/* Equipment lists */}
            <div className="space-y-2 border-t border-border pt-4">
              <span className="text-[10px] font-bold text-text-muted uppercase">Equipment & Facilities</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedRoom.equipment.map((eq) => (
                  <span key={eq} className="bg-bg-elevated text-text-secondary px-2.5 py-1 rounded text-xs">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => setSelectedRoom(null)}>Close details</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

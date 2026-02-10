import React from 'react';
import { X, LogOut, User, Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  const SettingItem = ({ icon: Icon, label, onClick, isDestructive = false }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className={isDestructive ? "text-red-500" : "text-gray-700"} />
        <span className={`font-medium ${isDestructive ? "text-red-500" : "text-gray-900"}`}>{label}</span>
      </div>
      {!isDestructive && <ChevronRight size={16} className="text-gray-400" />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Settings</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col">
          <SettingItem icon={User} label="Account" onClick={() => {}} />
          <SettingItem icon={Bell} label="Notifications" onClick={() => {}} />
          <SettingItem icon={Shield} label="Privacy" onClick={() => {}} />
          <SettingItem icon={HelpCircle} label="Help & Support" onClick={() => {}} />
          <SettingItem icon={LogOut} label="Log Out" onClick={onLogout} isDestructive />
        </div>
        
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
          Rupl Social v1.0.2
        </div>
      </div>
    </div>
  );
};
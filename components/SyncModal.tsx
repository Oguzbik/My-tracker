import React, { useRef } from 'react';
import CyberButton from './CyberButton';
import { Upload, Download, X } from 'lucide-react';
import { HistoryLog } from '../types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HistoryLog;
  onImport: (data: HistoryLog) => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_habit_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsedData = JSON.parse(result);
        // Simple validation check (optional)
        if (typeof parsedData !== 'object') {
            throw new Error("Invalid format");
        }
        onImport(parsedData);
        alert("Данные успешно загружены!");
        onClose();
      } catch (err) {
        alert("Ошибка при чтении файла. Убедитесь, что это корректный JSON.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = ''; 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-cyan-500 w-full max-w-md p-6 cyber-border shadow-[0_0_20px_rgba(0,243,255,0.2)]">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
            <h2 className="text-xl font-bold text-cyan-400 cyber-font">Синхронизация</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X size={24} />
            </button>
        </div>

        <p className="text-gray-400 text-sm mb-6">
            Выберите действие для ручного управления базой данных вашего прогресса.
            Файл сохраняется в формате JSON.
        </p>

        <div className="space-y-4">
            <div className="p-4 border border-gray-800 bg-black/40">
                <h3 className="text-white font-bold mb-2">Выгрузка данных</h3>
                <p className="text-xs text-gray-500 mb-3">Сохранить текущий прогресс в файл на устройстве.</p>
                <CyberButton onClick={handleExport} className="w-full flex justify-center">
                    <Download size={18} />
                    Выгрузить (Export)
                </CyberButton>
            </div>

            <div className="p-4 border border-gray-800 bg-black/40">
                <h3 className="text-white font-bold mb-2">Загрузка данных</h3>
                <p className="text-xs text-gray-500 mb-3">Восстановить прогресс из файла JSON.</p>
                <CyberButton variant="secondary" onClick={handleImportClick} className="w-full flex justify-center">
                    <Upload size={18} />
                    Загрузить (Import)
                </CyberButton>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json"
                    className="hidden" 
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
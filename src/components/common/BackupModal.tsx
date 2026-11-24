import React, { useState, useRef } from 'react'
import {
  X,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react'
import { backupService, ValidationResult } from '@/services/backupService'
import { useDailyFlow } from '@/contexts/DailyFlowContext'
import { Button } from '@/components/ui/button'

interface BackupModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { reloadAllData } = useDailyFlow()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Handle Export
  const handleExport = () => {
    setIsExporting(true)
    try {
      backupService.exportToFile()
    } finally {
      setTimeout(() => setIsExporting(false), 1000)
    }
  }

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportSuccess(false)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const result = backupService.validateBackup(content)
      setValidation(result)
    }
    reader.readAsText(file)

    // Reset input so user can pick the same file again if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle Confirm Import
  const handleConfirmImport = () => {
    if (!validation?.backup) return

    backupService.importBackup(validation.backup)
    reloadAllData()
    setValidation(null)
    setImportSuccess(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-df-border bg-[#FFFDF9] p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-df-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-df-sage/80 flex items-center justify-center text-[#1E5224] shadow-2xs">
              <Database className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-df-text leading-tight">
                Sao lưu & Khôi phục
              </h3>
              <p className="text-[11px] text-df-muted font-medium">
                Quản lý dữ liệu an toàn trên máy tính của bạn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-df-muted hover:text-df-text hover:bg-df-light-pink/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Notice */}
        {importSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Khôi phục dữ liệu thành công! Toàn bộ lịch và công việc đã được đồng bộ.</span>
          </div>
        )}

        {/* Export Section */}
        <div className="p-4 rounded-xl border border-df-border bg-white shadow-2xs space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-df-text flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-df-pink" />
                <span>Xuất dữ liệu dự phòng (Export)</span>
              </h4>
              <p className="text-[11px] text-df-muted mt-0.5 leading-relaxed">
                Tải toàn bộ Routine, Task, lịch sử và Streak về máy thành file <code>.json</code>.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="w-full gap-1.5 font-bold text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Đang xuất file...' : 'Tải file backup về máy (.json)'}</span>
          </Button>
        </div>

        {/* Import Section */}
        <div className="p-4 rounded-xl border border-df-border bg-white shadow-2xs space-y-3">
          <div>
            <h4 className="text-xs font-bold text-df-text flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-df-sage" />
              <span>Khôi phục từ file (Import)</span>
            </h4>
            <p className="text-[11px] text-df-muted mt-0.5 leading-relaxed">
              Nhập lại dữ liệu từ file sao lưu <code>.json</code> đã lưu trước đó.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {!validation ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-1.5 font-bold text-xs"
            >
              <Upload className="w-3.5 h-3.5" /> Chọn file sao lưu (.json)
            </Button>
          ) : validation.isValid && validation.summary ? (
            /* Confirmation before Overwrite */
            <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-amber-200/80 space-y-3 text-xs">
              <div className="flex items-start gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>Xác nhận ghi đè dữ liệu?</span>
              </div>

              <div className="space-y-1 text-[11px] text-df-muted pl-6">
                <div>• Số Routine: <strong>{validation.summary.routinesCount}</strong> mục</div>
                <div>• Số Task: <strong>{validation.summary.tasksCount}</strong> công việc</div>
                <div>• Lịch sử hoàn thành: <strong>{validation.summary.completionsCount}</strong> lượt</div>
                <div>• Kỷ lục Streak: <strong>{validation.summary.bestStreak}</strong> ngày</div>
              </div>

              <p className="text-[10px] text-rose-600 font-semibold pl-6">
                * Hành động này sẽ thay thế toàn bộ dữ liệu hiện tại bằng dữ liệu trong file backup.
              </p>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-df-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setValidation(null)}
                  className="text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleConfirmImport}
                  className="bg-amber-400 hover:bg-amber-500 text-df-text font-bold text-xs shadow-2xs"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Xác nhận ghi đè
                </Button>
              </div>
            </div>
          ) : (
            /* Error alert */
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <span>{validation.error}</span>
                <div>
                  <button
                    type="button"
                    onClick={() => setValidation(null)}
                    className="text-[10px] underline cursor-pointer text-rose-800"
                  >
                    Thử lại với file khác
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-df-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}

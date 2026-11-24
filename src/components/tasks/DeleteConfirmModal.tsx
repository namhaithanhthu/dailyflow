import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteConfirmModalProps {
  isOpen: boolean
  taskTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}) => {
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-df-border bg-[#FFFDF9] p-5 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-df-text">
              Xóa công việc này?
            </h4>
            <p className="text-xs text-df-muted leading-relaxed">
              Bạn có chắc muốn xóa <span className="font-bold text-df-text">"{taskTitle}"</span>? Thao tác này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-df-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onConfirm}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold"
          >
            Xóa vĩnh viễn
          </Button>
        </div>
      </div>
    </div>
  )
}

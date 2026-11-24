import { TaskCategory, TaskPriority } from '@/types/task'

export interface TaskCategoryConfig {
  id: TaskCategory
  name: string
  labelVi: string
  bgClass: string
  borderClass: string
  textClass: string
  dotClass: string
}

export const TASK_CATEGORIES: Record<TaskCategory, TaskCategoryConfig> = {
  study: {
    id: 'study',
    name: 'Study',
    labelVi: 'Học tập',
    bgClass: 'bg-df-light-pink',
    borderClass: 'border-df-pink',
    textClass: 'text-[#842A46]',
    dotClass: 'bg-df-pink',
  },
  project: {
    id: 'project',
    name: 'Project',
    labelVi: 'Dự án',
    bgClass: 'bg-[#EBF5EC]',
    borderClass: 'border-df-sage',
    textClass: 'text-[#205727]',
    dotClass: 'bg-emerald-500',
  },
  personal: {
    id: 'personal',
    name: 'Personal',
    labelVi: 'Cá nhân',
    bgClass: 'bg-[#E9F6F4]',
    borderClass: 'border-[#C2E8E2]',
    textClass: 'text-[#175C51]',
    dotClass: 'bg-teal-500',
  },
  other: {
    id: 'other',
    name: 'Other',
    labelVi: 'Khác',
    bgClass: 'bg-[#F5F2EB]',
    borderClass: 'border-[#E4DDCF]',
    textClass: 'text-[#564E43]',
    dotClass: 'bg-stone-400',
  },
}

export interface TaskPriorityConfig {
  id: TaskPriority
  name: string
  labelVi: string
  bgClass: string
  borderClass: string
  textClass: string
  weight: number // for sorting: high (3) > medium (2) > low (1)
}

export const TASK_PRIORITIES: Record<TaskPriority, TaskPriorityConfig> = {
  low: {
    id: 'low',
    name: 'Low',
    labelVi: 'Thấp',
    bgClass: 'bg-[#F2F6FA]',
    borderClass: 'border-[#D9E4EF]',
    textClass: 'text-[#3E5C76]',
    weight: 1,
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    labelVi: 'Trung bình',
    bgClass: 'bg-[#FDF7DF]',
    borderClass: 'border-df-yellow',
    textClass: 'text-[#7B5B0C]',
    weight: 2,
  },
  high: {
    id: 'high',
    name: 'High',
    labelVi: 'Ưu tiên cao',
    bgClass: 'bg-[#FEEDE8]',
    borderClass: 'border-[#F8CEC4]',
    textClass: 'text-[#8C2C1D]',
    weight: 3,
  },
}

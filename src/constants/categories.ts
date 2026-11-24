export type RoutineCategory =
  | 'university'
  | 'study'
  | 'english'
  | 'data_analytics'
  | 'exercise'
  | 'personal'
  | 'other'

export interface CategoryConfig {
  id: RoutineCategory
  name: string
  labelVi: string
  bgClass: string
  borderClass: string
  textClass: string
  dotClass: string
  accentColor: string
}

export const ROUTINE_CATEGORIES: Record<RoutineCategory, CategoryConfig> = {
  university: {
    id: 'university',
    name: 'University',
    labelVi: 'Đại học',
    bgClass: 'bg-[#F3EEFF] hover:bg-[#EAE2FD]',
    borderClass: 'border-[#DDD2F9]',
    textClass: 'text-[#4A2885]',
    dotClass: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
  },
  study: {
    id: 'study',
    name: 'Study',
    labelVi: 'Tự học',
    bgClass: 'bg-df-light-pink hover:bg-[#F2D7E0]',
    borderClass: 'border-df-pink',
    textClass: 'text-[#842A46]',
    dotClass: 'bg-df-pink',
    accentColor: '#F4C9D4',
  },
  english: {
    id: 'english',
    name: 'English',
    labelVi: 'Tiếng Anh',
    bgClass: 'bg-[#FDF6DC] hover:bg-[#FBF0C7]',
    borderClass: 'border-df-yellow',
    textClass: 'text-[#7A5B0B]',
    dotClass: 'bg-amber-400',
    accentColor: '#F5E7B0',
  },
  data_analytics: {
    id: 'data_analytics',
    name: 'Data Analytics',
    labelVi: 'Data Analyst',
    bgClass: 'bg-[#EBF5EC] hover:bg-[#DFEFDE]',
    borderClass: 'border-df-sage',
    textClass: 'text-[#205727]',
    dotClass: 'bg-emerald-500',
    accentColor: '#DCEBDD',
  },
  exercise: {
    id: 'exercise',
    name: 'Exercise',
    labelVi: 'Thể dục',
    bgClass: 'bg-[#FEEDE8] hover:bg-[#FCE1DA]',
    borderClass: 'border-[#F8CEC4]',
    textClass: 'text-[#8B2C1C]',
    dotClass: 'bg-orange-400',
    accentColor: '#F8CEC4',
  },
  personal: {
    id: 'personal',
    name: 'Personal',
    labelVi: 'Cá nhân',
    bgClass: 'bg-[#E9F6F4] hover:bg-[#D9F0ED]',
    borderClass: 'border-[#C2E8E2]',
    textClass: 'text-[#175C51]',
    dotClass: 'bg-teal-400',
    accentColor: '#C2E8E2',
  },
  other: {
    id: 'other',
    name: 'Other',
    labelVi: 'Khác',
    bgClass: 'bg-[#F5F2EB] hover:bg-[#EBE7DD]',
    borderClass: 'border-[#E4DDCF]',
    textClass: 'text-[#564E43]',
    dotClass: 'bg-stone-400',
    accentColor: '#E4DDCF',
  },
}

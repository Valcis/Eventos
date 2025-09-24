import { ReactNode } from 'react'
interface FormFieldProps{ label:string; children:ReactNode; hint?:string }
export default function FormField({label,children,hint}:FormFieldProps){
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint&&<span className="text-xs text-gray-500">{hint}</span>}
    </label>
  )
}
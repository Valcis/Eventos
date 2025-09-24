import { ReactNode } from 'react'
interface ModalProps{ title:string; isOpen:boolean; onClose:()=>void; children:ReactNode }
export default function Modal({title,isOpen,onClose,children}:ModalProps){
  if(!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <header className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3><button className="btn" onClick={onClose}>Cerrar</button>
        </header>
        <div className="p-4 space-y-4">{children}</div>
      </div>
    </div>
  )
}
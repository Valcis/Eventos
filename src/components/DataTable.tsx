import { useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, SortingState, useReactTable } from '@tanstack/react-table'
interface DataTableProps<T>{ columns: ColumnDef<T, any>[]; data: T[]; onEdit?: (row:T)=>void; onDelete?: (row:T)=>void; pageSize?: number }
export default function DataTable<T extends object>({columns,data,onEdit,onDelete,pageSize=10}: DataTableProps<T>){
  const [sorting,setSorting]=useState<SortingState>([])
  const table=useReactTable({ data, columns, state:{sorting}, onSortingChange:setSorting, getCoreRowModel:getCoreRowModel(), getSortedRowModel:getSortedRowModel(), getPaginationRowModel:getPaginationRowModel(), initialState:{ pagination:{ pageSize } } })
  return (<div className="card space-y-3">
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm"><thead className="text-left">
        {table.getHeaderGroups().map(hg=>(
          <tr key={hg.id}>
            {hg.headers.map(h=>(
              <th key={h.id} className="px-3 py-2 whitespace-nowrap select-none">
                {h.isPlaceholder?null:(<button className="font-semibold" onClick={h.column.getToggleSortingHandler()}>
                  {flexRender(h.column.columnDef.header,h.getContext())}{h.column.getIsSorted()==='asc'?' ▲':h.column.getIsSorted()==='desc'?' ▼':''}
                </button>)}
              </th>
            ))}
            {(onEdit||onDelete)&&<th className="px-3 py-2">Acciones</th>}
          </tr>
        ))}
      </thead><tbody>
        {table.getRowModel().rows.map(r=>(
          <tr key={r.id} className="border-t">
            {r.getVisibleCells().map(c=>(
              <td key={c.id} className="px-3 py-2 whitespace-nowrap">{flexRender(c.column.columnDef.cell,c.getContext())}</td>
            ))}
            {(onEdit||onDelete)&&(<td className="px-3 py-2"><div className="flex gap-2">
              {onEdit&&<button className="btn" onClick={()=>onEdit(r.original)}>Editar</button>}
              {onDelete&&<button className="btn" onClick={()=>onDelete(r.original)}>Borrar</button>}
            </div></td>)}
          </tr>
        ))}
      </tbody></table>
    </div>
    <div className="flex items-center justify-between gap-2">
      <div className="text-sm">Página {table.getState().pagination.pageIndex+1} de {table.getPageCount()||1}</div>
      <div className="flex gap-2">
        <button className="btn" onClick={()=>table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>« Primera</button>
        <button className="btn" onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>‹ Anterior</button>
        <button className="btn" onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente ›</button>
        <button className="btn" onClick={()=>table.setPageIndex(table.getPageCount()-1)} disabled={!table.getCanNextPage()}>Última »</button>
      </div>
    </div>
  </div>)
}
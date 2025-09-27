import * as React from "react";


export type MiniTableProps<T> = {
    columns: string[]; // cabeceras visibles
    rows: T[];
    renderCell: (column: string, row: T) => React.ReactNode;
    renderActions?: (row: T) => React.ReactNode; // celda acciones a la derecha
    maxRows?: number; // por defecto 6
    density?: "compact" | "normal"; // densidad de filas
};


export default function MiniTable<T>({
                                         columns,
                                         rows,
                                         renderCell,
                                         renderActions,
                                         maxRows = 6,
                                         density = "compact"
                                     }: MiniTableProps<T>): JSX.Element {
    const headPy = density === "compact" ? "py-0.5" : "py-1";
    const cellPy = density === "compact" ? "py-0.5" : "py-1.5"; // ⬅️ aún más compacto
    const pr = density === "compact" ? "pr-3" : "pr-4";
    const gap = density === "compact" ? "gap-0.5" : "gap-2"; // ⬅️ iconos más juntos


    return (
        <table className="w-full text-sm">
            <thead>
            <tr className="text-left text-gray-600">
                {columns.map((c) =>
                    <th key={c} className={`${headPy} ${pr}`}>{c === "Activo" ? "" : c}</th>
                )}
                {renderActions && <th className={`${headPy} pr-2 text-right`}>Acciones</th>}
            </tr>
            </thead>
            <tbody>
            {rows.slice(0, maxRows).map((row, i) => (
                <tr key={String((row as unknown as { id?: string }).id ?? i)} className="border-t">
                    {columns.map((c) => (
                        <td key={c} className={`${cellPy} ${pr}`}>{renderCell(c, row)}</td>
                    ))}
                    {renderActions && (
                        <td className={`${cellPy} pr-2`}>
                            <div className={`flex justify-end ${gap}`}>{renderActions(row)}</div>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

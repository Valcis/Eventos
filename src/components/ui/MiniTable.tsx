import * as React from "react";

export type MiniTableProps<T> = {
    columns: string[]; // cabeceras visibles (incluye "Activo" si aplica)
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
                                         density = "compact",
                                     }: MiniTableProps<T>): JSX.Element {
    const headPy = density === "compact" ? "py-0.5" : "py-1";
    const cellPy = density === "compact" ? "py-0.5" : "py-1.5";
    const px = density === "compact" ? "px-3" : "px-4";
    const gap = density === "compact" ? "gap-0.5" : "gap-2";

    return (
        <table className="w-full text-sm text-center">
            <thead>
            <tr className="text-gray-600">
                {columns.map((c) => (
                    <th key={c} className={`${headPy} ${px}`}>{c === "Activo" ? "" : c}</th>
                ))}
                {renderActions && <th className={`${headPy} ${px}`}>{/* Acciones centrado sin texto */}</th>}
            </tr>
            </thead>
            <tbody>
            {rows.slice(0, maxRows).map((row, i) => (
                <tr key={String((row as unknown as { id?: string }).id ?? i)} className="border-t">
                    {columns.map((c) => (
                        <td key={c} className={`${cellPy} ${px}`}>{renderCell(c, row)}</td>
                    ))}
                    {renderActions && (
                        <td className={`${cellPy} ${px}`}>
                            <div className={`mx-auto inline-flex ${gap}`}>{renderActions(row)}</div>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

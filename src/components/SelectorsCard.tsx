// src/components/SelectorsCard.tsx
import React from "react";
import DataTable from "./ui/DataTable";
import type { ColumnDef, SortState } from "./ui/DataTable/types";

type Props<Row extends Record<string, unknown>> = {
    title: string;
    rows: ReadonlyArray<Row>;
    columns: ReadonlyArray<ColumnDef<Row>>;
    className?: string;
};

export default function SelectorsCard<Row extends Record<string, unknown>>(props: Props<Row>): JSX.Element {
    const { title, rows, columns, className } = props;

    // sort local por card ⇒ ordenar una mini-tabla no afecta al resto
    const [sort, setSort] = React.useState<SortState>({ columnId: null, direction: null });

    return (
        <section className={`border rounded-2xl p-4 shadow-sm bg-white ${className ?? ""}`}>
            <header className="mb-3">
                <h3 className="text-base font-semibold">{title}</h3>
            </header>

            <DataTable<Row>
                rows={rows}
                columns={columns}
                sort={sort}
                onSortChange={setSort}
                density="compact"
                emptyState={<span className="text-gray-500">No hay datos</span>}
            />
        </section>
    );
}

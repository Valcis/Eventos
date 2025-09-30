import { useMemo, useState } from "react";
import { getUiForEntity } from "../../lib/ui/facade";
import { ViewMode } from "../../lib/ui/contracts";
import FilterBar from "../../components/ui/FilterBar/FilterBar";
import type { FilterValues } from "../../components/ui/FilterBar/types";
import DataTable from "../../components/ui/DataTable";

export default function Precios(): JSX.Element {
    const [mode] = useState<ViewMode>("compact");
    const ui = useMemo(() => getUiForEntity("precios", mode), [mode]);
    const [filters, setFilters] = useState<FilterValues>({});

    return (
        <>
            <FilterBar title="Filtros" fields={ui.filters} values={filters} onChange={setFilters} isCollapsible />
            <DataTable columns={ui.columns} /* rows={...} */ />
        </>
    );
}

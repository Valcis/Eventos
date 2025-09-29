import { buildDataTableColumns } from './toDataTable';
import { buildFilterFields } from './toFilterBar';
import { getSchema } from '../schemaRegistry';
import { getTablePreset, getSearchPreset } from '../presets/registry';
import { DataTableColumn } from './toDataTable';
import { FilterField } from './toFilterBar';

export function buildDataTableColumnsFor(table: string): DataTableColumn[] {
    const schema = getSchema(table);
    const preset = getTablePreset(table);
    return buildDataTableColumns(schema, preset);
}

export function buildFilterFieldsFor(table: string): FilterField[] {
    const schema = getSchema(table);
    const preset = getSearchPreset(table);
    return buildFilterFields(schema, preset);
}

import {TablePreset, SearchPreset} from './types';

type TableName = string;

const tablePresets = new Map<TableName, TablePreset>();
const searchPresets = new Map<TableName, SearchPreset>();

export function registerTablePreset(table: TableName, preset: TablePreset): void {
    tablePresets.set(table, preset);
}

export function registerSearchPreset(table: TableName, preset: SearchPreset): void {
    searchPresets.set(table, preset);
}

export function getTablePreset(table: TableName): TablePreset | undefined {
    return tablePresets.get(table);
}

export function getSearchPreset(table: TableName): SearchPreset | undefined {
    return searchPresets.get(table);
}

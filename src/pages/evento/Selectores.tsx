import * as React from "react";
import { useState } from "react";
import type { SelectorKind } from "../../types/selectores";
import { SELECTOR_CONFIG } from "../../features/selectors/config";
import SelectorsCard from "../../features/selectors/SelectorsCard";


export default function SelectoresPage(): JSX.Element {
// TODO: eventId real desde router/context/params
    const [eventId] = useState<string>("demo");
    const [query, setQuery] = useState<string>("");


    const kinds = Object.keys(SELECTOR_CONFIG) as SelectorKind[];


    return (
        <div className="p-4 md:p-6">
            <header className="mb-4 flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Selectores</h1>
                <div className="ml-auto w-full max-w-md">
                    <input
                        aria-label="Buscar en selectores"
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                        placeholder="Buscar en todas las listas…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </header>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {kinds.map((kind) => (
                    <SelectorsCard key={kind} kind={kind} eventId={eventId} query={query} />
                ))}
            </div>
        </div>
    );
}
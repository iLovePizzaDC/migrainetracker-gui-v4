import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import FilterForm from "@/shared/components/molecules/FilterForm";
import { FILTER_FORM_VARIANTS } from "@/shared/constants/variants/filter-form";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

// TODO same styled as other component contextmenu?
// TODO no transition when opening/closing filter
function FilterCard() {
    const { filter, setFilter } = useCalendar();

    const [filterOpen, setFilterOpen] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    useClickOutside(cardRef, setFilterOpen);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className="relative">
                <button
                    onClick={() => setFilterOpen((prev) => !prev)}
                    className="p-4 rounded-full bg-white/10 hover:opacity-80 transition-opacity backdrop-blur-sm"
                >
                    <FunnelIcon className="h-6 w-6" />
                </button>

                {filterOpen && (
                    <div
                        ref={cardRef}
                        className="absolute bottom-full right-0 mb-2 w-64 p-4 rounded-2xl bg-transparent backdrop-blur-xl border border-white/20 shadow-lg shadow-black/30"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Filter</h3>
                            <button onClick={() => setFilterOpen(false)}>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <FilterForm
                            variant={FILTER_FORM_VARIANTS.COMPACT}
                            filter={filter}
                            setFilter={setFilter}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterCard;

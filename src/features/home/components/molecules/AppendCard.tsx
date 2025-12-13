import CardForm from "@/features/home/components/molecules/CardForm";
import { useCardSetups } from "@/features/home/hooks/use-card-setups";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function AppendCard() {
    const { appendSetup } = useCardSetups();

    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="
                w-full self-start rounded-2xl
                bg-transparent backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            "
            tabIndex={-1}
        >
            <div
                className="p-4 sm:p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <h2 className="text-lg font-semibold">Add more</h2>
                {expanded ? (
                    <MinusIcon className="w-6 h-6" />
                ) : (
                    <PlusIcon className="w-6 h-6" />
                )}
            </div>

            <div
                className={`
                    grid transition-all duration-300
                    ${expanded ? 'grid-rows-[1fr] px-6 pb-6' : 'grid-rows-[0fr]'}
                `}
            >
                <div className="overflow-hidden">
                    {expanded && <CardForm onButtonClick={appendSetup} />}
                </div>
            </div>
        </div>
    );
}

export default AppendCard;

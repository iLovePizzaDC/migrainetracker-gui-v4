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
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <h2 className="text-lg font-semibold">Add more</h2>
                {expanded ? (
                    <MinusIcon className="w-6 h-6" />
                ) : (
                    <PlusIcon className="w-6 h-6" />
                )}
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'h-96' : 'h-0'}`}>
                {expanded && (
                    <CardForm onButtonClick={appendSetup} />
                )}
            </div>
        </div>
    );
}

export default AppendCard;

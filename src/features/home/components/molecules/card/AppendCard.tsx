import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import CardForm from "./CardForm";

interface IAppendCard {
    nextIndex: number;
}

function AppendCard({ nextIndex }: IAppendCard) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="
                self-start rounded-2xl
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
                    <CardForm nextIndex={nextIndex} />
                )}
            </div>
        </div>
    );
}

export default AppendCard;

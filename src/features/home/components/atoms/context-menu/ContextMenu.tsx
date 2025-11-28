import { useEffect, useRef } from "react";
import MenuItem from "./MenuItem";

interface IContextOpen {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ContextMenu({ open, setOpen }: IContextOpen) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [setOpen]);

    if (!open) return null;

    return (
        <div
            ref={menuRef}
            className="
                absolute top-10 right-0 z-50
                w-40 rounded-xl p-2
                bg-white/5 backdrop-blur-xl
                border border-white/20 shadow-xl shadow-black/30
                animate-in fade-in zoom-in duration-150
                sm:w-48
            "
        >
            <MenuItem label="Edit" onClick={() => console.log("edit")} />
            <MenuItem label="Remove" onClick={() => console.log("remove")} />
        </div>
    );
}

export default ContextMenu;

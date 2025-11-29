import { useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";

interface IContextOpen {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    onRemoveClick: () => void;
}

function ContextMenu({ open, setOpen, isEditing, setIsEditing, onRemoveClick }: IContextOpen) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [removalVerified, setRemovalVerified] = useState(false);

    const onEdit = () => {
        setOpen(false);
        setIsEditing(!isEditing);
    };

    const onRemove = () => {
        if (removalVerified) {
            onRemoveClick();
            setOpen(false);
            setRemovalVerified(false);
        }

        setRemovalVerified(true);
    }

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
                setRemovalVerified(false);
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
            <MenuItem label={isEditing ? 'Cancel' : 'Edit'} onClick={onEdit}
            />
            <MenuItem label={removalVerified ? 'Are you sure?' : 'Remove'} onClick={onRemove} />
        </div>
    );
}

export default ContextMenu;

import { useEffect } from "react";

export function useClickOutside(
    targetRef: React.RefObject<HTMLDivElement | null>,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
                setter(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [targetRef, setter]);
}

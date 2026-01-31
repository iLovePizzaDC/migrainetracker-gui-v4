import { useEffect } from "react";

export function useClickOutside(
    targetRef: React.RefObject<HTMLElement | null>,
    onOutsideClick: () => void
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                targetRef.current &&
                !targetRef.current.contains(event.target as Node)
            ) {
                onOutsideClick();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [targetRef, onOutsideClick]);
}

import { Bars3Icon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IMobileNavigationOptions {
    toggleMenu: () => void;
    isOpen: boolean;
}

export default function MobileNavigationOptions({ toggleMenu, isOpen }: IMobileNavigationOptions) {

    return (
        <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-200 pl-6"
            data-testid="mobile-nav-toggle"
        >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
    );
}

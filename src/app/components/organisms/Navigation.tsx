import { useState } from "react";
import { useUser } from "../../../shared/hooks/user/use-user";
import NavigationLinks from "../molecules/navigation/NavigationLinks";
import MobileNavigationOptions from "../molecules/navigation/MobileNavigationOptions";
import MobileNavigationLinks from "../molecules/navigation/MobileNavigationLinks";

function Navigation() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (// TODO style hello title
        <header className="fixed top-0 left-0 w-full z-30 rounded-lg backdrop-blur-lg bg-transparent shadow-md px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h3>Sorry to see you{user ? `, ${user.given_name}` : ''}</h3>

                <nav className="hidden lg:md:flex lg:md:space-x-6" data-testid="desktop-nav">
                    <NavigationLinks />
                </nav>

                <div className="lg:hidden">
                    <MobileNavigationOptions
                        toggleMenu={toggleMenu}
                        isOpen={isOpen}
                    />
                </div>
            </div>

            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
                data-testid="mobile-nav"
            >
                <nav className="rounded-lg backdrop-blur-lg bg-transparent shadow-md mt-2 p-3">
                    <MobileNavigationLinks
                        toggleMenu={toggleMenu}
                    />
                </nav>
            </div>
        </header>
    );
}

export default Navigation;

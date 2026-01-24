import { fetchUserLogout } from "@/shared/api/user.api";

function Footer() {

    const logout = async () => {
        await fetchUserLogout();
    };

    return(
        <footer className="left-0 w-full rounded-lg backdrop-blur-lg bg-transparent shadow-md mt-4">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-300 sm:text-center">© 2025 MigraineTracker.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-300 sm:mt-0">
                <li>
                    <button onClick={logout} className="hover:opacity-80 transition-opacity">Logout</button>
                </li>
            </ul>
            </div>
        </footer>
    );
}

export default Footer;

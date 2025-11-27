import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface INavigationLink {
    label: string;
    to: string;
    onClick?: () => void;
    className?: string;
}

export default function NavigationLink({
    label,
    to,
    onClick,
}: INavigationLink) {
    const { pathname } = useLocation();

    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        const checkActivePath = () => {
            const normalizedPathname: string = pathname.replace(/\//g, '');
            const normalizedTo: string = to.replace(/\//g, '');

            setIsActive(normalizedPathname === normalizedTo);
        };

        checkActivePath();
    }, [pathname, to]);

    return(
        <Link
            to={to}
            className={`${
                isActive
                    ? 'opacity-80'
                    : 'hover:opacity-80 transition-opacity'
                }`}
            onClick={onClick}
        >
            {label}
        </Link>
    )
}

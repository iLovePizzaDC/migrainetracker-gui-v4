import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface INavigationLink {
  label: string;
  to: string;
  onClick?: () => void;
  className?: string;
}

export default function NavigationLink({ label, to, onClick }: INavigationLink) {
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

  return (
    <Link
      to={to}
      className={`
                rounded-xl p-2 bg-transparent backdrop-blur-md
                w-full border-2 flex items-center
                ${isActive
          ? 'opacity-100 border-white/20 shadow-sm shadow-black/20 cursor-default'
          : 'border-transparent hover:border-white/10 hover:opacity-80 transition-all'
        }
            `}
      onClick={onClick}
    >
      <span className='text-left w-full'>{label}</span>
    </Link>
  );
}

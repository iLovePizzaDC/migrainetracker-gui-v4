interface IMenuItem {
  label: string;
  onClick: () => void;
  className?: string;
}

function MenuItem({ label, onClick, className }: IMenuItem) {
  return (
    <button
      onClick={onClick}
      className={`
                w-full text-left px-3 py-2 rounded-lg
                text-sm transition
                hover:bg-white/10
				${className}
            `}
    >
      {label}
    </button>
  );
}

export default MenuItem;

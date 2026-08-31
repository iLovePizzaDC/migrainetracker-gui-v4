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
                w-full rounded-lg px-3 py-2 text-left text-sm transition-colors
                hover:bg-white/[0.06]
				${className}
            `}
		>
			{label}
		</button>
	);
}

export default MenuItem;

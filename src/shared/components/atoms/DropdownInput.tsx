import { useClickOutside } from '@/shared/hooks/use-click-outside';
import type { DropdownOption } from '@/shared/types/input/input';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IDropdownInput {
	id: string;
	label: string;
	value: string;
	options: DropdownOption[];
	onChange: (value: string) => void;
	required?: boolean;
}

function DropdownInput({ id, label, value, options, onChange, required = false }: IDropdownInput) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLUListElement>(null);

	const [open, setOpen] = useState(false);
	const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);

	useClickOutside([buttonRef, menuRef], () => setOpen(false));

	useEffect(() => {
		if (!open) return;

		const handleScroll = (event: Event) => {
			const target = event.target as Node | null;

			if (menuRef.current && target && menuRef.current.contains(target)) {
				return;
			}

			setOpen(false);
		};

		window.addEventListener('scroll', handleScroll, true);
		window.addEventListener('resize', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleScroll);
		};
	}, [open]);

	const openMenu = () => {
		const rect = buttonRef.current?.getBoundingClientRect();
		if (!rect) return;

		setMenuStyle({
			position: 'fixed',
			top: rect.bottom + 4,
			left: rect.left,
			width: rect.width,
			zIndex: 1000,
		});

		setOpen(true);
	};

	const handleSelect = (newValue: string) => {
		onChange(newValue);
		setOpen(false);
	};

	return (
		<div className='w-full'>
			<label htmlFor={id} className='block text-sm font-medium mb-1'>
				{label}
			</label>

			<input type='text' id={id} value={value} required={required} className='hidden' readOnly />

			<button
				data-testid='dropdown-menu-trigger'
				ref={buttonRef}
				type='button'
				className='w-full p-2 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20 text-left'
				onClick={() => (open ? setOpen(false) : openMenu())}
			>
				{options.find((option) => option.value === value)?.label ?? 'Select...'}
			</button>

			{open &&
				menuStyle &&
				createPortal(
					<ul
						ref={menuRef}
						style={menuStyle}
						className='max-h-48 overflow-auto rounded-lg bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-lg'
					>
						{options.map((option) => (
							<li
								key={option.value}
								className={`px-3 py-2 cursor-pointer ${
									option.value === value ? 'bg-white/20' : ''
								} hover:opacity-80 transition-opacity`}
								onClick={() => handleSelect(option.value)}
							>
								{option.label}
							</li>
						))}
					</ul>,
					document.body,
				)}
		</div>
	);
}

export default DropdownInput;

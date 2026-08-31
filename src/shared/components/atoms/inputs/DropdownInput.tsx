import { useClickOutside } from '@/shared/hooks/use-click-outside';
import type { DropdownOption } from '@/shared/types/input';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IDropdownInput {
	id: string;
	label: string;
	value: string;
	options: DropdownOption[];
	onChange: (value: string) => void;
	disabled?: boolean;
	required?: boolean;
}

function DropdownInput({
	id,
	label,
	value,
	options,
	onChange,
	disabled = false,
	required = false,
}: IDropdownInput) {
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
		<div className='input-field w-full'>
			<label htmlFor={id} className='field-label'>
				{label}
			</label>

			<input
				type='text'
				id={id}
				value={value}
				disabled={disabled}
				required={required}
				className='hidden'
				readOnly
			/>

			<button
				data-testid='dropdown-menu-trigger'
				ref={buttonRef}
				type='button'
				className='glass-input text-left'
				onClick={() => (open ? setOpen(false) : openMenu())}
				disabled={disabled}
			>
				{options.find((option) => option.value === value)?.label ?? 'Select...'}
			</button>

			{open &&
				menuStyle &&
				createPortal(
					<ul ref={menuRef} style={menuStyle} className='glass-menu max-h-48 overflow-auto'>
						{options.map((option) => (
							<li
								data-testid={option.value}
								key={option.value}
								className={`px-3 py-2 cursor-pointer ${
									option.value === value ? 'bg-white/20' : ''
								} motion-fade hover:opacity-80`}
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

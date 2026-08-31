import MenuItem from '@/features/chart-cards/components/atoms/context-menu/MenuItem';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useRef, useState, type RefObject } from 'react';

interface IContextOpen {
	contextButtonRef: RefObject<HTMLButtonElement | null>;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	onRemoveClick: () => void;
}

function ContextMenu({
	contextButtonRef,
	open,
	setOpen,
	isEditing,
	setIsEditing,
	onRemoveClick,
}: IContextOpen) {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [removalVerified, setRemovalVerified] = useState(false);

	useClickOutside([contextButtonRef, menuRef], () => {
		setOpen(false);
		setRemovalVerified(false);
	});

	const onEdit = () => {
		setOpen(false);
		setIsEditing(!isEditing);
	};

	const onRemove = () => {
		if (removalVerified) {
			onRemoveClick();
			setOpen(false);
			setRemovalVerified(false);
		}

		setRemovalVerified(true);
	};

	if (!open) return null;

	return (
		<div
			data-testid='context-menu'
			ref={menuRef}
			className='
                glass-panel absolute top-10 right-0 z-50
                w-40 p-1.5
                animate-fade-up
                sm:w-48
            '
		>
			<MenuItem label={isEditing ? 'Cancel' : 'Edit'} onClick={onEdit} />
			<MenuItem
				label={removalVerified ? 'Are you sure?' : 'Remove'}
				onClick={onRemove}
				className={`${removalVerified ? 'text-red-500' : 'text-white'}`}
			/>
		</div>
	);
}

export default ContextMenu;

import MenuItem from '@/features/home/components/atoms/context-menu/MenuItem';
import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useRef, useState } from 'react';

interface IContextOpen {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	onRemoveClick: () => void;
}

function ContextMenu({ open, setOpen, isEditing, setIsEditing, onRemoveClick }: IContextOpen) {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [removalVerified, setRemovalVerified] = useState(false);

	useClickOutside(menuRef, () => {
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
                absolute top-10 right-0 z-50
                w-40 rounded-xl p-2
                bg-white/5 backdrop-blur-xl
                border border-white/20 shadow-xl shadow-black/30
                animate-in fade-in zoom-in duration-150
                sm:w-48
            '
		>
			<MenuItem label={isEditing ? 'Cancel' : 'Edit'} onClick={onEdit} />
			<MenuItem // TODO add tests
				label={removalVerified ? 'Are you sure?' : 'Remove'}
				onClick={onRemove}
				className={`${removalVerified ? 'text-red-500' : 'text-white'}`}
			/>
		</div>
	);
}

export default ContextMenu;

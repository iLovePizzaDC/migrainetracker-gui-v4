function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {

    return (
        <button
            onClick={onClick}
            className="
                w-full text-left px-3 py-2 rounded-lg
                text-sm transition
                hover:bg-white/20
            "
        >
            {label}
        </button>
    );
}

export default MenuItem;

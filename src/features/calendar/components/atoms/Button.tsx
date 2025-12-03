import type { ButtonType } from "../../../../shared/constants/input/button";

interface IButton {
    type: ButtonType;
    title: string;
}

function Button({ type, title }: IButton) {

    return (
        <button
            type={type}
            className="
                p-2 px-4 rounded-xl border border-white/30
                hover:opacity-80 transition-opacity
                bg-transparent backdrop-blur-md
                shadow-lg shadow-black/20
            "
        >
            {title}
        </button>
    );
}

export default Button;

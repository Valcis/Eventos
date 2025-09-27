import * as React from "react";

type IconButtonProps = {
    ariaLabel: string;
    title?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    className?: string;
    children: React.ReactNode; // icon
    size?: "sm" | "md";        // 👈 NUEVO
};

export default function IconButton({
                                       ariaLabel,
                                       title,
                                       onClick,
                                       type = "button",
                                       isDisabled = false,
                                       className = "",
                                       children,
                                       size = "sm",              // 👈 por defecto compacto
                                   }: IconButtonProps): JSX.Element {
    const pad = size === "sm" ? "p-1" : "p-2 md:p-2.5"; // 👈 menos padding en sm
    return (
        <button
            type={type}
            aria-label={ariaLabel}
            title={title ?? ariaLabel}
            onClick={onClick}
            disabled={isDisabled}
            className={`rounded-2xl border ${pad} transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}

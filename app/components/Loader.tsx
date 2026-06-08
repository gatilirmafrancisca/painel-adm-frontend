import React, { useEffect } from "react";

const Loader : React.FC = () => {

    useEffect(() => {
        // bloqueia scroll da página enquanto o loader estiver montado
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous || "";
        };
    }, []);

    return  (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            style={{ pointerEvents: "auto" }}
        >
            <span className="loader" aria-hidden="true" />
            <span className="sr-only">Carregando...</span>
        </div>
    );
}

export default Loader;
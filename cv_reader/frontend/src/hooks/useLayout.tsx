/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";


type LayoutContextValue = {
    width: number;
    height: number;
};

const LayoutContext = createContext<LayoutContextValue>({
    width: 0,
    height: 0,
});

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [width, setWidth] = useState(() => window.innerWidth);
    const [height, setHeight] = useState(() => window.innerHeight);

    useEffect(() => {
        const onResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    return (
        <LayoutContext.Provider value={{ width, height }}>
            {children}
        </LayoutContext.Provider>
    );
};


export const useLayout = () => {
    const { width, height } = useContext(LayoutContext);

    return useMemo(() => {
        const isMobile = width < 600;
        const isTablet = width > 600 && width <= 900;
        const isDesktop = width > 900;

        return {
            width,
            height,
            isMobile,
            isTablet,
            isDesktop,
        };
    }, [width, height]);
};

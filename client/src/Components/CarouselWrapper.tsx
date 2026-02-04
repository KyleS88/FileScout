import React, { useEffect } from 'react';

interface CarouselProps {
    children: React.ReactNode,
    next: ()=>void,
    prev: ()=>void,
}

export const CarouselWrapper: React.FC<CarouselProps> = ({  children, next, prev }) => {    
    useEffect(()=>{
        const onKeyDown = (e:KeyboardEvent) => {
            if (e.key === "ArrowLeft")
                prev();
            if (e.key === "ArrowRight")
                next();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [next, prev]);
    
    return (
        <div className="relative h-200 w-full overflow-hidden">
            {children}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer" onClick={prev}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="gray" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer" onClick={next}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="gray" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    )
}
import type React from "react"
import { CarouselWrapper } from "./CarouselWrapper"
import { useState, useCallback, useEffect } from "react"
import { searchPage } from "../api"

export interface SearchDocArray {
    id: string,
    filename: string,
    imageUrl: string,
}
interface FileManagementGalleryProp { 
    setOnGalleryScreen: React.Dispatch<React.SetStateAction<boolean>>,
    setBanner: React.Dispatch<React.SetStateAction<string>>,
}

export const FileManagementGallery = ({ setOnGalleryScreen, setBanner }: FileManagementGalleryProp) => {
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [pagedFiles, setPagedFiles] = useState<SearchDocArray[][]>([]);
    
    const getInitPage = useCallback(async ()=> {
        try {
            const data = await searchPage(0);
            setPagedFiles([data.results]);
        } catch (err) {
            if (err instanceof Error)
                setBanner(err.message);
            setBanner("An unexpected error has occured while initializing the file gallery please refresh the page");
        }
    }, [searchPage, setPageIndex]);

    useEffect(()=> {
        if (pagedFiles.length === 0)
            getInitPage();
    }, [getInitPage]);

    const prev = useCallback(() => {
        setPageIndex(idx=>(idx-1+pagedFiles.length)%pagedFiles.length);
    }, [setPageIndex]);

    const next = useCallback(async () => {
    try {
        if (pageIndex === pagedFiles.length - 1) {
            const data = await searchPage(pagedFiles.length);
            setPagedFiles(pagedFiles=> [...pagedFiles, data.results]);
        }
        setPageIndex(idx=>idx+1);
    } catch (err) {
        if (err instanceof Error) {
            setBanner(err.message);
        } setBanner("An error has occured please refresh the page");
    }
    }, [setBanner]);

    return (
        <>  
            <CarouselWrapper
                prev={prev}
                next={next}
                >
                <section className="flex flex-column items-center justify-center bg-gray-900 p-4 rounded-lg shadow-md">                
                    {pagedFiles[pageIndex]?.map((imageObj)=>(
                        <div className="relative w-full h-64">
                            <img src={imageObj.imageUrl} alt="Gallery Image " className="w-full h-full object-contain select-none" key={imageObj.imageUrl}></img>
                            <p className="">Filename: {imageObj.filename}</p>

                        </div>
                    ))}
                </section>
            </CarouselWrapper>
            <button onClick={()=>setOnGalleryScreen(false)} className="rounded px-4 py-2 bg-purple-500 text-white cursor-pointer">Go Back to Searching</button>
        </>
    )
}
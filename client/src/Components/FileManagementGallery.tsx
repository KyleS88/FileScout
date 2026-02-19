import type React from "react"
import { CarouselWrapper } from "./CarouselWrapper"
import { useState, useCallback, useEffect } from "react"
import { searchPage } from "../api"
import { getBannerEditor } from "./Banner"
import { GalleryCard } from "./GalleryCard"

export interface SearchDocArray {
    id: string,
    filename: string,
    imageUrl: string,
    created_at: number,
    stored_name: string,
}
interface FileManagementGalleryProp { 
    setOnGalleryScreen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const FileManagementGallery = ({ setOnGalleryScreen }: FileManagementGalleryProp) => {
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [pagedFiles, setPagedFiles] = useState<SearchDocArray[][]>([]);
    const { showMessage } = getBannerEditor();

    const getInitPage = useCallback(async ()=> {
        try {
            const data = await searchPage(0);
            setPagedFiles([data.results]);
        } catch (err) {
            if (err instanceof Error)
                showMessage(err.message, "red");
            showMessage("An unexpected error has occured while initializing the file gallery please refresh the page", "red");
        }
    }, [searchPage, setPageIndex]);

    useEffect(()=> {
        if (pagedFiles.length === 0)
            getInitPage();
    }, [getInitPage]);

    const prev = useCallback(() => {
        setPageIndex(idx=>(idx-1+pagedFiles.length)%pagedFiles.length);
        console.table(pagedFiles[0]);
    }, [setPageIndex, pagedFiles, pageIndex]);

    const next = useCallback(async () => {
    try {
        if (pageIndex === pagedFiles.length - 1) {
            const data = await searchPage(pagedFiles.length);
            if (!data.results.length)
                return;
            setPagedFiles(pagedFiles=> [...pagedFiles, data.results]);
        }
        setPageIndex(idx=>idx+1);
    } catch (err) {
        if (err instanceof Error) {
            showMessage(err.message, "red");
        } showMessage("An error has occured please refresh the page", "red");
    }
    }, [showMessage, pagedFiles, pageIndex]);
    return (
        <>  
            <CarouselWrapper
                prev={ prev }
                next={ next }
                >
                <section className="grid grid-cols-5 gap-4 items-center justify-center bg-gray-500 p-4 rounded-lg shadow-md w-full h-full space-y-4">                
                    {pagedFiles[pageIndex]?.map((imageObj)=>(
                        <GalleryCard 
                            setPagedFiles={setPagedFiles}
                            pageIndex={pageIndex}
                            imageObj={imageObj}
                            />
                    ))}
                </section>
            </CarouselWrapper>
            {pageIndex + 1} / {pagedFiles.length}
            <button onClick={()=>setOnGalleryScreen(false)} className="rounded px-4 py-2 bg-purple-500 text-white cursor-pointer">Go Back to Searching</button>
        </>
    )
}
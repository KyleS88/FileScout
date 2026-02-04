import { CarouselWrapper } from "./CarouselWrapper";
import React, { useEffect, useState, useCallback } from "react";
import { searchImages } from '../api'

type FileSearchProps = {
    setBanner: React.Dispatch<React.SetStateAction<string>>,
    setOnGalleryScreen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const FileSearchCard = ({ setBanner, setOnGalleryScreen }: FileSearchProps) => {
    const [query, setQuery] = useState<string>("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isFile, setIsFile] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);

    // Add to prev and next a condiditonal for prev and next page
    const prev = useCallback((): void => {        
        setIndex(i=>(i-1 + imageUrls.length)%imageUrls.length);
    }, [imageUrls.length]);
        
    const next = useCallback(async (): Promise<void> => {
        setIndex(i=>((i+1)%imageUrls.length));
    }, [imageUrls.length,]);
    
    const handleFileCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsFile(e.target.checked);
    }
    const handleSearch = async () => {
        try {
            setBanner("");
            if (!query) {
            setBanner("Please enter a search query");
            return;
            }
            const data = await searchImages(query, isFile);
            console.log(data)

            setImageUrls(data.images)
            window.scrollTo({
            top: 500,
            left: 0,
            behavior: 'smooth'
            })
        } catch (err) {
            err instanceof Error? setBanner(err.message):
            setBanner(`An unexpected error has occured please refresh the page: ${err}`);
        }
    }

    useEffect(()=> {
        const onEnterPress = (e:KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        }
        window.addEventListener("keydown", onEnterPress);
        return () => window.removeEventListener("keydown", onEnterPress);
    }, [handleSearch, query, isFile]);

    return (
        <>        
            <input        
                type="text" 
                onChange={(e)=>setQuery(e.target.value)}
                placeholder='What do you want to search? e.g. filename, treehouse'
                className="border border-gray-300 rounded px-4 py-2 max-w-2/3 w-full"
            />
            <div className="space-x-4">
                <input
                    type='checkbox'
                    id="isFile"
                    name="isFile"
                    checked={isFile}
                    onChange={(e)=>handleFileCheck(e)}
                />
                <label htmlFor="isFile" className="select-none">Are you searching for a file?</label>
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Search</button>
                <button onClick={()=>setOnGalleryScreen(true)} className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">Show all files</button>
            </div>
            <div className='h-200'>
                {imageUrls.length?
                <CarouselWrapper
                    next={next}
                    prev={prev} >
                    <img src={imageUrls[index]} alt="search result" className="w-220 h-auto select-none" />
                </CarouselWrapper>:
                  <p className="absolute text-4xl top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2">No image to display</p>} 
            </div>
        </>
    )
}
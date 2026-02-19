import React, { useState } from "react";
import { type SearchDocArray } from "./FileManagementGallery"
import { removeImage } from "../api";

interface GalleryCardProps {
    imageObj: SearchDocArray,
    setPagedFiles: React.Dispatch<React.SetStateAction<SearchDocArray[][]>>
    pageIndex: number,
}

export const GalleryCard = ( { imageObj, setPagedFiles, pageIndex }: GalleryCardProps ) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    
    const handleDelete = () => {
        removeImage(imageObj.stored_name);   
        setPagedFiles((prev) => 
            prev.map((page, idx) => 
                idx === pageIndex 
                ? page.filter((file) => file.stored_name !== imageObj.stored_name) 
                : page
            )
        );
    }

    return (
        <div onClick={()=>setIsExpand((currStatus)=>!currStatus)}
            className={`cursor-pointer transition-all duration-300 border rounded-xl shadow-sm bg-white ${isExpand ? 'p-16 flex-col' : 'p-4 flex-row items-center justify-between'} flex gap-4 w-full max-w-md`}
        >
            <div className="relative w-full h-64 flex flex-col items-center justify-center space-y-2" key={imageObj.id}>
                <img src={imageObj.imageUrl} alt="Gallery Image " className={`object-contain select-none transition-all duration-100 delay-150 ${isExpand? 'w-full h-full': 'w-[85%] h-[85%]'}`} key={imageObj.imageUrl} />
                <p className="text-sm text-black">Filename: {imageObj.filename}</p>
                <div className={`transition-opacity duration-200 delay-100 ${isExpand? 'opacity-100 visible': 'opacity-0 invisible h-0 overflow-hidden'} `}>
                    Date Added: {imageObj.created_at}
                    <button onClick={()=>handleDelete()} className="cursor-pointer">🗑️</button>
                </div>
                
            </div>
        </div>

    )
}
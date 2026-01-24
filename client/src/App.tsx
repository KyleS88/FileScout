
import { useEffect, useState } from 'react';
import { searchImages, uploadImage } from './api'
import { Carousel } from "./Components/Carousel"

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isFile, setIsFile] = useState<boolean>(false);
  const [banner, setBanner] = useState<string>("");


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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setBanner("");
      await uploadImage(e.target.files?.[0]);
      setBanner("Image has been successfully uploaded");
    } catch (err) {
      err instanceof Error? setBanner(err.message):
        setBanner(`An unexpected error has occured please refresh the page: ${err}`);
    }
  }
  return (
  <div className="bg-blue-100 min-h-screen p-8 space-y-6">
    {banner === "Image has been successfully uploaded"? (
      <div className="relative bg-green-100 text-green-700 p-4 rounded text-center" id="successBanner">
        <p>{banner}</p>
        <button 
          onClick={() => setBanner("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-bold hover:text-green-900 px-5 text-2xl select-none"
        >
          &times;
        </button>
      </div>
    ) : banner && (
      <div className="relative bg-red-100 text-red-700 p-4 rounded text-center" id="errorBanner">
        <p>{banner}</p>
        <button 
          onClick={() => setBanner("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-bold hover:text-red-900 px-5 text-2xl select-none"
        >
          &times;
        </button>
      </div>
    )}
    <h1 className="rounded-2xl border border-zinc-200 p-6 shadow-sm text-center font-bold text-3xl bg-[#101585] text-white select-none">Image Matching Engine</h1>
    <section className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-15 rounded-lg bg-white" id="imageUploadSection">
      <input type="file" accept="image/*" id="imageUpload" onChange={(e)=>handleUpload(e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      <span className="text-4xl">☁️</span>
      <p className="text-gray-400">Click or drag to this area to upload an image to the engine</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded pointer-events-none">Select File</button>
    </section>
    <section className="rounded-lg border-2 border-gray-400 p-6 shadow-sm bg-white flex flex-col items-center space-y-4 justify-center" id="searchSection">
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
        </div>
        <div className='imageDisplay'>
          <Carousel images={imageUrls}/>
        </div>
    </section>
  </div>

  )
}

export default App

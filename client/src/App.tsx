
import { useState } from 'react';
import { uploadImage } from './api'
import { Banner } from './Components/Banner';
import { FileSearchCard } from './Components/FileSearchCard';
import { FileManagementGallery } from './Components/FileManagementGallery';

const App = () => {
  const [banner, setBanner] = useState<string>("");
  const [onGalleryScreen, setOnGalleryScreen] = useState<boolean>(false);
  const bannerConfig = {
    green: {
      banner: "relative bg-green-100 text-green-700 p-4 rounded text-center",
      button: "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-bold hover:text-green-900 px-5 text-2xl select-none",
      color: "green"
    },
    red: {
      banner: "relative bg-red-100 text-red-700 p-4 rounded text-center",
      button: "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-bold hover:text-red-900 px-5 text-2xl select-none",
      color: "red"
    }
  }

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
    {banner && (
      <Banner
        banner={banner}
        setBanner={setBanner}
        bannerConfig={banner === "Image has been successfully uploaded"? bannerConfig.green: bannerConfig.red}
      />
    )}
    <h1 className="rounded-2xl border border-zinc-200 p-6 shadow-sm text-center font-bold text-3xl bg-[#101585] text-white select-none">Image Matching Engine</h1>
    <section className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-15 rounded-lg bg-white" id="imageUploadSection">
      <input type="file" accept="image/*" id="imageUpload" onChange={(e)=>handleUpload(e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      <span className="text-4xl">☁️</span>
      <p className="text-gray-400">Click or drag to this area to upload an image to the engine</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded pointer-events-none">Select File</button>
    </section>
    <section className="rounded-lg border-2 border-gray-400 p-6 shadow-sm bg-white flex flex-col items-center space-y-4 justify-center" id="searchSection">
      {onGalleryScreen?
      <FileManagementGallery
        setOnGalleryScreen = {setOnGalleryScreen}
        setBanner = {setBanner}
        />:
      <FileSearchCard 
        setBanner = {setBanner} 
        setOnGalleryScreen = {setOnGalleryScreen}
        />}
    </section>
  </div>
  )
}

export default App

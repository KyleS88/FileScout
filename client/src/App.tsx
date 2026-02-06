
import { useState } from 'react';
import { uploadImage } from './api'
import { FileSearchCard } from './Components/FileSearchCard';
import { FileManagementGallery } from './Components/FileManagementGallery';
import { getBannerEditor } from './Components/Banner'
const App = () => {
  const [onGalleryScreen, setOnGalleryScreen] = useState<boolean>(false);
  const { showMessage } = getBannerEditor();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      showMessage("");
      await uploadImage(e.target.files?.[0]);
      showMessage("Image has been successfully uploaded", "green");
    } catch (err) {
      err instanceof Error? showMessage(err.message, "red"):
        showMessage(`An unexpected error has occured please refresh the page: ${err}`);
    }
  }
  return (
  <div className="bg-blue-100 min-h-screen p-8 space-y-6">
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
        />:
      <FileSearchCard 
        setOnGalleryScreen = {setOnGalleryScreen}
        />}
    </section>
  </div>
  )
}

export default App

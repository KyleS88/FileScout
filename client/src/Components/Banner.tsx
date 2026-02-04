export type bannerConfigType = {
  banner: string,
  button: string,
  color: string,
}

type BannerProps = {
    banner: string,
    setBanner: React.Dispatch<React.SetStateAction<string>>,
    bannerConfig: bannerConfigType,
}

export const Banner=({banner, setBanner, bannerConfig}: BannerProps) =>{
    return (
        <div className={bannerConfig.banner} id={bannerConfig.color==="green"? "successBanner" : "errorBanner"}>
        <p>{banner}</p>
        <button 
          onClick={() => setBanner("")}
          className={bannerConfig.button}
        >
          &times;
        </button>
      </div>
    )
}
import React, { useState, useContext, createContext } from "react";

const bannerConfig = {
  green: {
    banner: "relative bg-green-100 text-green-700 p-4 rounded text-center",
    button: "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-bold hover:text-green-900 px-5 text-2xl select-none",
  },
  red: {
    banner: "relative bg-red-100 text-red-700 p-4 rounded text-center",
    button: "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-bold hover:text-red-900 px-5 text-2xl select-none",
  }
}

type BannerColorType = "green" | "red" | undefined;
type ShowMsgFuncType = (msg: string, type?: BannerColorType) => void;
interface BannerContextType {
  showMessage: ShowMsgFuncType,
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<{ msg: string, type: BannerColorType } | null>(null);
  
  const showMessage = (msg: string, type?: BannerColorType) => {
    setContext({ msg, type });
  }
  return (
    <BannerContext.Provider value={{ showMessage }}>
      {context?.msg && context.type && (
        <div className={bannerConfig[context.type].banner} id={context.type}>
          <p>{context.msg}</p>
          <button onClick={()=>showMessage("")} className={bannerConfig[context.type].button}>&times;</button>
        </div>
      )}
      {children}
    </BannerContext.Provider>
  )
}

export const getBannerEditor = (): BannerContextType => {
  const context: BannerContextType | undefined = useContext(BannerContext);
  if (!context) throw new Error("Please wrap this component with a BannerProvider");
  return context;
}
import {createContext, useState, useContext } from "react";

type AudioContextType = {
    audio: string | null;
    setAudio: React.Dispatch<React.SetStateAction<string | null>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    audioimg: string | null;
    setAudioimg: React.Dispatch<React.SetStateAction<string | null >>;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function CreateAudioContext({children}: {children: React.ReactNode}) {
    // Create a context for the audio player
    

    const [audio, setAudio] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioimg, setAudioimg] = useState<string | null>("")

    return(
        <AudioContext.Provider value={{audio, setAudio, isPlaying, setIsPlaying, audioimg, setAudioimg}}>
            {children}
        </AudioContext.Provider>
    )

}

export function useAudioContext() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudioContext must be used within a CreateAudioContext provider");
      }
      return context;
}
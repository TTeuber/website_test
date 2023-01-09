"use client";
import {useCallback, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import playBtnImg from "../public/icons/play.png";
import pauseBtnImg from "../public/icons/pause.png"
import Image from "next/image";

export default function CirclePlayer({width, src, context, time}) {
    const rightCover = useRef(null);
    const leftCover = useRef(null);
    const [angle, setAngle] = useState(0);
    const [playing, setPlaying] = useState(false);
    const {source, setSource, pickSong, audio} = useContext(context);

    useLayoutEffect(() => {
            if (angle === 0) {
                leftCover.current.style.transform = "rotate(0deg)";
            }
            if (angle <= 180) {
                rightCover.current.style.transform = `rotate(${angle}deg)`;
            }
            if (angle > 180) {
                leftCover.current.style.transform = `rotate(${angle-180}deg)`;
            }
    }, [angle])

    useEffect(() => {
        let id;
        if (playing) {
            id = setInterval(() => {
                if (angle >= 359.8) {
                    setAngle(0);
                    audio.current.pause();
                    setSource("");
                } else {
                    setAngle(a => a + 0.2);
                }
            }, 1000/60)
        }


        return () => clearInterval(id);
    }, [angle, audio, playing, setSource])

    useEffect(() => {
        if (source !== src) {
            setPlaying(false);
            setAngle(0);
        }
    }, [source, src])

    return (
        <div style={{height: `${width+8}px`, width:`${width+8}px`}} className={"relative rounded-full overflow-hidden shadow-xl border-4 border-black border-opacity-50"}>
            <div id={"circle"} className={`bg-black rounded-full h-full w-full absolute opacity-50`}></div>
            <div id={"right-window"} className={`absolute h-full w-1/2 left-1/2 overflow-hidden`}>
                <div id={"right-spinner"} className={`h-full relative right-full`}
                     style={{transform: `rotate(0deg)`, width: `${width}px`}} ref={rightCover}>
                    <div id={"right-cover"} className={"bg-gray-700 absolute left-1/2 h-full w-1/2 opacity-40"}></div>
                </div>
            </div>
            <div id={"left-window"} className={`absolute h-full w-1/2 overflow-hidden`}>
                <div id={"left-spinner"} className={`h-full relative`}
                     style={{transform: `rotate(0deg)`, width: `${width}px`, left: "1px"}} ref={leftCover}>
                    <div id={"left-cover"} className={"bg-gray-700 absolute h-full w-1/2 opacity-40"}></div>
                </div>
            </div>
            <button className={"absolute w-full h-full z-20 rounded-full flex justify-center items-center"}
                    style={{fontSize: `${width/3}px`}}
                    onClick={() => {setPlaying(!playing); setSource(src); pickSong(src, playing, time);}}>
                <Image src={playing ? pauseBtnImg : playBtnImg} alt={"play button"} height={100} width={100} className={`w-[${width/100}px] opacity-80`}/>
            </button>
        </div>
    )
}
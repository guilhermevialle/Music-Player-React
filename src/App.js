import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    TweenMax,
    TimelineMax,
    Power2,
    Expo,
    Sine,
    Circ,
    CSSPlugin,
} from "gsap/all";

import "./App.scss";

// svgs
import Repeat from "./svgs/repeat.svg";
import Previous from "./svgs/previous.svg";
import Play from "./svgs/play.svg";
import Next from "./svgs/next.svg";
import Volume from "./svgs/volume.svg";
import NoVolume from "./svgs/novolume.svg";
import LowVolume from "./svgs/lowvolume.svg";
import Pause from "./svgs/pause.svg";
import Playlisticon from "./svgs/playlisticon.svg";
import Waves from "./svgs/waves.svg";
import TopWaves from "./svgs/topwaves.svg";
import OpenedPlaylist from "./svgs/openedplaylist.svg";

// images
import img1 from "./images/img1.jpg";
import img2 from "./images/img2.jpg";
import img3 from "./images/img3.jpg";
import img4 from "./images/img4.jpg";
import img5 from "./images/img5.jpg";
import img6 from "./images/img6.jpg";
import img7 from "./images/img7.jpg";
import img8 from "./images/img8.jpg";
import img9 from "./images/img9.jpg";

// musics
import music1 from "./musics/music1.mp3";
import music2 from "./musics/music2.mp3";
import music3 from "./musics/music3.mp3";
import music4 from "./musics/music4.mp3";
import music5 from "./musics/music5.mp3";
import music6 from "./musics/music6.mp3";
import music7 from "./musics/music7.mp3";
import music8 from "./musics/music8.mp3";
import music9 from "./musics/music9.mp3";

var arrayIndex = 0;

function App() {
    const [tracks, setTracks] = useState([
        {
            autor: "[NCS] Free to use",
            name: "Art of Silence",
            songPath: music1,
            imgPath: img1,
        },
        {
            autor: "Tenno",
            name: "Vision",
            songPath: music2,
            imgPath: img2,
        },
        {
            autor: "Nourish",
            name: "All that you are is all that i need",
            songPath: music3,
            imgPath: img3,
        },
        {
            autor: "ON TOP",
            name: "the girl next door",
            songPath: music4,
            imgPath: img4,
        },
        {
            autor: "Artist",
            name: "Levi vs Beast Titan Theme Season 4",
            songPath: music5,
            imgPath: img5,
        },
        {
            autor: "Bloodbath",
            name: "Eaten",
            songPath: music6,
            imgPath: img6,
        },
        {
            autor: "NCS - No Copyright Songs",
            name: "The floor is lava",
            songPath: music7,
            imgPath: img7,
        },
        {
            autor: "Animes Soundtracks",
            name: "Reiner and Bertholdt Reveal Theme Season 2",
            songPath: music8,
            imgPath: img8,
        },
        {
            autor: "Suicide Silence",
            name: "You only live once",
            songPath: music9,
            imgPath: img9,
        },
    ]);

    // selectedMusic state
    const [selectedMusic, setSelectedMusic] = useState(tracks[0]);

    // refering elements
    var audio = useRef(null);
    var trackSliderElement = useRef(null);
    var volumeSlider = useRef(null);
    var currentTiming = useRef(null);
    var totalTiming = useRef(null);
    var playlistInterface = useRef(null);
    var playSvg = useRef(null);

    var timer;

    const resetSlider = () => {
        trackSliderElement.current.value = 0;
    };

    // side effects when change selectedMusic state
    useEffect(() => {
        const targets = playlistInterface.current.childNodes;

        targets.forEach((target) => {
            if (target.classList.contains("currentTrack")) {
                target.classList.remove("currentTrack");
            }
        });

        audio.current.play();

        playSvg.current.src = Pause;

        resetSlider();

        targets[arrayIndex].classList.add("currentTrack");

        timer = setInterval(changeMusicSliding, 1000);
    }, [selectedMusic]);

    const changeMusicSliding = () => {
        let position = 0;

        if (!isNaN(audio.current.duration)) {
            position =
                audio.current.currentTime * (100 / audio.current.duration);

            trackSliderElement.current.value = position;
        }
    };

    var clicked = 0;

    return (
        <div className="globalBox">
            <img src={Waves} id="waves" />
            <img src={TopWaves} id="topWaves" />
            <div className="interface">
                <div className="playlistBtn">
                    <button
                        onClick={() => {
                            var tl = new TimelineMax();

                            if (clicked == 1) {
                                clicked = 0;
                                tl.to(".initialText", 0.7, {
                                    ease: Expo.easeOut,
                                    xPercent: 100,
                                })
                                    .to(".aroundPlaylistInterface", 0.7, {
                                        ease: Sine.easeOut,
                                        xPercent: 0,
                                    })
                                    .to(".playlistInterface", 0.4, {
                                        height: 550,
                                        ease: Power2.ease,
                                    });

                                document.querySelector(
                                    ".playlistBtn img"
                                ).src = OpenedPlaylist;

                                return;
                            }

                            clicked = 1;
                            tl.to(".playlistInterface", 0.5, {
                                height: 500,
                                ease: Power2.ease,
                            })
                                .to(".aroundPlaylistInterface", 0.5, {
                                    ease: Power2.easeInOut,
                                    xPercent: -155,
                                })
                                .to(".initialText", 0.7, {
                                    ease: Circ.easeOut,
                                    xPercent: -200,
                                });

                            document.querySelector(
                                ".playlistBtn img"
                            ).src = Playlisticon;
                        }}
                    >
                        <img src={OpenedPlaylist} />
                    </button>
                </div>
                <div className="musicImg">
                    <img src={selectedMusic.imgPath} />
                </div>
                <audio
                    onDurationChange={(e) => {
                        totalTiming.current.innerHTML =
                            parseInt((audio.current.duration / 60) % 60) +
                            ":" +
                            parseInt(audio.current.duration % 60);
                    }}
                    onEnded={() => {
                        if (
                            arrayIndex ==
                            playlistInterface.current.childNodes.length - 1
                        ) {
                            console.log(
                                "Limpando intervalo... Cancelando próxima música."
                            );
                            clearInterval(timer);
                            return;
                        } else {
                            arrayIndex++;
                            setSelectedMusic(tracks[arrayIndex]);
                        }
                    }}
                    onTimeUpdate={(e) => {
                        var s = parseInt(e.target.currentTime % 60);
                        var m = parseInt((e.target.currentTime / 60) % 60);
                        currentTiming.current.innerHTML = m + ":" + s;
                    }}
                    ref={audio}
                    src={selectedMusic.songPath}
                ></audio>
                <div className="info">
                    <h3>
                        <h3>{selectedMusic.name}</h3>
                    </h3>
                    <h4>{selectedMusic.autor} </h4>
                </div>
                <div className="slider">
                    <input
                        onChange={(e) => {
                            e.preventDefault();
                            var sliderPosition =
                                audio.current.duration * (e.target.value / 100);

                            if (sliderPosition == audio.current.duration) {
                                console.log("ta igual");
                            }
                            audio.current.currentTime = sliderPosition;
                        }}
                        max="100"
                        min="0"
                        type="range"
                        name="slider"
                        id="slider"
                        ref={trackSliderElement}
                    />
                    <div>
                        <p ref={currentTiming}></p>
                        <p ref={totalTiming}></p>
                    </div>
                </div>

                <div className="controls">
                    <button
                        onClick={(e) => {
                            if (audio.current.loop) {
                                audio.current.loop = false;
                                e.currentTarget.childNodes[0].style.transform =
                                    "rotateZ(0deg)";
                                return;
                            }

                            e.currentTarget.childNodes[0].style.transform =
                                "rotateZ(-90deg)";
                            audio.current.loop = true;
                        }}
                    >
                        <img src={Repeat} />
                    </button>
                    <button
                        onClick={() => {
                            if (arrayIndex == 0) {
                                return;
                            }

                            arrayIndex--;
                            setSelectedMusic(tracks[arrayIndex]);
                        }}
                    >
                        <img src={Previous} />
                    </button>
                    <button
                        onClick={(e) => {
                            if (!audio.current.paused) {
                                audio.current.pause();
                                e.currentTarget.childNodes[0].src = Play;
                                return;
                            }

                            e.currentTarget.childNodes[0].src = Pause;
                            audio.current.play();

                            totalTiming.current.innerHTML =
                                parseInt((audio.current.duration / 60) % 60) +
                                ":" +
                                parseInt(audio.current.duration % 60);
                        }}
                    >
                        <img src={Play} ref={playSvg} />
                    </button>
                    <button
                        onClick={() => {
                            if (arrayIndex == tracks.length - 1) {
                                return;
                            }

                            arrayIndex++;
                            setSelectedMusic(tracks[arrayIndex]);
                        }}
                    >
                        <img src={Next} />
                    </button>
                    <button
                        onClick={(e) => {
                            if (audio.current.volume == 0) {
                                audio.current.volume = 0.2;
                                volumeSlider.current.value = 20;
                                e.currentTarget.childNodes[0].src = Volume;
                                return;
                            }

                            audio.current.volume = 0;
                            volumeSlider.current.value = 0;
                            e.currentTarget.childNodes[0].src = NoVolume;
                        }}
                    >
                        <img src={Volume} />
                    </button>
                    <input
                        ref={volumeSlider}
                        type="range"
                        name="vol"
                        id="vol"
                        max="100"
                        min="0"
                        onChange={(e) => {
                            audio.current.volume = e.target.value / 100;
                        }}
                    />
                </div>
            </div>

            <div className="aroundPlaylistInterface">
                <div className="title">
                    <h4>Playlist</h4>
                </div>

                <div className="playlistInterface" ref={playlistInterface}>
                    {tracks.map((item) => {
                        return (
                            <div
                                className="trackListed"
                                onClick={(e) => {
                                    const index = [
                                        ...e.currentTarget.parentNode
                                            .childNodes,
                                    ].indexOf(e.currentTarget);

                                    arrayIndex = index;
                                    setSelectedMusic(item);
                                }}
                            >
                                <div className="trackImg">
                                    <img src={item.imgPath} />
                                </div>
                                <div className="trackInfo">
                                    <h4>{item.name}</h4>
                                    <p>{item.autor}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="initialText">
                <h1>Download Now</h1>
                <p>Amazing, fast, beautiful, light.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                <h3>
                    Enjoy <span>Grubbles</span>!
                </h3>

                <div className="badges">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1280px-Google_Play_Store_badge_EN.svg.png" />
                </div>
            </div>
        </div>
    );
}

export default App;

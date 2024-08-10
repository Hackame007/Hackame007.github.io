let curr_index = 0
let songs = []
let song_name = []
let audio = new Audio()
let curr_time = null
let curr_folder = "love"

async function getSongs(folder) {
    let a = await fetch(`https://github.com/Hackame007/Hackame007.github.io/songs/${folder}`)
    let resp = await a.text();
    let div = document.createElement("div")
    div.innerHTML = resp
    let att = div.getElementsByTagName("a")
    let lib = document.querySelector(".lib_content")
    lib.innerHTML=""
    songs=[]
    song_name=[]
    curr_index=0
    curr_time=0

    for (let i = 0; i < att.length; i++) {
        const e = att[i];
        if (e.innerHTML.endsWith(".mp3")) {
            songs.push(e.href)
            e.innerHTML = e.innerHTML.replace('.mp3', '')
            song_name.push(e.innerHTML)
            lib.innerHTML = lib.innerHTML + `<div class="song_dtls flex align">
                <div class="flex item align">
                    <img width="30px" height="30px" src="assets/song.svg" alt="sng">
                    ${e.innerHTML.split('-')[0]} <br> ${e.innerHTML.split('-')[1]}
                    </div>
                    <img class="ply_btn" width="30px" height="30px" src="assets/play2.svg" alt="ply">
                    </div>`
        }
    }

    return songs
}


function play() {
    if (songs.length > 0) {
        audio.src = songs[curr_index]
        audio.currentTime = curr_time
        audio.play()
        // document.querySelector(".ply").style.display = "none";
        // document.querySelector(".pause").style.display = "inline";
        document.querySelector(".play_pause").src = "assets/playbar/pause.svg"
        let info = document.querySelector(".info")
        let curr_song = song_name[curr_index]
        info.innerHTML = `${curr_song.split("-")[0]} <br> ${curr_song.split("-")[1]}`

    }
}

function pause() {
    curr_time = audio.currentTime
    audio.pause()
    // document.querySelector(".ply").style.display = "inline";
    // document.querySelector(".pause").style.display = "none";
    document.querySelector(".play_pause").src = "assets/playbar/play.svg"
}

async function prev() {
    document.querySelector(".circle").style.left = 0
    if (curr_index == 0) {
        curr_index = songs.length - 1
    }
    else {
        curr_index = (curr_index - 1) % songs.length
    }
    curr_time = 0
    play()
}

async function nxt() {
    document.querySelector(".circle").style.left = 0
    curr_index = (curr_index + 1) % songs.length
    curr_time = 0
    play()
}

async function display_albums() {
    let a = await fetch(`https://github.com/Hackame007/Hackame007.github.io/songs`)
    let resp = await a.text();
    let div = document.createElement("div")
    div.innerHTML = resp
    let alb = div.getElementsByTagName("a")
    let arr = Array.from(alb)
    for (let index = 0; index < arr.length; index++) {
        const e=arr[index]
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`https://github.com/Hackame007/Hackame007.github.io/songs/${folder}/info.json`)
            let resp = await a.json()
            let card_cant = document.querySelector(".collection")
            card_cant.innerHTML+= `<div data-folder= ${folder} class="card">
                            <img class="card_img" src="/songs/${folder}/cover.jpg" alt="">
                            <div class="play">
                                <img src="assets/play.svg" alt="play">
                            </div>
                            <h2>${resp.title}</h2>
                            <p>${resp.desc}</p>
                        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (card) => {
            curr_folder = card.currentTarget.dataset.folder
            songs = await getSongs(curr_folder)
            play()
        })
    })
}


document.addEventListener("DOMContentLoaded", async () => {
    // alert("This is a spotify clone project and hence some options may not be available,Enjoy Listening!")
    songs = await getSongs(curr_folder);

    let info = document.querySelector(".info")
    let curr_song = song_name[curr_index]
    info.innerHTML = `${curr_song.split("-")[0]} <br> ${curr_song.split("-")[1]}`

    display_albums()

    document.querySelector(".ply").addEventListener("click",
        () => {
            if (audio.paused) {
                play()
            }
            else {
                pause()
            }
        }
    );
    // document.querySelector(".pause").addEventListener("click", pause);
    document.querySelector(".nxt").addEventListener("click", nxt);
    document.querySelector(".prev").addEventListener("click", prev);

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        document.querySelector(".duration").innerHTML = `${Math.floor(duration / 60)}:${Math.ceil(duration % 60)}`
    });

    audio.addEventListener("timeupdate", () => {
        let curr_time = audio.currentTime
        let duration = audio.duration
        document.querySelector(".curr_time").innerHTML = `${Math.floor(curr_time / 60)}:${Math.ceil(curr_time % 60)}`
        document.querySelector(".circle").style.left = (curr_time / duration) * 100 + "%"
    })

    let card = document.querySelectorAll(".song_dtls")
    card.forEach((element, index) => {
        card[index].addEventListener("click", () => {
            curr_index = index
            play()
        })
    })

    document.querySelector('.seekbar').addEventListener("click", x => {
        let duration = audio.duration
        document.querySelector(".circle").style.left = (x.offsetX / x.target.getBoundingClientRect().width) * 100 + "%"
        let seek_time = ((x.offsetX / x.target.getBoundingClientRect().width)) * duration
        audio.currentTime = seek_time
    })

    audio.addEventListener("ended", nxt)

    document.querySelector(".ham_bug").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%"
    })

    document.querySelector(".vol_range").addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100
        if (e.target.value == 0) {
            document.querySelector(".vol_img").src = "assets/vol3.svg"
        }

        else if (e.target.value > 0 && e.target.value < 50) {
            document.querySelector(".vol_img").src = "assets/vol2.svg"
        }

        else {
            document.querySelector(".vol_img").src = "assets/vol1.svg"
        }
    })
})

export default {
    methods: {
        playClickBgm() {
            console.log(1111223)
            let btnAudio = document.getElementById("btnAudio");
            if (btnAudio) { document.removeChild(btnAudio) }
            let x = document.createElement("AUDIO");
            x.id = "btnAudio";
            x.setAttribute("src", "assets/audio/btn.wav");
            document.body.appendChild(x);
            x.onplay();
        },
        playReapBgm() {
            let btnAudio = document.getElementById("btnAudioReap");
            if (btnAudio) { document.removeChild(btnAudio) }
            let x = document.createElement("AUDIO");
            x.id = "btnAudioReap";
            x.setAttribute("src", "assets/audio/reap.wav");
            document.body.appendChild(x);
            x.onplay();
        }
    }
};
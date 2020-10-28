import audioCilckFile from "assets/audio/btn.wav";
import audioReapFile from "assets/audio/reap.wav";
export default {
    methods: {
        jumpLocal (url, query) {
            const { href } = this.$router.resolve({
                path: url,
                query: query
            });
            window.open(href, "_blank");
        },
        jumpOther (url, query) {
            if (!url) return;
            var param = "";
            if (query) {
                for (var i in query) {
                    if (param) {
                        param = param + "&" + i + "=" + query[i];
                    }
                    else {
                        param = i + "=" + query[i];
                    }
                }
            }
            if (param) {
                url = url + "?" + param;
            }
            window.open(url, "_blank");
        },
        playClickBgm () {
            try {
                const isCloseAudio = sessionStorage.getItem("isCloseAudio");
                if (isCloseAudio == "1") return;
                let btnAudio = document.getElementById("btnAudio");
                if (btnAudio) { btnAudio.parentNode.removeChild(btnAudio) }
                let x = document.createElement("AUDIO");
                x.id = "btnAudio";
                x.setAttribute("src", audioCilckFile);
                document.body.appendChild(x);
                x.play();
            } catch (e) {
                console.log(e)

            }
        },
        playReapBgm () {
            try {
                const isCloseAudio = sessionStorage.getItem("isCloseAudio");
                if (isCloseAudio == "1") return;
                let btnAudio = document.getElementById("btnAudioReap");
                if (btnAudio) { btnAudio.parentNode.removeChild(btnAudio) }
                let x = document.createElement("AUDIO");
                x.id = "btnAudioReap";
                x.setAttribute("src", audioReapFile);
                document.body.appendChild(x);
                x.play();
            } catch (e) {
                console.log(e)

            }
        }
    },
}
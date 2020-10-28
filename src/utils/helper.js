export const dateFormat = (date) => {
    if (date) {
        var time = new Date(date);
        var Y = time.getFullYear();
        var M = time.getMonth() + 1;
        var D = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var ss = time.getSeconds();
        if (M < 10) M = "0" + M;
        if (D < 10) D = "0" + D;
        if (h < 10) h = "0" + h;
        if (mm < 10) mm = "0" + mm;
        if(ss < 10) ss = "0" + ss;
		if(ss == 60) ss = "00";
        return Y + "-" + M + "-" + D + " " + h + ":" + mm + ":" + ss;
    } else {
        return '0000-00-00 00:00';
    }
}
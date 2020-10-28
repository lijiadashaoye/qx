import Vue from 'vue';
import moment from 'moment';
Vue.filter('formatTime',function(dataTimeStamp){
	return moment(dataTimeStamp).format("YYYY-MM-DD HH:mm:ss")
})
//将时间戳转换成多少时间前（分、小时、天、月）
Vue.filter("toTimes", function (dateTimeStamp) {
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if (diffValue < 0) { return; }
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	var result = "";
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	}
	else if (weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	}
	else if (dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	}
	else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	}
	else if (minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else
		result = "刚刚";
	return result;
}
);

//将时间戳转换成时长（11：20：33）
Vue.filter("toTimeLocl", function (t) {
	if (t && t > 0) {
		var hour = Math.floor(t / 60 / 60 % 24);
		var min = Math.floor(t / 60 % 60);
		var sec = Math.floor(t % 60);
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (sec < 10) {
			sec = "0" + sec;
		}
		return t = hour + ":" + min + ":" + sec;
	} else {
		return t = '00' + ":" + '00' + ":" + '00';
	}

});

//将时间戳转换成日期,时间 MM-dd hh:mm
Vue.filter("toDayTime", function (nS) {
	if (nS) {
		var time = new Date(nS);
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		if (isNaN(m)) return "--";
		if (m < 10) m = "0" + m;
		if (d < 10) d = "0" + d;
		if (h < 10) h = "0" + h;
		if (mm < 10) mm = "0" + mm;
		return m + "-" + d + " " + h + ":" + mm;
	} else {
		return '00' + "-" + '00' + ' ' + '00' + ':' + '00';
	}
})
//转换成时分
Vue.filter("countOne",function(nS) {
	if(nS){
		var secondTime = parseInt(nS);// 秒
	        if(secondTime > 60) {
				var days = parseInt(secondTime / 60 / 60 / 24); //计算剩余的天数
				var hours = parseInt(days * 24); //计算剩余的小时
				var minuteTime = parseInt(secondTime  / 60 % 60);//计算剩余的分钟
				var second = parseInt(secondTime  % 60);//计算剩余的秒数
				if(minuteTime < 10)
				{	
					minuteTime = "0" + minuteTime;
				}
				if(second < 10)
				{	
					second = "0" + second;
				}
	        }
		return hours;
	}else{
		return '00';
	}
})
Vue.filter("countTwo",function(nS) {
	if(nS){
		var secondTime = parseInt(nS);// 秒
	        if(secondTime > 60) {
				var days = parseInt(secondTime / 60 / 60 / 24); //计算剩余的天数
				var hours = parseInt(days * 24); //计算剩余的小时
				var minuteTime = parseInt(secondTime  / 60 % 60);//计算剩余的分钟
				var second = parseInt(secondTime  % 60);//计算剩余的秒数
				if(minuteTime < 10)
				{	
					minuteTime = "0" + minuteTime;
				}
				if(second < 10)
				{	
					second = "0" + second;
				}
	        }
		return minuteTime;
	}else{
		return '00';
	}
})
Vue.filter("countThree",function(nS) {
	if(nS){
		var secondTime = parseInt(nS);// 秒
	        if(secondTime > 60) {
				var days = parseInt(secondTime / 60 / 60 / 24); //计算剩余的天数
				var hours = parseInt(days * 24); //计算剩余的小时
				var minuteTime = parseInt(secondTime  / 60 % 60);//计算剩余的分钟
				var second = parseInt(secondTime  % 60);//计算剩余的秒数
				if(minuteTime < 10)
				{	
					minuteTime = "0" + minuteTime;
				}
				if(second < 10)
				{	
					second = "0" + second;
				}
	        }
		return second;
	}else{
		return '00';
	}
})
//将时间转换为时间 hh:mm:ss
Vue.filter("toTime", function (t) {
	var hour = Math.floor(t / 60 / 60 % 24);
	var min = Math.floor(t / 60 % 60);
	var sec = t % 60;
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	var timeStr = hour + ":" + min + ":" + sec;
	return timeStr;
})
//将时间转换为日期 yyyy-MM-dd
Vue.filter("toDay", function (nS) {
	if (nS) {
		var time = new Date(nS);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		if (isNaN(y)) return "--";
		return y + '-' + m + '-' + d
	} else {
		return '--';
	}
})
//日期格式1970-01-18 23:30:21
Vue.filter("toBlockTime", function (nS) {
	if (nS) {
		var time = new Date(nS);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		if (isNaN(y)) return "--";
		if (m < 10) {
			m = "0" + m;
		}
		if (d < 10) {
			d = "0" + d;
		}
		if (h < 10) {
			h = "0" + h;
		}
		if (mm < 10) {
			mm = "0" + mm;
		}
		if (s < 10) {
			s = "0" + s;
		}
		if (s == 60) {
			s = "00"
		}
		return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s
	} else {
		return '--';
	}
})
//购买方式
Vue.filter("buyType", function (value) {
	if (value) {
		if (value == 1) {
			return '银行卡'
		}
		if (value == 2) {
			return '支付宝'
		}
		if (value == 3) {
			return '微信'
		}
	} else {
		return '--';
	}
})
//将utc格式转换为日期 yyyy-MM-dd
Vue.filter("utcToDate", function (value) {
	if (value) {
		var newDate = new Date(+new Date(value) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
		return newDate
	} else {
		return '--';
	}
})





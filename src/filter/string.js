import Vue from 'vue';
//将两个字符串通过 symbol 拼接一起
Vue.filter("stringSplicing", function (val1, val2, symbol = "/") {
    if (val1 && val2 && val1.trim() && val2.trim()) {
        return val1.trim() + symbol + val2.trim();
    }
    else {
        return val1 + val2;
    }
});

//信用分分值转译,带单位ß
Vue.filter("scoreUnit", function (val) {
    return Math.abs(val) + "分";
});

//信用分分值转译，绝对值
Vue.filter("scoreAbs", function (val) {
    return Math.abs(val);
});

//数据加中文圆括号
Vue.filter("stringParentheses", function (val) {
    if (val && val.trim()) {
        return "（" + val.trim() + "）";
    }
    else {
        return "";
    }
});
//上链状态
Vue.filter("txStatusString", function (value) {
    if(value){
        if(value==1){
            return '上链中'
        }
        if(value==2){
            return '上链失败'
        }
        if(value==3){
            return '已上链'
        }
    }else{
        return '未上链'
    }
});
//字符串长度不大于n，n>4,多余加****
Vue.filter("nameLeng", function (val, n) {
    if (val && val.trim() && val.length > n) {
        let leng = Math.floor(n / 2) - 1;
        return val.slice(0, leng) + "***" + val.slice(val.length - leng, val.length);
    }
    else {
        return val;
    }
});
Vue.filter("toString", function (val, n) {
    if(val.length>0){
        let val_ = val.map(item=>{
            return item.name
        })
        return val_.length>1?val_[0]+'...'+val_[val_.length-1]:val_[0]
        
    }else{
        return '--'
    }
});
//逗号隔开
Vue.filter("money",function(money) {
    if(money && money != -1)
    {
       money = String(money);
       var temp = money.split('').reverse().join('').match(/(\d{1,3})/g);
       return temp.join(',').split('').reverse().join('');
   }
    else if(money === 0)
    {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
       return '0';
   }else if(money == -1){
       return "∞"
   }
})
Vue.filter("dataChuli",function(value) {
    if(value){
        if(value == 'userManagement'){
            return '用户管理 > '
        }
        if(value == 'activeList'){
            return '活动列表 > '
        }
        if(value == 'opinion'){
            return '意见反馈 > '
        }
    }
})
//上链状态
Vue.filter("txStateEnum",function(value) {
    if(value){
        return '完成'
    }else{
        return '未完成'
    }
})
Vue.filter("listState",function(value) {
    if(value){
        if(value == 1){
            return '上架'
        }else{
            return '下架'
        }
    }
})
//运营状态
Vue.filter("roleSate",function(value) {
    if(value){
        if(value == 1){
            return '已启用'
        }else{
            return '已停用'
        }
    }else{
        return '--'
    }
})

Vue.filter("yijiLink",function(value) {
    if(value){
        if(value == 'accountManagement' || value == 'accountList'){
            return '成员管理'
        }else if(value == 'department' || value == 'departmentList'){
            return '组织架构 '
        }else if(value == 'certificateManagement' || value == 'cerfityLook' || value == 'issueCertificate' || value == 'batchIssue'){
            return '证书管理'
        }else if(value == 'templateManagement' || value == 'templateEdit' || value == 'templateAdd'|| value == 'templateHistory'){
            return '模板管理'
        }else if(value == 'permission'){
            return '成员管理'
        }else{
            return ''
        }
    }else{
        return ''
    }
})

Vue.filter("erjiLink",function(value) {
    if(value){
        if(value == 'userDetail'){
            return '> 用户详情'
        }else if(value == 'cerfityLook' ){
            return '> 查看'
        }else if(value == 'issueCertificate' ){
            return '> 颁发证书'
        }else if(value == 'userMessageDetail' || value == 'productDetail' || value == 'templateDetail'){
            return '> 查看详情'
        }else if(value == 'templateEdit'){
            return '> 模板编辑'
        }else if(value == 'templateAdd'){
            return '> 新建模板'
        }else if(value == 'templateHistory'){
            return '> 查看历史模板'
        }else if(value == 'accountList'){
            return '> 成员列表'
        }
        else if(value == 'departmentList'){
            return '> 组织架构列表'
        }
        else if(value == 'permission'){
            return '> 设置权限'
        }else if(value == 'batchIssue'){
            return '> 批量颁发'
        }else{
            return ''
        }
    }else{
        return ''
    }
})
//字符串超过长度变成省略号显示
Vue.filter("stringLeng",function(value,leng) {
	if(value)
	{
		if(leng&&value.length>parseInt(leng))
		{
			return value.substring(0,parseInt(leng))+"...";
		}
		else
		{
			
			return value;
		}
	}
	else
	{
		return "";
	}
})

Vue.filter("uploadStatus",function(value) {
	if(value)
	{
		if(value == 1){
            return '成功'
        }else{
            return '失败'
        }
        
	}
	else
	{
		return "--";
	}
})

Vue.filter("userStatus",function(value) {
	if(value)
	{
		if(value == 1){
            return '已激活'
        }else{
            return '未激活'
        }
        
	}
	else
	{
		return "--";
	}
})
Vue.filter("to10",function(value) {
	if(value)
	{
		return parseInt(value,16);
        
	}
	else
	{
		return "--";
	}
})
Vue.filter('navString',(value)=>{
    if(value.parentDeps){
      let string = value.parentDeps.map(item=>{return item.name}).join('-')
      return string;
    }else{
        return value.name
    }
})
Vue.filter("num",function(value) {
	if(!value && value!=0)
	{
		return "--"
        
	}
	else
	{
		return Number(value);
	}
})


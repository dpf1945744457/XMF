/*
*获取今日的起始和结束时间
*返回值："起始时间,结束时间"
*/
export function ToDayStr() {
    var returnStr = "";
    var date = new Date();      //当前时间
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    returnStr = year + "-" + month + "-" + day + " 00:00:00,";       //起始时间
    returnStr += year + "-" + month + "-" + day + " 23:59:59";      //结束时间
    return returnStr;
}

/*
*获取昨日的起始和结束时间
*返回值："起始时间,结束时间"
*/
export function YesterDayStr() {
    var date = GetDate(1, 1);       //当前时间前一天
    var returnStr = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    returnStr = year + "-" + month + "-" + day + " 00:00:00,";       //起始时间
    returnStr += year + "-" + month + "-" + day + " 23:59:59";      //结束时间
    return returnStr;
}
/*
*获取当前日期前N天或后N日期(N = day)
*type:1：前；2：后
*/
export function GetDate(day, type) {
    var zdate = new Date();
    var edate;
    if (type === 1) {
        edate = new Date(zdate.getTime() - (day * 24 * 60 * 60 * 1000));
    } else {
        edate = new Date(zdate.getTime() + (day * 24 * 60 * 60 * 1000));
    }
    return edate;
}
/*
*获取传入的日期前N天或后N日期(N = day)
*type:1：前；2：后
*date：传入的日期
*/
export function GetDate2(day, type, date) {
    var zdate;
    if (date === null || date === undefined) {
        zdate = new Date();
    } else {
        zdate = date;
    }
    var edate;
    if (type === 1) {
        edate = new Date(zdate.getTime() - (day * 24 * 60 * 60 * 1000));
    } else {
        edate = new Date(zdate.getTime() + (day * 24 * 60 * 60 * 1000));
    }
    return edate;
}
/*
*获取本周的起始和结束时间
*返回值："起始时间,结束时间"
*/
export function ThisWeekStr() {
    var returnStr = "";
    var date = new Date();      //当前时间
    var week = date.getDay();   //获取今天星期几
    var monday = GetDate2(week - 1, 1, date);      //获取星期一
    var sunday = GetDate2(7 - week, 2, date);   //获取星期天
    //起始时间的年月日
    var year1 = monday.getFullYear();
    var month1 = monday.getMonth() + 1;
    var day1 = monday.getDate();
    //结束时间的年月日
    var year2 = sunday.getFullYear();
    var month2 = sunday.getMonth() + 1;
    var day2 = sunday.getDate();
    //处理起始时间小于10的追加"0"在前面
    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;
    //处理结束时间小于10的追加"0"在前面
    month2 = month2 < 10 ? "0" + month2 : month2;
    day2 = day2 < 10 ? "0" + day2 : day2;

    returnStr = year1 + "-" + month1 + "-" + day1 + " 00:00:00,";       //起始时间
    returnStr += year2 + "-" + month2 + "-" + day2 + " 23:59:59";      //结束时间
    return returnStr;
}
/*
*获取上周的起始和结束时间
*返回值："起始时间,结束时间"
*/
export function LastWeekStr() {
    var returnStr = "";
    var date = new Date();      //当前时间
    var week = date.getDay();   //获取今天星期几
    var monday = GetDate2(week + 6, 1, date);      //获取上周星期一
    var sunday = GetDate2(week, 1, date);          //获取上周星期天
    //起始时间的年月日
    var year1 = monday.getFullYear();
    var month1 = monday.getMonth() + 1;
    var day1 = monday.getDate();
    //结束时间的年月日
    var year2 = sunday.getFullYear();
    var month2 = sunday.getMonth() + 1;
    var day2 = sunday.getDate();
    //处理起始时间小于10的追加"0"在前面
    month1 = month1 < 10 ? "0" + month1 : month1;
    day1 = day1 < 10 ? "0" + day1 : day1;
    //处理结束时间小于10的追加"0"在前面
    month2 = month2 < 10 ? "0" + month2 : month2;
    day2 = day2 < 10 ? "0" + day2 : day2;

    returnStr = year1 + "-" + month1 + "-" + day1 + " 00:00:00,";       //起始时间
    returnStr += year2 + "-" + month2 + "-" + day2 + " 23:59:59";      //结束时间
    return returnStr;
}



export function getLastMonth() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;//0-11表示1-12月
    var day = now.getDate();
    var dateObj = {};
    dateObj.now = year + '-' + month + '-' + day + " 23:59:59"; 
    var nowMonthDay = new Date(year, month, 0).getDate();    //当前月的总天数
    if(month - 1 <= 0){ //如果是1月，年数往前推一年<br>　　　　 
        dateObj.last = (year - 1) + '-' + 12 + '-' + day;
    }else{
        var lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate();  
        if(lastMonthDay < day){    //1个月前所在月的总天数小于现在的天日期
            if(day < nowMonthDay){        //当前天日期小于当前月总天数
                dateObj.last = year + '-' + (month - 1) + '-' + (lastMonthDay - (nowMonthDay - day))+ " 00:00:00";
            }else{
                dateObj.last = year + '-' + (month - 1) + '-' + lastMonthDay+ " 00:00:00";
            }
        }else{
            dateObj.last = year + '-' + (month - 1) + '-' + day+ " 00:00:00";
        }
    }
    return dateObj;
}
export function getLastWeek() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;//0-11表示1-12月
    var day = now.getDate();
    var dateObj = {};
    dateObj.now = year + '-' + month + '-' + day + " 23:59:59";
    if(day - 7 <= 0){   //如果在当月7日之前
        var lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate();    //1周前所在月的总天数
        if(month - 1 <= 0){ //如果在当年的1月份
            dateObj.last = (year - 1) + '-' + 12 + '-' + (31 - (7 - day))+ " 00:00:00";
        }else{
            dateObj.last = year + '-' + (month - 1) + '-' + (lastMonthDay - (7 - day))+ " 00:00:00";
        }
    }else{
        dateObj.last = year + '-' + month + '-' + (day -7)+ " 00:00:00";
    }
    return dateObj;
}
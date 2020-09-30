function initDate(date) {
    var str = "日一二三四五六" ;
    year = date.getFullYear() ;
    month = date.getMonth() + 1 ;
    day = date.getDate() ;
    hour = date.getHours() ;
    minute = date.getMinutes() ;
    seconds = date.getSeconds() ;
    week = str.charAt(date.getDay()) ;
    var result = "" ;
    result += year + "-" ;
    result += (month<10 ? "0"+ month : month) + "-" ;
    result += (day < 10 ? "0"+day : day) + " " ;
    result += (hour < 10 ? "0"+hour : hour) + ":" ;
    result += (minute < 10 ? "0"+minute : minute) + ":" ;
    result += seconds < 10 ? "0" + seconds : seconds ;
    result += " 星期" + week;
    return result ;
}
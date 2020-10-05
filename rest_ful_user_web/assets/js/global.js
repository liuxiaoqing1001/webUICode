var serverPath = "http://localhost:8090/";



function checkPwd(pwd) {
    //密码
    var reg = /^[\d\w]{6,12}$/;
    if (!reg.test(pwd)) {
        return false ;
    }
    return true ;
}

// 绘制验证码
var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z'
];
var colors = [];  // "verifyCanvas"
function drawCode(canvasId , validatorLen) {
    var canvas = document.getElementById(canvasId); //获取HTML端画布
    var context = canvas.getContext("2d"); //获取画布2D上下文
    context.fillStyle = "cornflowerblue"; //画布填充色
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 创建渐变
    var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    //清空画布
    context.fillStyle = gradient; //设置字体颜色
    context.font = "25px Arial"; //设置字体
    var rand = new Array();
    var x = new Array();
    var y = new Array();
    for (var i = 0; i < validatorLen; i++) {
        rand[i] = nums[Math.floor(Math.random() * nums.length)]
        x[i] = i * 16 + 10;
        y[i] = Math.random() * 20 + 20;
        context.fillText(rand[i], x[i], y[i]);
    }
    console.log(rand);
    //画3条随机线
    for (var i = 0; i < 3; i++) {
        drawline(canvas, context);
    }

    // 画30个随机点
    for (var i = 0; i < 30; i++) {
        drawDot(canvas, context);
    }
    convertCanvasToImage(canvas);
    return rand.join('');
}

// 随机线
function drawline(canvas, context) {
    context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
    context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
    context.lineWidth = 0.5; //随机线宽
    context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
    context.stroke(); //描边，即起点描到终点
}
// 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
function drawDot(canvas, context) {
    var px = Math.floor(Math.random() * canvas.width);
    var py = Math.floor(Math.random() * canvas.height);
    context.moveTo(px, py);
    context.lineTo(px + 1, py + 1);
    context.lineWidth = 0.2;
    context.stroke();
}

// 日期事件
function parseTwo(numStr) {
    numStr = parseInt(numStr) ;
    return numStr < 10 ? "0" + numStr : numStr ;
}
function getDateStr(date) {
    date = new Date(date) ;
    var week = "日一二三四五六" ;
    var str = date.getFullYear() + "年" +
        parseTwo(date.getMonth() +1) + "月" +
        parseTwo(date.getDate()) + "日 " +
        parseTwo(date.getHours()) + ":" +
        parseTwo(date.getMinutes()) + ":" +
        parseTwo(date.getSeconds()) +
        " 星期" + week.charAt(date.getDay());
    return str;
}
/**
 * 文件上传插件
 * @param tagId     文件域<input type="file"  id="?"/>
 * @param uploadUrl     上传图片url
 * @param uploadModalId 上传图片模态框id
 * @param showImgId     上传后显示图片<img id="?" />
 */
var PhotoInput = function() {
    var oFile = new Object() ;
    oFile.init = function (tagId, uploadUrl, uploadModalId, showImgId) {
        var tag = $("#" + tagId);
        console.log(tag) ;
        tag.fileinput({
            language: 'zh', //设置语言
            uploadUrl: uploadUrl, //上传的地址
            allowedFileExtensions: ['jpg', 'png', 'gif'],
            maxFileSize: 2048,			// 以kb为单位
            maxFilesNum: 1,

            showUpload: true, //是否显示上传按钮
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式
            enctype: 'multipart/form-data',
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        });

        tag.on("fileuploaded", function (event, data, previewId, index) {
            $("#" + uploadModalId).modal("hide");
            var responseData = data.response;
            if (responseData.errCode === 0) {
                bootbox.alert('上传成功');
                // 清除文件上传预览框
                $(event.target).fileinput('clear');
                // 刷新图片
                $("#" + showImgId).attr('src', responseData.data)
            }
        }).on("fileerror", function (event, data, msg) {
            console.log(msg);
        });
    }
    return oFile ;
}




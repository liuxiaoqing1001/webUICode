var parentDom = window.opener.document ;
console.log(parentDom) ;
var imgs = new Array();
function sendFile($summernote ,file) {
    var formData = new FormData();
    formData.append("file",file) ;
    $.ajax({
        type : 'post' ,
        url : serverPath + "activities/uploadImg" ,
        data : formData ,
        //如果提交data是FormData类型，那么下面三句一定需要加上
        cache : false ,
        processData : false,
        contentType : false ,
        success : function (data) {
            console.log(data) ;
            if(data.errCode == 0) {
                $('#editor').summernote('insertImage', data.data);  //直接插入路径就行，filename可选
                imgs.push(data.data.substr(data.data.lastIndexOf('/') + 1)) ;
            } else {
                bootbox.alert('图片插入失败！') ;
            }
        } ,
        error : function (data) {
            bootbox.alert('上传失败') ;
        }
    })
}
$(function(){
    $summernote = $("#editor").summernote({
        lang : 'zh-CN' ,
        height:300,
        toolbar : [
            <!--字体工具-->
            ['fontname', ['fontname']], //字体系列
            ['style', ['bold', 'italic', 'underline', 'clear']], // 字体粗体、字体斜体、字体下划线、字体格式清除
            ['font', ['strikethrough', 'superscript', 'subscript']], //字体划线、字体上标、字体下标
            ['fontsize', ['fontsize']], //字体大小
            ['color', ['color']], //字体颜色

            <!--段落工具-->
            // ['style', ['style']],//样式
            // ['para', ['ul', 'ol', 'paragraph']], //无序列表、有序列表、段落对齐方式
            // ['height', ['height']], //行高

            <!--插入工具-->
            ['table',['table']], //插入表格
            ['hr',['hr']],//插入水平线
            ['link',['link']], //插入链接
            ['picture',['picture']], //插入图片
            // ['video',['video']], //插入视频

            <!--其它-->
            ['fullscreen',['fullscreen']], //全屏
            ['codeview',['codeview']], //查看html代码
            ['undo',['undo']], //撤销
            ['redo',['redo']], //取消撤销
            ['help',['help']], //帮助
        ],
        callbacks: {
            onImageUpload: function (files) {
                sendFile($summernote ,files[0]);
            },
        }
    }) ;
    // 添加按钮
    $("#btn_addSure").click(function(){
        var content = {
            title : $("#addForm input[name=title]").val() ,
            content : $("#editor").summernote('code') ,
            date : $("#addForm input[name=date]").val() ,
            imgs : imgs.join(',')
        };
        imgs.length = 0;
        $.post(
            serverPath + "activities/add" ,
            content ,
            function(data) {

                if(data.errCode == 0) {
                    bootbox.confirm('添加成功，是否继续？',function(data) {
                        if(data) {
                           reset();
                        } else {
                            var pTable = parentDom.getElementById("activitiesTable") ;
                            $(pTable).bootstrapTable('refresh') ;
                            window.close() ;
                        }
                    })
                } else {
                    bootbox.all(data.errMsg + ",稍后再试！") ;
                }

            }
        );
    }) ;
    $("#btn_addCancel").click(function(){
       reset();
    })
    $('#addDatetimepicker').datetimepicker({
        format: 'yyyy年mm月dd日',
        autoclose: true,
        minView:'month',
        maxView:'month',
        todayBtn : true ,
        language:'zh-CN'
    });
});

function reset() {
    $("#editor").summernote('code' , '')
    $("#addForm")[0].reset() ;
    imgs.length = 0;
}

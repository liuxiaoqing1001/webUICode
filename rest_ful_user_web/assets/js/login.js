var yzhm = '' ;
$(document).ready(function(){
    // 验证码
    yzhm = drawCode("verifyCanvas" , 4);
    // 点击图片换验证码
    $("#code_img").click(function(){
        changeYzhm();
    });

        $("#formLogin").bootstrapValidator({
            message : "登录信息填写不符合规则" ,
            feedbackIcons: {			// 图标设置
                valid: 'glyphicon glyphicon-ok',		// 合格
                invalid: 'glyphicon glyphicon-remove',	// 不合格
                validating: 'glyphicon glyphicon-refresh'	// 校验中，，，
            },
            fields : {
                verify : {
                    message : '验证码错误！' ,
                    validators : {
                        notEmpty : {
                            message : '验证码不能为空!'
                        },
                        callback : {
                            message : '验证码填写错误!' ,
                            callback : function(value , validator , $field) {
                                return value.toLowerCase()==yzhm.toLowerCase() ;
                            }
                        }
                    }
                } ,
                loginName : {
                    message: '用户名填写错误!' ,
                    validators : {
                        notEmpty : {
                            message : '用户名不能为空!'
                        } ,
                        stringLength : {
                            min : 3 ,
                            message : '用户名至少三个字符'
                        }
                    }
                } ,
                loginPass : {
                    message: '密码填写错误!' ,
                    validators : {
                        notEmpty : {
                            message : '密码不能为空!'
                        } ,
                        stringLength : {
                            min : 3,
                            max : 15,
                            message : '密码长度应该在3-15之间' ,
                        } ,
                        regexp: {
                            regexp: /^[\d\w]{3,15}$/,
                            message: '密码应该是3-15位之间数字和字母相结合'
                        }
                    }
                }
            }

        }).on('success.form.bv', function(e) {//点击提交之后
            // 阻止表单提交
            e.preventDefault();
            // 获取表单引用
            var $form = $(e.target);

            // 得到bootstrapvalidator实例
            var bv = $form.data('bootstrapValidator');

            // 使用Ajax提交表单并进行校验？？？？？？？？？？？？？？？？
            $.get(
                serverPath + 'user/' + $('#formLogin input[name="loginName"]').val() + '/' +  $('#formLogin input[name="loginPass"]').val() ,
                function(reqData) {
                    //console.log(reqData) ;
                    bootbox.alert(reqData.msg) ;
                    if(reqData.errCode == 0) {
                        sessionStorage.setItem("loginuser" , JSON.stringify(reqData.data)) ;
                        location.href = "indexSys.html" ;
                    } else {
                        $('#formLogin input[name="loginname"]').focus();
                    }
                }
            );

        });
        // End 表单校验

    // 表单的重置按钮绑定动作
    $("#btnLoginReset").click(function() {
        $("#formLogin").data("bootstrapValidator").resetForm();
        $("#formLogin")[0].reset();
        changeYzhm();
    }) ;
});

function changeYzhm() {
    $('#verifyCanvas').remove();
    $('#verify').after('<canvas width="100" height="40" id="verifyCanvas"></canvas>');
    yzhm=drawCode("verifyCanvas" , 4);
}



// 绘制图片
function convertCanvasToImage(canvas) {
    document.getElementById("verifyCanvas").style.display = "none";
    var image = document.getElementById("code_img");
    image.src = canvas.toDataURL("image/png");
    return image;
}



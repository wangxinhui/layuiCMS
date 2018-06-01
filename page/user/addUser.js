layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
        $(".token").val(localStorage.getItem("token"));
        $(".userid").val(0);
    if (getUrlParam("id")>0){
        $.ajax({
            url: "/api/sso/api/user/getUsers/"+getUrlParam("id"),
            type: "post",
            data:{token:localStorage.getItem("token")},
            dataType: "json",
            success: function (data) {
                $(".userid").val(data.data.user_id);
                $(".username").val(data.data.username);
                $(".realname").val(data.data.realname);
                $(".phone").val(data.data.phone);
                $(".useremail").val(data.data.email);
                $(".gender").val(data.data.gender);
            }
        })
    }

 	form.on("submit(addUser)",function(data){
        $.ajax({
            url: "/api/sso/api/user/save",
            type: "post",
            data: $(".layui-form").serialize(),
            dataType: "json",
            success: function (data) {

            }
        })
 		//弹出loading
 		var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            top.layer.close(index);
			top.layer.msg("用户添加成功！");
 			layer.closeAll("iframe");
	 		//刷新父页面
	 		parent.location.reload();
        },2000);
 		return false;
 	})

})

//格式化时间
function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    return year+"-"+month+"-"+day+" "+hour+":"+minute;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

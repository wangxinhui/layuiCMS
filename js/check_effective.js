/**
 * Created by Administrator on 2018/5/10.
 */
layui.define(function (exports) {
    var obj = {
        hello:function (str) {
            alert('Hello' + (str||'mymod'));
        }
    }
    exports('check_effective', obj);
})
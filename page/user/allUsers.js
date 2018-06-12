layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;


    var queryPara = {
        token: localStorage.getItem("token"),
        pages: 1,
        cont: 10,
    };

    pageQuery();

    function pageQuery() {
        $.ajax({
            url: "/api/sso/api/user/getAllUsers",
            type: "post",
            data: queryPara,
            dataType: "json",
            success: function (data) {
                var datas = data.data.users;
                var count = data.data.count;
                var dataHtml = '';
                if (datas.length != 0) {
                    for (var i = 0; i < datas.length; i++) {
                        dataHtml += '<tr>'
                            + '<td>' + (i + 1) + '</td>'
                            + '<td>' + datas[i].username + '</td>'
                            + '<td>' + datas[i].realname + '</td>'
                            + '<td>' + datas[i].phone + '</td>'
                            + '<td>' + datas[i].email + '</td>'
                            + '<td>' + (datas[i].gender == 1 ? '男' : '女') + '</td>'
                            + '<td>'
                            + '<a class="layui-btn layui-btn-mini users_edit" id="' + datas[i].user_id + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                            + '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="' + datas[i].usersId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
                            + '</td>'
                            + '</tr>';
                    }
                } else {
                    dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
                }
                $(".users_content").html(dataHtml);
                resetPage(count, queryPara.pages);
            }
        })
    }

    function resetPage(count, pageIndex) {
        var pages = count % queryPara.cont == 0 ? count / queryPara.cont : parseInt(count / queryPara.cont) + 1;
        laypage({
            cont: "page",
            pages: pages,
            curr: pageIndex,
            jump: function (obj, first) {
                if (!first) {
                    queryPara.pages = obj.curr;
                    pageQuery();
                }
            }
        })
    }

    //查询
    $(".search_btn").click(function () {
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', {icon: 16, time: false, shade: 0.8});
            setTimeout(function () {
                queryPara.username = $(".search_input").val();
                pageQuery();
                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加会员
    $(".usersAdd_btn").click(function () {
        var index = layui.layer.open({
            title: "添加会员",
            type: 2,
            content: "addUser.html?id=0",
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处返回会员列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function () {
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.users_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.users_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', {icon: 3, title: '提示信息'}, function (index) {
                var index = layer.msg('删除中，请稍候', {icon: 16, time: false, shade: 0.8});
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < usersData.length; i++) {
                            if (usersData[i].newsId == $checked.eq(j).parents("tr").find(".news_del").attr("data-id")) {
                                usersData.splice(i, 1);
                                usersList(usersData);
                            }
                        }
                    }
                    $('.users_list thead input[type="checkbox"]').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 2000);
            })
        } else {
            layer.msg("请选择需要删除的文章");
        }
    })

    //全选
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    //通过判断文章是否全部选中来确定全选按钮是否选中
    form.on("checkbox(choose)", function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
        if (childChecked.length == child.length) {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
        } else {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
        }
        form.render('checkbox');
    })

    //操作
    $("body").on("click", ".users_edit", function () {  //编辑
        var user_id = $(this).attr("id");
        var index = layui.layer.open({
            title: "添加会员",
            type: 2,
            content: "addUser.html?id=" + $(this).attr("id"),
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处返回会员列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            },
            end: function () {
                console.log("I have OK");
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function () {
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })

    $("body").on("click", ".users_del", function () {  //删除
        var _this = $(this);
        queryPara.user_id = _this.attr("data-id");
        layer.confirm('确定删除此用户？', {icon: 3, title: '提示信息'}, function (index) {
            $.ajax({
                url: "/api/sso/api/user/del",
                type: "post",
                data: queryPara,
                dataType: "json",
                success: function (data) {
                    if (data.meta.success) {
                        location.reload();
                    }else {
                        layer.msg("删除失败");
                    }
                }
            });
        });

    });
})
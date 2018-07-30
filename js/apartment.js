$(".datepicker").datepicker({
    format: "yyyy/mm/dd",
    changeMonth: true,
    changeYear: true
})

$(function () {
    // $("#mod").DataTable()

    var table = ''
    // data picker
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        changeMonth: true,
        changeYear: true
    });

   function selectorItem(){
        // $.ajax({
            // url: "/api/school/show_campus",
            // type: "POST",
            // success: (res) =>{
                // var html = `<option selected value="">- 请选择 -</option>`
                // $.each(res.data,function(index,item){
                    // html += `<option value="${item.id}">${item.xqmc}</option>`

                // })
                // $("#campus").html(html)
            // },
            // error: (err) =>{
                // console.log(err.statusText)
            // }
        // })
   }

   selectorItem()

    // 信息展示
   function show(){
        // $.ajax({
            // url: "/api/apartment/show",
            // type: "post",
            // contentType: "application/json",
            // success: (res) =>{
                // console.log(res)
                // var html = ""
                // $.each(res.data,function(index,item){
                    
                //     html += `<tr>
                //                 <td>
                //                 <input type="checkbox" name="" id="a1" class="selectItem" campus-id="${item.id}">
                //                 </td>
                //                 <td>${item.campus.xqmc}</td>
                //                 <td>${item.gymc}</td>
                //                 <td>${item.gylx}</td>
                //                 <td>${item.gybh}</td>
                //                 <td><span class="form">${item.htks}</span>~<span class="to">${item.htjs}</span></td>
                //                 <td>${item.sssl}</td>
                //                 <td>
                //                     <span class="del" schllo-id="${item.campus.id}" campus-id="${item.id}">删除</span> /
                //                     <span class="change" data-toggle="modal" data-target="#myModal" schllo-id="${item.campus.id}" campus-id="${item.id}">修改</span>
                //                 </td>
                //             </tr>`
                // })

                
                // $("#dataList").html(html)
                // 客户端排序和搜索
                // if( table ) table.destroy()
                // table = $("#mod").DataTable()
                // console.log(table)
                // if ( $.fn.dataTable.isDataTable( '#mod' ) ) {
                //     table = $('#mod').DataTable({destory: true});
                // }
                // else {
                //     table = $('#mod').DataTable( {
                //         destory: true
                //     } );
                // }
                

            // }
        // })
        var data = localStorage.getItem('data')
        data = JSON.parse(data)
        console.log(data)  
        var campusName = []
        data.apartment.forEach(function(item,index){
            data.campus.forEach(function(campus){
                if(campus.id == item.campusId){
                    campusName.push(campus.campusName)
                }
            })
                    }) 
        var html = ''  
        data.apartment.forEach(function(item,index){
            var itemDate = item.contractPeriod.split('~')
            html += `<tr>
                        <td>
                        <input type="checkbox" name="" id="a1" class="selectItem" campus-id="${item.id}">
                        </td>
                        <td>${campusName[index]}</td>
                        <td>${item.apartmentName}</td>
                        <td>${item.apartmentType}</td>
                        <td>${item.apartmentNo}</td>
                        <td><span class="form">${itemDate[0]}</span>~<span class="to">${itemDate[1]}</span></td>
                        <td>${item.dormitoryNumber}</td>
                        <td>
                            <span class="del" schllo-id="${item.campusId}" campus-id="${item.id}">删除</span> /
                            <span class="change" data-toggle="modal" data-target="#myModal" schllo-id="${item.campusId}" campus-id="${item.id}">修改</span>
                        </td>
                    </tr>`
        })
        $("#dataList").html(html)
        // if( table ) table.destroy()
        table = $("#mod").DataTable()
        // console.log(table)
        // if ( $.fn.dataTable.isDataTable( '#mod' ) ) {
        //     table = $('#mod').DataTable({destory: true});
        // }
        // else {
        //     table = $('#mod').DataTable( {
        //         destory: true
        //     } );
        // }
        html = ''

        $.each(data.campus,function(index,item){
            if(index == 0){
                html += ` <option value="${item.id}" >${item.campusName}</option>`
            }
            else
                html += `<option value="${item.id}" >${item.campusName}</option>`

        })
        $("#campus").html(html)
   }

   show()

    // 添加公寓
function add(obj){
    // console.log(JSON.stringify(obj))
    // $.ajax({
    //     url: "/api/apartment/add",
    //     type: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify(obj),
    //     success: (res) =>{
    //         console.log(res)
    //         show()
    //         // location.reload()
    //     },
    //     error: (err) =>{
    //         console.log(err.statusText)
    //     }
    // })
    var data = localStorage.getItem('data')
    data = JSON.parse(data)
    var id = data.apartment[0] ? data.apartment[0].id + 1 : 1 
    obj.id = id
    let contractPeriod = obj.contractBegin + '~' + obj.contractEnd;
    delete obj.contractBegin
    delete obj.contractEnd
    obj.contractPeriod = contractPeriod
    console.log(obj)
    data.apartment.unshift(obj)
    data = JSON.stringify(data)
    localStorage.setItem('data',data)
    location.reload()
}

    //添加公寓
    $(".add").on("click",function(){
        $(".btn-primary").attr("genre","add"); //点击提交按钮时设置标识 添加
        $(".pop").css({display:"none"});
        $("#myModalLabel").html("添加公寓");
        // $("#campus").val("北科");               //初始化模态框字段
        $("#schoolName").val("");
        $("#type").val("自有");
        $("#num").val("");
        $("#datepicker1").val("");
        $("#datepicker2").val("");
        $("#count").val("");

        
    })

    $(".btn-primary").off("click")
    $(".btn-primary").on("click",function(){
        option("add")
    });

    //修改公寓
    $(document).off("click",".change")
    $("body").on("click",".change",function(){
        $(".pop").css({display:"none"});
        $("#myModalLabel").html("修改公寓信息");

        var obj = {
            "id": $(this).attr('schllo-id'),
            "campusId": parseInt($("#campus").val()),
            "campus": $(this).parent().prevAll().eq(5).html(),//所属校区
            "schoolName": $(this).parent().prevAll().eq(4).html(),  //公寓名称
            "type": $(this).parent().prevAll().eq(3).html(), //公寓类型
            "num": $(this).parent().prevAll().eq(2).html(), //公寓编号
            "dataStart": $(this).parent().prevAll().eq(1).find(".form").html(), //租期
            "dataEnd": $(this).parent().prevAll().eq(1).find(".to").html(), //到期
            "count": $(this).parent().prev().html() //宿舍数量
        }

        // $.ajax({
        //     url: "/api/school/show_campus",
        //     type: "POST",
        //     success: (res) =>{
        //         var html = `<option selected value="">- 请选择 -</option>`
        //         $.each(res.data,function(index,item){
        //             html += `<option value="${item.id}">${item.xqmc}</option>`

        //         })
        //         $("#campus").html(html)
        //     },
        //     error: (err) =>{
        //         console.log(err.statusText)
        //     }
        // })
        console.log(obj)
        $("#campus").val(obj.campusId);               //初始化模态框字段
        $("#schoolName").val(obj.schoolName);
        $("#type").val(obj.type);
        $("#num").val(obj.num);
        $("#datepicker1").val(obj.dataStart);
        $("#datepicker2").val(obj.dataEnd);
        $("#count").val(obj.count);

        $(".btn-primary").off("click")
        $(".btn-primary").on("click",function(){
            option("mod",this)
        }.bind(this));
    })

    function option(type,that){
        // console.log(that)
        var comNum = 0;
        var objLength = 0;

        var obj = {
            "campusId": parseInt($("#campus").val()),//所属校区
            "apartmentName": $("#schoolName").val(),  //公寓名称
            "apartmentType": $("#type").val(), //公寓类型
            "apartmentNo": $("#num").val(), //公寓编号
            "contractBegin": $("#datepicker1").val(), //租期
            "contractEnd": $("#datepicker2").val(), //到期
            "dormitoryNumber": parseInt($("#count").val()) //宿舍数量
        }
        for( var i in obj ){
            objLength++;
            if(obj[i]) comNum++;
        }

        if(comNum < objLength) $(".pop").css({display:"inline"});
        else{
            $(".close").trigger("click");         //关闭模态框
            if( type == "mod" ){  //根据标识判断操作是修改还是添加

                obj.id = parseInt($(that).attr("campus-id"))
                console.log(obj)
                var data = localStorage.getItem('data')
                data = JSON.parse(data)
                let contractPeriod = obj.contractBegin + '~' + obj.contractEnd;
                delete obj.contractBegin
                delete obj.contractEnd
                obj.contractPeriod = contractPeriod
                data.apartment.forEach(function(item,index){
                    if(obj.id == item.id){  
                        data.apartment[index] = obj
                        return
                    }
                })
                console.log(data.apartment)
                data = JSON.stringify(data)
                localStorage.setItem('data',data)
                location.reload()
                // $.ajax({
                //     url: '/api/apartment/update',
                //     type: 'post',
                //     contentType: 'application/json',
                //     data: JSON.stringify(obj),
                //     success: (res) =>{
                //         if(res.status == "ok") 
                //             // show()
                //             location.reload()
                //     },
                //     error: (err) =>{
                //         console.log(err.statusText)
                //     }
                // })
            }
            if( type == "add" ) add(obj)  //根据标识判断操作是修改还是添加
        }
    }

    // 删除公寓  通过事件委托解决新添加的元素绑定不上事件的问题
    $("body").on("click",".del",function () {
        var res = confirm("确认删除吗？");
        if (!res) return;
        else {
            var idArr = [],id = parseInt($(this).attr("campus-id"))
            idArr.push(id)
            // var id = JSON.stringify({"id": idArr})
            var data = localStorage.getItem('data')
            data = JSON.parse(data)
            console.log(idArr)
            data.apartment.forEach(function(item,index){
                idArr.forEach(function(idItem,indexs){
                    if(idItem == item.id){
                        data.apartment.splice(index,1)
                    }
                })
            })
            // console.log(data.apartment)
            data = JSON.stringify(data)
            localStorage.setItem('data',data)
            location.reload()
            // $.ajax({
            //     url: '/api/apartment/del',
            //     type: 'post',
            //     contentType: 'application/json',
            //     data,
            //     success: (res) =>{
            //         if(res.status == "ok") 
            //             // show()
            //             location.reload()
            //         else alert(res.msg)
            //     },
            //     error: (err) =>{
            //         console.log(err.statusText)
            //     }
            // })
        }
    })

    // 全选
    var flag1 = true;
    $(".selectAll").on("click",function(e){
        e.stopPropagation()
        if(flag1)
        {
            $(".selectItem").prop("checked",true);
            flag1 = !flag1;
        }
        else{
            $(".selectItem").prop("checked",false);
            flag1 = !flag1;
        }
    })

    // 批量删除
    $(".deletes").on("click",function(){
        var idArr = [],selectNum = 0;
        if( $(".selectAll").prop("checked") ) selectNum = -1;
        else selectNum = 0;
        $(".selectItem").each(function(index,item){

            if( $(item).prop("checked") ){
                 selectNum++
                 var id = parseInt($(item).attr("campus-id"))
                idArr.push(id)
            }
            
        })

        if(!idArr[0]) idArr.shift()
        // var data = JSON.stringify({"id": idArr})
        if(!selectNum) alert("未选中任何删除项！");
        else{
            var res = confirm("确认删除该 "+selectNum+" 项数据？");
            if(res){
                // $.ajax({
                //     url: '/api/dormitory/del',
                //     type: 'post',
                //     contentType: 'application/json',
                //     data,
                //     success: (res) =>{
                //         if(res.status == 'ok') {
                //             console.log(res)
                //             show()
                //             // location.reload()
                //         }
                //         else alert(res.msg)
                //     },
                //     error: (err) =>{
                //         console.log(err.statusText)
                //     }
                // })
                
                var data = localStorage.getItem('data')
                data = JSON.parse(data)
                console.log(idArr)
                idArr.forEach(function(idItem){
                data.apartment.forEach(function(item,index){
                        if(idItem == item.id){
                            data.apartment.splice(index,1)
                            return
                        }
                    })
                })
                data = JSON.stringify(data)
                localStorage.setItem('data',data)
                location.reload()
            }
        }
        console.log(JSON.parse(data))
    })
    
});


$(function () {
    var data = JSON.parse(localStorage.getItem('data'))

    // $("#showMsg").DataTable();
    //展示校区数据
    function show(){
        // $.ajax({
        //     url: "/api/school/show_campus",
        //     type: "POST",
        //     success: (res) =>{
        //         console.log(res)
        //         var html = ""
        //         $.each(res.data,function(index,item){
        //             html +=    `<tr>
        //                             <td>
        //                                 <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
        //                             </td>
        //                             <td>${item.xqmc}</td>
        //                             <td>${item.xqbh}</td>
        //                             <td>
        //                                 <span class="del" data-id=${item.id}>删除</span> /
        //                                 <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
        //                             </td>
        //                         </tr>`
        //         })
        //         $("#schooList").html(html)
        //     },
        //     error: (err) =>{
        //         console.log(err.statusText)
        //     }
        // })
        var data = JSON.parse(localStorage.getItem('data'))
        var html = ""
        $.each(data.campus,function(index,item){
            html +=    `<tr>
                            <td>
                                <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
                            </td>
                            <td>${item.campusName}</td>
                            <td>${item.campusNo}</td>
                            <td>
                                <span class="del" data-id=${item.id}>删除</span> /
                                <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
                            </td>
                        </tr>`
        })
        $("#schooList").html(html)
        
    }

    show()

    //展示首屏信息
    // $.ajax({
    //     url: "/api/school/show",
    //     type: "POST",
    //     success: (res) =>{
    //         console.log(res)
    //         var html = ""
    //         $.each(res.data,function(index,item){
    //             html +=    `<tr>
    //                             <td>${item.xqbh}</td>
    //                             <td>${item.ssbh}</td>
    //                             <td>${item.cws}</td>
    //                             <td>${item.rzrs}</td>
    //                             <td>${item.kxcw}</td>
    //                             <td>${item.xm}</td>
    //                             <td>${item.lxfs}</td>
    //                         </tr>`
    //         })
    //         $("#bodyList").html(html)
    //         $("#showMsg").DataTable();
    //     },
    //     error: (err) =>{
    //         console.log(err.statusText)
    //     }
    // })

    var dormitoryData = data.dormitory
    var schoolNo = []
    var houseMaster = []
    data.dormitory.forEach(function(item){
        var id = item.campusId
        var apartmentId = item.apartmentId
        data.campus.forEach(function(res){
            if(id == res.id) schoolNo.push(res.campusNo)
        })
        data.housemaster.forEach(function(items){
            if( apartmentId == items.apartmentId ){
                houseMaster.push({ name: items.name,telephoneNumber: items.telephoneNumber})
                return ;
            }
        })
    })

    var html = ""
    dormitoryData = dormitoryData.reverse()
    var roomNum = 0,bedNum = 0,personNum = 0,lvingPopulationNum = 0

    dormitoryData.forEach(function(item, index){
        if(!houseMaster[index])
            houseMaster[index] = { name: '无',telephoneNumber:'无'}
        roomNum ++;
        bedNum +=item.bedNumber*1
        lvingPopulationNum += item.lvingPopulation
        html =    `<tr>
                        <td>${schoolNo[index]}</td>
                        <td>${item.dormitoryNo}</td>
                        <td>${item.bedNumber}</td>
                        <td>${item.lvingPopulation}</td>
                        <td>${item.bedNumber - item.lvingPopulation}</td>
                        <td>${houseMaster[index].name}</td>
                        <td>${houseMaster[index].telephoneNumber}</td>
                    </tr>` + html
    })
    personNum = bedNum - lvingPopulationNum
    $('.color-theme-2').html(roomNum)
    $('.bedCount').html(bedNum)
    $('.personCount').html(lvingPopulationNum)
    $('.lastCount').html(personNum)
    $("#bodyList").html(html)
    $("#showMsg").DataTable();




    var flag = true;
    $(".modBtn").on("click",function(){
        if(flag) this.innerHTML = "取消修改";
        else this.innerHTML = "修改信息";
        $("#mod").toggle();
        $(".add").toggle();
        $(".deletes").toggle();
        flag = !flag;
    })

    // 添加校区
    function add(name,num){
        console.log(name,num)
        // $.ajax({
        //     url: "/api/school/add",
        //     type: "POST",
        //     contentType: "application/json",
        //     data: JSON.stringify({
        //         "name": name,
        //         "no": num
        //     }),
        //     success: (res) =>{
        //         console.log(res)
        //         if(res.status == "ok") show()
        //     },
        //     error: (err) =>{
        //         console.log(err.statusText)
        //     }
        // })

        var data = JSON.parse(localStorage.getItem('data'))
        console.log(data)
        var id = data.campus.length ? data.campus[0].id + 1 : 1
        var addData = {
            id,
            campusName: name,
            campusNo: num
        }
        data.campus.unshift(addData)
        localStorage.setItem('data',JSON.stringify(data))
        show()
    }

    $(".btn-primary").on("click",function(e){
        var schoolName = $("#schoolName").val();
        var schoolNum = $("#schoolNum").val();
        if(!schoolName || !schoolNum) $(".pop").css({display:"inline"});   //字段为空时不能提交 并显示提示
        else{
            $(".btn-default").trigger("click");
            if( $(".btn-primary").attr("genre") == "add" ) add(schoolName,schoolNum);  //根据标识判断操作是修改还是添加
        }
    });

    $(".add").on("click",function(){
        $(".btn-primary").attr("genre","add"); //点击提交按钮时设置标识 添加
        $(".pop").css({display:"none"});
        $("#myModalLabel").html("添加校区");
        $("#schoolNum").val("");
        $("#schoolName").val("");
    })

    // 删除校区  通过事件委托解决新添加的元素绑定不上事件的问题
    $("body").on("click",".del",function () {
        var id = $(this).attr("data-id") * 1
        var res = confirm("确认删除吗？");
        if (!res) return;
        else {
            // $.ajax({
            //     url: "/api/school/del",
            //     type: "post",
            //     contentType: "application/json",
            //     data: JSON.stringify({"id": [id]}),
            //     success: (res) =>{
            //         if(res.status == 'ok') show()
            //         else alert('信息删除失败，'+res.msg)
            //     },
            //     error: (err) =>{
            //         console.log(err.statusText)
            //     }
            // })
            // console.log(id)
            var data = JSON.parse(localStorage.getItem('data'))
            data.campus.forEach(function(item, index){
                if( item.id == id ){
                    data.campus.splice(index, 1)
                    return 0;
                }
            })
            localStorage.setItem('data',JSON.stringify(data))
            show()
        }
    })

    // 修改校区
    $("body").on("click",".change",function(){
        var id = $(this).attr("data-id")
        var that = this;
        $(".btn-primary").attr("genre","mod");  //点击提交按钮时设置标识 提交
        $(".pop").css({display:"none"});
        $("#myModalLabel").html("修改校区");

        var schoolNum = $(this).parent().prev().html(),
            schoolName = $(this).parent().prev().prev().html()
        //数据回填
        $("#schoolNum").val(schoolNum);
        $("#schoolName").val(schoolName);

        $(".btn-primary").off("click")
        $(".btn-primary").on("click",function(e){
            var schoolName = $("#schoolName").val();
            var schoolNum = $("#schoolNum").val();
            var modData = {
                id: parseInt(id),
                campusName: schoolName,
                campusNo: schoolNum
            }
            if(!schoolName || !schoolNum) $(".pop").css({display:"inline"});   //字段为空时不能提交 并显示提示
            else{
                $(".btn-default").trigger("click");
                // var data = `"id": ${id},"xqmc": ${schoolName},"xqbh": ${schoolNum}`
                if( $(".btn-primary").attr("genre") == "mod" )  //根据标识判断操作是修改还是添加
                {
                    // $.ajax({
                    //     url: "/api/school/update",
                    //     type: "POST",
                    //     contentType: "application/json",
                    //     data: JSON.stringify({
                    //         id: parseInt(id),
                    //         name: schoolName,
                    //         no: schoolNum
                    //     }),
                    //     success: (res) =>{
                    //         console.log(res)
                    //         if(res.status == 'ok'){
                    //             show()
                    //         }
                    //         else console.log(res.msg)
                    //     },
                    //     error: (err) =>{
                    //         console.log(err.statusText)
                    //     }
                    // })
                    var data = JSON.parse(localStorage.getItem('data'))
                    data.campus.forEach(function (item) {
                        if( item.id == modData.id ){
                            item.campusName = modData.campusName
                            item.campusNo = modData.campusNo
                        }
                    })
                    localStorage.setItem('data',JSON.stringify(data))
                    show()
                }
            }
        });
    })

    // 全选
    var flag1 = true;
    $(".selectAll").on("click",function(){
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
    var selectNum = 0;
    $(".deletes").on("click",function(){
        if( $(".selectAll").prop("checked") ) selectNum = -1;
        else selectNum = 0;
        var idArr = []
        $(".selectItem").each(function(index,item){
            if( $(item).prop("checked") ){
                selectNum++
                idArr.push($(item).attr("data-id") * 1)
            }
        })
        if(!idArr[0]) idArr.shift()
        if(!selectNum) alert("未选中任何删除项！");
        else{
            var res = confirm("确认删除该 "+selectNum+" 项数据？");
            // if(res) alert("请求已发送！");
            if(res){
                // $.ajax({
                //     url: "/api/school/del",
                //     type: "post",
                //     contentType: "application/json",
                //     data: JSON.stringify({id: idArr}),
                //     success: (res) =>{
                //         if(res.status == 'ok') show()
                //         else alert('信息删除失败，'+res.msg)
                //     },
                //     error: (err)=>{
                //         console.log(err.statusText)
                //     }
                // })
                var data = JSON.parse(localStorage.getItem('data'))
                idArr.forEach(function (item) {
                    data.campus.forEach(function (res, index) {
                        if( res.id == item ){
                            data.campus.splice(index, 1)
                        }
                    })
                })
                localStorage.setItem('data',JSON.stringify(data))
                show()
            }
        }
    })
});
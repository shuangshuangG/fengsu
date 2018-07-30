//获取宿舍信息
function show(){
    var data = JSON.parse(localStorage.getItem('data'))
    var campusName = []
    var apartmentName = []
    var html = ''
    data.dormitory.forEach(item =>{
        data.campus.forEach(element =>{
            if( element.id == item.campusId ){
                campusName.push(element.campusName)
            }
        })
    })
    data.dormitory.forEach(item =>{
        data.apartment.forEach(element =>{
            if( element.id == item.apartmentId ){
                apartmentName.push(element.apartmentName)
            }
        })
    })
    data.dormitory.forEach((item, index) => {
        html += `<tr>
                    <td>
                        <input type="checkbox" name="" id="a1" class="selectItem" data-id=${item.id}>
                    </td>
                    <td>${item.dormitoryNo}</td>
                    <td>${campusName[index]}</td>
                    <td>${apartmentName[index]}</td>
                    <td>${item.bedNumber}</td>
                    <td>
                        <span class="del" data-id=${item.id}>删除</span> /
                        <span class="change" data-toggle="modal" data-target="#myModal" data-id=${item.id}>修改</span>
                    </td>
                </tr>`
    });
    $('.tableBody').html(html)
    $("#mod").DataTable();
}
show()

var json = []
function getJson(){
    var data = localStorage.getItem('data')
    data = JSON.parse(data)

    data.campus.forEach(function(item){
        let temp = {}
        temp.name = item.campusName
        temp.id = item.id
        json.push(temp)
    })
    data.campus.forEach(function(items,index){
        let tem = []
        data.apartment.forEach(function(item){
            if(items.id == item.campusId){
                let temp = {}
                temp.name = item.apartmentName
                temp.id = item.id
                tem.push(temp)
            }
        })
        json[index].apartment = tem
    })
}

getJson()

// 添加校区
function add(obj){
    // console.log(0)
    // var tr = `<tr>
    //             <td>
    //                 <input type="checkbox" name="" id="a1" class="selectItem">
    //             </td>
    //             <td>${obj.dormitoryName}</td>
    //             <td>${obj.campus}</td>
    //             <td>${obj.apartment}</td>
    //             <td>${obj.count}</td>
    //             <td>
    //                 <span class="del">删除</span> /
    //                 <span class="change" data-toggle="modal" data-target="#myModal">修改</span>
    //             </td>
    //         </tr>`;
    // $("#mod tbody").prepend(tr);
    console.log(obj)
    var data = JSON.parse(localStorage.getItem('data'))
    var id =  data.dormitory.length ? data.dormitory[0].id + 1 : 1
    obj.id = id
    data.dormitory.unshift(obj)
    localStorage.setItem('data',JSON.stringify(data))
    location.reload()
}
    //提交按钮
$(".btn-primary").on("click",function(e){
    var comNum = 0;
    var objLength = 0;
    var obj = {
        "campusId": $("#campus").val(),//所属校区
        "apartmentId": $("#apartment").val(),  //所属公寓
        "dormitoryNo": $("#dormitoryName").val(), //宿舍编号
        "bedNumber": $("#count").val(), //床位数　
        "lvingPopulation": "0" //已入住人数
    }
    // console.log(obj)
    for( var i in obj ){
        objLength++;
        if(obj[i]) comNum++;
    }

    if(comNum < objLength) $(".pop").css({display:"inline"});
    else{
        $(".btn-default").trigger("click");         //关闭模态框
        if( $(".btn-primary").attr("genre") == "add" ) add(obj);  //根据标识判断操作是修改还是添加
    }

});
//添加宿舍
$(".add").on("click",function(){
    $(".btn-primary").attr("genre","add"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("添加宿舍");
    // $("#campus").val("北科");               //初始化模态框字段
    // $("#apartment").val("3A公寓");
    $("#dormitoryName").val("");
    $("#count").val("");
})

//修改宿舍
$("body").on("click",".change",function(){
    var that = this;
    $(".btn-primary").attr("genre","mod"); //点击提交按钮时设置标识 添加
    $(".pop").css({display:"none"});
    $("#myModalLabel").html("修改宿舍信息");

    var obj = {
        "campus": $(this).parent().prevAll().eq(2).html(),//所属校区
        "apartment": $(this).parent().prevAll().eq(1).html(),  //所属公寓
        "dormitoryName": $(this).parent().prevAll().eq(3).html(), //宿舍编号
        "count": $(this).parent().prev().html(), //床位数
        "id": $(this).attr('data-id')  //id
    }

    console.log(obj)

    let campusId, apartmentId
    json.forEach(function(item,index){
        if(item.name == obj.campus){
            campusId = item.id
            json[index].apartment.forEach(function(items,indexs){
                if(items.name == obj.apartment){
                    apartmentId =  items.id
                }
            })
        }

    })
    obj.campusId = campusId
    obj.apartmentId = apartmentId
    // console.log(obj)
    console.log(campusId,apartmentId)
    $("#campus").val(campusId);               //初始化模态框字段
    initPick('#campus','#apartment',json)
    $('#apartment').val(apartmentId)

    // if(obj.campus == '北科') 
    //     $("#apartment").html(`<option value="3A公寓" selected>3A公寓</option>
    //         <option value="21公寓">21公寓</option>
    //         <option value="12公寓">12公寓</option> `)
    // if(obj.campus == '天丰利') 
    //     $("#apartment").html(`<option value="18公寓" selected>18公寓</option><option value="22公寓">22公寓</option>`)
    // $("#apartment").val(obj.apartment);
    $("#dormitoryName").val(obj.dormitoryName);
    $("#count").val(obj.count);
    initPick('#campus','#apartment',json)

    var dataId = obj.id
    $(".btn-primary").on("click",function(){
        var comNum = 0;
        var objLength = 0;
        var obj = {
            "campusId": $("#campus").val(),//所属校区
            "apartmentId": $("#apartment").val(),  //所属公寓
            "dormitoryNo": $("#dormitoryName").val(), //宿舍编号
            "bedNumber": $("#count").val() //床位数
        }

        for( var i in obj ){
            objLength++;
            if(obj[i]) comNum++;
        }

        if(comNum < objLength) $(".pop").css({display:"inline"});
        else{
            $(".btn-default").trigger("click");         //关闭模态框
            if( $(".btn-primary").attr("genre") == "mod" )//根据标识判断操作是修改还是添加
            {  
                // $(that).parent().prevAll().eq(3).html(obj.dormitoryName)
                // $(that).parent().prevAll().eq(2).html(obj.campus)
                // $(that).parent().prevAll().eq(1).html(obj.apartment)
                // $(that).parent().prev().html(obj.count)
                obj.id = parseInt(dataId)
                var data = JSON.parse(localStorage.getItem('data'))
                data.dormitory.forEach(item =>{
                    if(item.id == obj.id){
                        item.campusId = obj.campusId
                        item.apartmentId = obj.apartmentId
                        item.dormitoryNo = obj.dormitoryNo
                        item.bedNumber = obj.bedNumber
                    }
                })
                localStorage.setItem('data',JSON.stringify(data))
                location.reload()
            }
        }
    });
})

// 删除公寓  通过事件委托解决新添加的元素绑定不上事件的问题
$("body").on("click",".del",function () {
    var id = $(this).attr('data-id') * 1
    var res = confirm("确认删除吗？");
    if (!res) return;
    else {
        var data = JSON.parse(localStorage.getItem('data'))
        data.dormitory.forEach(function(item, index){
            if( item.id == id ){
                data.dormitory.splice(index, 1)
            }
        })
        localStorage.setItem('data',JSON.stringify(data))
        location.reload()
    }
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
        var res = confirm("确认删除该 "+selectNum+" 项数据？")
        if(!res) return
        else{
            var data = JSON.parse(localStorage.getItem('data'))
            idArr.forEach( item =>{
                data.dormitory.forEach( (res, index) =>{
                    if( res.id == item ){
                        data.dormitory.splice(index, 1)
                    }
                } )
            } )
            localStorage.setItem('data',JSON.stringify(data))
            location.reload()
        }
    }
})

//联动选择封装
function initPick(e1,e2,json){
    let html = ''
    let id = $(e1).val()
    let num = 0
    if(id){
        json.forEach(function(item,index){
            if(id == item.id)
                num = index
        })
    }
    json.forEach(function(item,index){
        if(index == num)
            html += `<option value=${item.id} selected> ${item.name}</option>`
        else
            html += `<option value=${item.id} > ${item.name}</option>`
    })
    $(e1).html(html)
    let id2 =  $(e2).val()
    let num2 = 0
    if(id2){
        json[num].apartment.forEach(function(item,index){
            if(id2 == item.id)
                num2 = index
        })
    }
    html = ''
    json[num].apartment.forEach(function(item,index){
        if(index == num2)
            html += `<option value=${item.id} selected> ${item.name}</option>`
        else
            html += `<option value=${item.id} > ${item.name}</option>`
    })
    $(e2).html(html)
}

function selectPick(e1,e2,json){
    $(e1).on('change',function(e){
        let id = e.target.value
        let apartment = [] 
        json.forEach(function(item){
            if(item.id == id){
                apartment = item.apartment
                return
            } 
        })
        let htmls = ''
        apartment.forEach(function(item,index){
            if(index == 0)
               htmls += `<option value=${item.id} selected> ${item.name}</option>`
            else
               htmls += `<option value=${item.id} > ${item.name}</option>`
        })
        $(e2).html(htmls)
    })
}
initPick('#campus','#apartment',json)
selectPick('#campus','#apartment',json)
$(".schoolBtn").toggle(0)
// $(".schoolBtn").css({opacity: 0})

$(".flyImg").animate({top: "20%"},600,function(){
    // $(".schoolBtn").animate({opacity: 1},800)
    $(".schoolBtn").toggle(800)
})

$(".schoolBtn button").on('click',function(){
    $(".schoolBtn button").removeClass('btnActive')
    $(this).addClass('btnActive')
})

$("#schoolSubmit").on('click',() =>{
    loadhouse()
})

$("#back").on('click',function(){
    history.back()
})

function loadhouse(){
    //局部加载房间页
    $(".content-wrapper").load("../../model/floor.html",function(){
        // $(".contidion input").on('click',houseOpt.bind(1))
        $(".contidion input").bind('click',{data: "abc"},buildOpt)

        $("li").on('click',function(){

            var type = $(this).attr("roomType")
            switch(type){
                case "four":
                    $(".content-wrapper").load('../../model/quadRoom.html',houseOpt)
                    break
                case "six":
                    $(".content-wrapper").load('../../model/sixRoom.html',houseOpt)
                    break
                case "eight":
                    $(".content-wrapper").load('../../model/eightRoom.html',houseOpt)
                    break
            }
        })
    })
}

var timer = ''
function buildOpt(event){
    console.log(event.data)
    if( $(this).parent()[0].classList.contains("build") ){
        if( this.classList.contains("btnActive") ){
            $(this).toggleClass('btnActive')
        }
        else{
            $(".build input").removeClass('btnActive')
            $(this).addClass('btnActive')
        }
    }
    else if( $(this).parent()[0].classList.contains("type") ){
        if( this.classList.contains("btnActive") ){
            $(this).toggleClass('btnActive')
        }
        else{
            $(".type input").removeClass('btnActive')
            $(this).addClass('btnActive')
        }
    }
    else{
        if( this.classList.contains("btnActive") ){
            $(this).toggleClass('btnActive')
        }
        else{
            $(".state input").removeClass('btnActive')
            $(this).addClass('btnActive')
        }
    }

    var contidionArr = []
    $(".contidion input").each(function(index,item){
        if( item.classList.contains('btnActive') ) contidionArr.push(item.value)
    })

    if(timer) clearTimeout(timer)
    timer = setTimeout(function(){
        console.log(contidionArr)
    },200)
}

function houseOpt(){

    $("#backhouse").on('click',function(){
        loadhouse()
    })
    $(".bed").on('click',function(){
        $(".pop").css({display:"none"});
        if( $(this).find('.cancel')[0].style.display == 'block' ){
            var obj = JSON.parse($(this).attr("msg"))

            $("#num").val(obj.num);               //初始化模态框字段 回填数据
            $("#name").val(obj.name);
            $("#class").val(obj.class);

            $("#myModalLabel").html("占床人信息：")

            $(".btn-primary").attr("bedNum",this.classList[1])
            $(".btn-primary").attr("bedno",$(this).attr('bedno'))
            $(".btn-primary").attr("floorType",$(this).parent().attr('class'))
        }
        else{
            $("#num").val("");               //初始化模态框字段 置空
            $("#name").val("");
            $("#class").val("");

            $("#myModalLabel").html("输入占床人信息")

            $(".btn-primary").attr("bedNum",this.classList[1])
            $(".btn-primary").attr("bedno",$(this).attr('bedno'))
            $(".btn-primary").attr("floorType",$(this).parent().attr('class'))
        }
        
    })
}

var obj
//提交按钮
$(".btn-primary").on("click",function(e){
    
    var comNum = 0;
    var objLength = 0;
    obj = {
        "num": $("#num").val(),//学号
        "name": $("#name").val(),  //姓名
        "class": $("#class").val(),//班级
    }
    console.log(obj)

    for( var i in obj ){
        objLength++;
        if(obj[i]) comNum++;
    }

    if(comNum < objLength) $(".pop").css({display:"inline"});
    else{
        $(".btn-default").trigger("click");         //关闭模态框
        var bedNum = $(this).attr('bedNum')
        var bedno = $(this).attr('bedno')
        $(".cancel").eq(bedno-1).css({display: "block"})
        $('.'+bedNum).find('section').html(obj.name)
        $('.'+bedNum).attr('msg',JSON.stringify(obj))
        switch($(this).attr('floorType')){
            case "room-four":
                if( parseInt(bedno)%2 == 0 )
                    $('.'+bedNum).addClass("left")
                else
                    $('.'+bedNum).addClass("right")
                break
            case "room-six":
                if( parseInt(bedno)%2 == 0 )
                    $('.'+bedNum).addClass("right")
                else
                    $('.'+bedNum).addClass("left")
                break
            case "room-eight":
                if( parseInt(bedno)%2 == 0 )
                    $('.'+bedNum).addClass("right")
                else
                    $('.'+bedNum).addClass("left")
                break
        }
    }

    $(".cancel").off('click')
    $(".cancel").on('click',function(e){
        e.stopPropagation()
        var flag = confirm("确定取消该条占床信息？")
        if(flag){
            this.style.display = 'none'
            $(this).parent().removeClass("right")
            $(this).parent().removeClass("left")
        }
    })

});

// 智能匹配输入
var num = new Array();
num.push("11458765");
num.push("11436542");
num.push("11429877");  
function search1(){     
    $("#mylist1").empty();  
    var tea_school=$('input.addstuTSchool').val();
    for(i = 0; i < num.length; i++)
    {  
        if(tea_school != "" && num[i].match(tea_school + ".*")!= null)  
        {  
            var option="<option>"+ num[i] +"</option>";    
            $("#mylist1").append(option);  
        }  
    }  
} 

var nameArr = new Array();
nameArr.push("张三");
nameArr.push("李四");
nameArr.push("王五");  
function search2(){     
    $("#mylist2").empty();  
    var tea_school=$('input.addstuTSchool').eq(1).val();
    for(i = 0; i < nameArr.length; i++)
    {  
        if(tea_school != "" && nameArr[i].match(tea_school + ".*")!= null)  
        {  
            var option="<option>"+ nameArr[i] +"</option>";    
            $("#mylist2").append(option);  
        }  
    }  
} 

var roomNum = new Array();
roomNum.push("21-302");
roomNum.push("21-405");
roomNum.push("3A-101");  
function search3(){   
    $("#mylist3").empty();  
    var tea_school=$('input.addstuTSchool').eq(2).val();
    for(i = 0; i < roomNum.length; i++)
    {  
        if(tea_school != "" && roomNum[i].match(tea_school + ".*")!= null)  
        {  
            var option="<option>"+ roomNum[i] +"</option>";    
            $("#mylist3").append(option);  
        }  
    }  
} 
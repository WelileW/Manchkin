
function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset)
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return(setStr);
}

function setCookie (name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}


var $hello;
var $main;
var $clm1;
var $clm2;
var $clm3;
var $hall;
var hallUp;
var $game;
var gameUp;


var nik;
var userList;


$(function(){   // При заргрузке страницы

    init();
    // Инициализация
        $hello = $("#hello");
        $main = $("#main");
        // Chart
            Chart.init();
        // /Chart

        $clm1 = $main.children("#clm1");
        $clm2 = $main.children("#clm2");
        $clm3 = $main.children("#clm3");
        $hall = $main.find(".hall");
        $game = $main.find(".game");
        // Rooms
            $createRoom.init();
        // /Rooms
    // /Инициализация

    if(getCookie("NikName") == null){
        hello();
    }
    else{
        nik = getCookie("NikName");
        hall();
    }
});


// Авторизация
function hello(){
    $hello.show();
    $main.hide();

    var reserved = false;

    // Если пользователь ввел ник => Комната ожидания
    $hello.find('[name = NikName]').keyup(function(){
        var $field = $(this);
        console.info("val = " + $field.val());
        // Ограничение по длине
        if($field.val().length > 10){
            $field.val($field.val().substr(0,10));
        }
        if(userList) {
            // Ник должен быть не занят
            reserved = false;
            for (var i in userList) {
                if (!userList.hasOwnProperty(i)) continue;
                if ($field.val() == userList[i]) reserved = true;
            }
            if(reserved) $hello.find('.init').css("visibility", "visible");
            else $hello.find('.init').css("visibility", "hidden");
        }
    });
    $hello.find('[name = auth]').click(function(){
        if(!reserved) {
            var $nik = $hello.find('[name = NikName]');
            if ($nik.val() != "") {
                setCookie("NikName", $nik.val());
                $nik.val("");
                nik = getCookie("NikName");
                hall();
            }
            else {
                alert("Введите имя");
            }
        }
        else alert("Это имя уже занято");
    });
}

// Комната ожидания
function hall(){
    clearTimeout(gameUp);
    //$hello.hide();
   // $main.show();
    $hall.show();
    $game.hide();
    // Магия CSS
    $hello.hide();
    $main.show();
    $clm1.css("width","calc(38.2% - 10px)");
    $clm2.css("width","calc(61.8% - 10px)");
    $clm3.css({"position": "absolute","visibility": "hidden"});

    Chart.$main.css("height","calc(100% - 10px - 2em)");
    Chart.$main.children("div").css("height","calc(100% - 1.9em - 5px)");
    Chart.$main.children(".head").remove();
    $(".player").remove();
    $("#table").html("");
    $clm1.children(".hall").find(".mnik").html(nik);
    // /Магия CSS

    Chart.creating("/chart");

    update();

}

function update(){
    Chart.update();
    room.update();
    // alert("Обновление");
    console.info("Обновлен holl");

    //Прерываем update()
    // clearTimeout(timerId);
    hallUp = setTimeout(update,1000);
}

function init(){
    $.ajax({
        type: "GET",
        processData: false,
        contentType: 'text/plain',
        accept: 'application/json',
        url: "/jax-rs-boilerplate-0.1/api/users",
        data: "",
        success: function (users) {
            userList = users;
        }
    });
}





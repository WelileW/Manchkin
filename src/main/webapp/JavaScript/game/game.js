var players;
var Treasure;
var Instance;
var GarbageTreasure;
var GarbageInstance;
var Table;
var CardsOfTreasure;
var CardsOfInstance;
var gameId;
var gameUp;

var game = function(id){
    game.init(id);
};

game.init = function(id){
    gameId = id;
    clearTimeout(hallUp);
    hallUp = 0;
    // Магия CSS
    $hall.hide();
    $game.show();
    $hello.hide();
    $main.show();
    $clm1.css("width","calc(33.3% - 10px)");
    $clm2.css("width","calc(33.3% - 10px)");
    $clm3.css({"position": "relative","visibility": "visible"});

    Chart.$main.css("height","calc(30% - 10px)");
    Chart.$main.prepend("<p class='grey head'></p>");
    var $head;
    $head = Chart.$main.children("p:first");
    if(Rooms[id].players[0] == nik) {
        $head.append("<button class='end'>Конец игры</button>");
        $head.find(".end").on('click', game.deleteGame);
    }
    $head.append("<div id='d6'></div>");
    $head.find("#d6").on('click', game.scrollD6);
    Chart.$main.children("div").css("height","calc(100% - 1.9em - 35px)");
    // /Магия CSS

    Chart.creating("/game/" + id + "/chart");

    // Add players
    var find = false;
    var numberUser = 20;
    players = new Array();

    for(var j in Rooms[id].players){
        players[j] = new Player(Rooms[id].players[j]);
        if(nik == Rooms[id].players[j]){
            find = true;
            numberUser = j;
        }
        if(find && (Rooms[id].players.length < 6 || j-numberUser  != 4)){
            players[j].sorting(Rooms[id].players[j], j-numberUser, Rooms[id].players.length, j);
        }
    }
    for(var i = 0; i < numberUser ; i++){
        if(Rooms[id].players.length < 6 || Rooms[id].players.length - numberUser + i  != 4) {
            players[i].sorting(Rooms[id].players[i], Rooms[id].players.length - numberUser + i, Rooms[id].players.length, i);
        }
    }
    if(Rooms[id].players.length == 6){
        if(numberUser - 2 < 0){
            players[numberUser + 4].sorting(Rooms[id].players[numberUser + 4], 4, Rooms[id].players.length, numberUser+4);
        }
        else{
            players[numberUser - 2].sorting(Rooms[id].players[numberUser - 2], 4, Rooms[id].players.length, numberUser-2);
        }
    }
    // /Add players

    // Add deck, table and garbage
    Treasure = new Deck('Treasure');
    Instance = new Deck('Instance');
    GarbageTreasure = new Garbage('Treasure');
    GarbageInstance = new Garbage('Instance');
    Table = new Tables();
    CardsOfTreasure = new Box('Treasure', GarbageTreasure.$garbage);
    CardsOfInstance = new Box('Instance', GarbageInstance.$garbage);
    // /Add deck, table and garbage

/////   Прокрутка колесика мышки. Да, это ад
    wheelThis(document.getElementById('garbageTreasure'), 'Treasure');
    wheelThis(document.getElementById('garbageInstance'), 'Instance');

///// Кнопки Mix
    $clm2.find("#center").find("button.Treasure").on('click',{type: 'Treasure'}, game.mixDeck);
    $clm2.find("#center").find("button.Instance").on('click',{type: 'Instance'}, game.mixDeck);

    game.getGame();

};

function wheelThis(elem, type){
    if(elem.addEventListener){
        if ('onwheel' in document) {
            // IE9+, FF17+
            elem.addEventListener ("wheel", onWheel, false);
        }
        else if ('onmousewheel' in document) {
            // устаревший вариант события
            elem.addEventListener ("mousewheel", onWheel, false);
        }
        else {
            // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
            elem.addEventListener ("MozMousePixelScroll", onWheel, false);
        }
    }
    else { // IE<9
        elem.attachEvent ("onmousewheel", onWheel);
    }
    function onWheel(e) {
        e = e || window.event;

        // deltaY, detail содержат пиксели
        // wheelDelta не дает возможность узнать количество пикселей
        // onwheel || MozMousePixelScroll || onmousewheel
        var delta = e.deltaY || e.detail || e.wheelDelta;

        var garbage;
        switch (type){
            case 'Treasure':
                garbage = GarbageTreasure;
                break;
            case 'Instance':
                garbage = GarbageInstance;
                break;
            default :
                alert("Неизвестное кладбище попыталось открыться/закрыться");
        }

            console.info("Мы прокрутились!");
            if(delta < 0){
                // Вверх
                console.info("Вверх");
                game.hideGarbage(garbage.type);
            }
            else{
                // Вниз
                console.info("Вниз");
                game.showGarbage(garbage.type);
            }


        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }
}

function updateGame(){

    game.up();
    game.upLVL();
    // alert("Обновление");
    console.info("Обновлена game");

    //Прерываем update()
    // clearTimeout(timerId);
    gameUp = setTimeout(updateGame,1000);
}





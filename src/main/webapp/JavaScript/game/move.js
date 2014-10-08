var Move = new function(){};
Move.deck = function(event){
    if(Move.flag)   Move.down(event);
    else    Move.up(event);
};
Move.flag = false;
// Задача Move.up - найти нажатую карту в массивах
Move.up = function(event){
    if(event.which == 1) {
        if (!Move.flag) {
            Move.flag = true;
            // Запрет всплытия дальше
            if (event.stopPropagation) { // существует ли метод?
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            Move.cardX = event.pageX - $(event.currentTarget).offset().left;
            Move.cardY = event.pageY - $(event.currentTarget).offset().top;
            Move.place = event.data.place;
            Move.player = event.data.player;
            switch (Move.place) {
                case 'Garbage':
                case 'Table':
                case 'PlayerHand':
                case 'PlayerTable':
                    Move.number = $(event.currentTarget).attr('number');
                    Move.type = findCard(event);
                    break;
                case 'Deck':
                    Move.number = 0;
                    Move.place = 'Deck';
                    Move.type = event.data.type;
                    break;
                default :
                    alert("Неизвестное место отправления");
            }
            console.info("Игрок:" + Move.player);
            console.info("x: " + Move.cardX);
            console.info("y: " + Move.cardY);
        }
    }
};

findCard = function(event){
    // Найдем тип карты из ее классов
    var type = '';
    var classList = $(event.currentTarget).attr('class').split(/\s+/);
    console.info("Наши классы: " + classList);
    $.each( classList, function(index, item){
        switch (item){
            case 'Treasure':
                type = 'Treasure';
                break;
            case 'Instance':
                type = 'Instance';
                break;
        }
    });
    return type;
};

Move.down = function(event){
    if(Move.flag) {
        Move.flag = false;
        var limits = function (a) {
            if (a < 0)   a = 0;
            if (a > 100) a = 100;
            return a;
        };
        console.info("Новое место: " + event.data.place);
        Move.newPlace = event.data.place;
        if (Move.newPlace == 'Deck' || Move.newPlace == 'Garbage') {
            Move.placeX = 0;
            Move.placeY = 0;
            Move.newPlayer = 0;
        }
        else {
            switch (Move.newPlace) {
                case 'Table':
                    Move.dx = Table.$table.$place.dx;
                    Move.dy = Table.$table.$place.dy;
                    Move.newPlayer = 0;
                    break;
                case 'PlayerHand':
                    Move.newPlayer = event.data.player;
                    Move.dx = players[Move.newPlayer].$hand.$place.dx;
                    Move.dy = players[Move.newPlayer].$hand.$place.dy;
                    break;
                case 'PlayerTable':
                    Move.newPlayer = event.data.player;
                    Move.dx = players[Move.newPlayer].$table.$place.dx;
                    Move.dy = players[Move.newPlayer].$table.$place.dy;
                    break;
            }
            console.info("Родитель: " + (event.pageX - $(event.currentTarget).offset().left) + "  Ребенок: " + Move.cardX + "  dx: " + Move.dx);
            Move.placeX = limits(parseInt((event.pageX - $(event.currentTarget).offset().left - Move.cardX) / Move.dx));
            Move.placeY = limits(parseInt((event.pageY - $(event.currentTarget).offset().top - Move.cardY) / Move.dy));
        }
        if ((Move.place == 'Deck' || Move.place == 'Garbage') && (Move.newPlace == 'Deck' || Move.newPlace == 'Garbage')){}
        else    game.moveCard(Move.type, Move.number, Move.place, Move.newPlace, Move.placeX, Move.placeY, Move.newPlayer);
    }
};

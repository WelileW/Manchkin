
function Card($place, number, player, place, type, sprite, x, y, dx, dy, rotate){
    this.number = number;
    this.player = player;
    this.place = place;
    this.type = type;
    this.view = sprite;

    this.$create($place, player, place, x, y, dx, dy, rotate);

    console.info("Создана карта");
}

Card.prototype.$create = function($place, player, place, x, y, dx, dy, rotate){
    console.info("Карта полетела в " + place);
    $place.append('<div></div> ');
    this.$card = $place.find('div:last');
    this.$card.attr('number', this.number);
    var classList = this.view.split(/\s+/);
    for(var i in classList){
        if(!classList.hasOwnProperty(i)) continue;
        this.$card.addClass(classList[i]);
    }
    if(place == 'PlayerHand'  &&  $place.parent().attr('id') != nik){
        this.$card.addClass("back" + this.type)
    }
    if(rotate)  this.$card.addClass("rotate");
    this.player = player;
    this.place = place;
    this.x = x;
    this.y = y;
    this.$card.css("left",parseInt(x * dx - 60) + "px");
    this.$card.css("top",parseInt(y * dy - 93) + "px");
};

Card.prototype.move = function($place, player, place, x, y, dx, dy, rotate){
    var typeOfCard = this.type;
    var number = this.number;
    $('.' + typeOfCard + '[number = ' + number + ']').remove();
    this.$create($place, player, place, x, y, dx, dy, rotate);
};

Card.prototype.moveLight = function(dx, dy){
    var x = this.x;
    var y = this.y;
    this.$card.css("left",parseInt(x * dx - 60) + "px");
    this.$card.css("top",parseInt(y * dy - 93) + "px");
}

function click(event){
    switch(event.which){
        case 1:// Нажатие левой кнопки
            Move.up(event);
            break;
        case 2:// Нажатие колесика
            game.rotate(event);
            break;
        case 3:// Нажатие правой кнопки
            big(event);
            break;
        default :
            console.info("Нажата непонятная кнопка над картой")
    }
}

function small(event){
    if($(event.currentTarget).hasClass("big")){
       $(event.currentTarget).removeClass("big")
    }
    return false;
}

function big(event){
    event.preventDefault();
    // Запрет всплытия дальше
    if (event.stopPropagation) { // существует ли метод?
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
    $(event.currentTarget).addClass("big");
}
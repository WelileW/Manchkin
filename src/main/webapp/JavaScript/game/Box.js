
function Box(type, $Garbage){
    this.type = type;
    this.$Garbage = $Garbage;
    this.chunk = new Array();
}

Box.prototype.createCard = function(number, player, place, type, sprite, x, y, rotate){
    if(!this.chunk.hasOwnProperty(number)) {
        var $owner = this.find$Place(place, player);
        this.chunk[number] = new Card($owner, number, player, place, type, sprite, x, y, $owner.dx, $owner.dy, rotate);
    }
};

Box.prototype.moveCard = function(number, place, player, x, y, rotate){
    if(!this.chunk.hasOwnProperty(number)) alert("Карта не создана");
    else{
        var $owner = this.find$Place(place, player);
        this.chunk[number].move($owner, player, place, x, y, $owner.dx, $owner.dy, rotate);
    }
};

Box.prototype.removeCard = function(number){
    var typeOfCard = this.type;
    $('.' + typeOfCard + '[number = ' + number + ']').remove();
    if(this.chunk.hasOwnProperty(number)){
        this.chunk.splice(number);
    }
};

Box.prototype.find$Place = function(place, player){
    var $owner;
    switch (place){
        case 'Table':
            $owner = Table.$table.$place;
            break;
        case 'PlayerHand':
            $owner = players[player].$hand.$place;
            break;
        case 'PlayerTable':
            $owner = players[player].$table.$place;
            break;
        case 'Garbage':
            $owner = this.$Garbage.$place;
            break;
        default : alert("Попытка переместится в неизвестное место " + place);
    }
    return $owner;
}

Box.prototype.sizing = function(){
    for(var card in this.chunk){
        if(!this.chunk.hasOwnProperty(card))    continue;
        if(this.chunk[card].place != 'PlayerHand' && this.chunk[card].place != 'PlayerTable')   continue;
        var it = this.chunk[card];
        var $owner = this.find$Place(it.place, it.player);
        it.moveLight($owner.dx, $owner.dy);
    }
};

function $Place($place, place, player){
    this.$place = $place;

    this.$place.on('mousedown', 'div', {place: place, player: player}, click);
    this.$place.on('mousedown', {place: place, player: player}, Move.down);
    this.$place.on('mouseleave', 'div', small);
    this.$place.on('contextmenu', 'div', function(){
        return false;
    });

}

$Place.prototype.sizing = function(){
    this.$place.dx = (this.$place.width() - 60)/100;
    this.$place.dy = (this.$place.height() - 94)/100;
};
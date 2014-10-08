// Колода
function Deck(type){
    this.type = type;
    this.$deck = $clm2.find('#' + type);
    this.$button = this.$deck.find('button');
    this.$button.hide();
    this.$deck.on('mousedown', {place: 'Deck', player: 0, type: this.type}, Move.deck);
}
// А есть ли в колоде карточки?
Deck.prototype.up = function(flag){
    if(flag){ // Есть. Показываем рубашку
        if(!this.$deck.hasClass("back" + this.type)){
            this.$deck.addClass("back" + this.type);
        }
    }
    else{ // Нет
        if(this.$deck.hasClass("back" + this.type)) this.$deck.removeClass("back" + this.type);
    }
};

// Кладбище
function Garbage(type){
    this.type = type;
    this.$garbage = new $Place($clm3.find('#garbage' + type), 'Garbage', 0);
    this.$garbage.$place.dx = 0;
    this.$garbage.$place.dy = 0;
}
// При перемешивании колоды мы должны замешать туда и кладбище. То есть на кладбище ничего не будет.
Garbage.prototype.mix = function(){
    this.$garbage.$place.html("");
};

// Открываем/закрываем кладбище
Garbage.prototype.show = function(number){
    this.$garbage.$place.find("div").each(function(indx, element){
        // Верхние карты кладбища "съезжают" вниз.
        if(number > indx)    $(element).css("top","-93px");
        else                $(element).css("top","52px");
    });
};

// Общий стол
function Tables(){
    this.$table = new $Place($clm2.find('#table'), 'Table', 0);
    this.$table.sizing();
}

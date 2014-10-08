
function Player(name){
    this.name = name;
}
// Sorting: number приходит относительно юзера(То есть User - 0; Следующий
// за ним - 1 и тд). Это никак не зависит от порядка при создании комнаты
Player.prototype.sorting = function(name, number, total, numberInArray){
    switch (total){
        case 2:
            this.$create(name, $clm2, number, numberInArray, 2);
            break;
        case 3:
            switch (number){
                case 0:
                    this.$create(name, $clm2, number, numberInArray, 2);
                    break;
                case 1:
                    this.$create(name, $clm1, number, numberInArray, 1);
                    break;
                case 2:
                    this.$create(name, $clm3, number, numberInArray, 3);
                    break;
                default :
                    alert("Неправильный номер игрока");
            }
            break;
        case 4:
            switch (number){
                case 0:
                case 2:
                    this.$create(name, $clm2, number, numberInArray, 2);
                    break;
                case 1:
                    this.$create(name, $clm1, number, numberInArray, 1);
                    break;
                case 3:
                    this.$create(name, $clm3, number, numberInArray, 3);
                    break;
                default :
                    alert("Неправильный номер игрока");
            }
            break;
        case 5:
            switch (number){
                case 0:
                case 3:
                    this.$create(name, $clm2, number, numberInArray, 2);
                    break;
                case 1:
                case 2:
                    this.$create(name, $clm1, number, numberInArray, 1);
                    break;
                case 4:
                    this.$create(name, $clm3, number, numberInArray, 3);
                    break;
                default :
                    alert("Неправильный номер игрока");
            }
            break;
        case 6:
            switch (number){
                case 0:
                case 3:
                    this.$create(name, $clm2, number, numberInArray, 2);
                    break;
                case 1:
                case 2:
                    this.$create(name, $clm1, number, numberInArray, 1);
                    break;
                case 4:
                case 5:
                    this.$create(name, $clm3, number, numberInArray, 3);
                    break;
                default :
                    alert("Неправильный номер игрока");
            }
            break;
        default:
            alert("Неправильное количество игроков");
    }
};
Player.prototype.$create = function(name, $column, number, numberInArray, clm){
    if(number == 0) this.owner = true;
    else    this.owner = false;

    this.clm = clm;

    $column.find(".game").prepend('<div id="' + name + '" class="player border"></div> ');
    this.$player = $column.find(".game").find("#" + name);

    if(this.owner) this.$player.css({"position": "absolute","bottom": "0"});

    // Base info
    this.$player.append('<p class="grey"></p> ');
    var $head = this.$player.find('.grey');
    $head.append('<div>' + name + '. Уровень </div>');

        // Lvl
        $head.append('<div class="theLVL"></div> ');
        this.$lvl = $head.find('.theLVL');
        $head.append('<div class="lvl"></div> ');
        var lvl = $head.find('.lvl');
        lvl.append('<div class="up">^</div>');
        lvl.append('<div class="down">v</div>');

        this.$player.find('.grey').find('.lvl').find('.up').on('mousedown', {player: numberInArray}, game.upPlayer);
        this.$player.find('.grey').find('.lvl').find('.down').on('mousedown', {player: numberInArray}, game.downPlayer);

    // Button "end move"
    if(this.owner) {
        $head.append('<button>Конец хода</button>');
        this.$button = $head.find('button');
        this.$button.hide();
        this.$button.on('mousedown', game.playerNext);
    }

    // Hand & Table
    this.$player.append('<div class="hand"></div> ');
    this.$player.append('<div class="table"></div> ');
    this.$hand = new $Place(this.$player.find('.hand'), 'PlayerHand', numberInArray);
    this.$table = new $Place(this.$player.find('.table'), 'PlayerTable', numberInArray);

    this.sizing();
};

// Дискретизация руки и стола
Player.prototype.sizing = function(){
    this.$hand.sizing();
    this.$table.sizing();
};

// Выделение игрока, которому принадлежит ход.
Player.prototype.mover = -1;
    Player.prototype.max = function(mover){
        if(!this.owner && this.mover != mover) {
            this.mover = mover;
            if(this.clm == 1)   this.$player.css({width: 'calc(100% - 2px)', height: 'calc(48% - 2px)'});
            else    this.$player.css({width: 'calc(100% - 2px)', height: 'calc(32% - 2px)'});
            this.sizing();
        }
    };
    Player.prototype.min = function(mover){
        if(!this.owner && this.mover != mover)   {
            this.mover = mover;
            if(this.clm == 1)   this.$player.css({width: 'calc(80% - 2px)', height: 'calc(39% - 2px)'});
            else    this.$player.css({width: 'calc(80% - 2px)', height: 'calc(25.6% - 2px)'});
            this.sizing();
        }
    };

// Комната

// Очень тяжело давалось создание шаблона. В результате понадобился костыль($createRoom) к основному(Rooms)
// массиву. Остальной программе не мешает и при этом работает. Если сильно режит глаза и запутывает, можно снести.

var $createRoom = new function(){

    this.$butt = '';
    this.$deck = {
        classic : ''
    };
    this.$addons = {
        axe : '',
        clerical : '',
        nfs : '',
        ranged : '',
        cheat : ''
    }
};
var $waitRoom;
// Init
$createRoom.init = function(){
    $waitRoom = $clm2.find("#wait").find("div");

    var create = $hall.find("#create");

    $createRoom.$butt = create.find('button');
    $createRoom.$deck.classic = create.find('.classic');
    $createRoom.$addons.axe = create.find('.axe');
    $createRoom.$addons.clerical = create.find('.clerical');
    $createRoom.$addons.nfs = create.find('.nfs');
    $createRoom.$addons.ranged = create.find('.ranged');
    $createRoom.$addons.cheat = create.find('.cheat');

    $createRoom.$butt.click(room.create);
};

var Rooms = new Array();
var Room = function(players, ready, deck, addons){
    this.players = players;  // массив
    this.ready = ready;
    this.deck = deck;       // объект
    this.addons = addons;   // объект
    // PlayerList
    this.playerList = '';
    // Buttons
    this.$game = '';
    this.$delete = '';
    this.$leave = '';
    this.$add = '';
};

var room = function(){};

    // API
        room.update = function(){
        $.ajax({
            type: "GET",
            processData: false,
            contentType: 'text/plain',
            accept: "application/json",
            url: "/jax-rs-boilerplate-0.1/api/rooms",
            data: "",
            success: function (rooms) {
                // Rooms = rooms if Rooms c rooms and rooms c Rooms
                // Rooms c rooms
                for(var i in Rooms){
                    if(!Rooms.hasOwnProperty(i)) continue;
                    var flag = false;
                    for(var key in rooms) if(i == key) flag = true;
                    if(!flag){
                        Rooms.splice(i, 1);
                        room.remove(i);
                    }
                }
                // rooms c Rooms
                for(var i in rooms){
                    // i c Rooms
                    if(Rooms[i]){
                        // Update
                        Rooms[i].players = rooms[i].players;
                        // If its ready
                        if(rooms[i].ready){
                            // If our user in ready room
                            for(var j in Rooms[i].players){
                                // If game didn't run yet
                                if(nik == Rooms[i].players[j] && hallUp != 0){
                                    game(i);
                                }
                            }
                            // Delete room      ?? Прийдет ли сюда JS ?? на следующий такт точно прийдет
                            //Rooms.splice(i, 1);
                            room.remove(i);
                        }
                    }
                    // !c Rooms
                    else{
                        Rooms[i] = new Room(rooms[i].players, rooms[i].ready, rooms[i].deck, rooms[i].addons);
                        // don't ready
                        if(!rooms[i].ready){
                            // Add i in Rooms
                            room.newRoom(i);
                        }
                    }
                }
            }
        });
        room.up();
    };
        room.create = function(){
            $.ajax({
                type: "POST",
                processData: false,
                contentType: 'application/json',
                url: "/jax-rs-boilerplate-0.1/api/rooms",
                data: JSON.stringify({
                    'player': nik,
                    'classic': $createRoom.$deck.classic.prop("checked"),
                    'axe': $createRoom.$addons.axe.prop("checked"),
                    'clerical': $createRoom.$addons.clerical.prop("checked"),
                    'nfs': $createRoom.$addons.nfs.prop("checked"),
                    'ranged': $createRoom.$addons.ranged.prop("checked"),
                    'cheat': $createRoom.$addons.cheat.prop("checked")
                })
            });

            $createRoom.$deck.classic.prop("checked", false);
            $createRoom.$addons.axe.prop("checked", false);
            $createRoom.$addons.clerical.prop("checked", false);
            $createRoom.$addons.nfs.prop("checked", false);
            $createRoom.$addons.ranged.prop("checked", false);
            $createRoom.$addons.cheat.prop("checked", false);
        };
        room.del = function(a){
            $.ajax({
                type: "DELETE",
                processData: false,
                contentType: 'text/plain',
                url: "/jax-rs-boilerplate-0.1/api/rooms",
                data: a.data.id
            });
        };
        room.addPlayer = function(a){
            $.ajax({
                type: "PUT",
                processData: false,
                contentType: 'text/plain',
                url: "/jax-rs-boilerplate-0.1/api/rooms/" + a.data.id,
                data: nik
            });
        };
        room.remPlayer = function(a){
            $.ajax({
                type: "DELETE",
                processData: false,
                contentType: 'text/plain',
                url: "/jax-rs-boilerplate-0.1/api/rooms/" + a.data.id,
                data: nik
            });
        };
        room.ready = function(a){
            $.ajax({
                type: "POST",
                processData: false,
                contentType: 'text/plain',
                url: "/jax-rs-boilerplate-0.1/api/rooms/" + a.data.id,
                data: ''
            });
        };
    // /API

    // Обновление видимости кнопок в зависимости от статуса игрока
    room.up = function(){
        var owner = false;
        var players = false;
        for (var i in Rooms){
            var own = false;
            var player = false;
            if (!Rooms.hasOwnProperty(i) || Rooms[i].ready) continue;
            if(i == 0) continue;

            // User владелец комнаты?
            if (Rooms[i].players[0] == nik) {
                own = true;
                owner = true;
            }
            else {
                // User внутри комнаты?
                for (var j in Rooms[i].players) {
                    if (Rooms[i].players[j] == nik) {
                        player = true;
                        players = true;
                    }
                }
            }

            // Удалить и запустить комнату может только владелец
            if(own){
                Rooms[i].$delete.show();
                // Запустить игру если в ней более 1 человека
                if(Rooms[i].players.length == 1)  Rooms[i].$game.hide();
                else    Rooms[i].$game.show();
            }
            else{
                Rooms[i].$delete.hide();
                Rooms[i].$game.hide();
            }
            // Покинуть комнату
            if(player)  Rooms[i].$leave.show();
            else Rooms[i].$leave.hide();

            // Update playerList
            Rooms[i].playerList.html('<p>Игроки:</p>');
            for(var j in Rooms[i].players){
                Rooms[i].playerList.append('<li>' + Rooms[i].players[j] + '</li>')
            }
        }
        if(!owner && !players){
            $waitRoom.find('.add').show(); // Присоединится
            $createRoom.$butt.show(); // Создать новую комнату
        }
        else{
            $waitRoom.find('.add').hide();
            $createRoom.$butt.hide();
        }
    };
    // Создание новой комнаты
    room.newRoom = function(id){
        var add = function(content){
            $colons.find('p:last').after('<li>' + content + '</li>');
        };
        if(id != 0) {
            $waitRoom.append('<div class="room" id=room' + id + '></div>');
            var $room = $waitRoom.find("#room" + id);
            $room.append('<div></div>');
            var $colons = $room.children('div');
            $colons.append('<div class="player"><p>Игроки:</p></div>');
            $colons.append('<div><p>Колоды:</p></div>');
                if (Rooms[id].deck.classic) {
                    add("Классика");
                }
            $colons.append('<div><p>Дополнения:</p></div>');
                if (Rooms[id].addons.cheat) {
                    add("Двуручный чит");
                }
                if (Rooms[id].addons.ranged) {
                    add("Следопуты");
                }
                if (Rooms[id].addons.nfs) {
                    add("Тяга к коняге");
                }
                if (Rooms[id].addons.clerical) {
                    add("Клирические ошибки");
                }
                if (Rooms[id].addons.axe) {
                    add("Дикий топор");
                }
            $room.append('<button class="add">Присоединится</button>');
            $room.append('<button class="leave">Покинуть</button>');
            $room.append('<button class="go">Поехали!</button>');
            $room.append('<button class="delete">Распустить</button>');

            Rooms[id].playerList = $room.find('.player');

            Rooms[id].$game = $room.find('.go');
            Rooms[id].$delete = $room.find('.delete');
            Rooms[id].$leave = $room.find('.leave');
            Rooms[id].$add = $room.find('.add');

            Rooms[id].$game.hide();
            Rooms[id].$delete.hide();
            Rooms[id].$leave.hide();
            Rooms[id].$add.hide();

            Rooms[id].$game.click({ id: id}, room.ready);
            Rooms[id].$delete.click({ id: id}, room.del);
            Rooms[id].$leave.click({ id: id}, room.remPlayer);
            Rooms[id].$add.click({ id: id}, room.addPlayer);
        }
    };
    // Удаление комнаты
    room.remove = function(id){
        $waitRoom.find("#room" + id).remove();
    };
// /Комната

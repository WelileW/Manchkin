// API
game.deleteGame = function(){
    $.ajax({
        type: "DELETE",
        processData: false,
        contentType: 'text/plain',
        data: "",
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId
    });
};
game.moveCard  = function(type, number, place, newPlace, x, y, newPlayer){
    $.ajax({
        type: "POST",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({
            'type': type,
            'number': Number(number),
            'oldPlace': place,
            'place': newPlace,
            'x': Number(x),
            'y': Number(y),
            'player': Number(newPlayer)
        }),
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/card"
    });
};
game.rotate = function(event){
    if(findCard(event) == "Treasure" &&
        (event.data.place == 'Table' || event.data.place == 'PlayerTable')
        ) {
        $.ajax({
            type: "PUT",
            processData: false,
            contentType: 'text/plain',
            data: Number($(event.currentTarget).attr('number')),
            url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/card"
        });
    }
};
game.up = function(){
    $.ajax({
        type: "GET",
        processData: false,
        contentType: 'text/plain',
        accept: 'application/json',
        data: "",
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/card",
        success: function (up){
            if(up.exist) {
                for (var card in up.card) {
                    if (!up.card.hasOwnProperty(card)) continue;
                    var it = up.card[card];
                    var box;
                    switch (it.type) {
                        case 'Treasure':
                            box = CardsOfTreasure;
                            break;
                        case 'Instance':
                            box = CardsOfInstance;
                            break;
                        default :
                            alert("/card GET прислал кривой тип");
                    }
                    if (it.place == "Deck")
                        box.removeCard(it.number);
                    else
                        switch (it.oldPlace) {
                            case 'Deck':
                                box.createCard(it.number, it.player, it.place, it.type, it.sprite, it.x, it.y, it.rotate);
                                break;
                            case 'Garbage':
                            case 'Table':
                            case 'PlayerHand':
                            case 'PlayerTable':
                                box.moveCard(it.number, it.place, it.player, it.x, it.y, it.rotate);
                                break;
                            default :
                                alert("Попытка переместится из неизвестного места");
                        }
                }
                GarbageInstance.show(up.GarbageInstance);
                GarbageTreasure.show(up.GarbageTreasure);
                if (up.upTreasure)   GarbageTreasure.mix();
                if (up.upInstance)   GarbageInstance.mix();
                Instance.up(up.Instance);
                Treasure.up(up.Treasure);
                Chart.update();
            }
            else hall();
        }
    });
};

game.getGame = function(){
    $.ajax({
        type: "GET",
        processData: false,
        contentType: 'text/plain',
        accept: 'application/json',
        data: "",
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId,
        success: function (up){
            if(up.exist) {
                for (var card in up.card) {
                    if (!up.card.hasOwnProperty(card)) continue;
                    var it = up.card[card];
                    var box;
                    switch (it.type) {
                        case 'Treasure':
                            box = CardsOfTreasure;
                            break;
                        case 'Instance':
                            box = CardsOfInstance;
                            break;
                        default :
                            alert("/card GET прислал кривой тип");
                    }
                    box.createCard(it.number, it.player, it.place, it.type, it.sprite, it.x, it.y, it.rotate);
                }
                updateGame();
            }
            else hall();
        }
    })
};
game.mixDeck = function(event){
    $.ajax({
        type: "POST",
        processData: false,
        contentType: 'text/plain',
        data: event.data.type,
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/deck"
    });
};

game.scrollD6 = function(){
    $.ajax({
        type: "POST",
        processData: false,
        contentType: 'text/plain',
        data: nik,
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/d6"
    });
};

game.hideGarbage = function(type){
    $.ajax({
        type: "DELETE",
        processData: false,
        contentType: 'text/plain',
        data: type,
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/garbage"
    });
};
game.showGarbage = function(type){
    $.ajax({
        type: "PUT",
        processData: false,
        contentType: 'text/plain',
        data: type,
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/garbage"
    });
};

game.upPlayer = function(event){
    $.ajax({
        type: "PUT",
        processData: false,
        contentType: 'text/plain',
        accept: 'application/json',
        data: event.data.player + 1,
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/player"
    });
};
game.downPlayer = function(event){
    $.ajax({
        type: "POST",
        processData: false,
        contentType: 'text/plain',
        data: event.data.player + 1,
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/player"
    });
};
game.upLVL = function(){
    $.ajax({
        type: "GET",
        processData: false,
        contentType: 'text/plain',
        accept: 'application/json',
        data: "",
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/player",
        success: function (up){
            if(up.exist) {
                for (var player in up.player) {
                    if (!up.player.hasOwnProperty(player)) continue;
                    players[player].$lvl.html(up.player[player].lvl);
                    if (player == up.move) {
                        if (players[player].$button) players[player].$button.show();
                        players[player].max(up.move);
                    }
                    else {
                        if (players[player].$button) players[player].$button.hide();
                        players[player].min(up.move);
                    }
                }
                CardsOfInstance.sizing();
                CardsOfTreasure.sizing();
            }
            else hall();
        }
    });
};
game.playerNext = function(){
    $.ajax({
        type: "POST",
        processData: false,
        contentType: 'application/json',
        data: "",
        url: "/jax-rs-boilerplate-0.1/api/game/" + gameId + "/player"
    });
};



// /API
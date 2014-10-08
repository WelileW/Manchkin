package Manchkin.game;

import Manchkin.Chart;
import Manchkin.Room;
import Manchkin.Rooms;
import Manchkin.UserList;

import javax.json.*;
import javax.ws.rs.*;
import java.util.*;

@Path("api/game")
@Consumes("text/plain")
@Produces("application/json")
public class GameAPI {
    private static HashMap<Integer, Deck> Treasure = new HashMap<>();
    private static HashMap<Integer, Deck> Instance = new HashMap<>();
    private static HashMap<Integer, Manchkin.game.Players> Players = new HashMap<>();
    private static HashMap<Integer, Garbage> GarbageTreasure = new HashMap<>();
    private static HashMap<Integer, Garbage> GarbageInstance = new HashMap<>();
    private static HashMap<Integer, CardInGame> TreasureInGame = new HashMap<>();
    private static HashMap<Integer, CardInGame> InstanceInGame = new HashMap<>();
    private static HashMap<Integer, Manchkin.Chart> Chart = new HashMap<>();
    private static HashMap<Integer, Manchkin.game.Active> Active = new HashMap<>();

    public static void game(int id, Room room){
            Treasure.put(id, new Deck(
                    "Treasure", room.deck.get("classic"), room.addons.get("axe"),
                    room.addons.get("clerical"), room.addons.get("nfs"), room.addons.get("ranged"), room.addons.get("cheat")
            ));
            Instance.put(id, new Deck(
                    "Instance", room.deck.get("classic"), room.addons.get("axe"),
                    room.addons.get("clerical"), room.addons.get("nfs"), room.addons.get("ranged"), room.addons.get("cheat")
            ));
            Players.put(id, new Players(room.players));
            GarbageTreasure.put(id, new Garbage());
            GarbageInstance.put(id, new Garbage());
            TreasureInGame.put(id, new CardInGame());
            InstanceInGame.put(id, new CardInGame());
            Chart.put(id, new Chart());
            Active.put(id, new Active());

        Card it;
        for(int player = 0; player < Players.get(id).Players.size(); player++){
            for(int i = 0; i < 2; i++){
                it = Treasure.get(id).removeTop();
                TreasureInGame.get(id).add(it,
                        Card.Place.PlayerHand, i*20,
                        i*50, player);
                Active.get(id).add(it);
                it = Instance.get(id).removeTop();
                InstanceInGame.get(id).add(it, Card.Place.PlayerHand, 40+i*20,
                        i*50, player);
                Active.get(id).add(it);
            }
        }

    }

    @Path("/{id}")
    @DELETE
    public void deleteGame(@PathParam("id") Integer id){
        Treasure.remove(id);
        Instance.remove(id);
        Players.remove(id);
        GarbageTreasure.remove(id);
        GarbageInstance.remove(id);
        TreasureInGame.remove(id);
        InstanceInGame.remove(id);
        Chart.remove(id);
        Active.remove(id);
        Rooms.ROOMS.remove(id);
    }

    @Path("/{id}/card")
    @Consumes("application/json")
    @POST
    public void moveCard(@PathParam("id") Integer id, JsonObject card){
        // Мне не нравится это место с добавлением новых классов
        Box oldBox, newBox;
        Card it;
        switch (card.getString("type")){
            case "Treasure":
                switch (card.getString("oldPlace")){
                    case "PlayerHand":
                    case "PlayerTable":
                    case "Table":
                        oldBox = TreasureInGame.get(id);
                        break;
                    case "Deck":
                        oldBox = Treasure.get(id);
                        break;
                    case "Garbage":
                        oldBox = GarbageTreasure.get(id);
                        break;
                    default:
                        oldBox = new Box();
                        System.out.println("Карта попыталась двинуться неизвестно от куда");
                }
                switch (card.getString("place")){
                    case "PlayerHand":
                    case "PlayerTable":
                    case "Table":
                        newBox = TreasureInGame.get(id);
                        break;
                    case "Deck":
                        newBox = Treasure.get(id);
                        break;
                    case "Garbage":
                        newBox = GarbageTreasure.get(id);
                        break;
                    default:
                        newBox = new Box();
                        System.out.println("Карта попыталась двинуться неизвестно куда");
                }
                break;
            case "Instance":
                switch (card.getString("oldPlace")){
                    case "PlayerHand":
                    case "PlayerTable":
                    case "Table":
                        oldBox = InstanceInGame.get(id);
                        break;
                    case "Deck":
                        oldBox = Instance.get(id);
                        break;
                    case "Garbage":
                        oldBox = GarbageInstance.get(id);
                        break;
                    default:
                        oldBox = new Box();
                        System.out.println("Карта попыталась двинуться неизвестно от куда");
                }
                switch (card.getString("place")){
                    case "PlayerHand":
                    case "PlayerTable":
                    case "Table":
                        newBox = InstanceInGame.get(id);
                        break;
                    case "Deck":
                        newBox = Instance.get(id);
                        break;
                    case "Garbage":
                        newBox = GarbageInstance.get(id);
                        break;
                    default:
                        newBox = new Box();
                        System.out.println("Карта попыталась двинуться неизвестно куда");
                }
                break;
            default:
                oldBox = new Box();
                newBox = new Box();
                System.out.println("Карта неизвестного типа попыталась двинуться");
        }
        it = oldBox.remove(card.getInt("number"));
        newBox.add(it, Card.Place.valueOf(card.getString("place")),
                card.getInt("x"), card.getInt("y"), card.getInt("player"));
        Active.get(id).add(it);
    }

    @Path("/{id}/card")
    @Consumes("text/plain")
    @PUT
    public void rotateCard(@PathParam("id") Integer id, int number){
        Active.get(id).add(TreasureInGame.get(id).rotate(number));
    }

    @Path("/{id}/card")
    @Consumes("text/plain")
    @GET
    public JsonObject up(@PathParam("id") Integer id, String data){
        JsonObjectBuilder json = Json.createObjectBuilder();
        if(Treasure.get(id) != null) {
            json.add("exist", true);
            JsonArrayBuilder jsonCards = Json.createArrayBuilder();
            for (Card card : Active.get(id).getAll()) {
                JsonObjectBuilder jsonCard = Json.createObjectBuilder();
                jsonCard.add("number", card.number);
                jsonCard.add("player", card.player);
                jsonCard.add("oldPlayer", card.oldPlayer);
                jsonCard.add("place", card.place.toString());
                jsonCard.add("oldPlace", card.oldPlace.toString());
                jsonCard.add("rotate", card.rotate);
                jsonCard.add("x", card.x);
                jsonCard.add("y", card.y);
                jsonCard.add("type", card.type.toString());
                jsonCard.add("sprite", card.sprite);

                jsonCards.add(jsonCard.build());
            }
            json.add("card", jsonCards.build());
            json.add("Instance", Instance.get(id).top());
            json.add("Treasure", Treasure.get(id).top());
            json.add("GarbageInstance", GarbageInstance.get(id).take());
            json.add("GarbageTreasure", GarbageTreasure.get(id).take());
            json.add("upTreasure", (GarbageTreasure.get(id).Chunk.size() == 0));
            json.add("upInstance", (GarbageInstance.get(id).Chunk.size() == 0));
        }
        else json.add("exist", false);
        return json.build();

    }

    @Path("/{id}/deck")
    @Consumes("text/plain")
    @POST
    public void mixDeck(@PathParam("id") Integer id, String type){
        Deck deck;
        Garbage garbage;
        switch (type){
            case "Treasure":
                deck = Treasure.get(id);
                garbage = GarbageTreasure.get(id);
                break;
            case "Instance":
                deck = Instance.get(id);
                garbage = GarbageInstance.get(id);
                break;
            default:
                System.out.println("Неизвестный тип колоды попытался перемешаться");
                deck = new Deck("", false,false,false,false,false,false);
                garbage = new Garbage();
        }
        while (garbage.Chunk.size() != 0){
            deck.add(garbage.removeTop(), Card.Place.Deck, 0, 0, 0);
        }
        deck.mix();
    }

    @Path("/{id}/garbage")
    @Consumes("text/plain")
    @DELETE
    public void hideGarbage(@PathParam("id") Integer id, String type){
        switch (type){
            case "Treasure":
                GarbageTreasure.get(id).hide();
                break;
            case "Instance":
                GarbageInstance.get(id).hide();
                break;
            default:
                System.out.println("Карта неизвестного типа попыталась спрятаться");
        }
    }

    @Path("/{id}/garbage")
    @Consumes("text/plain")
    @PUT
    public void showGarbage(@PathParam("id") Integer id, String type){
        switch (type){
            case "Treasure":
                GarbageTreasure.get(id).show();
                break;
            case "Instance":
                GarbageInstance.get(id).show();
                break;
            default:
                System.out.println("Карта неизвестного типа попыталась открыться");
        }
    }

    @Path("/{id}/player")
    @Consumes("application/json")
    @POST
    public void next(@PathParam("id") Integer id, String data){
        Players.get(id).next();
    }

    @Path("/{id}/player")
    @Consumes("text/plain")
    @PUT
    public void upLVL(@PathParam("id") Integer id, int player){
        Players.get(id).up(player/10);
    }

    @Path("/{id}/player")
    @Consumes("text/plain")
    @POST
    public void downLVL(@PathParam("id") Integer id, int player){
        Players.get(id).down(player/10);
    }

    @Path("/{id}/player")
    @Consumes("text/plain")
    @GET
    public JsonObject upPlayer(@PathParam("id") Integer id, String data){
        JsonObjectBuilder json = Json.createObjectBuilder();
        if(Treasure.get(id) != null) {
            json.add("exist", true);
            JsonArrayBuilder jsonPlayers = Json.createArrayBuilder();
            for (Manchkin.game.Players.Player player : Players.get(id).Players) {
                JsonObjectBuilder jsonCard = Json.createObjectBuilder();
                jsonCard.add("lvl", player.lvl);

                jsonPlayers.add(jsonCard.build());
            }
            json.add("player", jsonPlayers.build());
            json.add("move", Players.get(id).move);
        }
        else   json.add("exist", false);
        return json.build();
    }

    @Path("/{id}/chart")
    @Consumes("text/plain")
    @POST
    public void echo(@PathParam("id") Integer id, String data){
        Chart.get(id).add(data);
    }

    @Path("/{id}/chart")
    @Consumes("text/plain")
    @GET
    public Map<Integer, String> getAll(@PathParam("id") Integer id, @QueryParam("nik") String data) {
        UserList.update(data);
        return Chart.get(id).Chart;
    }

    Random rnd = new Random();
    @Path("/{id}/d6")
    @Consumes("text/plain")
    @POST
    public void scrollD6(@PathParam("id") Integer id, String nik){
        int scroll = rnd.nextInt(6) + 1;
        String note = nik + " бросает кубик... " + scroll;
        System.out.println(note);
        Chart.get(id).add(note);
    }

    @Path("/{id}")
    @Consumes("text/plain")
    @GET
    public JsonObject getGame(@PathParam("id") Integer id, String data){
        JsonObjectBuilder json = Json.createObjectBuilder();
        if(Treasure.get(id) != null) {
            json.add("exist", true);
            JsonArrayBuilder jsonCards = Json.createArrayBuilder();
            for (Card card : TreasureInGame.get(id).Chunk) {
                JsonObjectBuilder jsonCard = Json.createObjectBuilder();
                jsonCard.add("number", card.number);
                jsonCard.add("player", card.player);
                jsonCard.add("place", card.place.toString());
                jsonCard.add("rotate", card.rotate);
                jsonCard.add("x", card.x);
                jsonCard.add("y", card.y);
                jsonCard.add("type", card.type.toString());
                jsonCard.add("sprite", card.sprite);

                jsonCards.add(jsonCard.build());
            }
            for (Card card : InstanceInGame.get(id).Chunk) {
                JsonObjectBuilder jsonCard = Json.createObjectBuilder();
                jsonCard.add("number", card.number);
                jsonCard.add("player", card.player);
                jsonCard.add("place", card.place.toString());
                jsonCard.add("x", card.x);
                jsonCard.add("y", card.y);
                jsonCard.add("type", card.type.toString());
                jsonCard.add("sprite", card.sprite);

                jsonCards.add(jsonCard.build());
            }
            for (Card card : GarbageTreasure.get(id).Chunk) {
                JsonObjectBuilder jsonCard = Json.createObjectBuilder();
                jsonCard.add("number", card.number);
                jsonCard.add("player", card.player);
                jsonCard.add("place", card.place.toString());
                jsonCard.add("x", card.x);
                jsonCard.add("y", card.y);
                jsonCard.add("type", card.type.toString());
                jsonCard.add("sprite", card.sprite);

                jsonCards.add(jsonCard.build());
            }
            for (Card card : GarbageInstance.get(id).Chunk) {
                JsonObjectBuilder jsonCard = Json.createObjectBuilder();
                jsonCard.add("number", card.number);
                jsonCard.add("player", card.player);
                jsonCard.add("place", card.place.toString());
                jsonCard.add("x", card.x);
                jsonCard.add("y", card.y);
                jsonCard.add("type", card.type.toString());
                jsonCard.add("sprite", card.sprite);

                jsonCards.add(jsonCard.build());
            }
            json.add("card", jsonCards.build());
        }
        else    json.add("exist", false);
        return json.build();
    }
}

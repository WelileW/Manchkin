package Manchkin.game;

public class Card {

    enum Place{
        PlayerHand,
        PlayerTable,
        Table,
        Deck,
        Garbage
    }

    enum Type{
        Treasure,
        Instance
    }

    public int number;
    public int player;
    public int oldPlayer;
    public Place place;
    public Place oldPlace;
    public int x, y;
    public Type type;
    public String sprite;
    public boolean rotate;

    public Card(int number, String type, String deck, int deckNumber){
        this.number = number;
        rotate = false;
        player = 0;
        oldPlayer = 0;
        place = Place.Deck;
        oldPlace = Place.Deck;
        x = 0;
        y = 0;
        this.type = Type.valueOf(type);
        String dopNull;
        if(deckNumber < 10){
            dopNull = "0";
        }
        else dopNull = "";
        sprite = "sprite " + type + " " + deck + " card" + dopNull + deckNumber;
    }

    public void move(Place place, int x, int y, int player){
        this.oldPlace = this.place;
        this.place = place;
        if(this.oldPlace != this.place || this.place == Place.Deck || this.place == Place.Garbage) this.rotate = false;
        this.x = x;
        this.y = y;
        this.oldPlayer = this.player;
        this.player = player;
    }

    public void rotating(){
        if(this.place != Place.Deck || this.place != Place.Garbage) {
            if (rotate) rotate = false;
            else rotate = true;
        }
    }

}

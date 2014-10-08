package Manchkin;

import java.util.*;

public class Room {
    public Set<String> players = new LinkedHashSet<>();
    public boolean ready = false;
    public Map<String,Boolean> deck = new TreeMap<>();
    public Map<String,Boolean> addons = new TreeMap<>();

    public Room(String player, boolean classic, boolean axe, boolean clerical,
                boolean nfs, boolean ranged, boolean cheat){
        this.players.add(player);

        // deck
        this.deck.put("classic", classic);

        // addons
        this.addons.put("axe", axe);
        this.addons.put("clerical", clerical);
        this.addons.put("nfs", nfs);
        this.addons.put("ranged", ranged);
        this.addons.put("cheat", cheat);
    }

    public void add(String player){
        this.players.add(player);
    }

    public void remove(String player){
        this.players.remove(player);
    }
}

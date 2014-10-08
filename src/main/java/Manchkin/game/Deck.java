package Manchkin.game;

import Manchkin.game.Card;

import java.util.ArrayList;
import java.util.Random;


public class Deck extends Box {
    int number;

    public Deck(String type, boolean classic, boolean axe, boolean clerical,
                boolean nfs, boolean ranged, boolean cheat){
        number = 0;
        switch (type) {
            case "Instance":
                if (classic)    addAll(type, "classic", 95);
                if (axe)        addAll(type, "axe", 60);
                if (clerical)   addAll(type, "cleric", 66);
                if (nfs)        addAll(type, "nfs", 78);
                if (ranged)     addAll(type, "ranged", 70);
                if (cheat)      addAll(type, "cheat", 70);
                break;

            case "Treasure":
                if (classic)    addAll(type, "classic", 75);
                if (axe)        addAll(type, "axe", 40);
                if (clerical)   addAll(type, "cleric", 46);
                if (nfs)        addAll(type, "nfs", 34);
                if (ranged)     addAll(type, "ranged", 60);
                if (cheat)      addAll(type, "cheat", 40);
                break;
            default:
                System.out.println("Ошибка: неправильно задан тип карт в колоде");
        }
        mix();
    }

    private void addAll(String type, String deck, int capacity){
        for(int i = 0; i < capacity ; i++){
            Chunk.add(new Card(number, type, deck, i));
            number++;
        }
    }

    public void mix(){
        Random rnd = new Random();
        for (int i = 1; i < Chunk.size(); i++) {
            int j = rnd.nextInt(i);
            Card temp = Chunk.get(i);
            Chunk.set(i, Chunk.get(j));
            Chunk.set(j, temp);
        }
    }

    public boolean top(){
        return (Chunk.size() != 0);
    }

    @Override
    public Card remove(int number){
        return removeTop();
    }
}



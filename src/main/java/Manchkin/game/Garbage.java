package Manchkin.game;

import Manchkin.game.Card;

import java.util.*;

public class Garbage extends Box {
    public int number;

    // Просматриваем
    public void show(){
        if(number < Chunk.size())   number++;
    }

    // Открыто ли кладбище?
    public int take(){
        return Chunk.size() - number;
    }

    // Прячем кладбище
    public void hide(){
        number = 0;
    }

    public Garbage(){
        number = 0;
    }
}

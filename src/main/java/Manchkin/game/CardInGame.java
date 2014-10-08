package Manchkin.game;


import Manchkin.game.Card;

import java.util.*;

public class CardInGame extends Box {

    public Card rotate(int number){
        Card card;
        card = findCard(number);
        card.rotating();
        return card;
    }
}

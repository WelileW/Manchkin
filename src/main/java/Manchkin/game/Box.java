package Manchkin.game;


import java.util.*;

public class Box {
    // В коробке стоит стопка
    public ArrayList<Card> Chunk = new ArrayList<>();

    // Положить в коробку карту
    public void add(Card card, Card.Place place, int x, int y, int player){
        card.move(place, x, y, player);
        Chunk.add(card);
    }

    // Взять из коробки карту
    public Card remove(int number){
        Card card;
        card = findCard(number);
        Chunk.remove(card);
        Chunk.trimToSize();
        return card;
    }

    public Card removeTop(){
        Card card;
        card = Chunk.get(Chunk.size() - 1);
        Chunk.remove(Chunk.size() - 1);
        Chunk.trimToSize();
        return card;
    }

    // Найти в коробке карту
    protected Card findCard(int number){
        for(Card card : Chunk){
            if(card.number == number)
                return card;
        }
        System.out.println("Создана несуществующая карта в Box");
        return new Card(-1, "", "", 0);
    }
}

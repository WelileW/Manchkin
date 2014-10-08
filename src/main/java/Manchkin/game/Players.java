package Manchkin.game;


import java.util.*;

public class Players {

    public ArrayList<Player> Players= new ArrayList<>();
    public int move;

    class Player{
        public int lvl;
        String name;
        void up(){
            if(lvl < 20)    lvl++;
        }
        void down(){
            if(lvl > 1)    lvl--;
        }
        Player(String name){
            this.name = name;
            this.lvl = 1;
        }
    }

    public void next(){
        move++;
        if(move == Players.size())  move = 0;
    }

    public Players(Set<String> players){
        Iterator<String> itr = players.iterator();
        while (itr.hasNext()) {
            Players.add(new Player(itr.next()));
        }
        move = 0;
    }

    public ArrayList<Player> get(){
        return Players;
    }

    public void up(int number){
        Players.get(number).up();
    }

    public void down(int number){
        Players.get(number).down();
    }
}

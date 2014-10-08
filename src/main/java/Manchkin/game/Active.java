package Manchkin.game;

import java.util.*;


public class Active {
    public Map<Card, Calendar> ActiveCard = new HashMap<>();

    public Active(){
        // Every 1 min ActiveCard is cleaning itself
        int delay = 5*1000;
        TimerTask task = new TimerTask(){
            public void run(){
                if(!ActiveCard.isEmpty()) {
                    Map.Entry<Card, Calendar> iter;
                    Iterator<Map.Entry<Card, Calendar>> it = ActiveCard.entrySet().iterator();
                    Calendar now = Calendar.getInstance();
                    while (it.hasNext()) {
                        iter = it.next();
                        // If time out is 1 min
                        if (now.getTimeInMillis() - iter.getValue().getTimeInMillis() > delay) {
                            it.remove();
                        }
                    }
                }
            }
        };
        Timer timer  = new Timer();

        timer.schedule(task, 1, delay);
    }

    public void add(Card card){
        ActiveCard.put(card, Calendar.getInstance());
    }

    public Set<Card> getAll(){
        return ActiveCard.keySet();
    }

}

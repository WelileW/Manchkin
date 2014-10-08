package Manchkin;


import java.util.*;

public class Chart {
    public HashMap<Integer, String> Chart = new HashMap<>();
    private int id = 2;
    private static final int size = 20; // постоянный размер хранилища

    public void add(String data){
        if(this.Chart.containsKey(id - size)){
            this.Chart.remove(id - size);
        }
        this.Chart.put(id, data);
        id++;
    }

    public Chart(){
        add("Ali Baba");
        add("Vlad Dracula");
    }
}

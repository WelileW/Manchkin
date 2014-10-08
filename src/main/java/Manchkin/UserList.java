package Manchkin;

import javax.inject.Singleton;
import javax.ws.rs.*;
import java.util.*;
@Singleton
@Path("api/users")


public class UserList {
    private static final Map<String, Calendar> USERS = new HashMap<>();

    public UserList(){
        // Every 5 min UserList is cleaning itself
        TimerTask task = new TimerTask(){
            public void run(){
                Iterator<Map.Entry<String, Calendar>> it = USERS.entrySet().iterator();
                Calendar now = Calendar.getInstance();
                while (it.hasNext()){
                    // If time out is 5 min
                    if(now.getTimeInMillis() - it.next().getValue().getTimeInMillis() > 1000*60*5){
                        it.remove();
                    }
                }
            }
        };
        Timer timer  = new Timer();

        timer.schedule(task, 1, 1000*60);
    }



    public static void update(String user){
        USERS.put(user, Calendar.getInstance());
    }

    @Consumes("text/plain")
    @Produces("application/json")
    @GET
    public static Set<String> getAll(){
        System.out.println(USERS.keySet());
        return USERS.keySet();
    }
}

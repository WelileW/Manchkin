package Manchkin;


import Manchkin.game.GameAPI;

import javax.json.*;
import javax.ws.rs.*;
import java.util.*;

@Path("api/rooms")
@Consumes("text/plain")
@Produces("application/json")
public class Rooms {
    public static final HashMap<Integer,Room> ROOMS = new HashMap<>();
    private static int i = 1;

    static{
        ROOMS.put(0, new Room("", false, false, false, false, false, false));
    }

    // Create new Room
    @Consumes("application/json")
    @POST
    public void newRoom(JsonObject room){
        // It is Java EE 7 !!!
        ROOMS.put(i, new Room(room.getString("player"),
                room.getBoolean("classic"),
                room.getBoolean("axe"),
                room.getBoolean("clerical"),
                room.getBoolean("nfs"),
                room.getBoolean("ranged"),
                room.getBoolean("cheat")
        ));
        i++;
    }

    @Consumes("text/plain")
    // Update. Send all Rooms to client
    @GET
    public Map<Integer,Room> getAll(String data){
        return ROOMS;
    }

    // Delete Room
    @DELETE
    public void del(Integer id){
        ROOMS.remove(id);
    }

    // The room
    @Path("/{id}")
    // Add player to this room
    @PUT
    public void add(@PathParam("id") Integer id, String player){
        ROOMS.get(id).add(player);
    }

    // Remove player from room
    @Path("/{id}")
    @DELETE
    public void remove(@PathParam("id") Integer id, String player){
        ROOMS.get(id).remove(player);
    }

    // Create new game based this room
    @Path("/{id}")
    @POST
    public void ready(@PathParam("id") Integer id){
        ROOMS.get(id).ready = true;
        GameAPI.game(id, ROOMS.get(id));
    }
}

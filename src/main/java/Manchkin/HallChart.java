package Manchkin;

import javax.ws.rs.*;
import java.util.Map;


@Path("api/chart")
@Consumes("text/plain")
@Produces("application/json")
public class HallChart {
    static Chart chart = new Chart();

    // Create new note
    @POST
    public void echo(String data){
        chart.add(data);
    }

    // Update client's chart
    @GET
    public Map<Integer, String> getAll(@QueryParam("nik") String data) {
        UserList.update(data);
        return chart.Chart;
    }
}

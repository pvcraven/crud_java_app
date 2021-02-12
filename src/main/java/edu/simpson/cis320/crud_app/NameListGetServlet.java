package edu.simpson.cis320.crud_app;

import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "NameListGetServlet", value = "/api/name_list_get")
public class NameListGetServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(NameListGetServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        log.log(Level.FINE, "Get people servlet");

        // Type of output (HTML, JSON, image, whatever
        response.setContentType("application/json");

        // Get an object that can write to the network
        PrintWriter out = response.getWriter();

        // Use our DAO to get a list of people
        List<Person> peopleList = PersonDAO.getPeople();

        Jsonb jsonb = JsonbBuilder.create();
        String jsonString = jsonb.toJson(peopleList);

        // Write out that string
        out.println(jsonString);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }
}

package edu.simpson.cis320.crud_app;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "FormTestCheckboxServlet", value = "/api/form_test_checkbox_servlet")
public class FormTestCheckboxServlet extends HttpServlet {

    /* Handle Post or Get requests */
    private void processPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // Grab the data we got via a parameter
        String [] vehicles = request.getParameterValues("vehicle");

        // If nothing is checked, we get a null. We do not get a list with
        // no items.
        if(vehicles == null) {
            out.println("There were no vehicles checked.");
        } else {
            // List each vehicle checked.
            out.println("List of vehicles");

            for (int i = 0; i < vehicles.length; i++) {
                // Just print the data out to confirm we got it.
                out.println("vehicle='" + vehicles[i] + "'");
            }
            out.println("Done with the list");
        }
    }

    /* I don't care if it is a get or a post, do the same for both. */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.processPost(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.processPost(request, response);
    }
}
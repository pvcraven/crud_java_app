package edu.simpson.cis320.crud_app;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "SetCookieServlet", value = "/api/set_cookie_servlet")
public class SetCookieServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        String cookieName = request.getParameter("cookieName");
        String cookieValue = request.getParameter("cookieValue");

        Cookie userCookie = new Cookie(cookieName, cookieValue);

        // Positive number - Cookie stored for that many seconds
        // Zero - Delete cookie
        // Negative number - Cookie is only stored while the browser is open
        userCookie.setMaxAge(60*60*24*365); //Store cookie for 1 year

        response.addCookie(userCookie);
        out.println("Done setting the cookie");
    }
}
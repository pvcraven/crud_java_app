package edu.simpson.cis320.crud_app;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "memeServlet", value = "/meme")
public class MemeServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(MemeServlet.class.getName());

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        log.log(Level.INFO, "Meme servlet");

        ServletContext context = getServletContext();
        InputStream imageStream = context.getResourceAsStream("WEB-INF/classes/meme_image.jpg");
        BufferedImage image = ImageIO.read(imageStream);

        // Get graphics context (pen)
        Graphics g = image.getGraphics();

        // Set font
        String fontName = "Century Schoolbook";
        int fontSize = 70;
        int fontStyle = Font.BOLD;
        Font font = new Font(fontName, fontStyle, fontSize);
        g.setFont(font);

        String message = request.getParameter("message");
        if (message == null) {
            message = "Simpson Storm x";
        }

        // Set the color
        Color myColor = new Color(0xFFFFFF); // Red
        g.setColor(myColor);

        // Draw the string
        g.drawString(message, 100, 100);

        // Set the color
        myColor = new Color(0xEEB41E); // Gold
        g.setColor(myColor);

        // Draw the string
        g.drawString(message, 102, 102);

        // Dispose of the pen
        g.dispose();

        // Write out the image
        response.setContentType("image/jpg");
        OutputStream out = response.getOutputStream();
        ImageIO.write(image, "JPG", out);
    }
}
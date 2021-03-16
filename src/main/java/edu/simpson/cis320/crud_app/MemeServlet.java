package edu.simpson.cis320.crud_app;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.logging.Level;
import java.util.logging.Logger;

// Map the servlet to a URL
@WebServlet(name = "meme", value = "/meme")
public class MemeServlet extends HttpServlet {
    // Create logger for this class
    private final static Logger log = Logger.getLogger(MemeServlet.class.getName());

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Log that we got here
        log.log(Level.INFO, "Meme servlet");

        // Grab the message as a parameter. Default if there's none.
        String message = request.getParameter("message");
        if (message == null) {
            message = "Simpson Storm";
        }

        // Get the servlet 'context', and from that, grab the image.
        // Image should be stored in the "resources" folder.
        ServletContext context = getServletContext();
        InputStream imageStream = context.getResourceAsStream("/WEB-INF/classes/simpson.jpg");
        BufferedImage img = ImageIO.read(imageStream);

        // Get the graphics context. Like a pen, for drawing.
        Graphics g = img.getGraphics();

        // Set the font for the graphics context.
        String fontName = "Century Schoolbook";
        int fontSize = 140;
        int fontStyle = Font.BOLD;
        Font font = new Font(fontName, fontStyle, fontSize);
        g.setFont(font);

        // Set the color for the graphics context
        g.setColor(new Color(0x6B0623));

        // Draw our text
        g.drawString(message, 100, 100);

        // Set the color for the graphics context
        g.setColor(new Color(0xEEB41E));

        // Draw our text, offset
        g.drawString(message, 105, 105);

        // Get rid of the pen, free up resources
        g.dispose();

        // This will be a jpeg image
        response.setContentType("image/jpg");

        // Grab the output stream
        OutputStream out = response.getOutputStream();

        // Write out image to the output stream
        ImageIO.write(img, "JPG", out);

    }

}
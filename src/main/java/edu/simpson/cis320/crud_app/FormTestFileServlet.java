package edu.simpson.cis320.crud_app;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "FormTestServlet", value = "/api/form_test_file_servlet")
@MultipartConfig(fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 5 * 5)
public class FormTestFileServlet  extends HttpServlet {

    /* Utility function to parse out the file name that was uploaded. */
    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("file")) {
                return s.substring(s.indexOf("=") + 2, s.length()-1);
            }
        }
        return "";
    }

    /* Process an uploaded file */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // You can output in any format, text/JSON, text/HTML, etc. We'll keep it simple
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // This is just here to show you can upload form fields in addition to the file
        String description = request.getParameter("description");
        out.println("Description: "+description);

        // If you have a control with multiple files that can be uploaded, there is a "getParts" method
        Part filePart = request.getPart("file"); // Retrieves <input type="file" name="file">
        if(filePart != null) {
            // We get this long complicated line here:
            out.println("content-disposition: " + filePart.getHeader("content-disposition"));

            // This function pulls the file name out of that.
            String fileName = extractFileName(filePart);

            // Print the file name
            out.println(fileName);

            // Write the file here.
            // I don't use the file name, because I haven't shown how to protect against
            // "directory traversal" yet.
            filePart.write("C:/temp/myfile.txt");
        } else {
            out.println("No part");
        }
        out.println("Done");
    }
}

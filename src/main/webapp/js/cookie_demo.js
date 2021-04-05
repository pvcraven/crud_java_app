// This function uses JavaScript to print all our cookies.
// It does not use the back-end at all.
function getCookiesJavaScript() {
    // Use a variable called "output" and keep adding things
    // we want to output to it.
    var output = "Cookie String\n";

    // Cookies are stored in a weird it-is-a-string-but-it-isn't called
    // document.cookie. "document" is the Document Object Model (DOM)
    // Here we output it.
    output += document.cookie;
    output += "\n";

    // Wait, all those cookies are on one line! What if we want
    // to list the cookies individually?
    $.each(document.cookie.split(/; */), function()  {
        var splitCookie = this.split('=');
        var name = splitCookie[0];
        var value = splitCookie[1];
        if (name.length > 0)
            output += name + "=" + value + "\n";
    });

    // Now, set out output field with the 'output' variable.
    $('#getCookiesResult').html(output);
}

// Although we don't use this function, if you want to just get a cookie
// given a cookie name, here's how you do it.
function getByCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

// This function will make an AJAX call to the servlet engine
// which will then list all the cookies. We'll take what the
// server returns and output it to the screen.
function getCookiesJava() {

    var url = "api/get_cookies_servlet";

    $.post(url, null, function (dataFromServer) {
        // Put the results of this call in our result field
        $('#getCookiesResult').html(dataFromServer)
    });
}

// Want to set a cookie with JavaScript? Here's how!
function setCookieJavascriptButton() {
    var cookieName = $("#cookieName").val();
    var cookieValue = $("#cookieValue").val();

    // I know all the cookies are stored in "document.cookie" as one
    // long string. So storing 1 cookie in this string clears all the
    // old cookies? No! It doesn't. So this isn't really a string.
    document.cookie = cookieName + "=" + cookieValue + "; SameSite=Lax";

    // Clear the form fields.
    $("#cookieName").val("");
    $("#cookieValue").val("");
}

// Want to set a cookie with the back-end Java?
// Here's how!
function setCookieJava() {

    var url = "api/set_cookie_servlet";

    // Grab key/value pair
    var cookieName = $("#cookieName").val();
    var cookieValue = $("#cookieValue").val();

    var dataToServer = {cookieName : cookieName, cookieValue : cookieValue};

    // Send to server. We'll set it in the java code.
    $.post(url, dataToServer, function (dataFromServer) {
        console.log("Finished calling servlet.");
        console.log(dataFromServer);
        $("#cookieName").val("");
        $("#cookieValue").val("");
    });
}

// Hook up the buttons
var button = $('#getCookiesJava');
button.on("click", getCookiesJava);

button = $('#getCookiesJavaScriptButton');
button.on("click", getCookiesJavaScript);

button = $('#setCookieJavascript');
button.on("click", setCookieJavascriptButton);

button = $('#setCookieJava');
button.on("click", setCookieJava);
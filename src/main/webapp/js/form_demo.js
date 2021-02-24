/* Method 4: Use an AJAX Get */
function jqueryGetButtonAction() {

    // URL where our servlet is at
    let url = "api/form_test_servlet";
    // Use jQuery to grab the dataout of the field
    let myFieldValue = $("#jqueryGetField").val();
    // Create a JSON object with field names and field values
    let dataToServer = { fieldname : myFieldValue };

    // Send the request to the servlet
    $.get(url, dataToServer, function (dataFromServer) {
        // This happens when we are don
        console.log("Finished calling servlet.");
        console.log(dataFromServer);
    });
}

// Hook the function above to the 'submit' button for the Method 4 form
let jqueryGetButton = $('#jqueryGetButton');
jqueryGetButton.on("click", jqueryGetButtonAction);

/* Method 5: Use an AJAX Post */
function jqueryPostButtonAction() {

    let url = "api/form_test_servlet";
    let myFieldValue = $("#jqueryPostField").val();
    let dataToServer = { fieldname : myFieldValue };

    $.post(url, dataToServer, function (dataFromServer) {
        console.log("Finished calling servlet.");
        console.log(dataFromServer);
    });
}
let jqueryPostButton = $('#jqueryPostButton');
jqueryPostButton.on("click", jqueryPostButtonAction);

/* Method 6: AJAX Post using JSON data */
function jqueryPostJSONButtonAction() {

    let url = "api/form_test_json_servlet";
    let myFieldValue = $("#jqueryPostJSONField").val();
    let dataToServer = { fieldname : myFieldValue };

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(dataToServer),
        success: function(dataFromServer) {
            console.log(dataFromServer);
        },
        contentType: "application/json",
        dataType: 'text' // Could be JSON or whatever too
    });
}
let jqueryPostJSONButton = $('#jqueryPostJSONButton');
jqueryPostJSONButton.on("click", jqueryPostJSONButtonAction);

Dropzone.options.myDropzone = {
    init: function() {
        this.on("success", function(file, response) {
            console.log(response);
        });
    }
};
// Main Javascript File

function htmlSafe(data) {
    return data.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
}

function formatPhoneNumber(phoneNumberString) {
    // Strip all non-digits
    let cleaned = phoneNumberString.replace(/\D/g, '');

    // Are we left with 10 digits? This will return them in
    // three groups
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
}

function getDateFromSQL(sqlDate) {
    let cleaned = sqlDate.replace(/\D/g, '');
    let match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
    let resultDate = new Date(match[1], match[2], match[3]);
    return resultDate;
}

function updateTable() {
    // Here's where your code is going to go.
    console.log("updateTable called");

    // Define a URL
    let url = "api/name_list_get";

    // Start a web call. Specify:
    // URL
    // Data to pass (nothing in this case)
    // Function to call when we are done
    $.getJSON(url, null, function(json_result) {
        // List all the names
        $('#datatable tbody tr').remove();
        for (let i = 0; i < json_result.length; i++) {
            // Print the first name
            console.log(json_result[i].first, json_result[i].last);

            bday = getDateFromSQL(json_result[i].birthday);
            bdayString = bday.toLocaleDateString();
            console.log(bday);

            $('#datatable tbody').append('<tr><td>'
                +htmlSafe(json_result[i].first)
                +'</td><td>'
                +htmlSafe(json_result[i].last)
                +'</td><td>'
                +htmlSafe(json_result[i].email)
                +'</td><td>'
                +formatPhoneNumber(htmlSafe(json_result[i].phone))
                +'</td><td>'
                +htmlSafe(bdayString)
                +'</td></tr>');
        }
        console.log("Done");
    });
}

// Call your code.
updateTable();

// Called when "Add Item" button is clicked
function showDialogAdd() {

    // Print that we got here
    console.log("Opening add item dialog");

    // Clear out the values in the form.
    // Otherwise we'll keep values from when we last
    // opened or hit edit.
    // I'm getting it started, you can finish.
    $('#id').val("");
    $('#firstName').val("");

    // Show the hidden dialog
    $('#myModal').modal('show');
}

// There's a button in the form with the ID "addItem"
// Associate the function showDialogAdd with it.
let addItemButton = $('#addItem');
addItemButton.on("click", showDialogAdd);

function fieldValidate(field, regex) {
    // Get the field
    let v1 = field.val();

    // Create the regular expression
    let reg = regex;

    // Test the regular expression to see if there is a match
    if (reg.test(v1)) {
        // Set style for outline of form field
        field.removeClass("is-invalid");
        field.addClass("is-valid");
        return true;
    } else {
        // Set style for outline of form field
        field.removeClass("is-valid");
        field.addClass("is-invalid");
        return false;
    }
}

// Called when "Save changes" button is clicked
function saveChanges() {
    // Print that we got here
    console.log("Save Changes start");

    let success = true;
    let valid;

    let firstNameField = $('#firstName')
    valid = fieldValidate(firstNameField, /^[^0-9]{1,10}$/);
    if (!valid) success = false;

    let lastNameField = $('#lastName');
    fieldValidate(lastNameField, /^[^0-9]{1,10}$/);
    if (!valid) success = false;

    let emailField = $('#email');
    fieldValidate(emailField, /^.+@.+$/);
    if (!valid) success = false;

    let phoneField = $('#phone');
    fieldValidate(phoneField, /^\d{3}-\d{3}-\d{4}$/);
    if (!valid) success = false;

    let birthdayField = $('#birthday');
    fieldValidate(birthdayField, /^\d{4}-\d{2}-\d{2}$/);
    if (!valid) success = false;

    if (success) {
        console.log("Valid form!");
        let url = "api/form_test_json_servlet";
        let dataToServer = { first : firstNameField.val(),
                             last : lastNameField.val(),
                             email : emailField.val(),
                             phone : phoneField.val(),
                             birthday : birthdayField.val(),
        };

        url = "api/name_list_edit";
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(dataToServer),
            success: function(dataFromServer) {
                console.log(dataFromServer);
                $('#myModal').modal('hide');
                updateTable();
            },
            contentType: "application/json",
            dataType: 'text' // Could be JSON or whatever too
        });
    }
}

let saveChangesButton = $('#saveChanges');
saveChangesButton.on("click", saveChanges);
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
    return new Date(match[1], match[2], match[3]);
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

            let bday = getDateFromSQL(json_result[i].birthday);
            let bdayString = bday.toLocaleDateString();
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
                +'</td><td>'
                +"<button type='button' name='edit' class='editButton btn btn-primary' value='" + json_result[i].id + "'>Edit</button>"
                +"&nbsp;<button type='button' name='delete' class='deleteButton btn btn-danger' value='" + json_result[i].id + "'>Delete</button>"
                +'</td></tr>');
        }
        $(".deleteButton").on("click", deleteItem);
        $(".editButton").on("click", editItem);
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
    $('#lastName').val("");
    $('#phone').val("");
    $('#email').val("");
    $('#birthday').val("");

    // Show the hidden dialog
    $('#myModal').modal('show');
}

// When the modal is fully shown
$('#myModal').on('shown.bs.modal', function () {
    // Move focus to first field
    $('#firstName').focus();
});

// Fire an even with keydown
$(document).keydown(function(e){
    // Log the key
    console.log(e.keyCode);
    // If key is an 'a' and dialog not shown, pop it up
    if(e.keyCode == 65 && !$('#myModal').is(':visible')) {
        showDialogAdd();
    }
    // If key is an enter key and dialog is shown, save changes
    if(e.keyCode == 13 && $('#myModal').is(':visible')) {
        saveChanges();
    }

});

// There's a button in the form with the ID "addItem"
// Associate the function showDialogAdd with it.
let addItemButton = $('#addItem');
addItemButton.on("click", showDialogAdd);

function fieldValidate(field, regex) {
    // Get the field
    let field_value = field.val();

    // Test the regular expression to see if there is a match
    if (regex.test(field_value)) {
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
    let valid = true;

    // Get the field
    let firstNameField = $('#firstName');
    // Run the validate function to see if this field is legit
    // Also sets field styles
    valid = fieldValidate(firstNameField, /^[^0-9]{1,10}$/);
    // If it isn't value, and we haven't yet had a field that has
    // been invalid, then set the focus here.
    if (!valid && success) {
        firstNameField.focus();
    }
    // Not valid field, say that form isn't going to work
    if (!valid) {
        success = false;
    }

    let lastNameField = $('#lastName');
    valid = fieldValidate(lastNameField, /^[^0-9]{1,10}$/);
    if (!valid && success) lastNameField.focus();
    if (!valid) success = false;

    let emailField = $('#email');
    valid = fieldValidate(emailField, /^.+@.+$/);
    if (!valid) success = false;

    let phoneField = $('#phone');
    valid = fieldValidate(phoneField, /^\d{3}-\d{3}-\d{4}$/);
    if (!valid) success = false;

    let birthdayField = $('#birthday');
    valid = fieldValidate(birthdayField, /^\d{4}-\d{2}-\d{2}$/);
    if (!valid) success = false;

    if (success) {
        console.log("Valid form!");
        let dataToServer = { first : firstNameField.val(),
                             last : lastNameField.val(),
                             email : emailField.val(),
                             phone : phoneField.val(),
                             birthday : birthdayField.val(),
        };

        let url = "api/name_list_edit";
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(dataToServer),
            success: function(dataFromServer) {
                console.log("Done with insert");
                console.log(dataFromServer);

                let result = JSON.parse(dataFromServer);
                if ('error' in result) {
                    alert(result.error);

                    $("#toast-body").html("Error: Record not inserted");
                    $('#myToast').toast({delay: 5000});
                    $('#myToast').toast('show');

                } else {
                    $('#myModal').modal('hide');
                    updateTable();

                    $("#toast-body").html("Record inserted");
                    $('#myToast').toast({delay: 5000});
                    $('#myToast').toast('show');
                }
            },
            contentType: "application/json",
            dataType: 'text'
        });
    }
}

let saveChangesButton = $('#saveChanges');
saveChangesButton.on("click", saveChanges);


function deleteItem(e) {
    console.log("Delete");
    console.log(e.target.value);

    let dataToServer = { id : e.target.value };

    let url = "api/name_list_delete";
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(dataToServer),
        success: function(dataFromServer) {
            console.log("Done with delete");
            console.log(dataFromServer);

            let result = JSON.parse(dataFromServer);
            if ('error' in result) {
                alert(result.error);
            } else {
                $('#myModal').modal('hide');
                updateTable();
            }
        },
        contentType: "application/json",
        dataType: 'text'
    });
}

function editItem(e) {
    console.debug("Edit");
    console.debug(e.target.value);

    // Grab the id from the event
    let id = e.target.value;

    // This next line is fun.
    // "e" is the event of the mouse click
    // "e.target" is what the user clicked on. The button in this case.
    // "e.target.parentNode" is the node that holds the button. In this case, the table cell.
    // "e.target.parentNode.parentNode" is the parent of the table cell. In this case, the table row.
    // "e.target.parentNode.parentNode.querySelectorAll("td")" gets an array of all matching table cells in the row
    // "e.target.parentNode.parentNode.querySelectorAll("td")[0]" is the first cell. (You can grab cells 0, 1, 2, etc.)
    // "e.target.parentNode.parentNode.querySelectorAll("td")[0].innerHTML" is content of that cell. Like "Sam" for example.
    // How did I find this long chain? Just by setting a breakpoint and using the interactive shell in my browser.
    let first = e.target.parentNode.parentNode.querySelectorAll("td")[0].innerHTML;
    let last = e.target.parentNode.parentNode.querySelectorAll("td")[1].innerHTML;
    let email = e.target.parentNode.parentNode.querySelectorAll("td")[2].innerHTML;
    let phone = e.target.parentNode.parentNode.querySelectorAll("td")[3].innerHTML;
    let birthday = e.target.parentNode.parentNode.querySelectorAll("td")[4].innerHTML;
    // repeat line above for all the fields we need

    $('#id').val(id); // Yes, now we set and use the hidden ID field
    $('#firstName').val(first);
    $('#lastName').val(last);
    $('#email').val(email);

    // Regular expression to match phone number pattern:
    // (515) 555-1212
    let regexp = /\((\d{3})\) (\d{3})-(\d{4})/;
    let match = phone.match(regexp);
    // Log what we matched
    console.log("Matches:");
    console.log(match);
    // Reformat into 515-555-1212
    let phoneString = match[1] + "-" + match[2] + "-" + match[3];
    $('#phone').val(phoneString);

    // Parse date to current time in milliseconds
    let timestamp = Date.parse(birthday);
    // Made date object out of that time
    let dateObject = new Date(timestamp);
    // Convert to a full ISO formatted string
    let fullDateString = dateObject.toISOString();
    console.log(fullDateString);
    // Trim off the time part
    let shortDateString = fullDateString.split('T')[0];

    $('#birthday').val(shortDateString);

    // Etc

    // Show the window
    $('#myModal').modal('show');

}

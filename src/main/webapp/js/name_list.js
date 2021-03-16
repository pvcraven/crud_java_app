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


function showDialogAdd() {
    console.log("ADD ITEM");

    // Show the hidden dialog
    $('#myModal').modal('show');

    $('#id').val("");
    $('#firstName').val("");

}

// There's a button in the form with the ID "addItem"
// Associate the function showDialogAdd with it.
let addItemButton = $('#addItem');
addItemButton.on("click", showDialogAdd);

function saveChanges() {
    console.log("Save changes");
    let firstName = $('#firstName').val();
    console.log("First name: " + firstName);

    // Create the regular expression
    let reg = /^[A-Za-z]{1,10}$/;

    // Test the regular expression to see if there is a match
    if (reg.test(firstName)) {
        $('#firstName').removeClass("is-invalid");
        $('#firstName').addClass("is-valid");
    } else {
        $('#firstName').removeClass("is-valid");
        $('#firstName').addClass("is-invalid");
    }
}
// There's a button in the form with the ID "addItem"
// Associate the function showDialogAdd with it.
let saveChangesButton = $('#saveChanges');
saveChangesButton.on("click", saveChanges);



var form = document.forms[0];

function submitForm() {
    var data = {};
    var errorMessage = '';

    if (form.gameName.value) data.gameName = form.gameName.value;
    if (!form.gameCode.value) {
        errorMessage += 'Please Enter Game Code';
    } else {
        data.gameCode = form.gameCode.value;
    } 
    if (!form.email.value && !validateEmail(form.email)) {
        errorMessage += 'Please Enter Proper Email';
    } else {
        data.email = form.email.value;
    }
    if (!form.password.value) {
        errorMessage += 'Please Enter Password';
    } else {
        data.password = form.password.value
    }
    if (form.setRules.value) {
        data.setRules = form.setRules.value;
    } 
    
    fetch('/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(submitSuccess)
    .catch(submitError);
}
/////////////// Form Validation Function ///////////////

function validateEmail(target, isRequired) {
    var email = target.value;
    if (!email && !isRequired) return true;
        // http://emailregex.com/
     var isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
     if (!isValid) error(target);
         return isValid;
}



/////////////// Form Submit Callbacks //////////////////

function submitSuccess() {
    
}

function submitError() {

}






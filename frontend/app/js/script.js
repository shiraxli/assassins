var form = document.forms[0];

function submitOnEnterKey(submitFunction, targetForm) {
   targetForm = targetForm || form;
    var runOnKeydown = function(e) { if (e.keyCode === 13) submitFunction();  }
    var children = targetForm.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.id && child.id === 'js-admin-info')
            submitOnEnterKey(submitFunction, child);
        var type = child.getAttribute('type');
        if (type === 'text' || type === 'email' || type === 'password' ||
            type === 'number' || type === 'phone')
        child.onkeydown = runOnKeydown;

                }

}

function submitCreateForm() {
    var data = {};
    var errorMessage = '';

    if (form.gameName.value) data.gameName = form.gameName.value;
    if (!form.gameCode.value) {
        errorMessage += 'Please Enter Game Code; ';
    } else {
        data.gameCode = form.gameCode.value;
    }
    if (!form.email.value || !validateEmail(form.email)) {
        errorMessage += 'Please Enter Proper Email; ';
    } else {
        data.email = form.email.value;
    }
    if (!form.password.value) {
        errorMessage += 'Please Enter Password; ';
    } else {
        data.password = form.password.value
    }
    if (form.setRules.value) {
        data.setRules = form.setRules.value;
    }

    if (errorMessage) return displayError(errorMessage);

    fetch('/create', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function(res) {
        if (!res.ok) return submitError(res)
<<<<<<< HEAD
        window.location = '/';
    }).catch(submitError());
}
=======
        else return res.json.then(function(result) {
           window.location = '/games/' + result.gameCode + '/players'
        });
    }).catch(submitError);
}

function joinGame() {
    var data = {};
    var errorMessage = '';
    if (!form.gameCode.value) {
        error(form.gameCode);
        errorMessage += 'Please Enter Game Code; ';
    } else {
        data.gameCode = form.gameCode.value;
    }
    if (!form.firstName.value) {
        error(form.firstName);
        errorMessage += 'Please Enter First Name; ';
    } else {
        data.firstName = form.firstName.value;
    }
    if (!form.lastName.value) {
        error(form.lastName);
        errorMessage += 'Please Enter Last Name; ';
    } else {
        data.lastName = form.lastName.value;
    }
    if (!form.email.value || !validateEmail(form.email)) {
        error(form.email);
        errorMessage += 'Please Enter Proper Email; ';
    } else {
        data.email = form.email.value;
    }
    if (!form.password.value) {
        error(form.password);
        errorMessage += 'Please Enter Password; ';
    } else {
        data.password = form.password.value
    }

    if (errorMessage) return displayError(errorMessage);
>>>>>>> 126bea2e592bb10ef60b5699b571c17e6b8a2287

    fetch('/join', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function(res) {
        if (!res.ok) return submitError(res);
        // localStorage.token = result.token;
        else console.log('joined a game!');
        //window.location = '/player';
    }).catch(submitError);
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

function error(target) {
    target.style.border = '3px solid #F00';
}

function clearError(target) {
    if (target === 'message')
        return document.getElementById('js-error-message').style.visibility = 'hidden';
    target.style.border = '1px solid #888';
}

function clearForm() {
    form.reset();
    clearError('message');
    var divs = document.getElementsByClassName('hidden');
    for (var i = 0; i < divs.length; i++)
        divs[i].style.display = '';
}

/////////////// Form Submit Callbacks //////////////////

function submitSuccess(res) {
    if (!res.ok) return submitError(res);
    console.log('Successfully Submitted Form');
}

function submitError(res, message) {
    console.log(message);
    if (res.status >= 400 && res.status < 500)
        return res.text().then(function(ErrorMessage) {displayError(ErrorMessage)});
    if(message)
        return displayError(message);
    return displayError('There Was a Problem Somewhere in The Program');
}

function displayError(message) {
    var errorDiv = document.getElementById('js-error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
}

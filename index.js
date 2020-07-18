console.log("firebase", firebase)
console.log("firestore", firebase.firestore)

let errorMessage = document.getElementsByClassName("message")
let errorVisible = document.getElementsByClassName("error-block")
let borderRed = document.getElementsByTagName("input")
const labelRed = document.getElementsByTagName("label")
const button = document.getElementById("button")
const formRegister = document.getElementById("register-form")
let userList = []
let nameFlag = false
let emailFlag = false
let passwordFlag = false
let ConfirmPasswordFlag = false

formRegister.addEventListener("submit", (e) => {
    e.preventDefault();

    // if (activeSubmitBtn()) {
    //     window.location.replace('src/transaction/transaction.html')
    // }

})

function validation() {
    const userName = document.getElementById("user-name").value
    const userEmail = document.getElementById("user-email").value
    const userPassword = document.getElementById("user-Password").value
    const confirmPaswd = document.getElementById("confirm-Password").value
    console.log("hello")
        // debugger



    // for UserName field

    if (userName == "") {

        labelRed[0].style.color = "#693232"
        borderRed[0].style.border = "2px solid red"
        errorVisible[0].style.display = "inline-flex"
        errorMessage[0].innerHTML = "Please fill out this field"

    } else
    if (userName.length < 6) {
        labelRed[0].style.color = "#693232"
        borderRed[0].style.border = "2px solid red"
        errorVisible[0].style.display = "inline-flex"
        errorMessage[0].innerHTML = "Username must be greater than 8 character"

    } else if (userName != "") {
        labelRed[0].style.color = "dodgerblue"
        borderRed[0].style.border = "2px solid dodgerblue"
        errorVisible[0].style.display = "none"
        nameFlag = true
        activeSubmitBtn()
    }
    userList.push(localStorage.setItem("userNameKey", userName))


    //For Email field 

    if (userEmail == "") {
        labelRed[1].style.color = "#693232"
        borderRed[1].style.border = "2px solid red"
        errorVisible[1].style.display = "inline-flex"
        errorMessage[1].innerHTML = "Please fill out this field"

    } else
    if ((userEmail.indexOf("@") <= 0) && userEmail.charAt(userEmail.length - 4) != "@") {
        labelRed[1].style.color = "#693232"
        borderRed[1].style.border = "2px solid red"
        errorVisible[1].style.display = "inline-flex"
        errorMessage[1].innerHTML = "'@' Position invalid, it's incomplete"

    } else
    if ((userEmail.charAt(userEmail.length - 4) != ".") &&
        (userEmail.charAt(userEmail.length - 3) != "")) {
        labelRed[1].style.color = "#693232"
        borderRed[1].style.border = "2px solid red"
        errorVisible[1].style.display = "inline-flex"
        errorMessage[1].innerHTML = "' . ' is Invalid Position"

    } else if (userEmail != "") {
        labelRed[1].style.color = "dodgerblue"
        borderRed[1].style.border = "2px solid dodgerblue"
        errorVisible[1].style.display = "none"
        emailFlag = true
        activeSubmitBtn()
    }


    //For Password field

    if (userPassword == "") {
        labelRed[2].style.color = "#693232"
        borderRed[2].style.border = "2px solid red"
        errorVisible[2].style.display = "inline-flex"
        errorMessage[2].innerHTML = "Please fill out this field"

    } else
    if (userPassword != "") {
        labelRed[2].style.color = "dodgerblue"
        borderRed[2].style.border = "2px solid dodgerblue"
        errorVisible[2].style.display = "none"

        if (userPassword.length >= 6) {

            var paswd = /^(?=.*[0-9])(?=.*[!@#$?%^&*])[a-zA-Z0-9!@#$?%^&*]{6,16}$/;
            if (!userPassword.match(paswd)) {

                labelRed[2].style.color = "#693232"
                borderRed[2].style.border = "2px solid red"
                errorVisible[2].style.display = "inline-flex"
                errorMessage[2].innerHTML = "Password should be a combination of an aphabet, number and a special character"
                passwordFlag = false
                activeSubmitBtn()
            }
        } else {
            labelRed[2].style.color = "#693232"
            borderRed[2].style.border = "2px solid red"
            errorVisible[2].style.display = "inline-flex"
            errorMessage[2].innerHTML = "Please Enter a 6 characters long password."
            passwordFlag = false
            activeSubmitBtn()
        }
        passwordFlag = true
        activeSubmitBtn()
    }


    //Confirm Password
    if (confirmPaswd == "") {
        labelRed[3].style.color = "#693232"
        borderRed[3].style.border = "2px solid red"
        errorVisible[3].style.display = "inline-flex"
        errorMessage[3].innerHTML = "Please fill out this field"

    } else
    if (confirmPaswd != "") {


        if (confirmPaswd.length >= 6) {

            var paswd = /^(?=.*[0-9])(?=.*[!@#$?%^&*])[a-zA-Z0-9!@#$?%^&*]{6,16}$/;
            if (!confirmPaswd.match(paswd)) {

                labelRed[3].style.color = "#693232"
                borderRed[3].style.border = "2px solid red"
                errorVisible[3].style.display = "inline-flex"
                errorMessage[3].innerHTML = "Password should be a combination of an aphabet, number and a special character"

            } else
            if (confirmPaswd != userPassword) {

                labelRed[3].style.color = "#693232"
                borderRed[3].style.border = "2px solid red"
                errorVisible[3].style.display = "inline-flex"
                errorMessage[3].innerHTML = "Password does not Match"


            } else if (confirmPaswd == userPassword) {
                labelRed[3].style.color = "dodgerblue"
                borderRed[3].style.border = "2px solid dodgerblue"
                errorVisible[3].style.display = "none"
                ConfirmPasswordFlag = true
                activeSubmitBtn()
            }
        }
        userList.push(localStorage.setItem("userPasswordKey", userPassword))
    }
    authenticationSignUp()

    function authenticationSignUp() {
        firebase.auth().createUserWithEmailAndPassword(userEmail, confirmPaswd)
            .then(function(user) {
                console.log('user---->', user)

                const userID = user.user.uid
                localStorage.setItem('userId', userID)

                firebase.firestore().collection('users').doc(userID).set({
                    userName,
                    userEmail
                }).then(function() {
                    swal({
                        title: "Successfully Registered",
                        // text: "You clicked the button!",
                        icon: "success",
                    });
                    location.href = "src/dashboard/dashboard.html"
                }).catch(function(error) {
                    var errorMessage = error.message;
                    console.log(errorMessage)
                });
            })
            .catch(function(error) {
                var errorMessage = error.message;
                console.log(errorMessage)
            })

    }

    function activeSubmitBtn() {
        if (nameFlag && emailFlag && passwordFlag && ConfirmPasswordFlag) {
            return true
        }
        return false

    }
}





// Login-section Form

const formLogin = document.getElementById("login-form")
let isvalid = false
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    // debugger

    // if (isvalid) {
    //     alert("Succesfully LogedIn")
    //     window.location.replace('src/transaction/transaction.html')
    // } else {

    //     labelRed[4].style.color = "#693232"
    //     borderRed[4].style.border = "2px solid red"
    //     errorVisible[4].style.display = "inline-flex"
    //     errorMessage[4].innerHTML = "Invalid User Name"

    //     labelRed[5].style.color = "#693232"
    //     borderRed[5].style.border = "2px solid red"
    //     errorVisible[5].style.display = "inline-flex"
    //     errorMessage[5].innerHTML = "Invalid Password"
    //     alert("invalid password and user name")
    // }


})

function loginValidation() {
    // debugger
    var loginName = document.getElementById("userName").value
    console.log("username--->", loginName)
    var loginPassword = document.getElementById("userPassword").value
    console.log("userpassword--->", loginPassword)
    var loginEmail = document.getElementById("userName").value

    if (loginName == "") {
        labelRed[4].style.color = "#693232"
        borderRed[4].style.border = "2px solid red"
        errorVisible[4].style.display = "inline-flex"
        errorMessage[4].innerHTML = "Please fill out this field"
    } else if (loginName != "") {
        labelRed[4].style.color = "dodgerblue"
        borderRed[4].style.border = "2px solid dodgerblue"
        errorVisible[4].style.display = "none"
    }

    if (loginPassword == "") {
        labelRed[5].style.color = "#693232"
        borderRed[5].style.border = "2px solid red"
        errorVisible[5].style.display = "inline-flex"
        errorMessage[5].innerHTML = "Please fill out this field"
    } else
    if (loginPassword != "") {
        labelRed[5].style.color = "dodgerblue"
        borderRed[5].style.border = "2px solid dodgerblue"
        errorVisible[5].style.display = "none"
    }

    //firebase authentication 
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function(user) {
            console.log('user--->', user)
            const userID = user.user.uid
            localStorage.setItem('userId', userID)

            // swal({
            //     title: "LogIn Successful",
            //     // text: "You clicked the button!",
            //     icon: "success",
            // });
            window.location.replace("src/dashboard/dashboard.html")

        }).catch(function(error) {

            var errorMessage = error.message;

            swal({
                title: errorMessage,
                // text: "You clicked the button!",
                icon: "warning",
            });
        });

    // Get date from local Storage

    var storedName = localStorage.getItem("userNameKey");
    var storedPw = localStorage.getItem("userPasswordKey");

    if (loginName == storedName && loginPassword == storedPw) {

        isvalid = true
    } else {
        isvalid = false

    }
}
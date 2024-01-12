let loginForm = document.getElementById('loginForm');
let signupButton = document.getElementById('signUpButton');

loginForm.addEventListener('submit',userAuthentication);
signupButton.addEventListener('click',signUpRedirect);

function signUpRedirect() {
    window.location.href = "../SignUp/signUp.html";
}

async function userAuthentication(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let pass = document.getElementById('password').value;

    localStorage.setItem("Email",email)

    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {

        await axios.post("http://52.90.191.116:3000/users/login",{
            email:email,
            pass:pass
        }).then(res => {
            alert("Login succesful")
            localStorage.setItem("token",res.data.token)
            window.location.href = "../ChatApp/chat.html";
            console.log("res===>",res)
        })

    } catch (err) {
        let status = err.response.status
        if(status === 404){
            alert("Invalid email or password");
        } else if(status === 500){
            alert("Server crashed")
        }
    }
}
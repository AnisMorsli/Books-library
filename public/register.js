//variable target the input of user that willing to create a new account
    const form = document.getElementById('form');
    const email = document.getElementById("email");
    const pass = document.getElementById("pass");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const username = document.getElementById('username')
// post request that will be send throw axios to the serveur
// this is to prevent the page of changing directory by default
    form.onsubmit =(e) =>{
        e.preventDefault();
//axios post request with .then .catch
        axios({
            method: 'post',
            url:'/register',
            data: {
                email : email.value,
                pass : pass.value,
                username : username.value,
                firstname : firstname.value,
                lastname : lastname.value
            }
        })
        .then((res)=>{
            if(res.status == 200){
                location.href = '/login'
            }
        })
        .catch((err)=>{
            email.style.border = 'red 2px solid '
            console.log(err)
        })
    }
    // next will be trying to do it with async/await try/catch

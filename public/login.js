//set variable 
const form = document.getElementById('form')
const email = document.getElementById('email')
const pass = document.getElementById('pass')

//set the post request using axios 
// trying the ascyn/awit fonction
// you can't redirect from the serveur using axios you need to send a respose back to axios from the serveur so it can redirect you from the front end , this is BS !!!
form.onsubmit = async (e)  => {
    e.preventDefault();
    try{
        const res = await axios.post('/login',{
            pass: pass.value,
            email: email.value
        })
        if(res.status == 404){
            email.style.border = 'solid red 2px'
        }else if(res.status == 406){
            pass.style.border = 'solid red 2px'
        }else if(res.status == 200){
            location.href = `/userdashbord/${res.data.ID}`
        }
    }
    catch(err) {
        console.log(err.res)
    }
}
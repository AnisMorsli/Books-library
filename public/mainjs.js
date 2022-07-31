const logout_form =document.getElementById('logout_form')

logout_form.onclick = async (e)=>  {
    e.preventDefault();
    try{
        const res = await axios.post('/logout',{
        })
        if (res.status == 200){
            location.href = '/'
        }
    }catch(err){
        console.log(err)
    }
    
}
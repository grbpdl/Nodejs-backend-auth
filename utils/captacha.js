const axios=require('axios').default
require('dotenv').config()
async function chechCaptacha(recaptachavalue)
 {
   axios(
    {
        url:`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptachavalue}`,
        method:'POST'
    }).then(({data})=>{
        console.log(data)
        return data.success;
    }).catch(error=>{
        console.log(error)
        return false;
    })
    
}
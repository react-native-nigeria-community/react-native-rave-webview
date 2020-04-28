export const verifyPayment = async (user)=>{
    try {
        const response = await fetch(`https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/verify`,{
            method:'POST',
            body:JSON.stringify(user),
            headers:{
                'Content-Type':'application/json; charset=UTF-8',
                accept:'application/json'
            },
        }).catch(err => console.log(err));
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
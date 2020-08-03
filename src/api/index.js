export const verifyPayment = async (key,ref)=>{
    try {
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${ref}/verify`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json; charset=UTF-8',
                accept:'application/json',
                'Authorization': `Bearer ${key}`
            },
        }).catch(err => console.log(err));
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
import moment from "moment";
export const beforeToday=(expireIn)=>{

    // Convert expireIn to Date object
    const date = moment.utc(expireIn, 'DD-MM-YYYY HH:mm').toDate();

    // Get current time in UTC and add 2 hours
    const currentTime = moment.utc().add(2, 'hours').toDate();

    // Check if date is before currentTime
    const invalid = moment(date).isBefore(moment(currentTime));
    // console.log(date,currentTime,checkValid);
   
    if (invalid){
     return true; //this means that you can't set expiration day before today now it should be after some time
    }else{
     return false;
    }
}
export const AfterToday=(expireIn)=>{

    // Convert expireIn to Date object
    const date = moment.utc(expireIn, 'DD-MM-YYYY HH:mm').toDate();

    // Get current time in UTC and add 2 hours
    const currentTime = moment.utc().add(2, 'hours').toDate();

    // Check if date is after currentTime
    const invalid = moment(date).isAfter(moment(currentTime));
    
   
    if (invalid){
     return true;
    }else{
     return false;
    }
}
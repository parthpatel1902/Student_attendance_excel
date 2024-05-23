const isValidDate = async (inputDate)=>{
    var dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  
    if (!dateFormat.test(inputDate)) {
      return "Please enter the date in yyyy-mm-dd format"
    }
  
    var year = parseInt(inputDate.substring(0, 4), 10);
    var month = parseInt(inputDate.substring(5, 7), 10);
    var day = parseInt(inputDate.substring(8, 10), 10);
  
    if (month < 1 || month > 12) {
      return "Invalid month";
    }
  
    if (day < 1 || day > 31) {
      return "Invalid day";
    }
  
    // Check for February and leap year
    if (month === 2) {
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        // Leap year
        if (day > 29) {
          return `You enter year ${year} which is a leap year so it should have only 29 days in february`;
        }
      } else {
        // Not a leap year
        if (day > 28) {
          return `You enter year ${year} which is not a leap year so it should have only 28 days in february`;
        }
      }
    }
  
    // Check for months with 30 days
    if ([4, 6, 9, 11].includes(month) && day > 30) {
      return `0${month} month has 30 days`;
    }

    const dateCheck = new Date(inputDate);

    if (isNaN(dateCheck.getTime())) {
      throw new Error('Invalid date format');
    }
  
    if(dateCheck.getDay() === 0){
      return "Please select a valid date as Sunday is not considered a working day"
    }
  
    return false;
}

module.exports = {isValidDate}
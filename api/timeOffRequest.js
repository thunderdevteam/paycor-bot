var request = require('request');

const token = 'Gk4zQRdyONKKbZujHqTmo92ZDMjul3um7I8lDEZPWNzFSIlS5u66dx_8OGW4OJJOOWgHXwi5nGRGEUbHNtxkqwG6-TD1iMHHlCXRv9eizlOEi-uudd7v_TUxEDhqKg2P5HI6SaoN6n-y5tjZFNEiK0hL34CuBhbVy3WqpGtcMCso6WvS';
//"/v1/clientDetail?clientId=" + clientId + '&employeeId=' + employeeId
var getData = (clientId, EmployeeId, callback) => {
    request({
        method: 'GET',
        url: `http://localhost/absencemanagementservice/v1/clients/${clientId}/employees/${EmployeeId}/benefitHoursBalances`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }, function(error, res, body){
        callback(body);
    }); 
}

var getClientDetails = (clientId, employeeId, callback) => {
    request({
        method: 'GET',
        url: "http://localhost/absencemanagementservice/v1/clientDetail?clientId=" + clientId + "&employeeId=" + employeeId,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }, function(error, res, body){
        callback(body);
    }); 
}

var getTimeCardDetails = (clientId, EmployeeId, date, callback) => {
    request({
        method: 'GET',
        url: `http://localhost/Time/api/TimeCard/${clientId}/${EmployeeId}?date=${date}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }, function(error, res, body){
        callback(body);
    }); 
}

var getHolidays = (clientId, EmployeeId, startDate, endDate, callback) => {
    request({
        method: 'GET',
        url: `http://localhost/Time/api/Schedule/GetScheduleHoursForEmployee?clientId=${clientId}&employeeUid=${EmployeeId}&startDate=${startDate}&endDate=${endDate}&api_key=Schedule`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }, function(error, res, body){
        callback(body);
    }); 
}


var getExecptions = (clientId, employeeId, startDate, callback) => {

    getClientDetails(clientId, employeeId, function(data){
        let clientdata = JSON.parse(data);
        console.log(clientdata);

        request({
            method: 'GET',
            url: `http://localhost/Time/api/v1/employees/${clientdata.employeeGuid}/TimeCardExceptions?startDate=08%2F28%2F2018`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }, function(error, res, body){
            callback(body);
        }); 
    });
}
/**
 * Time card(My Time Card details) for date :https://secure-quarterly.paycor.com/Time/api/TimeCard/302/181284952495643?date=08%2F21%2F2018
 * * Time card(Time Card Exception) for date :https://secure-quarterly.paycor.com/Time/api/v1/employees/b132561b-a4e0-0000-0000-00002e010000/TimeCardExceptions?startDate=08%2F21%2F2018
 * My Schedule Hours:https://secure-quarterly.paycor.com/Time/api/Schedule/GetScheduleHoursForEmployee?clientId=302&employeeUid=181284952495643&startDate=8%2F21%2F2018&endDate=8%2F21%2F2018&api_key=Schedule
 * Time off details:https://secure-quarterly.paycor.com/absencemanagementservice/v1/clients/302/employees/181284952495643/timeOffRequests?fromDate=08%2F27%2F2018
 * Holiday :https://secure-quarterly.paycor.com/Time/api/Schedule/GetScheduleHoursForEmployee?clientId=302&employeeUid=181284952495643&startDate=8%2F21%2F2018&endDate=9%2F21%2F2018&api_key=Holiday
 * Create Time Off: i am not sure we have to do this 
 */
module.exports.getData = getData;
module.exports.getTimeCardDetails = getTimeCardDetails;
module.exports.getHolidays = getHolidays;
module.exports.getExecptions = getExecptions;

return module.exports;
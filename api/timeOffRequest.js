var request = require('request');

var getData = (callback) => {
    request({
        method: 'GET',
        url: 'http://localhost/absencemanagementservice/v1/clients/302/employees/1546568950252/benefitHoursBalances',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 9LDQrGSCMhdsINJLWxZSQRcBjWt8q4D1-F63DhY47PrctoXG1-kSayl3n52bboJdPg5IGXCh4jpdivo8gQAT9IS-3PgRUYiL2QG9z9di8mbGaWuNPubFJPhCU_E1KzGKr-pFRMsqLR0D0qD_2rWeHu2GB_omSbnEY2X0sLA4MTcGQU2M"
        }
    }, function(error, res, body){
        callback(body);
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

return module.exports;
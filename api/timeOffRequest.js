var request = require('request');

var getData = (callback) => {
    request({
        method: 'GET',
        url: 'http://localhost/absencemanagementservice/v1/clients/302/employees/1546568950252/benefitHoursBalances',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 9RIaHiM_gkzJdiCMzCKSEJ3GwWKPflldKAmED7s5GRM1vyvEGZrcaZcRVPaCs9CfozmAjBz8x095Np78B4RDY1FCuQ_fu4kDYlebElfR972UMxSoxlDVeFI8lUi-8pebKIlbYZSdEqbP9WWAoEX6-Cft4wM1vMw6IAcvhXfC2oX7lAnn"
        }
    }, function(error, res, body){
        callback(body);
    }); 
}

module.exports.getData = getData;

return module.exports;
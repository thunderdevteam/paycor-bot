var formatDate = (dt) => {
    dt = new Date(dt.getTime() + Math.abs(dt.getTimezoneOffset() * 60000));
        let mm = dt.getMonth() + 1;
        mm = (mm < 10) ? '0' + mm : mm;
        let dd = dt.getDate();
        dd = (dd < 10) ? '0' + dd : dd;
        let yyyy = dt.getFullYear();
        return mm + '/' + dd + '/' + yyyy; 
}

module.exports.formatDate = formatDate;
return module.exports; 
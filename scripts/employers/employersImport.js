const fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'employers.tsv');
let columns = ['Employer_ID', 'Employer', 'Occupation_ID', 'Avatar_Image', 'Address', 'City', 'State', 'Zipcode', 'Email', 'Overview'];

fs.readFile(filePath, "utf8", function (err, data) {
    //Windows BS
    data.split('\n').forEach(d => {
        let row = d.split('\t');
        let emailVal = row[columns.indexOf('Email')];
        let email = `'${emailVal !== undefined && emailVal.length > 0 ? emailVal : ""}'`;
        let query = `insert into gilded_public.employers(title, image_avatar_url, address, city, state, zipcode, email, overview_link)` +
        ` values('${row[columns.indexOf('Employer')]}', '${row[columns.indexOf('Avatar_Image')]}', '${row[columns.indexOf('Address')]}', '${row[columns.indexOf('City')]}', '${row[columns.indexOf('State')]}', '${row[columns.indexOf('Zipcode')]}', ${email}, '${row[columns.indexOf('Overview')]}');`;
        let currentID = `(SELECT currval('gilded_public.employers_id_seq'))`;
        let socCodes = row[columns.indexOf('Occupation_ID')].split(',');
        console.log(query);
        socCodes.forEach(d => {
            let fieldId = d.split('-')[0];
            let occupationId = d.split('-')[1];
            let mappingQuery = `insert into gilded_public.employeroccupations(field_id, soc_id, employer_id)`
            + `values(${fieldId}, ${occupationId}, ${currentID});`;
            console.log(mappingQuery);
        });
    });
});
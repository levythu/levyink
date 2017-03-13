var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: "smtp.ym.163.com",
    port: 994,
    secure: true,
    auth:
    {
        user: '',
        pass: ''
    }
});
var childp=require('child_process');

function getDateString()
{
    var t=new Date();
    return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();
}
childp.exec('node dumpdb.js',{encoding:"utf8"},function(error, stdout, stderr)
{
    transporter.sendMail(
    {
        from: 'Notification <noreply@levy.at>',
        to: 'zly.george@163.com',
        subject: '[From Levyink Webserver] Database Dump file on '+getDateString(),
        text: 'Hi,\n     Please check the attachments to get the file. Thx.',
        attachments: [
        {
            filename: 'dbdump-'+getDateString()+".json",
            content: stdout
        }]
    },function(error, info)
    {
        if (error==null)
            console.log("SUCC.");
        process.exit(0);
    });
});

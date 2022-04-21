import nodemailer from 'nodemailer';

/**
 *  data : {
 *      solvePeople,
        HtmlData
        subject
 *  }
 */
function sendMail(data) {
    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        secure: false,                      
        service: 'qq',                      
        port: 587,                         
        secureConnection: true,             
        auth: {
            user: '2659580957@qq.com', 
            pass: 'prwawjjrhzapecga',         
        },
    });


    let mailOptions = {
        from: '<2659580957@qq.com>',            
        to: data.solvePeople, 
        subject: data.subject,         
        html: data.HtmlData.toString(),

        date: Date.now(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

export default sendMail;
import nodemailer from 'nodemailer';
import path, { dirname, resolve} from 'path';
import fs from 'fs';
import ejs from 'ejs';


function sendMail() {
    const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'));
    const HtmlData = template({
    title: 'Ejs',
    desc: '使用Ejs渲染模板',
    });


    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        secure: false,                      
        service: 'qq',                      
        port: 587,                         
        secureConnection: true,             
        auth: {
        user: '2659580957@qq.com', 
        pass: 'qhursqlmfxyneace',         
        },
    });


    let mailOptions = {
        from: '<2659580957@qq.com>',            
        to: "2659580957@qq.com", 
        subject: "啦啦啦啦啦啦啦啦啦啦啦",           
        html: HtmlData.toString(),

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
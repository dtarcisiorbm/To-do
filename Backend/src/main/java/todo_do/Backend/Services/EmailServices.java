package todo_do.Backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("haospa123@gmail.com");

        mailSender.send(message);

        //String subject = "Bem-vindo ao nosso serviço!";
        //String text = "Olá " + data.getLogin() + ",\n\n Obrigado por se cadastrar no nosso serviço!";
        //emailService.sendEmail(data.getLogin(), subject, text);
    }
}
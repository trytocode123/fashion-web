
package com.example.backend.cotroller;

import com.example.backend.service.IEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
    
    private final IEmailService emailService;

    public TestController(IEmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/email")
    public ResponseEntity<?> testEmail(@RequestParam String email) {
        try {
            System.out.println("DEBUG: Testing email to " + email);
            emailService.sendVNPaySuccessMail(email, "TEST_REF", 10000.0);
            return ResponseEntity.ok("Email request sent (Check logs for Async result)");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}

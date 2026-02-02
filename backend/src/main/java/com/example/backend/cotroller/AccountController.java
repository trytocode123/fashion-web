package com.example.backend.cotroller;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.Customer;
import com.example.backend.service.ICustomerService;
import com.example.backend.service.JwtResponseService;
import com.example.backend.service.JwtService;
import com.example.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api")
public class AccountController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ICustomerService customerService;

    /* ---------------- GET ALL USER ------------------------ */
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<List<AccountDTO>> getAllUser() {
        return new ResponseEntity<>(accountService.findAll(), HttpStatus.OK);
    }

    /* ---------------- GET USER BY ID ------------------------ */
    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        AccountDTO user = accountService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>("Not Found User", HttpStatus.NO_CONTENT);
    }

    /* ---------------- CREATE NEW USER ------------------------ */
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public ResponseEntity<String> createUser(@RequestBody Account account) {
        if (accountService.add(account)) {
            return new ResponseEntity<>("Created!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("User Existed!", HttpStatus.BAD_REQUEST);
        }
    }

    /* ---------------- DELETE USER ------------------------ */
    @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) {
        accountService.delete(id);
        return new ResponseEntity<>("Deleted!", HttpStatus.OK);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody Account user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateTokenLogin(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Account userInfo = accountService.findByUsername(user.getUsername());
            Customer customer = customerService.findCustomerByAccount(userInfo);
            return ResponseEntity.ok(new JwtResponseService(userInfo.getId(), jwt,
                    userInfo.getUsername(), customer.getFullName(), userDetails.getAuthorities()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}

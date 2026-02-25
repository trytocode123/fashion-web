package com.example.backend.controller;

import com.example.backend.dto.CartDTO;
import com.example.backend.entity.Size;
import com.example.backend.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/v1/api/cart")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CartController {

    private final ICartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(cartService.getCartForUser(principal.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            Principal principal,
            @RequestParam Long productId,
            @RequestParam Size size,
            @RequestParam Integer quantity
    ) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(cartService.addItemToCart(principal.getName(), productId, size, quantity));
    }

    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateQuantity(
            Principal principal,
            @RequestParam Long cartItemId,
            @RequestParam Integer quantity
    ) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(cartService.updateItemQuantity(principal.getName(), cartItemId, quantity));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<CartDTO> removeItem(
            Principal principal,
            @PathVariable Long cartItemId
    ) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(cartService.removeItemFromCart(principal.getName(), cartItemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        cartService.clearCart(principal.getName());
        return ResponseEntity.ok().build();
    }
}

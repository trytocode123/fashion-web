package com.example.backend.service.impl;

import com.example.backend.dto.CartDTO;
import com.example.backend.dto.CartItemDTO;
import com.example.backend.entity.*;
import com.example.backend.repository.IAccountRepository;
import com.example.backend.repository.ICartItemRepository;
import com.example.backend.repository.ICartRepository;
import com.example.backend.repository.IProductRepository;
import com.example.backend.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IAccountRepository accountRepository;
    private final IProductRepository productRepository;

    @Override
    @Transactional
    public CartDTO getCartForUser(String username) {
        Cart cart = getOrCreateCart(username);
        return mapToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addItemToCart(String username, Long productId, Size size, Integer quantity) {
        Cart cart = getOrCreateCart(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in cart with same size
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId) && item.getSize() == size)
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setSize(size);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
        }

        cartRepository.save(cart);
        return mapToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateItemQuantity(String username, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(username);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDTO(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartDTO removeItemFromCart(String username, Long cartItemId) {
        Cart cart = getOrCreateCart(username);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (item.getCart().getId().equals(cart.getId())) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
            cartRepository.save(cart);
        }

        return mapToDTO(cart);
    }

    @Override
    @Transactional
    public void clearCart(String username) {
        Cart cart = getOrCreateCart(username);
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(String username) {
        Optional<Cart> optionalCart = cartRepository.findByAccount_Username(username);
        if (optionalCart.isPresent()) {
            return optionalCart.get();
        }

        // Using optional return from repository and handling null explicitly
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account == null) {
            throw new RuntimeException("Account not found");
        }

        Cart newCart = new Cart();
        newCart.setAccount(account);
        return cartRepository.save(newCart);
    }

    private CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setAccountId(cart.getAccount().getId());

        long totalPrice = 0L;
        if (cart.getCartItems() != null) {
            dto.setItems(cart.getCartItems().stream().map(item -> {
                CartItemDTO itemDTO = new CartItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setProductId(item.getProduct().getId());
                itemDTO.setProductName(item.getProduct().getName());
                itemDTO.setProductPrice(item.getProduct().getPrice());
                itemDTO.setProductImg(item.getProduct().getImg());
                itemDTO.setSize(item.getSize());
                itemDTO.setQuantity(item.getQuantity());
                return itemDTO;
            }).collect(Collectors.toList()));

            for (CartItem item : cart.getCartItems()) {
                totalPrice += (item.getProduct().getPrice() * item.getQuantity());
            }
        }

        dto.setTotalPrice(totalPrice);
        return dto;
    }
}

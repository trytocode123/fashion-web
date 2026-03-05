package com.example.backend.controller;

import com.example.backend.entity.Product;
import com.example.backend.service.IProductService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("v1/api/products")
public class ProductController {

    final IProductService productService;

    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @GetMapping()
    @Cacheable(value = "products", key = "#page + '-' + #size")
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "9") int size) {
        System.out.println("chạy lại lần 2 nếu có chuyển trang còn về lại trang thì không chạy");
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findAll(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/top8Trailer")
    @Cacheable("productsTrailer")
    public ResponseEntity<?> getTrailerTop() {
        List<Product> trailerTop8Tops = productService.trailerTop8Tops();
        return ResponseEntity.ok(trailerTop8Tops);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getInfoProduct(@PathVariable Long id) {
        Product product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public ResponseEntity<?> getProductBy(@RequestParam String name) {
        List<Product> products = productService.findProductByName(name);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterProducts(
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> genders,
            @RequestParam(required = false) List<String> sizes,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.filterProducts(categories, genders, sizes, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }
}

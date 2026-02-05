package com.example.backend.cotroller;

import com.example.backend.entity.Product;
import com.example.backend.service.IProductService;
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
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findAll(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/top8Trailer")
    public ResponseEntity<?> getTrailTop() {
        List<Product> trailerTop4Tops = productService.trailerTop8Tops();
        return ResponseEntity.ok(trailerTop4Tops);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getInfoProduct(@PathVariable Long id) {
        Product product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/product-by-name/{name}")
    public ResponseEntity<?> getProductBy(@PathVariable String name) {
        List<Product> products = productService.findProductByName(name);
        return ResponseEntity.ok(products);
    }
}

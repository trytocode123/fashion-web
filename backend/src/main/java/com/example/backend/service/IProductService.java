package com.example.backend.service;

import com.example.backend.entity.Product;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    Page<Product> findAll(Pageable pageable);
    List<Product> trailerTop8Tops();
    Product findById(Long id);
    List<Product> findProductByName(String name);
}

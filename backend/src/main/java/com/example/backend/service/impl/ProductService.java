package com.example.backend.service.impl;


import com.example.backend.entity.Product;
import com.example.backend.repository.IProductRepository;
import com.example.backend.service.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements IProductService {
    final IProductRepository productRepository;

    public ProductService(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public List<Product> trailerTop8Tops() {
        return productRepository.get8ProductTrailer();
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> findProductByName(String name) {
        return productRepository.findProductByName(name);
    }

    @Override
    public Page<Product> filterProducts(List<String> categories, List<String> genders, List<String> sizes, Long minPrice, Long maxPrice, Pageable pageable) {
        boolean hasCategories = categories != null && !categories.isEmpty();
        
        boolean hasGenders = genders != null && !genders.isEmpty();
        List<com.example.backend.entity.Gender> genderEnums = null;
        if (hasGenders) {
            genderEnums = genders.stream()
                .map(g -> {
                    if (g.equalsIgnoreCase("Men")) return com.example.backend.entity.Gender.MALE;
                    if (g.equalsIgnoreCase("Women")) return com.example.backend.entity.Gender.FEMALE;
                    return com.example.backend.entity.Gender.UNISEX;
                })
                .collect(java.util.stream.Collectors.toList());
        }

        boolean hasSizes = sizes != null && !sizes.isEmpty();
        List<com.example.backend.entity.Size> sizeEnums = null;
        if (hasSizes) {
            sizeEnums = sizes.stream()
                .map(s -> {
                    try {
                        return com.example.backend.entity.Size.valueOf(s.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        return null;
                    }
                })
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toList());
            if (sizeEnums.isEmpty()) hasSizes = false;
        }

        minPrice = minPrice != null ? minPrice : 0L;
        maxPrice = maxPrice != null ? maxPrice : Long.MAX_VALUE;

        return productRepository.filterProducts(categories, hasCategories, genderEnums, hasGenders, sizeEnums, hasSizes, minPrice, maxPrice, pageable);
    }
}

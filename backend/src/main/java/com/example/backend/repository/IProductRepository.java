package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findAll(
            Pageable pageable
    );

    @Query(value = "select * from products limit 8",
            nativeQuery = true)
    List<Product> get8ProductTrailer();

    List<Product> findProductByName(String name);
}

package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import org.springframework.data.repository.query.Param;
import com.example.backend.entity.Gender;
import com.example.backend.entity.Size;

public interface IProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findAll(
            Pageable pageable
    );

    @Query(value = "select * from products limit 8",
            nativeQuery = true)
    List<Product> get8ProductTrailer();

    @Query(value = "SELECT * FROM products p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    Page<Product> findProductByName(@Param("name") String name, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "(:hasCategories = false OR p.subCategory.category.name IN :categories) AND " +
           "(:hasGenders = false OR p.gender IN :genders) AND " +
           "(:hasSizes = false OR p.size IN :sizes) AND " +
           "(p.price >= :minPrice) AND " +
           "(p.price <= :maxPrice)")
    Page<Product> filterProducts(
            @Param("categories") List<String> categories, @Param("hasCategories") boolean hasCategories,
            @Param("genders") List<Gender> genders, @Param("hasGenders") boolean hasGenders,
            @Param("sizes") List<Size> sizes, @Param("hasSizes") boolean hasSizes,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            Pageable pageable);
}

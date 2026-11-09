package com.senai.jonatas.comprebem.config;

import com.senai.jonatas.comprebem.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CargaInicial {

    private static final String[] CATEGORIAS = {
            "Eletrônicos",
            "Roupas",
            "Alimentos",
            "Livros",
            "Brinquedos"
    };

    @Bean
    CommandLineRunner popularProdutos(ProdutoRepository produtoRepository) {
        return args -> {
            if (produtoRepository.count() >= 60) {
                return;
            }

            for (int i = 1; i <= 60; i++) {
                String categoria = CATEGORIAS[i % CATEGORIAS.length];
                produtoRepository.save(new com.senai.jonatas.comprebem.entity.Produto(
                        "Produto " + i,
                        new java.math.BigDecimal(10 * i),
                        categoria,
                        "Descrição do Produto " + i,
                        "https://via.placeholder.com/150",
                        100
                ));
            }

        };
    }
}

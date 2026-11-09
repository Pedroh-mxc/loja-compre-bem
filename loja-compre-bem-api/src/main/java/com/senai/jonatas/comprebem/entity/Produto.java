package com.senai.jonatas.comprebem.entity;

import com.senai.jonatas.comprebem.dto.ProdutoRequestDTO;
import com.senai.jonatas.comprebem.dto.ProdutoResponseDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

@Data
@Entity
@Table(name = "TB_PRODUTO")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column
    private String categoria;

    @Column(length = 500)
    private String descricao;

    @Column
    private String imagem;

    @Column(nullable = false)
    private Integer quantidade;

    public Produto() {
    }

    public Produto(String nome, BigDecimal preco, String categoria, String descricao, String imagem, Integer quantidade) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.descricao = descricao;
        this.imagem = imagem;
        this.quantidade = quantidade;
    }

    public static Produto toEntity(ProdutoRequestDTO produtoRequestDTO) {
        Produto produto = new Produto();
        produto.setNome(produtoRequestDTO.nome());
        produto.setDescricao(produtoRequestDTO.descricao());
        produto.setPreco(produtoRequestDTO.preco());
        produto.setCategoria(produtoRequestDTO.categoria());
        produto.setImagem(produtoRequestDTO.imagem());
        produto.setQuantidade(produtoRequestDTO.quantidade());
        return produto;
    }
}

package com.senai.jonatas.comprebem.repository;

import com.senai.jonatas.comprebem.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    @Query("""
            SELECT p 
                        FROM Produto p 
                        WHERE UPPER(p.nome) LIKE %:filtro% 
                                    OR UPPER(p.descricao) LIKE %:filtro%
            """)
    Page<Produto> findByFiltro(String filtro, Pageable pageable);

}

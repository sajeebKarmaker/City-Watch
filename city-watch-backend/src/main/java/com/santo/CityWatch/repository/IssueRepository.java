package com.santo.CityWatch.repository;

import com.santo.CityWatch.entity.IssueEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<IssueEntity, Long> {

  @Query(
      """
      SELECT i
      FROM IssueEntity i
      JOIN FETCH i.category c
      WHERE (:categoryFilter IS NULL OR :categoryFilter = '' OR :categoryFilter = 'All' OR c.name = :categoryFilter)
        AND (:titleSearch IS NULL OR :titleSearch = '' OR LOWER(i.title) LIKE LOWER(CONCAT('%', :titleSearch, '%')))
      ORDER BY i.createdAt DESC
      """)
  List<IssueEntity> findAllByFilters(
      @Param("categoryFilter") String categoryFilter, @Param("titleSearch") String titleSearch);

  @Query("SELECT i FROM IssueEntity i JOIN FETCH i.category WHERE i.id = :id")
  Optional<IssueEntity> findByIdWithCategory(@Param("id") long id);
}
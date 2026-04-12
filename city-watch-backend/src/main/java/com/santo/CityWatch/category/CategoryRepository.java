package com.santo.CityWatch.category;

import java.sql.PreparedStatement;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class CategoryRepository {

  private final JdbcTemplate jdbcTemplate;

  public CategoryRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public long count() {
    Long c = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM categories", Long.class);
    return c != null ? c : 0L;
  }

  public List<CategoryDto> findAll() {
    return jdbcTemplate.query(
        "SELECT id, name FROM categories ORDER BY name",
        (rs, rowNum) -> new CategoryDto(rs.getLong("id"), rs.getString("name")));
  }

  public CategoryDto insert(String name) {
    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(
        connection -> {
          PreparedStatement ps =
              connection.prepareStatement(
                  "INSERT INTO categories (name) VALUES (?)", new String[] {"id"});
          ps.setString(1, name);
          return ps;
        },
        keyHolder);
    Number key = keyHolder.getKey();
    if (key == null) {
      throw new IllegalStateException("Failed to obtain generated key for category");
    }
    return new CategoryDto(key.longValue(), name);
  }
}

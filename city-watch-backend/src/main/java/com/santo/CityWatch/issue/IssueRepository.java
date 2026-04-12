package com.santo.CityWatch.issue;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class IssueRepository {

  private final JdbcTemplate jdbcTemplate;

  public IssueRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private static RowMapper<IssueResponse> issueRowMapper() {
    return (rs, rowNum) -> {
      Timestamp created = rs.getTimestamp("created_at");
      Instant createdInstant = created != null ? created.toInstant() : Instant.EPOCH;
      return new IssueResponse(
          rs.getLong("id"),
          rs.getString("category_name"),
          rs.getString("title"),
          rs.getString("description"),
          rs.getString("status"),
          new IssueResponse.Location(rs.getDouble("latitude"), rs.getDouble("longitude")),
          rs.getString("image_url"),
          createdInstant,
          rs.getInt("report_count"));
    };
  }

  private static final String BASE_SELECT =
      """
      SELECT i.id, c.name AS category_name, i.title, i.description, i.status,
             i.latitude, i.longitude, i.location_details, i.image_url, i.report_count, i.created_at
      FROM issues i
      JOIN categories c ON c.id = i.category_id
      """;

  public List<IssueResponse> findAll(String categoryFilter, String titleSearch) {
    StringBuilder sql = new StringBuilder(BASE_SELECT).append(" WHERE 1=1 ");
    List<Object> args = new ArrayList<>();
    if (categoryFilter != null && !categoryFilter.isBlank() && !"All".equalsIgnoreCase(categoryFilter)) {
      sql.append(" AND c.name = ? ");
      args.add(categoryFilter);
    }
    if (titleSearch != null && !titleSearch.isBlank()) {
      sql.append(" AND LOWER(i.title) LIKE LOWER(?) ");
      args.add("%" + titleSearch + "%");
    }
    sql.append(" ORDER BY i.created_at DESC");
    return jdbcTemplate.query(sql.toString(), issueRowMapper(), args.toArray());
  }

  public Optional<IssueResponse> findById(long id) {
    try {
      IssueResponse row =
          jdbcTemplate.queryForObject(BASE_SELECT + " WHERE i.id = ?", issueRowMapper(), id);
      return Optional.ofNullable(row);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public long insert(CreateIssueRequest request) {
    int reports = request.reportCount() != null ? request.reportCount() : 1;
    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(
        connection -> {
          PreparedStatement ps =
              connection.prepareStatement(
                  """
                  INSERT INTO issues (
                    category_id, title, description, status, latitude, longitude,
                    location_details, image_url, report_count
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                  """,
                  new String[] {"id"});
          ps.setLong(1, request.categoryId());
          ps.setString(2, request.title());
          ps.setString(3, request.description());
          ps.setString(4, request.status());
          ps.setDouble(5, request.latitude());
          ps.setDouble(6, request.longitude());
          ps.setString(7, request.locationDetails());
          ps.setString(8, request.imageUrl());
          ps.setInt(9, reports);
          return ps;
        },
        keyHolder);
    Number key = keyHolder.getKey();
    if (key == null) {
      throw new IllegalStateException("Failed to obtain generated key for issue");
    }
    return key.longValue();
  }

  public int update(long id, UpdateIssueRequest request) {
    return jdbcTemplate.update(
        """
        UPDATE issues SET
          category_id = ?, title = ?, description = ?, status = ?,
          latitude = ?, longitude = ?, location_details = ?, image_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        request.categoryId(),
        request.title(),
        request.description(),
        request.status(),
        request.latitude(),
        request.longitude(),
        request.locationDetails(),
        request.imageUrl(),
        id);
  }

  public int delete(long id) {
    return jdbcTemplate.update("DELETE FROM issues WHERE id = ?", id);
  }

  public int incrementReportCount(long id) {
    return jdbcTemplate.update(
        "UPDATE issues SET report_count = report_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        id);
  }
}

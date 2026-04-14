package com.santo.CityWatch.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record IssueResponse(
    long id,
    String category,
    String title,
    String description,
    String status,
    Location location,
    @JsonProperty("image") String imageUrl,
    @JsonProperty("timestamp") Instant timestamp,
    @JsonProperty("reports") int reports) {

  public record Location(
      double lat,
      @JsonProperty("lng") double lng) {}
}

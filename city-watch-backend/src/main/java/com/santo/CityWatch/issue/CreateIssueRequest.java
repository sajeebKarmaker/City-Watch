package com.santo.CityWatch.issue;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateIssueRequest(
    @NotNull Long categoryId,
    @NotBlank String title,
    String description,
    String status,
    @NotNull Double latitude,
    @NotNull Double longitude,
    String locationDetails,
    @JsonProperty("image") String imageUrl,
    @Min(1) Integer reportCount) {

  public CreateIssueRequest {
    if (status == null || status.isBlank()) {
      status = "Pending";
    }
  }
}

package com.santo.CityWatch.issue;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateIssueRequest(
    @NotNull Long categoryId,
    @NotBlank String title,
    String description,
    @NotBlank String status,
    @NotNull Double latitude,
    @NotNull Double longitude,
    String locationDetails,
    @JsonProperty("image") String imageUrl) {}

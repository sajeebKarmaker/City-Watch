package com.santo.CityWatch.service;

import com.santo.CityWatch.entity.CategoryEntity;
import com.santo.CityWatch.entity.IssueEntity;
import com.santo.CityWatch.model.CreateIssueRequest;
import com.santo.CityWatch.model.IssueResponse;
import com.santo.CityWatch.model.UpdateIssueRequest;
import com.santo.CityWatch.repository.CategoryRepository;
import com.santo.CityWatch.repository.IssueRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class IssueService {

  private final IssueRepository issueRepository;
  private final CategoryRepository categoryRepository;

  public IssueService(IssueRepository issueRepository, CategoryRepository categoryRepository) {
    this.issueRepository = issueRepository;
    this.categoryRepository = categoryRepository;
  }

  public List<IssueResponse> listIssues(String category, String search) {
    return issueRepository.findAllByFilters(category, search).stream().map(this::toResponse).toList();
  }

  public IssueResponse getIssue(long id) {
    return issueRepository
        .findByIdWithCategory(id)
        .map(this::toResponse)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));
  }

  public IssueResponse createIssue(CreateIssueRequest request) {
    IssueEntity issue = toEntity(request);
    IssueEntity saved = issueRepository.save(issue);
    return issueRepository.findByIdWithCategory(saved.getId()).map(this::toResponse).orElseThrow();
  }

  public IssueResponse replaceIssue(long id, UpdateIssueRequest request) {
    IssueEntity existing =
        issueRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));
    IssueEntity issue = toEntity(request);
    issue.setId(existing.getId());
    issue.setCreatedAt(existing.getCreatedAt());
    issue.setReportCount(existing.getReportCount());
    issueRepository.save(issue);
    return getIssue(id);
  }

  public void deleteIssue(long id) {
    if (!issueRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found");
    }
    issueRepository.deleteById(id);
  }

  public IssueResponse meToo(long id) {
    IssueEntity issue =
        issueRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));
    issue.setReportCount(issue.getReportCount() + 1);
    issueRepository.save(issue);
    return issueRepository.findByIdWithCategory(id).map(this::toResponse).orElseThrow();
  }

  private IssueEntity toEntity(CreateIssueRequest request) {
    IssueEntity issue = new IssueEntity();
    CategoryEntity category =
        categoryRepository
            .findById(request.categoryId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
    issue.setCategory(category);
    issue.setTitle(request.title());
    issue.setDescription(request.description());
    issue.setStatus(request.status());
    issue.setLatitude(request.latitude());
    issue.setLongitude(request.longitude());
    issue.setLocationDetails(request.locationDetails());
    issue.setImageUrl(request.imageUrl());
    issue.setReportCount(request.reportCount() != null ? request.reportCount() : 1);
    return issue;
  }

  private IssueEntity toEntity(UpdateIssueRequest request) {
    IssueEntity issue = new IssueEntity();
    CategoryEntity category =
        categoryRepository
            .findById(request.categoryId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
    issue.setCategory(category);
    issue.setTitle(request.title());
    issue.setDescription(request.description());
    issue.setStatus(request.status());
    issue.setLatitude(request.latitude());
    issue.setLongitude(request.longitude());
    issue.setLocationDetails(request.locationDetails());
    issue.setImageUrl(request.imageUrl());
    return issue;
  }

  private IssueResponse toResponse(IssueEntity issue) {
    return new IssueResponse(
        issue.getId(),
        issue.getCategory().getName(),
        issue.getTitle(),
        issue.getDescription(),
        issue.getStatus(),
        new IssueResponse.Location(issue.getLatitude(), issue.getLongitude()),
        issue.getImageUrl(),
        issue.getCreatedAt(),
        issue.getReportCount());
  }
}

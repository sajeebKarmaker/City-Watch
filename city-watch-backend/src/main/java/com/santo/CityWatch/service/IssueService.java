package com.santo.CityWatch.service;

import com.santo.CityWatch.model.CreateIssueRequest;
import com.santo.CityWatch.model.IssueResponse;
import com.santo.CityWatch.model.UpdateIssueRequest;
import com.santo.CityWatch.repository.IssueRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class IssueService {

  private final IssueRepository issueRepository;

  public IssueService(IssueRepository issueRepository) {
    this.issueRepository = issueRepository;
  }

  public List<IssueResponse> listIssues(String category, String search) {
    return issueRepository.findAll(category, search);
  }

  public IssueResponse getIssue(long id) {
    return issueRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));
  }

  public IssueResponse createIssue(CreateIssueRequest request) {
    long id = issueRepository.insert(request);
    return issueRepository.findById(id).orElseThrow();
  }

  public IssueResponse replaceIssue(long id, UpdateIssueRequest request) {
    int updated = issueRepository.update(id, request);
    if (updated == 0) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found");
    }
    return getIssue(id);
  }

  public void deleteIssue(long id) {
    int deleted = issueRepository.delete(id);
    if (deleted == 0) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found");
    }
  }

  public IssueResponse meToo(long id) {
    int rows = issueRepository.incrementReportCount(id);
    if (rows == 0) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found");
    }
    return getIssue(id);
  }
}

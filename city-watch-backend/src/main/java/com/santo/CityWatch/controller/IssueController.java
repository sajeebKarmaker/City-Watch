package com.santo.CityWatch.controller;

import com.santo.CityWatch.model.CreateIssueRequest;
import com.santo.CityWatch.model.IssueResponse;
import com.santo.CityWatch.model.UpdateIssueRequest;
import com.santo.CityWatch.service.IssueService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

  private final IssueService issueService;

  public IssueController(IssueService issueService) {
    this.issueService = issueService;
  }

  @GetMapping
  public List<IssueResponse> list(
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String search) {
    return issueService.listIssues(category, search);
  }

  @GetMapping("/{id}")
  public IssueResponse get(@PathVariable long id) {
    return issueService.getIssue(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public IssueResponse create(@Valid @RequestBody CreateIssueRequest request) {
    return issueService.createIssue(request);
  }

  @PutMapping("/{id}")
  public IssueResponse replace(
      @PathVariable long id, @Valid @RequestBody UpdateIssueRequest request) {
    return issueService.replaceIssue(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable long id) {
    issueService.deleteIssue(id);
  }

  @PostMapping("/{id}/me-too")
  public IssueResponse meToo(@PathVariable long id) {
    return issueService.meToo(id);
  }
}

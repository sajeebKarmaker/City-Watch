package com.santo.CityWatch.service.interfaces;

import com.santo.CityWatch.model.CreateIssueRequest;
import com.santo.CityWatch.model.IssueResponse;
import com.santo.CityWatch.model.UpdateIssueRequest;
import java.util.List;

public interface IssueService {

  List<IssueResponse> listIssues(String category, String search);

  IssueResponse getIssue(long id);

  IssueResponse createIssue(CreateIssueRequest request);

  IssueResponse replaceIssue(long id, UpdateIssueRequest request);

  void deleteIssue(long id);

  IssueResponse meToo(long id);
}

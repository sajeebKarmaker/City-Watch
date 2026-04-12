package com.santo.CityWatch.config;

import com.santo.CityWatch.issue.CreateIssueRequest;
import com.santo.CityWatch.issue.IssueRepository;
import com.santo.CityWatch.category.CategoryRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class SeedDataRunner implements ApplicationRunner {

  private final CategoryRepository categoryRepository;
  private final IssueRepository issueRepository;

  public SeedDataRunner(CategoryRepository categoryRepository, IssueRepository issueRepository) {
    this.categoryRepository = categoryRepository;
    this.issueRepository = issueRepository;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (categoryRepository.count() > 0) {
      return;
    }
    var roads = categoryRepository.insert("Roads");
    var lighting = categoryRepository.insert("Lighting");
    var sanitation = categoryRepository.insert("Sanitation");
    categoryRepository.insert("Vandalism");
    categoryRepository.insert("Parks");
    categoryRepository.insert("Other");

    issueRepository.insert(
        new CreateIssueRequest(
            roads.id(),
            "Large Pothole on Main St",
            "A deep pothole is causing cars to swerve. It's about 2 feet wide.",
            "Pending",
            23.7842,
            90.3928,
            "Main St near downtown",
            "https://images.unsplash.com/photo-1709934730506-fba12664d4e4",
            12));

    issueRepository.insert(
        new CreateIssueRequest(
            lighting.id(),
            "Broken Street Light",
            "The street light at the corner of 5th and Oak is completely out.",
            "In Progress",
            23.7714,
            90.4071,
            "5th and Oak",
            "https://images.unsplash.com/photo-1687812693663-c322b9af62a5",
            4));

    issueRepository.insert(
        new CreateIssueRequest(
            sanitation.id(),
            "Overflowing Trash Bins",
            "Public bins have not been emptied in a week.",
            "Resolved",
            23.7889,
            90.4053,
            "Central park entrance",
            "https://images.unsplash.com/photo-1762187547870-83fbeef1afcf",
            8));
  }
}

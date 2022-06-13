import { CandidateUserModel, UserModel } from '../model/user.model';
import { JobPostModel } from '../model/job-post.model';
import { RecommendationHistory } from '../model/recommendation.model';

export class RecommendationAlgorithm {
  user: CandidateUserModel;
  jobs: Array<JobPostModel>;
  history: RecommendationHistory;

  constructor(
    user: CandidateUserModel,
    jobs: Array<JobPostModel>,
    history: RecommendationHistory
  ) {
    this.user = user;
    this.jobs = jobs;
    this.history = history;
  }

  execute() {
    // Likes
    this.jobs = this.jobs.filter(
      (job) => !this.history.likes.has(job.uuid.toString())
    );

    // Dislikes
    this.jobs = this.jobs.filter(
      (job) => !this.history.disLikes.has(job.uuid.toString())
    );

    // Calculate common tags
    this.jobs.map((job) => {
      const commonSkills: Array<string> = job.tags.filter((tag) =>
        this.user.skills.includes(tag)
      );
      job.commonWithUser = commonSkills.length;
    });

    // First position 2 or more tags
    this.jobs = this.jobs.sort((a: JobPostModel, b: JobPostModel) => {
      return b.commonWithUser - a.commonWithUser;
    });
  }

  random(array: Array<JobPostModel>): Array<JobPostModel> {
    let i = array.length;
    let valorTemporal;
    let indexRandom;

    // quedan elementos para mezclar
    while (0 !== i) {
      // escoger un elemento random
      indexRandom = Math.floor(Math.random() * i);
      i = i - 1;

      // interacambio por uno actual
      valorTemporal = array[i];
      array[i] = array[indexRandom];
      array[indexRandom] = valorTemporal;
    }
    return array;
  }
}

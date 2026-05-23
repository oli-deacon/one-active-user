export type Story = {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  coverImage?: string;
  body: string;
  url: string;
};

export type Build = {
  name: string;
  slug: string;
  summary: string;
  friction: string;
  whyExistingToolsWereNotEnough: string;
  whoItIsFor: string;
  howItWasBuilt: string;
  howItIsUsedNow: string;
  currentStatus: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  screenshots?: string[];
  externalLink?: string;
  body: string;
  url: string;
};

export type BuildSubmission = {
  submissionType: "build";
  submitterName: string;
  email: string;
  projectName?: string;
  builtWhat: string;
  friction: string;
  whyExistingToolsWereNotEnough: string;
  whoItIsFor: string;
  howItIsUsedNow: string;
  isAnyoneElseUsingIt?: string;
  whatItTaughtYou?: string;
  linkOrScreenshots?: string;
};

export type StorySubmission = {
  submissionType: "story";
  submitterName: string;
  email: string;
  pieceSummary: string;
  whyItBelongs: string;
  experienceSource: string;
  draftOrOutline?: string;
};

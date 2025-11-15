export interface ImageMetadata {
  // Credit Information
  author: string;
  source: string;
  license: string;
  url?: string;
  title: string;
  description: string;
  altText: string;
  usageRights: string;
  attributionRequired: boolean;
}

export const imageCredits: Record<string, ImageMetadata> = {
  "/carouselImages/team.jpg": {
    author: "Mikhail Nilov",
    source: "Pexels",
    license:
      "All photos and videos on Pexels can be downloaded and used for free.",
    url: "https://www.pexels.com/photo/employees-looking-at-the-screen-of-the-laptop-7988217/",

    title: "Employees Looking at the Screen of the Laptop",
    description:
      "Professional team of software engineers collaborating on projects",
    altText:
      "Diverse group of tech professionals working together in a modern office",
    usageRights: "Free to use for personal and commercial purposes",
    attributionRequired: false,
  },

  "/carouselImages/digital.jpg": {
    author: "Stockcake",
    source: "Stockcake",
    license: "Free to use",
    url: "https://stockcake.com/i/global-digital-network_2069048_1359964",

    title: "Digital Technology",
    description:
      "Glowing connection lines link human figures across a digital globe, representing worldwide technological unity and collaboration",
    altText:
      "Digital technology visualization with network connections and data flow",
    usageRights: "Free to use for personal and commercial purposes",
    attributionRequired: false,
  },

  "/carouselImages/hiring.jpg": {
    author: "Andrea Piacquadio",
    source: "Pexels",
    license: "Pexels (Free to use)",
    url: "https://www.pexels.com/photo/person-in-black-suit-hired-an-employee-3760069/",

    title: "Hiring and Recruitment",
    description: "Professional recruitment and hiring process in action",
    altText: "Team of recruiters reviewing candidate profiles and resumes",
    usageRights: "Free to use for personal and commercial purposes",
    attributionRequired: false,
  },
};

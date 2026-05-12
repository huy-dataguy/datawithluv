export const SITE = {
  website: "https://your-domain.com/", // replace this with your deployed domain
  author: "Quoc Huy",
  profile: "https://github.com/huy-dataguy",
  desc: "Data Engineering blog — building scalable pipelines, real-time streaming systems, and modern data architectures.",
  title: "Quoc Huy's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "vi", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Ho_Chi_Minh", // Default global timezone (IANA format)
} as const;

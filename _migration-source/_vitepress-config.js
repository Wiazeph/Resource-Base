import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Front-End Development Resources',
  description:
    'An amazing repository where you can discover a plethora of resources related to Front-End Development, which will make your life easier.',

  lastUpdated: true,

  themeConfig: {
    nav: [
      {
        text: 'Introduction',
        link: '/introduction',
      },
      {
        text: 'Contributors',
        link: '/contributors/',
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/introduction',
      },
      {
        text: 'Resources',
        collapsed: false,
        items: [
          { text: 'Documents', link: '/resources/documents' },
          { text: 'Videos', link: '/resources/videos' },
          { text: 'Courses', link: '/resources/courses' },
          {
            text: 'Certificate Programs',
            link: '/resources/certificate-programs',
          },
          {
            text: 'Training and Code Battles Sites',
            link: '/resources/training-code-battles-sites',
          },
          { text: 'Cheat Sheets', link: '/resources/cheat-sheets' },
          { text: 'Roadmaps', link: '/resources/roadmaps' },
          {
            text: 'GitHub Repositories',
            link: '/resources/github-repositories',
          },
          {
            text: 'Resource Search Sites',
            link: '/resources/resource-search',
          },
        ],
      },
      {
        text: 'Assets',
        collapsed: false,
        items: [
          {
            text: 'UI Design Components',
            link: '/assets/ui-design',
          },
          {
            text: 'Libraries and Plugins',
            link: '/assets/libraries-plugins',
          },
          { text: 'Ready to Use', link: '/assets/ready-to-use' },
          { text: 'Templates', link: '/assets/templates' },
          { text: 'Icons', link: '/assets/icons' },
          { text: 'Colors', link: '/assets/colors' },
          { text: 'Fonts', link: '/assets/fonts' },
          {
            text: 'Stock Media Resources',
            link: '/assets/stock-media-resources',
          },
        ],
      },
      {
        text: 'Tools',
        collapsed: false,
        items: [
          { text: 'CSS Generators', link: '/tools/css-generators' },
          { text: 'Hosts', link: '/tools/hosts' },
          { text: 'APIs', link: '/tools/api' },
        ],
      },
      {
        text: 'Extensions',
        collapsed: false,
        items: [
          {
            text: 'Browser',
            link: '/extensions/browser-extensions',
          },
          {
            text: 'VSCode',
            link: '/extensions/vscode-extensions',
          },
        ],
      },
      {
        text: 'Useful Sections',
        collapsed: false,
        items: [
          {
            text: 'AI Tools',
            link: '/useful-sections/ai-tools',
          },
          {
            text: 'CV / Resume Builders',
            link: '/useful-sections/cv-resume-builders',
          },
          {
            text: 'Code Snippets Image Generators',
            link: '/useful-sections/code-snippets',
          },
          {
            text: 'Mockup Generators',
            link: '/useful-sections/mockup-generators',
          },
          {
            text: 'GitHub ... Generators',
            link: '/useful-sections/github-generators',
          },
        ],
      },
    ],

    editLink: {
      pattern:
        'https://github.com/Wiazeph/Front-End-Development-Resources/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Wiazeph/Front-End-Development-Resources',
      },
    ],

    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
    },
  },

  head: [
    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-YDYXCDG57L',
      },
    ],
    [
      'script',
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YDYXCDG57L');
    `,
    ],
  ],
})

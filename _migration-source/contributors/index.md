<script setup>
import { VPTeamMembers } from "vitepress/theme";

const members = [
  {
    avatar: "https://avatars.githubusercontent.com/u/37252753?v=4",
    name: "Emre Erden",
    title: "Creator",
    links: [
      { icon: "linkedin", link: "https://linkedin.com/in/Wiazeph" },
      { icon: "github", link: "https://github.com/Wiazeph" },
      { icon: "twitter", link: "https://twitter.com/Wiazeph" },
      { icon: "instagram", link: "https://instagram.com/Wiazeph" },
      ],
  },
    {
    avatar: "https://avatars.githubusercontent.com/u/106361546?v=4",
    name: "Ali Osman Delişmen",
    title: "Contributor",
    links: [
      { icon: "github", link: "https://github.com/osmandlsmn" },
    ],
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/65294379?v=4",
    name: "Cem Tatlı",
    title: "Contributor",
    links: [
      { icon: "github", link: "https://github.com/cemtatli" },
      { icon: "twitter", link: "https://twitter.com/vaycem" },
    ],
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/108342464?v=4",
    name: "Eray Özkan",
    title: "Contributor",
    links: [
      { icon: "github", link: "https://github.com/oozkanneray" },
    ],
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/42185275?v=4",
    name: "Omer Ozceylan",
    title: "Contributor",
    links: [
      { icon: "github", link: "https://github.com/omerozceylan" },
      { icon: "linkedin", link: "https://www.linkedin.com/in/omer-ozceylan-8602621b5/" },
      { icon: "twitter", link: "https://twitter.com/OmerOzclyn" },
      { icon: "instagram", link: "https://www.instagram.com/scolfieid/" },
    ],
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/92332508?v=4",
    name: "Altan Kurt",
    title: "Contributor",
    links: [
      { icon: "github", link: "https://github.com/altankurt" },
      { icon: "linkedin", link: "https://www.linkedin.com/in/altankurt/" },
      { icon: "twitter", link: "https://twitter.com/aaltankurt" },
      { icon: "instagram", link: "https://www.instagram.com/altankurt/" },
    ],
  },
];
</script>

<VPTeamMembers size="small" :members="members" />

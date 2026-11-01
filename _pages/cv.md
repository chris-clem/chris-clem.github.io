---
layout: page
permalink: /cv/
title: Curriculum vitae
---

<p>For my full profile, visit <a href="https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}/">LinkedIn</a>.</p>

<section class="profile-section" aria-labelledby="cv-experience">
  <h2 id="cv-experience">Experience</h2>
  {% include profile-entries.liquid entries=site.data.profile.experience details=true %}
</section>

<section class="profile-section" aria-labelledby="cv-education">
  <h2 id="cv-education">Education</h2>
  {% include profile-entries.liquid entries=site.data.profile.education %}
</section>

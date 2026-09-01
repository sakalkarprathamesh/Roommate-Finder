# 🚀 Roomie — Release Changelog

## [v1.1.0] — The Atmosphere & Identity Update (2026-09-02)

### 🎨 Google Dark Theme Suite
- Fully integrated Google Dark Mode design tokens (`#202124` canvas, `#303134` elevated cards, `#8AB4F8` primary links, `#FFFFFF` high-contrast typography).
- Resolved all dimmed font contrast issues across headers, modals, listings, and discovery cards.
- Styled creator branding in vibrant Google Blue (`#1A73E8`) for Light Mode and Sky Blue (`#8AB4F8`) for Dark Mode.

### 🧑‍🎨 Custom Illustrated Student Avatars
- Extracted and alpha-masked 10 clean circular avatars (6 male, 4 female) stored in `/avatars/`.
- Integrated gender-based smart filtering during registration and profile settings.
- Removed automated name subtext from avatar selectors for a modern, minimal aesthetic.

### 🏷️ Minimal Profile Bar & Dropdown
- Cleaned the top-right navbar to display a minimal circular avatar icon button.
- Profile menu opens into a high-contrast card with the avatar positioned directly to the left of the user's name, email, and role badge.

### ✨ High-Impact Hero Tagline
- Formatted the hero section tagline into a continuous, bold single horizontal line on desktop:
  > **Find your <span style="color: #1A73E8;">room.</span> Find your <span style="color: #1A73E8;">people.</span>**

### ❤️ Dedicated Saved Listings Page (`/saved`)
- Created a standalone Saved Listings page (`/saved`) instead of routing to the dashboard.
- Displays the `"No shared listings"` empty state when no accommodations are bookmarked.

### 🛡️ Account Deletion in Settings
- Added a permanent **Account Deletion** option in Settings with interactive confirmation modal and cascade backend removal.

---

## [v1.0.0] — Initial Production Release
- Verified student roommate discovery platform for MIT-ADT University Pune.
- Mutual occupancy confirmation system and real-time chat between matched students.
- Flat and PG management dashboards.
- Dynamic campus discovery filters and safe contact request lifecycle.

export interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    id: 'dark-theme-suite-v1-1',
    title: 'Modern Dark Mode Suite',
    description:
      'Immersive dark mode featuring refined charcoal aesthetics with high-contrast text and luminous accent highlights.',
  },
  {
    id: 'custom-student-avatars-v1-1',
    title: 'Illustrated Student Avatars & Smart Suggestions',
    description:
      'New collection of 10 clean illustrated avatars with smart gender-based suggestions during registration and profile editing.',
  },
  {
    id: 'minimal-profile-bar-v1-1',
    title: 'Clean Minimal Navigation Bar',
    description:
      'The top-right navbar now features a clean circular profile avatar that expands into a rich account menu card on click.',
  },
  {
    id: 'single-line-hero-v1-1',
    title: 'High-Impact Hero Tagline',
    description:
      'Updated the Roomie hero tagline into a continuous, bold horizontal statement with vibrant Roomie blue highlights.',
  },
  {
    id: 'standalone-saved-listings-v1-1',
    title: 'Dedicated Saved Listings View',
    description:
      'Access your bookmarked accommodations directly via /saved with a streamlined empty state when no listings are saved.',
  },
  {
    id: 'account-deletion-v1-1',
    title: 'Account Deletion & Privacy Safeguards',
    description:
      'Users can now safely and permanently delete their Roomie account and all associated listings from Settings at any time.',
  },
  {
    id: 'welcome-and-guidance',
    title: 'Student welcome & quick-start guide',
    description:
      'First-time visitors now receive a quick, lightweight walkthrough on registering, finding flatmates, and safely connecting with peers.',
  },
  {
    id: 'user-safety-reporting',
    title: 'Enhanced safety & listing reporting',
    description:
      'You can now confidentially report suspicious listings or inappropriate messages in chat to keep our community safe.',
  },
  {
    id: 'verified-live-listings',
    title: 'Verified live student listings',
    description:
      'Search results and roommate matches now exclusively display active, verified student accommodations with real-time availability.',
  },
  {
    id: 'persistent-student-accounts',
    title: 'Persistent accounts & uninterrupted logins',
    description:
      'Your student login, profile info, and listings are permanently saved and will never be affected by future site updates.',
  },
  {
    id: 'shared-occupied-history',
    title: 'Shared occupancy history',
    description:
      'Both you and your matched roommate can now view your confirmed occupied listings in your dashboard history at any time.',
  },
  {
    id: 'mark-room-occupied',
    title: 'Mark a room as occupied',
    description:
      'Users can now mark a listing as filled once a room is taken. Both people involved confirm it together, so listings stay accurate. Includes an easy undo if marked by mistake.',
  },
  {
    id: 'chat-with-match',
    title: 'Chat with your match',
    description:
      'After a connection request is accepted, users can chat directly within the site to coordinate details.',
  },
  {
    id: 'successfully-matched-counter',
    title: 'Successfully Matched counter',
    description:
      'The homepage now shows how many students have successfully found a room through the site.',
  },
  {
    id: 'cleaner-dashboard',
    title: 'Cleaner dashboard',
    description:
      "Active listings and filled (occupied) listings are now shown separately, so your dashboard only shows what's currently available.",
  },
];

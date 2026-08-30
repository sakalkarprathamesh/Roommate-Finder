export interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
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

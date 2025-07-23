import { Goal } from './goal.model';

export const MOCKGOALS: Goal[] = [
  new Goal(
    '1',
    'Learn Angular',
    'Master Angular fundamentals',
    new Date('2024-12-31'),
    false
  ),
  new Goal(
    '2',
    'Build Project',
    'Complete the DreamIt project',
    new Date('2024-06-30'),
    false
  )
];
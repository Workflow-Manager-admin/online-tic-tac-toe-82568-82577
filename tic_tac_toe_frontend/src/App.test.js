import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders board, player status, and restart button', () => {
  render(<App />);
  // Board has 9 cells (buttons)
  expect(screen.getAllByRole('button', { name: /cell/i }).length).toBe(9);
  // Status present
  expect(screen.getByText(/Player 1|Player 2|turn/i)).toBeInTheDocument();
  // Restart button
  expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
});

test('can play a round and restart', () => {
  render(<App />);
  const cells = screen.getAllByRole('button', { name: /cell/i });
  fireEvent.click(cells[0]); // X
  fireEvent.click(cells[1]); // O
  fireEvent.click(cells[4]); // X
  fireEvent.click(cells[2]); // O
  fireEvent.click(cells[8]); // X for win
  expect(screen.getByText(/winner/i)).toBeInTheDocument();
  // Restart
  fireEvent.click(screen.getByRole('button', { name: /restart/i }));
  expect(cells[0].textContent).toBe("");
});

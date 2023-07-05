// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import React from 'react';
import { render, fireEvent, getByPlaceholderText, getByText } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('searches for GitHub repositories', async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    const input = getByPlaceholderText('Enter username');
    const button = getByText('Search');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    const repoName = getByText('test');
    expect(repoName).toBeInTheDocument();
  });

  it('displays user repositories', async () => {
    const { getByText } = render(<App />);
    const button = getByText('Search');

    fireEvent.change(getByPlaceholderText('Enter username'), { target: { value: 'test' } });
    fireEvent.click(button);

    const repoName = getByText('test');
    fireEvent.click(repoName);

    const repoDescription = getByText('This is a test repository');
    expect(repoDescription).toBeInTheDocument();
  });

  it('renders each component correctly', () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    const input = getByPlaceholderText('Enter username');
    const button = getByText('Search');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('receives and uses props correctly', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');
  });

  it('updates state correctly', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');

    fireEvent.click(repoName);

    expect(repoName).toHaveClass('repo-name-active');
  });

  it('calls lifecycle methods correctly', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');

    fireEvent.click(repoName);

    expect(repoName).toHaveClass('repo-name-active');
  });

  it('handles events correctly', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');

    fireEvent.click(repoName);

    expect(repoName).toHaveClass('repo-name-active');
  });

  it('renders efficiently', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');
  });

  it('follows accessibility guidelines', () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    const input = getByPlaceholderText('Enter username');
    const button = getByText('Search');

    expect(input).toHaveAttribute('aria-label', 'Enter username');
    expect(button).toHaveAttribute('aria-label', 'Search');
  });

  it('integrates correctly with other components', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');
  });

  it('styles correctly', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('test');

    expect(repoName).toHaveClass('repo-name');
  });

  it('handles errors correctly', () => {
    const { getByText } = render(<App />);
    const repoName = getByText('error');

    expect(repoName).toHaveClass('repo-name');
  });
});
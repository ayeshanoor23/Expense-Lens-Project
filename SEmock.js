import { fireEvent, render, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('OCR Module', () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync('./ocr-section.html', 'utf8');
  });

  test('renders main OCR module container', () => {
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('ocr-module');
  });

  test('updates timestamp every second', () => {
    jest.useFakeTimers();
    const timeElement = screen.getByRole('time');
    const initialTime = timeElement.textContent;
    
    jest.advanceTimersByTime(1000);
    expect(timeElement.textContent).not.toBe(initialTime);
  });

  test('handles file upload', () => {
    const file = new File(['dummy content'], 'test.png', {type: 'image/png'});
    const input = screen.getByLabelText(/upload image file/i);
    
    fireEvent.change(input, { target: { files: [file] }});
    
    expect(screen.getByRole('status')).toHaveTextContent(/processing/i);
  });

  test('copy button copies recognized text', () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() }
    });
    
    const copyBtn = screen.getByRole('button', {name: /copy text/i});
    fireEvent.click(copyBtn);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('meets accessibility requirements', () => {
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label');
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow');
    expect(progressBar).toHaveAttribute('aria-valuemin');
    expect(progressBar).toHaveAttribute('aria-valuemax');
  });
});
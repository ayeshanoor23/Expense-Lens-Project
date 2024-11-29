import { fireEvent, getByRole, getByText, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('OCR Module', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = ''; // Clear previous test
    const div = document.createElement('div');
    div.innerHTML = document.querySelector('.ocr-module').outerHTML;
    document.body.appendChild(div);
    container = document.body.firstChild;
  });

  test('renders main OCR components', () => {
    expect(container.querySelector('.header-title')).toHaveTextContent('Optical Character Recognition');
    expect(container.querySelector('.nav-menu')).toBeInTheDocument();
    expect(container.querySelectorAll('.nav-item')).toHaveLength(3);
  });

  test('file upload functionality', () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = container.querySelector('#fileInput');
    const uploadBtn = container.querySelector('#uploadBtn');
    
    expect(fileInput).toBeInTheDocument();
    expect(uploadBtn).toBeInTheDocument();
    
    fireEvent.click(uploadBtn);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(container.querySelector('#previewImage')).toHaveAttribute('alt', 'Preview of test.png');
  });

  test('copy button functionality', async () => {
    const copyBtn = container.querySelector('#copyBtn');
    const recognizedText = container.querySelector('#recognizedText');
    
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    
    recognizedText.textContent = 'Test OCR Text';
    fireEvent.click(copyBtn);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test OCR Text');
    });
  });

  test('download button creates and triggers download', () => {
    const downloadBtn = container.querySelector('#downloadBtn');
    const recognizedText = container.querySelector('#recognizedText');
    const createElementSpy = jest.spyOn(document, 'createElement');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');
    
    recognizedText.textContent = 'Test OCR Text';
    fireEvent.click(downloadBtn);
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
  });

  test('navigation tabs are keyboard accessible', () => {
    const tabs = container.querySelectorAll('.nav-item');
    const firstTab = tabs[0];
    
    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: 'Enter' });
    
    expect(firstTab).toHaveClass('active');
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  test('progress bar updates during OCR process', async () => {
    const uploadBtn = container.querySelector('#uploadBtn');
    const fileInput = container.querySelector('#fileInput');
    const progressFill = container.querySelector('#progressFill');
    const progressStatus = container.querySelector('#progressStatus');
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    fireEvent.click(uploadBtn);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(progressStatus).toHaveTextContent('Processing...');
    
    await waitFor(() => {
      expect(progressFill).toHaveStyle({ width: '100%' });
      expect(progressStatus).toHaveTextContent('Complete');
    }, { timeout: 3000 });
  });

  test('handles invalid file types', () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const fileInput = container.querySelector('#fileInput');
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(alertMock).toHaveBeenCalledWith('Please select an image file.');
  });

  test('rerun OCR button functionality', async () => {
    const rerunBtn = container.querySelector('#rerunBtn');
    const recognizedText = container.querySelector('#recognizedText');
    const progressStatus = container.querySelector('#progressStatus');
    
    fireEvent.click(rerunBtn);
    
    expect(progressStatus).toHaveTextContent('Processing...');
    
    await waitFor(() => {
      expect(progressStatus).toHaveTextContent('Complete');
      expect(recognizedText).not.toHaveTextContent('Recognized text will appear here...');
    }, { timeout: 3000 });
  });
});
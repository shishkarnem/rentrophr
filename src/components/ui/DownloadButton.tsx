import { Download } from 'lucide-react';
import { Button } from './button';

interface DownloadButtonProps {
  filename: string;
  title: string;
}

const DownloadButton = ({ filename, title }: DownloadButtonProps) => {
  const handleDownload = () => {
    // Create a text content from the current page
    const content = document.querySelector('main')?.innerText || '';
    
    const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-accent transition-all duration-300 hover:scale-105"
    >
      <Download className="w-4 h-4" />
      Скачать страницу
    </Button>
  );
};

export default DownloadButton;

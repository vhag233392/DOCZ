import { Component } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface DocumentData {
  title: string;
  author: string;
  institution: string;
  course: string;
  professor: string;
  date: string;
  content: string;
  margin: string;
}

interface MarginOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-apa-editor',
  standalone: false,

  templateUrl: './apa-editor.component.html',
  styleUrl: './apa-editor.component.css'
})
export class ApaEditorComponent {

  margins: MarginOption[] = [
    { value: '1', label: '1 pulgada (2.54 cm) - Estándar APA' },
    { value: '1.5', label: '1.5 pulgadas (3.81 cm)' },
    { value: '2', label: '2 pulgadas (5.08 cm)' }
  ];

  documentData: DocumentData = {
    title: '',
    author: '',
    institution: '',
    course: '',
    professor: '',
    date: '',
    content: '',
    margin: '1'
  };

  formatContent(content: string): string {
    if (!content) return '';

    const formattedContent = content.split('\n').map(paragraph => {
      let processedParagraph = paragraph.trim();
      if (!processedParagraph) return '';

      if (processedParagraph === '---') {
        return '<hr class="separator">';
      }

      if (processedParagraph.startsWith('###')) {
        let titleContent = processedParagraph;
        if (processedParagraph.startsWith('####')) {
          titleContent = processedParagraph.replace(/^####\s*/, '');
          titleContent = this.processItalics(titleContent);
          return `<div class="subsection-title"><strong>${titleContent}</strong></div>`;
        } else {
          titleContent = processedParagraph.replace(/^###\s*/, '');
          titleContent = this.processItalics(titleContent);
          return `<div class="section-title"><strong>${titleContent}</strong></div>`;
        }
      }

      processedParagraph = this.processItalics(processedParagraph);
      processedParagraph = processedParagraph.replace(/#/g, '');
      return `<p>${processedParagraph}</p>`;
    }).join('');

    return formattedContent;
  }

  processItalics(text: string): string {
    if (!text) return '';
    const italicRegex = /\*+([^*]+)\*+/g;
    let processedText = text.replace(italicRegex, '<em>$1</em>');
    return processedText.replace(/\*/g, '');
  }

  exportToPDF(): void {
    const element = document.getElementById('document-preview');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${this.documentData.title || 'documento'}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    html2pdf().set(opt).from(element).save();
  }
}

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
  fontSize: string;  // Nueva propiedad para tamaño de fuente
  alignment: string; // Nueva propiedad para alineación
}

interface MarginOption {
  value: string;
  label: string;
}

interface FontOption {
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

  margins = [
    { value: '1', label: '1 pulgada (2.54 cm) - Estándar APA' },
    { value: '1.5', label: '1.5 pulgadas (3.81 cm)' },
    { value: '2', label: '2 pulgadas (5.08 cm)' }
  ];

  fontSizes = [
    { value: '10', label: '10 pt' },
    { value: '11', label: '11 pt' },
    { value: '12', label: '12 pt (Estándar APA)' },
    { value: '14', label: '14 pt' }
  ];

  alignments = [
    { value: 'justify', label: 'Justificado (APA)' },
    { value: 'left', label: 'Alineado a la izquierda' },
    { value: 'right', label: 'Alineado a la derecha' },
    { value: 'center', label: 'Centrado' }
  ];

  documentData: DocumentData = {
    title: '',
    author: '',
    institution: '',
    course: '',
    professor: '',
    date: '',
    content: '',
    margin: '1',
    fontSize: '12',
    alignment: 'justify'
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
          return `<h4 class="subsection-title">${titleContent}</h4>`;
        } else {
          titleContent = processedParagraph.replace(/^###\s*/, '');
          titleContent = this.processItalics(titleContent);
          return `<h3 class="section-title">${titleContent}</h3>`;
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

    // Modificamos la expresión regular para que solo coincida con palabras completamente envueltas en asteriscos
    // y que no sean parte de una palabra (como en *Merchandising*)
    const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;

    // Primero procesamos las cursivas intencionales
    let processedText = text.replace(italicRegex, '<em>$1</em>');

    // Luego eliminamos los asteriscos que quedaron (los que son parte de palabras)
    processedText = processedText.replace(/\*/g, '');

    return processedText;
  }

  async exportToPDF() {
    const element = document.getElementById('document-preview');
    if (!element) return;

    // Aplicar estilos adicionales antes de generar el PDF
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        margin: 1in !important;
      }
      .content {
        padding: 0 !important;
      }
      #document-preview {
        word-break: keep-all !important;
        overflow-wrap: normal !important;
        -webkit-hyphens: none !important;
        -ms-hyphens: none !important;
        hyphens: none !important;
      }
    `;
    document.head.appendChild(style);

    const opt = {
      margin: 1,
      filename: `${this.documentData.title || 'documento'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: 816, // 8.5 inches * 96 DPI
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, intente de nuevo.');
    } finally {
      document.head.removeChild(style);
    }
  }

  wordCount(): number {
    if (!this.documentData.content) return 0;
    return this.documentData.content.trim().split(/\s+/).length;
  }

  autoSave() {
    localStorage.setItem('documentData', JSON.stringify(this.documentData));
  }

  loadDraft() {
    const savedData = localStorage.getItem('documentData');
    if (savedData) {
      this.documentData = JSON.parse(savedData);
    }
  }

  ngOnInit() {
    this.loadDraft();
    setInterval(() => this.autoSave(), 30000);
  }
}

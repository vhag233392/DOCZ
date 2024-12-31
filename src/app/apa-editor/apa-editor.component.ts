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
}

@Component({
  selector: 'app-apa-editor',
  standalone: false,

  templateUrl: './apa-editor.component.html',
  styleUrl: './apa-editor.component.css'
})
export class ApaEditorComponent {


  documentData: DocumentData = {
    title: '',
    author: '',
    institution: '',
    course: '',
    professor: '',
    date: '',
    content: ''
  };

  formatContent(content: string): string {
    // Elimina ### y convierte en títulos en negrita
    let formattedContent = content.replace(/^###\s*(.*?)$/gm, '<h2 class="font-bold text-xl mb-4">$1</h2>');

    // Reemplaza --- con separadores horizontales
    formattedContent = formattedContent.replace(/^---$/gm, '<hr class="my-4">');

    return formattedContent;
  }

  exportToPDF() {
    const element = document.getElementById('document-preview');
    const opt = {
      margin: 1,
      filename: `${this.documentData.title || 'documento'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }

}

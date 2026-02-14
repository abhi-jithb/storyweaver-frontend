import { Book } from '../types/opds';

export const exportToCSV = (books: Book[]) => {
    if (books.length === 0) return;

    // Standard CSV headers
    const headers = ['id', 'title', 'author', 'language', 'level', 'categories', 'publisher', 'publishedDate', 'summary'];

    const csvRows = books.map(book => {
        return [
            `"${book.id}"`,
            `"${book.title.replace(/"/g, '""')}"`,
            `"${book.author.replace(/"/g, '""')}"`,
            `"${book.language}"`,
            `"${book.level || ''}"`,
            `"${(book.categories || []).join(' | ')}"`,
            `"${(book.publisher || '').replace(/"/g, '""')}"`,
            `"${book.publishedDate || ''}"`,
            `"${book.summary.replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `storyweaver_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToOPDS = (books: Book[]) => {
    // Basic OPDS feed generation (pseudo-implementation for demo)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>StoryWeaver Export</title>
  <updated>${new Date().toISOString()}</updated>
  ${books.map(book => `
  <entry>
    <title>${book.title}</title>
    <author><name>${book.author}</name></author>
    <summary>${book.summary}</summary>
    <link rel="http://opds-spec.org/image" href="${book.cover}" type="image/jpeg"/>
  </entry>`).join('')}
</feed>`;

    const blob = new Blob([xml], { type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `storyweaver_export.opds`);
    link.click();
};

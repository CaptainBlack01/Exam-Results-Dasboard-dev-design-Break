document.addEventListener('DOMContentLoaded', () => {
  const termSelect = document.getElementById('term');
  const rows = Array.from(document.querySelectorAll('#resultsBody tr[data-subject]'));
  const performanceTotal = document.getElementById('performanceTotal');
  const performancePosition = document.getElementById('performancePosition');
  const downloadBtn = document.getElementById('downloadResults');
  const printBtn = document.getElementById('printResults');

  const termData = {
    '1st-term': {
      position: '1st',
      scores: {
        English: [28, 41],
        Mathematics: [28, 30],
        Physics: [29, 38],
        Chemistry: [30, 33],
        Economics: [28, 50],
        'Civic Education': [28, 41],
      },
    },
    '2nd-term': {
      position: '2nd',
      scores: {
        English: [30, 44],
        Mathematics: [26, 35],
        Physics: [31, 40],
        Chemistry: [32, 37],
        Economics: [30, 48],
        'Civic Education': [29, 43],
      },
    },
    '3rd-term': {
      position: '1st',
      scores: {
        English: [29, 46],
        Mathematics: [30, 38],
        Physics: [33, 42],
        Chemistry: [31, 40],
        Economics: [32, 51],
        'Civic Education': [30, 45],
      },
    },
  };

  const getGrade = (total) => {
    if (total >= 75) return { grade: 'A', remark: 'Distinction' };
    if (total >= 65) return { grade: 'B', remark: 'Very Good' };
    if (total >= 55) return { grade: 'C', remark: 'Credit' };
    if (total >= 45) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
  };

  const renderTerm = (term) => {
    const data = termData[term];
    if (!data) return;

    let total = 0;

    rows.forEach((row) => {
      const scores = data.scores[row.dataset.subject];
      if (!scores) return;
      const [ca, exam] = scores;
      const rowTotal = ca + exam;
      total += rowTotal;

      const cells = row.querySelectorAll('td');
      cells[1].textContent = String(ca);
      cells[2].textContent = String(exam);
      cells[3].textContent = String(rowTotal);

      const { grade, remark } = getGrade(rowTotal);
      cells[4].textContent = grade;
      cells[5].textContent = remark;
    });

    if (performanceTotal) {
      const average = rows.length ? (total / rows.length).toFixed(1) : '0.0';
      performanceTotal.textContent = `Average: ${average}`;
    }
    if (performancePosition) performancePosition.textContent = data.position;
  };

  if (termSelect) {
    termSelect.addEventListener('change', (event) => {
      renderTerm(event.target.value);
    });
    renderTerm(termSelect.value);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const table = document.querySelector('.table table');
      if (!table) return;

      const csvRows = [];
      table.querySelectorAll('tr').forEach((row) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map((cell) =>
          cell.textContent.trim().replace(/"/g, '""')
        );
        csvRows.push(cells.map((cell) => `"${cell}"`).join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `exam-results-${termSelect ? termSelect.value : 'term'}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }
});

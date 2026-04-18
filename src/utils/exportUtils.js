import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function exportToPDF(opportunities, profile) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(108, 92, 231);
  doc.text('OpportunityAI — Results Report', pageWidth / 2, 20, { align: 'center' });

  // Profile summary
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Student: ${profile.name || 'N/A'} | Program: ${profile.program || 'N/A'} | CGPA: ${profile.cgpa || 'N/A'}`, pageWidth / 2, 30, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

  // Table
  const tableData = opportunities.map((opp, i) => [
    i + 1,
    opp.title,
    opp.type,
    opp.deadline,
    `${opp.overallScore}/100`,
    opp.profileFitScore + '%',
    opp.actionSteps?.[0] || 'N/A'
  ]);

  doc.autoTable({
    startY: 44,
    head: [['#', 'Opportunity', 'Type', 'Deadline', 'Score', 'Fit', 'Next Step']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [108, 92, 231], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 45 },
      2: { cellWidth: 22 },
      3: { cellWidth: 25 },
      4: { cellWidth: 18 },
      5: { cellWidth: 15 },
      6: { cellWidth: 45 }
    }
  });

  // Details
  let y = doc.lastAutoTable.finalY + 12;
  opportunities.forEach((opp, i) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setTextColor(108, 92, 231);
    doc.text(`${i + 1}. ${opp.title}`, 14, y);
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text(`Why: ${opp.fitReason || 'N/A'}`, 14, y, { maxWidth: pageWidth - 28 });
    y += 10;
    if (opp.actionSteps) {
      opp.actionSteps.forEach(step => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`• ${step}`, 18, y, { maxWidth: pageWidth - 36 });
        y += 5;
      });
    }
    y += 4;
  });

  doc.save('opportunity-report.pdf');
}

export function exportToExcel(opportunities, profile) {
  const data = opportunities.map((opp, i) => ({
    'Rank': i + 1,
    'Title': opp.title,
    'Type': opp.type,
    'Organization': opp.organization || 'N/A',
    'Deadline': opp.deadline,
    'Overall Score': opp.overallScore,
    'Profile Fit': opp.profileFitScore,
    'Urgency': opp.urgencyScore,
    'Eligibility': (opp.eligibility || []).join('; '),
    'Required Documents': (opp.requiredDocuments || []).join('; '),
    'Benefits': opp.benefits || 'N/A',
    'Application Link': opp.applicationLink || 'N/A',
    'Fit Reason': opp.fitReason || 'N/A',
    'Action Steps': (opp.actionSteps || []).join('; ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Opportunities');

  // Profile sheet
  const profileData = [
    { Field: 'Name', Value: profile.name || 'N/A' },
    { Field: 'Program', Value: profile.program || 'N/A' },
    { Field: 'Semester', Value: profile.semester || 'N/A' },
    { Field: 'CGPA', Value: profile.cgpa || 'N/A' },
    { Field: 'Skills', Value: (profile.skills || []).join(', ') },
    { Field: 'Preferred Types', Value: (profile.preferredTypes || []).join(', ') },
    { Field: 'Financial Need', Value: profile.financialNeed || 'N/A' },
    { Field: 'Location', Value: profile.location || 'N/A' },
  ];
  const ws2 = XLSX.utils.json_to_sheet(profileData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Student Profile');

  XLSX.writeFile(wb, 'opportunity-report.xlsx');
}

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

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

export async function exportToExcel(opportunities, profile) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'OpportunityAI';
  workbook.created = new Date();

  // Opportunities sheet
  const ws = workbook.addWorksheet('Opportunities');
  ws.columns = [
    { header: 'Rank', key: 'rank', width: 8 },
    { header: 'Title', key: 'title', width: 35 },
    { header: 'Type', key: 'type', width: 18 },
    { header: 'Organization', key: 'organization', width: 25 },
    { header: 'Deadline', key: 'deadline', width: 18 },
    { header: 'Overall Score', key: 'overallScore', width: 14 },
    { header: 'Profile Fit', key: 'profileFitScore', width: 14 },
    { header: 'Urgency', key: 'urgencyScore', width: 12 },
    { header: 'Eligibility', key: 'eligibility', width: 30 },
    { header: 'Required Documents', key: 'requiredDocuments', width: 30 },
    { header: 'Benefits', key: 'benefits', width: 30 },
    { header: 'Application Link', key: 'applicationLink', width: 30 },
    { header: 'Fit Reason', key: 'fitReason', width: 40 },
    { header: 'Action Steps', key: 'actionSteps', width: 40 },
  ];

  // Style header row
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6C5CE7' } };

  opportunities.forEach((opp, i) => {
    ws.addRow({
      rank: i + 1,
      title: opp.title,
      type: opp.type,
      organization: opp.organization || 'N/A',
      deadline: opp.deadline,
      overallScore: opp.overallScore,
      profileFitScore: opp.profileFitScore,
      urgencyScore: opp.urgencyScore,
      eligibility: (opp.eligibility || []).join('; '),
      requiredDocuments: (opp.requiredDocuments || []).join('; '),
      benefits: opp.benefits || 'N/A',
      applicationLink: opp.applicationLink || 'N/A',
      fitReason: opp.fitReason || 'N/A',
      actionSteps: (opp.actionSteps || []).join('; '),
    });
  });

  // Profile sheet
  const ws2 = workbook.addWorksheet('Student Profile');
  ws2.columns = [
    { header: 'Field', key: 'field', width: 20 },
    { header: 'Value', key: 'value', width: 50 },
  ];
  ws2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6C5CE7' } };

  const profileRows = [
    { field: 'Name', value: profile.name || 'N/A' },
    { field: 'Program', value: profile.program || 'N/A' },
    { field: 'Semester', value: profile.semester || 'N/A' },
    { field: 'CGPA', value: profile.cgpa || 'N/A' },
    { field: 'Skills', value: (profile.skills || []).join(', ') },
    { field: 'Preferred Types', value: (profile.preferredTypes || []).join(', ') },
    { field: 'Financial Need', value: profile.financialNeed || 'N/A' },
    { field: 'Location', value: profile.location || 'N/A' },
  ];
  profileRows.forEach(row => ws2.addRow(row));

  // Generate file and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'opportunity-report.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}


const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel,
  LevelFormat, PageBreak, TabStopType, TabStopPosition,
} = require('docx');

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: 'Arial', size: level === HeadingLevel.HEADING_1 ? 28 : 24, color: '1A1A1A' })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160 },
    alignment: opts.align,
    children: [new TextRun({ text, font: 'Arial', size: 22, color: '333333', ...opts.run })],
  });
}

function bodyRuns(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160 },
    alignment: opts.align,
    children: runs.map(r => new TextRun({ font: 'Arial', size: 22, color: '333333', ...r })),
  });
}

function bullet(text, ref = 'bullets') {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: '333333' })],
  });
}

function spacer(height = 200) {
  return new Paragraph({ spacing: { after: height }, children: [] });
}

function signatureBlock(name, title) {
  return [
    spacer(400),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333', space: 1 } },
      spacing: { after: 40 },
      children: [new TextRun({ text: '', font: 'Arial', size: 22 })],
    }),
    bodyRuns([
      { text: name, bold: true },
      { text: `    ${title}`, color: '666666' },
    ], { after: 40 }),
    new Paragraph({
      spacing: { after: 40 },
      tabStops: [{ type: TabStopType.LEFT, position: 4320 }],
      children: [
        new TextRun({ text: 'Date: ', font: 'Arial', size: 22, color: '666666' }),
        new TextRun({ text: '____________________', font: 'Arial', size: 22, color: '999999' }),
      ],
    }),
  ];
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: '1A1A1A' },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: '1A1A1A' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // --- Header ---
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'WEB SERVICES AGREEMENT', font: 'Arial', size: 36, bold: true, color: '1A1A1A' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '22c55e', space: 8 } },
        children: [new TextRun({ text: `Effective Date: ${today}`, font: 'Arial', size: 22, color: '666666' })],
      }),
      spacer(200),

      // --- Parties ---
      heading('1. Parties'),
      bodyRuns([
        { text: 'Provider: ', bold: true },
        { text: 'Stray Design (Tom Sesler), hereinafter ' },
        { text: '"Provider"', bold: true, italics: true },
      ]),
      bodyRuns([
        { text: 'Client: ', bold: true },
        { text: 'Rack N Roll, located in Erie, PA, hereinafter ' },
        { text: '"Client"', bold: true, italics: true },
      ]),

      // --- Scope ---
      heading('2. Scope of Work'),
      body('Provider has designed and developed a custom website for Client, which includes:'),
      bullet('Custom-built website using Next.js, deployed and hosted on Vercel'),
      bullet('Sanity CMS Studio integration with visual content management dashboard'),
      bullet('Six (6) content types: Site Settings, Daily Specials, Flyers & Event Images, Calendar Events, Menu, and Gallery'),
      bullet('Image optimization and CDN delivery for fast load times'),
      bullet('Responsive design for desktop, tablet, and mobile devices'),
      bullet('Search engine optimization (SEO) and structured data'),

      // --- Ownership ---
      heading('3. Ownership & Access'),
      heading('Infrastructure (Provider-Owned)', HeadingLevel.HEADING_2),
      body('Provider owns and maintains the following infrastructure on behalf of Client:'),
      bullet('Vercel hosting account and deployment pipeline'),
      bullet('GitHub repository containing the website source code'),
      bullet('Sanity CMS project and API credentials'),
      spacer(80),
      body('These remain under Provider\u2019s account for the duration of this agreement. This ensures proper maintenance, security updates, and support.'),

      heading('Client Access', HeadingLevel.HEADING_2),
      body('Client receives full access to the Sanity Studio content management dashboard for managing all website content. No coding knowledge is required.'),

      heading('Source Code Transfer', HeadingLevel.HEADING_2),
      body('Upon termination of this agreement or at Client\u2019s request, Provider will transfer the complete source code repository and a static export of all website content to Client at no additional charge. Client may then self-host or engage another provider.'),

      // --- Pricing ---
      heading('4. Pricing'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [5000, 4360],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: thinBorders, width: { size: 5000, type: WidthType.DXA },
                shading: { fill: 'F0FAF0', type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 160, right: 160 },
                children: [new Paragraph({ children: [new TextRun({ text: 'One-Time Setup & Development', font: 'Arial', size: 22, bold: true })] })],
              }),
              new TableCell({
                borders: thinBorders, width: { size: 4360, type: WidthType.DXA },
                shading: { fill: 'F0FAF0', type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 160, right: 160 },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: '$1,497.00', font: 'Arial', size: 22, bold: true })],
                })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: thinBorders, width: { size: 5000, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 160, right: 160 },
                children: [new Paragraph({ children: [new TextRun({ text: 'Monthly Support & Hosting', font: 'Arial', size: 22, bold: true })] })],
              }),
              new TableCell({
                borders: thinBorders, width: { size: 4360, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 160, right: 160 },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: '$50.00 / month', font: 'Arial', size: 22, bold: true })],
                })],
              }),
            ],
          }),
        ],
      }),
      spacer(80),
      bodyRuns([
        { text: 'One-time fee ', color: '666666', size: 20 },
        { text: 'is due upon delivery and acceptance of the completed website. ', color: '666666', size: 20 },
        { text: 'Monthly payments ', color: '666666', size: 20 },
        { text: 'are due on the 1st of each month. Payments more than 15 days overdue may result in temporary suspension of hosting services until the balance is resolved.', color: '666666', size: 20 },
      ]),

      // --- Monthly Support ---
      heading('5. Monthly Support Includes'),
      bullet('Website hosting on Vercel with CDN and SSL'),
      bullet('Sanity CMS hosting and maintenance'),
      bullet('Security updates and dependency patches'),
      bullet('Bug fixes and troubleshooting'),
      bullet('Unlimited content and design revisions as the business evolves'),
      bullet('Minor feature additions and adjustments'),
      bullet('Performance monitoring and optimization'),
      bullet('Domain management assistance'),

      // --- What's not included ---
      heading('6. Additional Services (Not Included)'),
      body('The following are outside the scope of monthly support and would be quoted separately:'),
      bullet('Complete website redesign or rebuild'),
      bullet('Major new feature development (e.g., e-commerce, online ordering, reservation systems)'),
      bullet('Third-party integrations beyond the current scope'),
      bullet('Custom photography or professional content creation'),
      bullet('Paid advertising management (Google Ads, Facebook Ads, etc.)'),

      // --- Content Management ---
      heading('7. Content Management'),
      body('Client (or a designated employee) is responsible for all content updates made through the Sanity Studio dashboard. This includes uploading images, editing specials, managing events, and updating menu items.'),
      spacer(80),
      body('Provider is not responsible for the accuracy, legality, or appropriateness of content published by Client. Client agrees to ensure all uploaded content complies with applicable laws and does not infringe on third-party intellectual property rights.'),

      // --- Revisions ---
      heading('8. Revisions'),
      body('This agreement includes unlimited revisions to the website\u2019s design and functionality as part of the monthly support fee. Provider understands that businesses evolve\u2014specials change, events rotate, and the site should grow with the business.'),
      spacer(80),
      body('Revisions are handled on a reasonable-effort basis and do not include items listed in Section 6 (Additional Services).'),

      // --- Page break for remaining sections ---
      new Paragraph({ children: [new PageBreak()] }),

      // --- Termination ---
      heading('9. Termination'),
      body('Either party may terminate this agreement with 30 days\u2019 written notice (email is sufficient).'),
      spacer(80),
      body('Upon termination:'),
      bullet('Provider will deliver a complete copy of the website source code to Client'),
      bullet('Provider will export all content from the Sanity CMS'),
      bullet('Client may self-host or engage another provider going forward'),
      bullet('Any outstanding balance must be paid within 30 days of termination'),
      bullet('Hosting and CMS access will remain active through the end of the final paid month'),

      // --- Responsibility ---
      heading('10. Responsibilities'),
      body('Provider is responsible for keeping the website functional, secure, and online. If something breaks, Provider will fix it.'),
      spacer(80),
      body('Provider is not responsible for content published by Client (see Section 7), or for outages caused by third-party services outside Provider\u2019s control (e.g., internet service providers, domain registrars).'),

      // --- Confidentiality ---
      heading('11. Confidentiality'),
      body('Both parties agree to keep confidential any proprietary business information, login credentials, and customer data shared during the course of this agreement.'),

      // --- Entire Agreement ---
      heading('12. Entire Agreement'),
      body('This document constitutes the entire agreement between the parties. Any modifications must be agreed upon in writing by both parties.'),

      // --- Signatures ---
      spacer(400),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: '22c55e', space: 8 } },
        spacing: { before: 200, after: 200 },
        children: [new TextRun({ text: 'AGREED AND ACCEPTED', font: 'Arial', size: 24, bold: true, color: '1A1A1A' })],
      }),

      // Two-column signature using a table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4500, 360, 4500],
        rows: [
          new TableRow({
            children: [
              // Provider signature
              new TableCell({
                borders: noBorders, width: { size: 4500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 0, right: 160 },
                children: [
                  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'PROVIDER', font: 'Arial', size: 18, bold: true, color: '666666' })] }),
                  spacer(600),
                  new Paragraph({
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333', space: 1 } },
                    spacing: { after: 40 },
                    children: [],
                  }),
                  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'Tom Sesler, Stray Design', font: 'Arial', size: 20, bold: true })] }),
                  new Paragraph({
                    spacing: { after: 40 },
                    children: [
                      new TextRun({ text: 'Date: ', font: 'Arial', size: 20, color: '666666' }),
                      new TextRun({ text: '_______________', font: 'Arial', size: 20, color: '999999' }),
                    ],
                  }),
                ],
              }),
              // Spacer column
              new TableCell({
                borders: noBorders, width: { size: 360, type: WidthType.DXA },
                children: [new Paragraph({ children: [] })],
              }),
              // Client signature
              new TableCell({
                borders: noBorders, width: { size: 4500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 160, right: 0 },
                children: [
                  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'CLIENT', font: 'Arial', size: 18, bold: true, color: '666666' })] }),
                  spacer(600),
                  new Paragraph({
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333', space: 1 } },
                    spacing: { after: 40 },
                    children: [],
                  }),
                  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'Rack N Roll, Authorized Representative', font: 'Arial', size: 20, bold: true })] }),
                  new Paragraph({
                    spacing: { after: 40 },
                    children: [
                      new TextRun({ text: 'Date: ', font: 'Arial', size: 20, color: '666666' }),
                      new TextRun({ text: '_______________', font: 'Arial', size: 20, color: '999999' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/Users/tomsesler/rack-n-roll/RackNRoll-WebServices-Agreement.docx', buffer);
  console.log('Contract generated: RackNRoll-WebServices-Agreement.docx');
});

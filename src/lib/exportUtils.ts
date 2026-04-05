import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

// ─── PDF Export (html2canvas) ─────────────────────────────────────────────────
export async function exportToPDF(
    elementId: string,
    filename: string,
    hideSelectors: string[] = []
) {
    const element = document.getElementById(elementId);
    console.log('element found:', element);
    console.log('element innerHTML length:', element?.innerHTML.length);
    console.log('element scrollHeight:', element?.scrollHeight);
    if (!element) return;

    // hide elements on the REAL DOM first so canvas size excludes them
    const hiddenElements: { el: HTMLElement; prevDisplay: string }[] = [];
    hideSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
            const htmlEl = el as HTMLElement;
            hiddenElements.push({ el: htmlEl, prevDisplay: htmlEl.style.display });
            htmlEl.style.display = 'none';
        });
    });

    // force width and unlock overflow on real DOM too
    const origWidth = element.style.width;
    const origMaxHeight = element.style.maxHeight;
    const origOverflow = element.style.overflow;
    const origMinHeight = element.style.minHeight;

    element.style.width = '1200px';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    element.style.minHeight = 'unset';

    // wait for layout to settle
    await new Promise((r) => setTimeout(r, 800));
    const rect = element.getBoundingClientRect();

    console.log('scrollHeight:', element.scrollHeight);
    console.log('offsetHeight:', element.offsetHeight);
    console.log('getBoundingClientRect height:', element.getBoundingClientRect().height);

    const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#030105',
        logging: false,
        windowWidth: 1200,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
            // ONLY fix structural layout containers, not UI components like progress bars
            // target 3 levels deep from export roots max
            const layoutSelectors = [
                '#record-export-root',
                '#record-export-root > *',
                '#record-export-root > * > *',
                '#batch-pdf-content',
                '#batch-pdf-content > *',
                '#batch-pdf-content > * > *',
                '#results-export-root',
                '#results-export-root > *',
            ];

            clonedDoc.querySelectorAll(layoutSelectors.join(',')).forEach((el: any) => {
                const computed = clonedDoc.defaultView?.getComputedStyle(el);
                if (!computed) return;
                if (['hidden', 'scroll', 'auto'].includes(computed.overflow)) {
                    el.style.overflow = 'visible';
                }
                if (['hidden', 'scroll', 'auto'].includes(computed.overflowY)) {
                    el.style.overflowY = 'visible';
                }
                if (computed.maxHeight !== 'none') {
                    el.style.maxHeight = 'none';
                }
            });

            // fix Recharts ResponsiveContainers
            const containers = document.querySelectorAll('.recharts-responsive-container');
            clonedDoc.querySelectorAll('.recharts-responsive-container').forEach((el: any, i: number) => {
                const orig = containers[i];
                if (!orig) return;
                const { width, height } = orig.getBoundingClientRect();
                el.style.width = width + 'px';
                el.style.height = height + 'px';
            });

            // fix SVG dimensions
            clonedDoc.querySelectorAll('svg').forEach((svg: any) => {
                if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                const { width, height } = svg.getBoundingClientRect();
                if (width > 0 && !svg.getAttribute('width')) svg.setAttribute('width', String(width));
                if (height > 0 && !svg.getAttribute('height')) svg.setAttribute('height', String(height));
            });
        },
    });
    console.log('canvas width:', canvas.width);
    console.log('canvas height:', canvas.height);

    // restore everything
    element.style.width = origWidth;
    element.style.maxHeight = origMaxHeight;
    element.style.overflow = origOverflow;
    element.style.minHeight = origMinHeight;
    hiddenElements.forEach(({ el, prevDisplay }) => {
        el.style.display = prevDisplay;
    });


    // canvas.width/height are in "device pixels" because scale: 1.5
    // you need to divide by scale before converting to pt
    const SCALE = 1.5;
    const pdfWidth = (canvas.width / SCALE) * 0.75;   // CSS px → pt
    const pdfHeight = (canvas.height / SCALE) * 0.75;

    // THIS is the root cause — 'portrait' was silently swapping
    // width/height when your canvas came out wider than tall (landscape)
    // and then the image was placed at wrong dimensions vs page dimensions
    const orientation = pdfWidth > pdfHeight ? 'landscape' : 'portrait';

    const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0, 0,
        pdfWidth, pdfHeight
    );
    pdf.save(`${filename}.pdf`);
}
// ─── CSV — batch predictions ──────────────────────────────────────────────────
export function exportPredictionsToCSV(predictions: any[], filename: string) {
    if (!predictions.length) return;

    const featureKeys = predictions[0]?.features
        ? Object.keys(predictions[0].features)
        : [];

    const headers = [
        'record_index', 'prediction', 'prediction_label', 'confidence',
        'tree_votes_theft', 'tree_votes_normal', 'tree_votes_total',
        'prob_theft', 'prob_normal', 'area_id',
        'anomaly_flags_count', 'anomaly_flags_summary',
        ...featureKeys.map((k) => `feature_${k}`),
    ];

    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = predictions.map((rec) => {
        const flagSummary = (rec.anomaly_flags || [])
            .map((f: any) => `${f.feature}(z=${f.z_score})`)
            .join(' | ');
        return [
            rec.record_index ?? '', rec.prediction ?? '', rec.prediction_label ?? '',
            rec.confidence ?? '', rec.tree_votes?.theft ?? '', rec.tree_votes?.normal ?? '',
            rec.tree_votes?.total ?? '', rec.probabilities?.theft ?? '',
            rec.probabilities?.normal ?? '', rec.area_id ?? '',
            rec.anomaly_flags?.length ?? 0, flagSummary,
            ...featureKeys.map((k) => rec.features?.[k] ?? ''),
        ].map(escape).join(',');
    });

    const csv = [headers.map(escape).join(','), ...rows].join('\n');
    triggerDownload(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

// ─── CSV — single record ──────────────────────────────────────────────────────
export function exportSingleRecordToCSV(record: any, scanId: string) {
    const featureKeys = record.features ? Object.keys(record.features) : [];
    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const headers = [
        'scan_id', 'record_index', 'prediction', 'prediction_label', 'confidence',
        'tree_votes_theft', 'tree_votes_normal', 'tree_votes_total',
        'prob_theft', 'prob_normal', 'area_id',
        'anomaly_flags_count', 'anomaly_flags_summary',
        ...featureKeys.map((k) => `feature_${k}`),
    ];

    const flagSummary = (record.anomaly_flags || [])
        .map((f: any) => `${f.feature}(z=${f.z_score},dir=${f.direction})`)
        .join(' | ');

    const row = [
        scanId, record.record_index ?? '', record.prediction ?? '',
        record.prediction_label ?? '', record.confidence ?? '',
        record.tree_votes?.theft ?? '', record.tree_votes?.normal ?? '',
        record.tree_votes?.total ?? '', record.probabilities?.theft ?? '',
        record.probabilities?.normal ?? '', record.area_id ?? '',
        record.anomaly_flags?.length ?? 0, flagSummary,
        ...featureKeys.map((k) => record.features?.[k] ?? ''),
    ].map(escape).join(',');

    const csv = [headers.map(escape).join(','), row].join('\n');
    triggerDownload(csv, `${scanId}_record_${record.record_index}.csv`, 'text/csv;charset=utf-8;');
}

// ─── helper ───────────────────────────────────────────────────────────────────
function triggerDownload(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
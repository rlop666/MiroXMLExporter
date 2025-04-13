(async function () {
  // Esperamos que Miro SDK esté disponible
  if (!window.miro) {
    alert("No se puede acceder a Miro SDK desde aquí.");
    return;
  }

  const items = await miro.board.get({ type: ['sticky_note', 'card'] });

  let xml = `<cards>\n`;

  for (const item of items) {
    const { x, y, width, height } = item.bounds || {};
    const content = item.plainText || item.title || item.content || '';

    xml += `  <card>\n`;
    xml += `    <x>${x}</x>\n`;
    xml += `    <y>${y}</y>\n`;
    xml += `    <width>${width}</width>\n`;
    xml += `    <height>${height}</height>\n`;
    xml += `    <content>${content.replace(/[<>&'"]/g, c => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
    }[c]))}</content>\n`;
    xml += `  </card>\n`;
  }

  xml += `</cards>`;

  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "miro-cards-export.xml";
  a.click();
})();

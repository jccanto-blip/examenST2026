/* ============================================================
   Generador XLSX sin dependencias (zip STORE + OOXML mínimo)
   Permite exportar el consolidado a Excel real (.xlsx)
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- CRC32 ---------------- */
  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); }
      t[i] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) { c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /* ---------------- Utilidades binarias ---------------- */
  var te = new TextEncoder();
  function strBytes(s) { return te.encode(s); }
  function u16(v) { return new Uint8Array([v & 255, (v >> 8) & 255]); }
  function u32(v) {
    return new Uint8Array([v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]);
  }
  function concat(parts) {
    var len = 0;
    for (var i = 0; i < parts.length; i++) len += parts[i].length;
    var out = new Uint8Array(len), off = 0;
    for (var j = 0; j < parts.length; j++) { out.set(parts[j], off); off += parts[j].length; }
    return out;
  }

  /* ---------------- ZIP (método STORE) ---------------- */
  function zipStore(files) {
    // files: [{name, data: Uint8Array}]
    var localParts = [], centralParts = [], offset = 0;
    var now = new Date();
    var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    var dosDate = (((now.getFullYear() - 1980) & 127) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    for (var i = 0; i < files.length; i++) {
      var nameB = strBytes(files[i].name);
      var data = files[i].data;
      var crc = crc32(data);
      var local = concat([
        u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate),
        u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0),
        nameB, data
      ]);
      localParts.push(local);
      var central = concat([
        u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate),
        u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0), u16(0),
        u16(0), u16(0), u32(0), u32(offset),
        nameB
      ]);
      centralParts.push(central);
      offset += local.length;
    }
    var centralAll = concat(centralParts);
    var eocd = concat([
      u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
      u32(centralAll.length), u32(offset), u16(0)
    ]);
    return concat(localParts.concat([centralAll, eocd]));
  }

  /* ---------------- OOXML ---------------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function colLetter(n) {
    var s = '';
    n++;
    while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function sheetXml(cols, rows) {
    // cols: [{w}], rows: [[valores]] (string|number|null)
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    x += '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    if (cols && cols.length) {
      x += '<cols>';
      for (var i = 0; i < cols.length; i++) x += '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + cols[i] + '" customWidth="1"/>';
      x += '</cols>';
    }
    x += '<sheetData>';
    for (var r = 0; r < rows.length; r++) {
      x += '<row r="' + (r + 1) + '">';
      for (var c = 0; c < rows[r].length; c++) {
        var v = rows[r][c];
        var ref = colLetter(c) + (r + 1);
        if (v === null || v === undefined || v === '') { continue; }
        if (typeof v === 'number') {
          x += '<c r="' + ref + '"><v>' + v + '</v></c>';
        } else {
          x += '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + esc(String(v)) + '</t></is></c>';
        }
      }
      x += '</row>';
    }
    x += '</sheetData></worksheet>';
    return x;
  }

  var STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
    '</styleSheet>';

  function buildXLSX(sheets) {
    // sheets: [{name, cols:[w...], rows:[[...]]}]
    var ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
    var wbrels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>';
    var wb = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>';
    for (var i = 0; i < sheets.length; i++) {
      ct += '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
      wb += '<sheet name="' + esc(sheets[i].name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
      if (i > 0) {
        wbrels += '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
      }
    }
    ct += '</Types>';
    wb += '</sheets></workbook>';
    wbrels += '</Relationships>';

    var files = [
      { name: '[Content_Types].xml', data: strBytes(ct) },
      { name: '_rels/.rels', data: strBytes('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>') },
      { name: 'xl/workbook.xml', data: strBytes(wb) },
      { name: 'xl/_rels/workbook.xml.rels', data: strBytes(wbrels) },
      { name: 'xl/styles.xml', data: strBytes(STYLES) }
    ];
    for (var j = 0; j < sheets.length; j++) {
      files.push({ name: 'xl/worksheets/sheet' + (j + 1) + '.xml', data: strBytes(sheetXml(sheets[j].cols, sheets[j].rows)) });
    }
    return zipStore(files);
  }

  window.buildXLSX = buildXLSX;

  /* ---------------- Lector XLSX (STORE, sin compresión) ---------------- */
  function decodeXml(s) {
    return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  }
  function readXLSX(bytes) {
    // acepta Uint8Array (pruebas) y ArrayBuffer puro (FileReader del navegador)
    var u8;
    if (typeof ArrayBuffer !== 'undefined' && bytes instanceof ArrayBuffer) {
      u8 = new Uint8Array(bytes);
    } else if (bytes instanceof Uint8Array) {
      u8 = bytes;
    } else if (bytes && bytes.buffer) {
      u8 = new Uint8Array(bytes.buffer, bytes.byteOffset || 0, bytes.byteLength);
    } else {
      u8 = new Uint8Array(bytes);
    }
    var dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    // buscar EOCD
    var eocd = -1;
    for (var i = dv.byteLength - 22; i >= 0; i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) { throw new Error('No es un archivo ZIP/XLSX válido'); }
    var cdOffset = dv.getUint32(eocd + 16, true);
    var cdSize = dv.getUint32(eocd + 12, true);
    var entries = {};
    var pos = cdOffset;
    var end = cdOffset + cdSize;
    while (pos < end) {
      if (dv.getUint32(pos, true) !== 0x02014b50) { break; }
      var method = dv.getUint16(pos + 10, true);
      var compSize = dv.getUint32(pos + 20, true);
      var nameLen = dv.getUint16(pos + 28, true);
      var extraLen = dv.getUint16(pos + 30, true);
      var commentLen = dv.getUint16(pos + 32, true);
      var localOff = dv.getUint32(pos + 42, true);
      var name = '';
      for (var n = 0; n < nameLen; n++) { name += String.fromCharCode(u8[pos + 46 + n]); }
      var data = null;
      if (method === 0) {
        data = new Uint8Array(u8.buffer, u8.byteOffset + localOff + 30 + nameLen, compSize).slice();
      }
      entries[name] = data;
      pos += 46 + nameLen + extraLen + commentLen;
    }
    var td = new TextDecoder('utf-8');
    function txt(key) { return entries[key] ? td.decode(entries[key]) : ''; }
    // nombres de hojas
    var names = [];
    var wb = txt('xl/workbook.xml');
    var nmRe = /<sheet[^>]*name="([^"]*)"[^>]*>/g;
    var m;
    while ((m = nmRe.exec(wb)) !== null) { names.push(decodeXml(m[1])); }
    var sheets = [];
    for (var s = 1; s <= names.length; s++) {
      var xml = txt('xl/worksheets/sheet' + s + '.xml');
      var rows = [];
      var rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
      var rm;
      while ((rm = rowRe.exec(xml)) !== null) {
        var inner = rm[1];
        var cells = {};
        var cellRe = /<c([^>]*)>([\s\S]*?)<\/c>/g;
        var cm;
        while ((cm = cellRe.exec(inner)) !== null) {
          var attrs = cm[1];
          var rAttr = /r="([A-Z]+)(\d+)"/.exec(attrs);
          var val = null;
          var body = cm[2];
          if (body.indexOf('t="inlineStr"') >= 0 || /<t[^>]*>/.test(body)) {
            var t = /<t[^>]*>([\s\S]*?)<\/t>/.exec(body);
            val = t ? decodeXml(t[1]) : '';
          } else {
            var v = /<v>([\s\S]*?)<\/v>/.exec(body);
            if (v) { val = parseFloat(v[1]); }
          }
          if (rAttr && val !== null && val !== '') {
            var colIdx = 0;
            var colStr = rAttr[1];
            for (var ci = 0; ci < colStr.length; ci++) { colIdx = colIdx * 26 + (colStr.charCodeAt(ci) - 64); }
            cells[colIdx - 1] = val;
          }
        }
        if (Object.keys(cells).length) {
          var arr = [];
          var maxC = 0;
          for (var k in cells) { if (cells.hasOwnProperty(k)) { var kk = parseInt(k, 10); if (kk > maxC) maxC = kk; } }
          for (var f = 0; f <= maxC; f++) { arr.push(cells.hasOwnProperty(String(f)) ? cells[f] : null); }
          rows.push(arr);
        }
      }
      sheets.push({ name: names[s - 1] || ('Hoja' + s), rows: rows });
    }
    return { sheets: sheets };
  }
  window.readXLSX = readXLSX;
})();

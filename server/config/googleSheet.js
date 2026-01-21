const { google } = require('googleapis')
const path = require('path')
const fs = require('fs')

const keyFile = path.join(__dirname, 'credentials.json')
const credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'))

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

async function appendToSheet(data) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const valueMain = [
    [
      new Date().toLocaleDateString('vi-VN'),
      `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      data.url,
      data.fullName,
      data.yearOfBirth,
      data.ip,
      data.phone,
      new Date().toLocaleTimeString('vi-VN', { hour12: false }),
      'Elementor',
      data.userAgent,
      data.email,
      data.program,
      data.formName,
      data.difficult,
      data.schedule,
    ],
  ]
  const valuePopUp = [
    [
      data.fullName,
      data.url,
      data.userAgent,
      data.formName,
      data.email,
      data.yearOfBirth,
      'Elementor',
      data.phone,
      data.program,
      new Date().toLocaleDateString('vi-VN'),
      `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      new Date().toLocaleTimeString('vi-VN', { hour12: false }),
    ],
  ]
  const valueFooter = [
    [
      new Date().toLocaleDateString('vi-VN'),
      data.url,
      data.email,
      'Elementor',
      new Date().toLocaleTimeString('vi-VN', { hour12: false }),
      data.fullName,
      `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      data.phone,
      data.formName,
    ],
  ]
  if (data.atPlace == 'POPUP') {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Formweb-popup!A:L',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: valuePopUp },
    })
  } else if (data.atPlace == 'FOOTER') {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Formweb-footer!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: valueFooter },
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Formweb!A:O',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: valueMain },
    })
  }
  // await sheets.spreadsheets.batchUpdate({
  //   spreadsheetId,
  //   requestBody: {
  //     requests: [
  //       {
  //         deleteDimension: {
  //           range: {
  //             sheetId: 1976936367,
  //             dimension: 'ROWS',
  //             startIndex: 581, // dòng 582 (bắt đầu từ 0)
  //             endIndex: 584, // xóa đến dòng 584 (không bao gồm)
  //           },
  //         },
  //       },
  //     ],
  //   },
  // })
}

module.exports = { appendToSheet }

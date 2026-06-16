const SPREADSHEET_ID =
  "YOUR_SPREADSHEET_ID";

const SHEET_NAME = "YOUR_SHEET_NAME";

function doGet(e) {

  try {

    // =========================
    // Lấy dữ liệu từ URL
    // =========================

    const qr =
      (e.parameter.qr || "").trim();

    const className =
      (e.parameter.class || "").trim();

    if (!qr) {

      return jsonResponse({
        success: false,
        message: "Thiếu mã QR"
      });

    }

    if (!className) {

      return jsonResponse({
        success: false,
        message: "Chưa chọn lớp"
      });

    }

    // =========================
    // Kết nối Sheet
    // =========================

    const sheet =
      SpreadsheetApp
        .openById(SPREADSHEET_ID)
        .getSheetByName(SHEET_NAME);

    const now = new Date();

    const today =
      Utilities.formatDate(
        now,
        "GMT+7",
        "yyyy-MM-dd"
      );

    const currentTime =
      Utilities.formatDate(
        now,
        "GMT+7",
        "HH:mm:ss"
      );

    // =========================
    // Kiểm tra QR hợp lệ
    // =========================

    const parts = qr.split("_");

    if (parts.length < 3) {

      return jsonResponse({
        success: false,
        message: "QR không đúng định dạng"
      });

    }

    const memberCode = parts[0];
    const memberName = parts[1];
    const year = parts[2];

    // =========================
    // Kiểm tra trùng trong ngày
    // =========================

    const values =
      sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {

    const rowQR =
      String(values[i][0]).trim();

    const rowClass =
      String(values[i][4]).trim();

    const rowDate =
      Utilities.formatDate(
        new Date(values[i][6]),
        "GMT+7",
        "yyyy-MM-dd"
      );

    Logger.log(
      `${rowQR} | ${rowClass} | ${rowDate}`
    );

    if (
      rowQR === qr &&
      rowClass === className &&
      rowDate === today
    ) {

      return jsonResponse({
        success: false,
        message:
          "⚠️ Thành viên đã điểm danh hôm nay"
      });

    }

  }    

    // =========================
    // Lưu dữ liệu
    // =========================

    sheet.appendRow([
      qr,
      memberCode,
      memberName,
      year,
      className,
      currentTime,
      today
    ]);

    // =========================
    // Trả kết quả
    // =========================

    return jsonResponse({
      success: true,
      message:
        "✅ Điểm danh thành công",
      name: memberName,
      code: memberCode,
      class: className,
      time: currentTime
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.toString()
    });

  }

}

function jsonResponse(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}
// =============================
// CONFIG
// =============================

console.log("APP VERSION 20260616-01");
alert("APP VERSION 20260616-01");

const WEB_APP_URL ="YOUR_WEB_APP_URL";
const codeReader =
  new ZXing.BrowserMultiFormatReader();

let isProcessing = false;
let lastQR = "";

// =============================
// START SCAN
// =============================

async function startScan() {

  try {

    const devices =
      await navigator.mediaDevices.enumerateDevices();

    const videoDevices =
      devices.filter(
        device => device.kind === "videoinput"
      );

    if (videoDevices.length === 0) {

      showMessage(
        "Không tìm thấy camera",
        false
      );

      return;
    }

	const constraints = {
	  video: {
		facingMode: {
		  ideal: "environment"
		}
	  }
	};

	codeReader.decodeFromConstraints(
	  {
		video: {
		  facingMode: {
			ideal: "environment"
		  }
		}
	  },
	  "video",
      async (result, err) => {

        if (!result) return;

        if (isProcessing) return;

        const qr =
          result.text.trim();

        if (!qr) return;

        const classValue =
          document
            .getElementById("classSelect")
            .value;

        if (!classValue) {

          showMessage(
            "Vui lòng chọn lớp",
            false
          );

          return;
        }

        // chống đọc lặp liên tục
        if (qr === lastQR) {
          return;
        }

        lastQR = qr;
        isProcessing = true;

        showMessage(
          "Đang xử lý nèe...",
          true
        );

        try {

          const params =
            new URLSearchParams({
              qr: qr,
              class: classValue
            });

          const response =
            await fetch(
              `${WEB_APP_URL}?${params.toString()}`
            );

          if (!response.ok) {

            throw new Error(
              `HTTP ${response.status}`
            );

          }

          const data =
            await response.json();

          showMessage(
            data.message,
            data.success
          );

          console.log(data);

        } catch (error) {

          console.error(error);

          showMessage(
            "Lỗi kết nối máy chủ",
            false
          );

        }

        setTimeout(() => {

          isProcessing = false;
          lastQR = "";

        }, 2000);

      }
    );

  } catch (error) {

    console.error(error);

    showMessage(
      "Không thể mở camera",
      false
    );

  }

}

// =============================
// STOP SCAN
// =============================

function stopScan() {

  codeReader.reset();

  showMessage(
    "Đã dừng quét",
    true
  );

}

// =============================
// UI HELPER
// =============================

function showMessage(
  message,
  success
) {

  const resultElement =
    document.getElementById("result");

  resultElement.innerText =
    message;

  resultElement.style.fontWeight =
    "bold";

  resultElement.style.marginTop =
    "12px";

  resultElement.style.color =
    success
      ? "#0f9d58"
      : "#d93025";

}

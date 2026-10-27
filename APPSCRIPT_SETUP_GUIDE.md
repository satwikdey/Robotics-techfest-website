# TECHPULSE 2027 • Google Apps Script & Excel Setup Guide

> [!NOTE]
> **Active Deployment Connected!**
> Web App Endpoint: `https://script.google.com/macros/s/AKfycbwho09oISTnmsj2ifg5QFvHSXD1ApycShe9AgQ0NVRsDRarOdVmKfUW4IIXB-BgAdFL/exec`
> Version: 3 | Verified Status: Active & Synced

This guide explains how to connect your **TECHPULSE 2027** website form to a Google Sheet so that every participant registration is automatically stored in a spreadsheet in real-time, ready to view or download as an Excel file (`.xlsx`).

---

## ⚡ Quick 2-Minute Setup

### Step 1: Create a Google Spreadsheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name your spreadsheet: **`TechPulse 2027 Registrations`**.

---

### Step 2: Open the Apps Script Editor
1. In the top Google Sheets menu, click **Extensions** > **Apps Script**.
2. A new tab will open with a code editor showing `function myFunction() { ... }`.
3. Select and **delete** all existing code in the editor.

---

### Step 3: Paste the Script Code
Copy and paste the entire contents of [`google_apps_script.js`](file:///c:/Users/kyrot/Desktop/Robotics%20Tech%20Fest/google_apps_script.js) (or the block below) into the editor:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent collisions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Auto-create header row on first submission
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", "Delegate ID", "Profile", "Full Name", "Primary Email",
        "Mobile Number", "Gender", "Date of Birth", "Grade / Dept", "Section / Year",
        "Roll / ID Number", "Guardian Name", "Guardian Contact", "Institution Name",
        "City", "Enlisted Arenas", "Battle Zones", "Food Pass", "Emergency Contact"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0c111c");
      headerRange.setFontColor("#00f0ff");
      sheet.setFrozenRows(1);
    }

    // Append attendee entry
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.delegateId || "TP27-CADET",
      data.profile || "Delegate",
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.gender || "",
      data.dob || "",
      data.department || data.grade || "",
      data.yearSem || data.section || "",
      data.rollNumber || "",
      data.guardianName || "",
      data.guardianPhone || "",
      data.institutionName || "",
      data.city || "",
      data.events || "",
      data.zones || "",
      data.foodPass || "",
      data.emergencyContact || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", delegateId: data.delegateId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

### Step 4: Deploy as a Web App
1. In the upper right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the following options:
   - **Description**: `TechPulse 2027 Registration API`
   - **Execute as**: `Me (your email address)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must be set to "Anyone" so visitors to the website can register without logging into your Google account)*.
4. Click **Deploy**.
5. Google will prompt you to **Authorize access**:
   - Click *Review permissions*
   - Choose your Google Account
   - Click *Advanced* > *Go to Untitled project (unsafe)*
   - Click *Allow*
6. Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 5: Connect to the Website
1. Open the TECHPULSE 2027 website in your browser.
2. In the top navigation bar, click the **REGISTRY** / **Sheet Sync** button.
3. Paste your Web App URL into the **Google Apps Script Web App Endpoint URL** box.
4. Click **Save URL**.
5. That's it! Every registration submitted on the website will now stream instantly into your Google Sheet.

---

## 📊 Exporting to Excel Anytime
1. **From Google Sheets**: Go to **File** > **Download** > **Microsoft Excel (.xlsx)**.
2. **Directly from the Website**: Open the website's Sheet Sync console and click **"Download Excel / CSV Spreadsheet"**. The website automatically keeps an encrypted local copy of every submission so you never lose data even if you are offline!

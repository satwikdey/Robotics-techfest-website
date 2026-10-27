/**
 * ==============================================================================
 * TECHPULSE 2027 • GOOGLE APPS SCRIPT FOR EXCEL / GOOGLE SHEET INTEGRATION
 * ==============================================================================
 * This script accepts delegate registrations from the TechPulse 2027 website
 * and stores them in your Google Spreadsheet in real-time.
 * 
 * 2-MINUTE SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename your spreadsheet to "TechPulse 2027 Registrations"
 * 3. In the top menu, click Extensions > Apps Script
 * 4. Delete any code in the editor, and paste THIS ENTIRE FILE
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Set:
 *    - Description: "TechPulse 2027 Registration API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so attendees can submit)
 * 8. Click "Deploy", authorize permissions when prompted, and COPY the Web App URL.
 * 9. Paste that URL into the "Sheet Sync" console on the TechPulse website!
 * ==============================================================================
 */

// Handle POST requests from website registration form
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write collisions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse incoming data
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Auto-initialize header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Delegate ID",
        "Registration Profile",
        "Full Name",
        "Primary Email",
        "Mobile Number",
        "Gender",
        "Date of Birth",
        "Grade / Dept",
        "Section / Year",
        "Roll / ID Number",
        "Guardian Name",
        "Guardian Contact",
        "Institution Name",
        "City",
        "Enlisted Arenas",
        "Battle Zones",
        "Food Pass",
        "Emergency Contact"
      ];
      
      sheet.appendRow(headers);
      
      // Style header row (Cybertron styling)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0c111c");
      headerRange.setFontColor("#00f0ff");
      sheet.setFrozenRows(1);
    }

    // Extract fields with fallbacks
    var timestamp = data.timestamp || new Date().toISOString();
    var delegateId = data.delegateId || "TP27-CADET";
    var profile = data.profile || "Delegate";
    var fullName = data.fullName || "";
    var email = data.email || "";
    var phone = data.phone || "";
    var gender = data.gender || "";
    var dob = data.dob || "";
    
    var gradeOrDept = data.department || data.grade || "";
    var secOrYear = data.yearSem || data.section || "";
    var rollNumber = data.rollNumber || "";
    var guardianName = data.guardianName || "";
    var guardianPhone = data.guardianPhone || "";
    
    var institution = data.institutionName || "";
    var city = data.city || "";
    var events = data.events || "";
    var zones = data.zones || "";
    var foodPass = data.foodPass || "";
    var emergencyContact = data.emergencyContact || "";

    // Append attendee row
    sheet.appendRow([
      timestamp,
      delegateId,
      profile,
      fullName,
      email,
      phone,
      gender,
      dob,
      gradeOrDept,
      secOrYear,
      rollNumber,
      guardianName,
      guardianPhone,
      institution,
      city,
      events,
      zones,
      foodPass,
      emergencyContact
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Delegate successfully registered in Cybertron Matrix",
        delegateId: delegateId,
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Handle GET requests (Health check)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      message: "TechPulse 2027 Google Apps Script Endpoint Active",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

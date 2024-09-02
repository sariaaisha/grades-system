// استدعاء المكتبات اللازمة
const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');

// إنشاء تطبيق Express وتحديد المنفذ
const app = express();
const PORT = process.env.PORT || 3000;  // استخدام المتغير PORT إذا كان متاحًا أو 3000 كخيار افتراضي

// إعداد Body-Parser لاستقبال البيانات بصيغة JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// مسار ملف Excel
const workbookPath = path.join(__dirname, 'grades.xlsx');

// إضافة درجة طالب
app.post('/add-grade', (req, res) => {
    const { studentCode, studentName, assessmentType, assessmentDate, grade } = req.body;

    const workbook = xlsx.readFile(workbookPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, {header: 1});

    let studentRow = data.find(row => row[0] == studentCode);
    if (!studentRow) {
        studentRow = [studentCode, studentName, "", "", "", "", "", "", "", "", "", ""];
        data.push(studentRow);
    }

    const assessmentIndex = {
        'assessment 1': 2,
        'assessment 2': 3,
        'assessment 3': 4,
        'assessment 4': 5,
        'assessment 5': 6,
        'assessment 6': 7,
        'assessment 7': 8,
        'assessment 8': 9,
        'assessment 9': 10,
        'assessment 10': 11
    };

    studentRow[assessmentIndex[assessmentType]] = grade;

    const newSheet = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = newSheet;
    xlsx.writeFile(workbook, workbookPath);

    res.json({ success: true, message: 'Grade added successfully' });
});

// جلب درجات الطالب
app.post('/get-grades', (req, res) => {
    const { accessCode } = req.body;

    const workbook = xlsx.readFile(workbookPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, {header: 1});

    const studentData = data.find(row => row[0] == accessCode);

    if (studentData) {
        res.json({ success: true, data: studentData });
    } else {
        res.json({ success: false, message: 'كود الطالب غير صحيح' });
    }
});

// بدء تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

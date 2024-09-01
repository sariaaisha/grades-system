document.getElementById('loginForm').style.display = 'block';
document.getElementById('parentForm').style.display = 'none';
document.getElementById('teacherForm').style.display = 'none';

function login() {
    const userType = document.getElementById('userType').value;
    const loginCode = document.getElementById('loginCode').value;

    if (userType === 'teacher' && loginCode === '28963') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('teacherForm').style.display = 'block';
    } else if (userType === 'parent') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('parentForm').style.display = 'block';
    } else {
        alert('كود الدخول غير صحيح');
    }
}

function getGrades() {
    const accessCode = document.getElementById('accessCode').value;

    fetch('/get-grades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const gradesTableBody = document.getElementById('gradesTableBody');
            gradesTableBody.innerHTML = '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.data[0]}</td>
                <td>${data.data[1]}</td>
                ${data.data.slice(2).map(grade => `<td>${grade}</td>`).join('')}
            `;
            gradesTableBody.appendChild(row);

            document.getElementById('gradeInfo').classList.remove('hidden');
            document.getElementById('errorMessage').classList.add('hidden');
        } else {
            document.getElementById('gradeInfo').classList.add('hidden');
            document.getElementById('errorMessage').classList.remove('hidden');
        }
    })
    .catch(error => console.error('Error:', error));
}

function addGrade() {
    const studentCode = document.getElementById('studentCode').value;
    const studentName = document.getElementById('studentName').value;
    const assessmentType = document.getElementById('assessmentType').value;
    const assessmentDate = document.getElementById('assessmentDate').value;
    const grade = document.getElementById('grade').value;

    fetch('/add-grade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            studentCode,
            studentName,
            assessmentType,
            assessmentDate,
            grade
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تم إضافة الدرجة بنجاح');
        } else {
            alert('حدث خطأ أثناء إضافة الدرجة');
        }
    })
    .catch(error => console.error('Error:', error));
}

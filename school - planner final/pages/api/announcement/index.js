<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>School Planner Multi-User</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h1 id="schoolHeader">
  <img id="schoolLogo" src="logos/trio.jpg" alt="School Logo" style="height:50px; vertical-align:middle; margin-right:10px;">
  <span id="schoolName">Trio</span>
</h1>

<!-- Role Selection -->
<label>Select Role:</label>
<select id="role">
    <option value="admin">Admin</option>
    <option value="teacher">Teacher</option>
    <option value="student">Student/Parent</option>
</select>
<br><br>

<!-- Admin Login -->
<div id="adminForm" style="display:none;">
    <h3>Admin Login</h3>
    <input type="email" id="adminEmail" placeholder="Email"><br>
    <input type="password" id="adminPassword" placeholder="Password"><br>
    <button onclick="loginAdmin()">Login</button>
</div>

<!-- Teacher Login -->
<div id="teacherForm" style="display:none;">
    <h3>Teacher Login</h3>
    <input type="email" id="teacherEmail" placeholder="Email"><br>
    <input type="password" id="teacherPassword" placeholder="Password"><br>
    <button onclick="loginTeacher()">Login</button>
</div>

<!-- Student Login -->
<div id="studentForm" style="display:none;">
    <h3>Student/Parent Login</h3>
    <label>Grade:</label>
    <select id="studentGrade"></select>
    <label>Class:</label>
    <select id="studentClass"></select>
    <button onclick="loginStudent()">View Tasks</button>
</div>

<!-- Main App -->
<div id="app" style="display:none;">
  <h3 id="currentUser"></h3>

  <!-- Admin Controls -->
  <div id="adminControls" style="display:none;">
    <h3>Admin Panel</h3>
    <label>Teacher Name:</label>
    <input type="text" id="newTeacherName" placeholder="Enter teacher name"><br>
    <label>Email:</label>
    <input type="email" id="newTeacherEmail" placeholder="Enter teacher email"><br>
    <label>Password:</label>
    <input type="password" id="newTeacherPassword" placeholder="Enter password"><br>
    <button onclick="registerTeacher()">Add Teacher</button>
    
    <h3>Manage School</h3>
    <label>School Name:</label>
    <input type="text" id="schoolNameInput"><br>
    <label>School Logo:</label>
    <input type="file" id="schoolLogoInput"><br>
    <button onclick="updateSchoolInfo()">Update School Info</button>

    <!-- 🔹 Reset Teacher Password Feature -->
    <h3>Reset Teacher Password</h3>
    <label>Teacher Email:</label>
    <input type="email" id="resetTeacherEmail" placeholder="Enter teacher email"><br>
    <label>New Password:</label>
    <input type="password" id="resetTeacherPassword" placeholder="Enter new password"><br>
    <button onclick="resetTeacherPassword()">Reset Password</button>

    <button onclick="logoutAdmin()">Logout</button>
  </div>

  <!-- Teacher Controls -->
  <div id="teacherControls" style="display:none;">
    <label>Grade:</label>
    <select id="grade"></select>
    <label>Class:</label>
    <select id="class"></select><br>
    <label>Subject:</label>
    <input type="text" id="subject" placeholder="Math, English, etc."><br>
    <label>Task:</label>
    <input type="text" id="taskDesc" placeholder="Homework description"><br>
    <label>Due Date:</label>
    <input type="date" id="dueDate"><br>
    <button onclick="addTask()">Add Task</button>

    <h3>Announcements</h3>
    <input type="text" id="announcementMsg" placeholder="Write announcement">
    <label>Grade (optional):</label>
    <select id="announcementGrade"></select>
    <select id="announcementClass"></select>
    <button onclick="addAnnouncement()">Add Announcement</button>
    <ul id="announcementList"></ul>

    <button onclick="logoutTeacher()">Logout</button>
  </div>

  <!-- Student Announcements -->
  <div id="studentAnnouncements" style="display:block;">
    <h3>Announcements</h3>
    <ul id="studentAnnouncementList"></ul>
    <button onclick="logoutStudent()">Logout</button>
  </div>

  <h2>Tasks</h2>
  <ul id="taskList"></ul>
</div>

<script>
const BASE_URL = window.location.origin;
let role = '';
let teacherId = '';
let teacherName = '';

function populateGradeClass() {
    const gradeSelects = [document.getElementById('grade'), document.getElementById('studentGrade'), document.getElementById('announcementGrade')];
    const classSelects = [document.getElementById('class'), document.getElementById('studentClass'), document.getElementById('announcementClass')];

    gradeSelects.forEach(sel => {
        sel.innerHTML = '';
        sel.add(new Option("All Grades", "all"));
        for(let g=1; g<=12; g++) sel.add(new Option(`Grade ${g}`, g));
    });

    classSelects.forEach(sel => {
        sel.innerHTML = '';
        sel.add(new Option("All Classes", "all"));
        for(let c=65;c<=90;c++) sel.add(new Option(String.fromCharCode(c), String.fromCharCode(c)));
    });
}

document.getElementById('role').addEventListener('change', function(){
    document.getElementById('adminForm').style.display = (this.value==='admin') ? 'block' : 'none';
    document.getElementById('teacherForm').style.display = (this.value==='teacher') ? 'block' : 'none';
    document.getElementById('studentForm').style.display = (this.value==='student') ? 'block' : 'none';
    document.getElementById('app').style.display = 'none';
});

// ---------- Admin ----------
function loginAdmin(){
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    if(email==='admin@school.com' && password==='admin123'){
        role='admin';
        document.getElementById('app').style.display='block';
        document.getElementById('adminControls').style.display='block';
        document.getElementById('teacherControls').style.display='none';
        document.getElementById('studentAnnouncements').style.display='none';
        document.getElementById('currentUser').innerText = "Logged in as Admin";
        document.getElementById('adminForm').style.display='none';
    } else { alert('Invalid admin credentials!'); }
}
function logoutAdmin(){
    role=''; 
    document.getElementById('app').style.display='none';
    document.getElementById('adminControls').style.display='none';
    document.getElementById('currentUser').innerText='';
    document.getElementById('adminEmail').value='';
    document.getElementById('adminPassword').value='';
    document.getElementById('adminForm').style.display='block';
}

// ---------- Teacher ----------
function loginTeacher(){
    const email = document.getElementById('teacherEmail').value.trim();
    const password = document.getElementById('teacherPassword').value.trim();
    if(!email || !password){ alert('Fill all fields'); return; }

    fetch(`${BASE_URL}/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,password})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.error){ alert(data.error); return; }
        teacherId = data.user.id;
        teacherName = data.user.name;
        role='teacher';
        document.getElementById('currentUser').innerText = `Logged in as Teacher: ${teacherName}`;
        document.getElementById('teacherControls').style.display='block';
        document.getElementById('adminControls').style.display='none';
        document.getElementById('studentAnnouncements').style.display='none';
        document.getElementById('app').style.display='block';
        document.getElementById('teacherForm').style.display='none';
        fetchTasks();
        fetchAnnouncements();
    })
    .catch(err=>{ console.error(err); alert('Error connecting to server'); });
}

function logoutTeacher(){
    role=''; teacherId=''; teacherName='';
    document.getElementById('app').style.display='none';
    document.getElementById('teacherControls').style.display='none';
    document.getElementById('currentUser').innerText='';
    document.getElementById('teacherEmail').value='';
    document.getElementById('teacherPassword').value='';
    document.getElementById('teacherForm').style.display='block';
}

// ---------- Student ----------
function loginStudent(){
    role='student';
    const grade = document.getElementById('studentGrade').value;
    const classLetter = document.getElementById('studentClass').value;
    document.getElementById('currentUser').innerText=`Viewing tasks for Grade ${grade}${classLetter}`;
    document.getElementById('studentForm').style.display='none';
    document.getElementById('teacherControls').style.display='none';
    document.getElementById('adminControls').style.display='none';
    document.getElementById('studentAnnouncements').style.display='block';
    document.getElementById('app').style.display='block';
    fetchTasks();
    fetchAnnouncements();
}

function logoutStudent(){
    role='';
    document.getElementById('app').style.display='none';
    document.getElementById('studentForm').style.display='block';
    document.getElementById('currentUser').innerText='';
}

// ---------- Teacher/Admin Functions ----------
function registerTeacher(){
    if(role!=='admin'){ alert('Only admins can add teachers'); return; }
    const name = document.getElementById('newTeacherName').value.trim();
    const email = document.getElementById('newTeacherEmail').value.trim();
    const password = document.getElementById('newTeacherPassword').value.trim();
    if(!name || !email || !password){ alert('Fill all fields'); return; }

    fetch(`${BASE_URL}/register`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name,email,password})
    })
    .then(res=>res.json())
    .then(data=>alert(data.message||data.error))
    .catch(err=>{ console.error(err); alert('Error connecting to server'); });
}

function addTask(){
    if(role!=='teacher'){ alert('Only teachers can add tasks'); return; }
    const grade = document.getElementById('grade').value;
    const classLetter = document.getElementById('class').value;
    const subject = document.getElementById('subject').value.trim();
    const description = document.getElementById('taskDesc').value.trim();
    const dueDate = document.getElementById('dueDate').value;
    if(!subject || !description || !dueDate){ alert('Fill all fields'); return; }

    fetch(`${BASE_URL}/task`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({grade,classLetter,subject,description,dueDate,teacher:{id:teacherId,name:teacherName}})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.error){ alert(data.error); return; }
        document.getElementById('subject').value='';
        document.getElementById('taskDesc').value='';
        document.getElementById('dueDate').value='';
        fetchTasks();
    });
}

function addAnnouncement(){
    if(role!=='teacher'){ alert('Only teachers can add announcements'); return; }
    const message = document.getElementById('announcementMsg').value.trim();
    const grade = document.getElementById('announcementGrade').value;
    const classLetter = document.getElementById('announcementClass').value;
    if(!message){ alert('Write an announcement!'); return; }

    fetch(`${BASE_URL}/announcement`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({message,grade,classLetter,teacher:{id:teacherId,name:teacherName}})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.error){ alert(data.error); return; }
        document.getElementById('announcementMsg').value='';
        fetchAnnouncements();
    });
}

function fetchTasks(){
    fetch(`${BASE_URL}/tasks`)
    .then(res=>res.json())
    .then(data=>{
        const list = document.getElementById('taskList');
        list.innerHTML='';
        const today = new Date().toISOString().split('T')[0];

        data.forEach(t=>{
            // Auto-delete expired tasks
            if(new Date(t.dueDate).toISOString().split('T')[0]<today){
                fetch(`${BASE_URL}/task/${t.id}`,{method:'DELETE'});
                return;
            }
            let li=document.createElement('li');
            if(role==='teacher' && t.teacher.id===teacherId){
                li.innerText=`[Grade ${t.grade}${t.classLetter}] [${t.subject}] ${t.description} - ${t.dueDate}`;
                let delBtn=document.createElement('button');
                delBtn.innerText='Delete';
                delBtn.onclick=()=>{ if(confirm('Delete task?')){ fetch(`${BASE_URL}/task/${t.id}`,{method:'DELETE'}).then(()=>fetchTasks()); } };
                li.appendChild(delBtn);
                list.appendChild(li);
            }
            if(role==='student'){
                const studentGrade=document.getElementById('studentGrade').value;
                const studentClass=document.getElementById('studentClass').value;
                if(t.grade==studentGrade && t.classLetter==studentClass){
                    li.innerText=`[${t.teacher.name}] [${t.subject}] ${t.description} - ${t.dueDate}`;
                    list.appendChild(li);
                }
            }
        });
    });
}

function fetchAnnouncements(){
    fetch(`${BASE_URL}/announcements`)
    .then(res=>res.json())
    .then(data=>{
        const teacherList=document.getElementById('announcementList');
        const studentList=document.getElementById('studentAnnouncementList');
        teacherList.innerHTML=''; studentList.innerHTML='';
        const today = new Date().toISOString().split('T')[0];

        data.forEach(a=>{
            // Auto-delete old announcements
            if(new Date(a.createdAt).toISOString().split('T')[0]<today){
                fetch(`${BASE_URL}/announcement/${a.id}`,{method:'DELETE'});
                return;
            }

            const gradeText = a.grade==="all"?"All Grades":`Grade ${a.grade}`;
            const classText = a.classLetter==="all"?"All Classes":a.classLetter;
            const liText = `[${gradeText}${classText!=="All Classes"?a.classLetter:""}] ${a.message}`;

            if(role==='teacher' && a.teacher.id===teacherId){
                const li=document.createElement('li');
                li.innerText=liText;
                let delBtn=document.createElement('button');
                delBtn.innerText='Delete';
                delBtn.onclick=()=>{ if(confirm('Delete announcement?')){ fetch(`${BASE_URL}/announcement/${a.id}`,{method:'DELETE'}).then(()=>fetchAnnouncements()); } };
                li.appendChild(delBtn);
                teacherList.appendChild(li);
            }

            if(role==='student'){
                const studentGrade=document.getElementById('studentGrade').value;
                const studentClass=document.getElementById('studentClass').value;
                if((a.grade==='all'||a.grade==studentGrade)&&(a.classLetter==='all'||a.classLetter==studentClass)){
                    const li=document.createElement('li');
                    li.innerText=liText;
                    studentList.appendChild(li);
                }
            }
        });
    });
}

// ---------- 🔹 New Feature: Reset Teacher Password ----------
function resetTeacherPassword(){
    if(role!=='admin'){ alert('Only admins can reset passwords'); return; }
    const email = document.getElementById('resetTeacherEmail').value.trim();
    const newPassword = document.getElementById('resetTeacherPassword').value.trim();
    if(!email || !newPassword){ alert('Fill all fields'); return; }

    fetch(`${BASE_URL}/reset-password`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,newPassword})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.error){ alert(data.error); return; }
        alert(data.message || 'Password reset successfully');
        document.getElementById('resetTeacherEmail').value='';
        document.getElementById('resetTeacherPassword').value='';
    })
    .catch(err=>{ console.error(err); alert('Error connecting to server'); });
}

// Populate dropdowns on load
populateGradeClass();
// ---------- 🔹 Update School Info ----------
function updateSchoolInfo() {
    if(role !== 'admin') { 
        alert('Only admins can update school info'); 
        return; 
    }

    const schoolName = document.getElementById('schoolNameInput').value.trim();
    const schoolLogoFile = document.getElementById('schoolLogoInput').files[0];

    if(!schoolName && !schoolLogoFile) {
        alert('Enter a new school name or select a logo to update.');
        return;
    }

    // Update school name
    if(schoolName) {
        document.getElementById('schoolName').innerText = schoolName;
    }

    // Update school logo
    if(schoolLogoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('schoolLogo').src = e.target.result;
        };
        reader.readAsDataURL(schoolLogoFile);
    }

    alert('School info updated successfully!');
}
</script>

</body>
</html>

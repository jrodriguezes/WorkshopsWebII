const form = document.getElementById('courseForm');
const courseBody = document.getElementById('courseBody');
const dropwdown = document.getElementById('dropdownProfessorId');

async function loadProfessorsIds() {
    try {
        const response = await fetch("http://localhost:3001/professors", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const professors = await response.json();

            dropwdown.innerHTML = "";
            for (let professor of professors) {
                dropwdown.innerHTML += `<option value="${professor.idNumber}">${professor.idNumber}</option>`;
            }
        }

    } catch (error) {
        console.log(error);
    }
}

async function getCourses() {
    try {
        const response = await fetch("http://localhost:3001/courses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const courses = await response.json();
            courseBody.innerHTML = "";

            for (let course of courses) {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${course._id}</td>
                    <td>${course.courseCode}</td>
                    <td>${course.name}</td>
                    <td>${course.description}</td>
                    <td>${course.professorId}</td>
                    <td><button class="select">Seleccionar</button></td>
                `;

                row.querySelector('button').addEventListener('click', () => fillInputs(course));

                courseBody.appendChild(row);
            }
        }

    } catch (error) {
        console.log(error);
    }

}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const courseCode = document.getElementById('courseCodeInput').value;
        const courseName = document.getElementById('courseNameInput').value;
        const description = document.getElementById('descriptionInput').value;
        const professorId = document.getElementById('dropdownProfessorId').value;

        const response = await fetch("http://localhost:3001/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({ courseCode: courseCode, name: courseName, description: description, professorId: professorId })
        })

        if (response.ok) {
            form.reset();
            getCourses();
        }
    } catch (error) {
        console.log(error);
    }
});

function fillInputs(course) {
    document.getElementById('mongooseId').value = course._id;
    document.getElementById('courseCodeInput').value = course.courseCode;
    document.getElementById('courseNameInput').value = course.name;
    document.getElementById('descriptionInput').value = course.description;
    document.getElementById('dropdownProfessorId').value = course.professorId;
}

async function updateCourse() {
    try {
        const mongoId = document.getElementById('mongooseId').value;
        const courseCode = document.getElementById('courseCodeInput').value;
        const courseName = document.getElementById('courseNameInput').value; 
        const description = document.getElementById('descriptionInput').value;
        const professorId = document.getElementById('dropdownProfessorId').value;

        if (!mongoId) {
            alert("Selecciona un curso para actualizar");
            return;
        }

        const response = await fetch(`http://localhost:3001/courses?_id=`+ mongoId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                courseCode: courseCode,
                name: courseName,
                description: description,
                professorId: professorId,
            })
        })

        if (response.ok) {
            form.reset();
            getCourses();
        }

    } catch (error) {
        console.log(error);
    }
}

document.getElementById('btnUpdate').addEventListener('click', updateCourse);

async function deleteCourse() {
    try {
        const mongoId = document.getElementById('mongooseId').value;

        if (!mongoId) {
            alert("Selecciona un curso para eliminar");
            return;
        }

        const response = await fetch(`http://localhost:3001/courses?_id=` + mongoId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok) {
            form.reset();
            getCourses();
        }
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('btnDelete').addEventListener('click', deleteCourse);

document.getElementById('professorButton').addEventListener('click', () => {
    window.location.href = "professor-panel";
});

getCourses();
loadProfessorsIds();
const form = document.getElementById("professorForm")
const bodyTable = document.getElementById("professorBody")

async function getProfessors() {
    try {
        const response = await fetch("http://localhost:3001/professors", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.ok) {
            const professors = await response.json()

            bodyTable.innerHTML = ""

            for (let professor of professors) {
                const row = document.createElement("tr")

                row.innerHTML = `
                <td>${professor._id}</td> 
                <td>${professor.idNumber}</td>
                <td>${professor.name}</td> 
                <td>${professor.lastName}</td> 
                <td>${professor.age}</td> 
                <td>
                    <button class="select">Seleccionar</button>
                </td>`;

                row.querySelector("button").addEventListener("click", () => {
                    fillInputs(professor)
                })

                bodyTable.appendChild(row)
            }
        }
    } catch (error) {
            console.log("Error fetching professors:")
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const numberId = document.getElementById("idNumberInput").value;
    const professorName = document.getElementById("professorNameInput").value;
    const lastName = document.getElementById("lastNameInput").value;
    const age = document.getElementById("ageInput").value;
            
    try {
        const response = await fetch("http://localhost:3001/professors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({idNumber: numberId, name: professorName, lastName: lastName, age: age}),
    })
        if (response.ok) {
            form.reset()
            getProfessors()
        }

        } catch (error) {
        console.log("Error creating professor:", error)
    }

})

function fillInputs(professor) {
    document.getElementById("mongooseId").value = professor._id;
    document.getElementById("idNumberInput").value = professor.idNumber;
    document.getElementById("professorNameInput").value = professor.name;
    document.getElementById("lastNameInput").value = professor.lastName;
    document.getElementById("ageInput").value = professor.age;
}

async function updateProfessor() {
    const mongooseId = document.getElementById("mongooseId").value;
    const numberId = document.getElementById("idNumberInput").value;
    const professorName = document.getElementById("professorNameInput").value;
    const lastName = document.getElementById("lastNameInput").value;
    const age = document.getElementById("ageInput").value;
    try {
        const response = await fetch('http://localhost:3001/professors?_id=' + mongooseId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({idNumber: numberId, name: professorName, lastName: lastName, age: age}),
        })
        if (response.ok) {
            form.reset()
            getProfessors()
        }
    
    } catch (error) {
        console.log("Error updating professor:")
    }
}

document.getElementById("btnUpdate").addEventListener("click", updateProfessor)

async function deleteProfessor() {
    const mongooseId = document.getElementById("mongooseId").value;

    if (!mongooseId) {
        console.error("Professor ID is required for deletion");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/professor?id=' + mongooseId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.ok) {
            form.reset()
            getProfessors()
        }
    } catch (error) {
        console.log("Error deleting professor:")
    }
}

document.getElementById("btnDelete").addEventListener("click", deleteProfessor)

document.getElementById('coursesButton').addEventListener('click', () => {
    window.location.href = "course-panel";
});


getProfessors()
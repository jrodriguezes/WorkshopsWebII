const form = document.getElementById("courseForm");
const table = document.getElementById("tableBody");

form.addEventListener("submit", async (error) => {
    error.preventDefault();
    const name = document.getElementById("name").value;
    const credits = document.getElementById("credits").value;

    try {
        const response = await fetch("/course", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, credits }),
        });

        if (response.ok) {
        form.reset();  
        getCourses();
        } else {
            console.error("Error al crear el curso");
        }

    } catch (error) {
        console.log(error);
    }
});

function fillInputs(course) {
    document.getElementById("id").value = course._id;
    document.getElementById("name").value = course.name;
    document.getElementById("credits").value = course.credits;
}

async function getCourses() {
    const response = await fetch("/course", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    table.innerHTML = "";

    data.forEach((course) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="tableBorder">${course._id}</td>
            <td class="tableBorder">${course.name}</td>
            <td class="tableBorder">${course.credits}</td>
            <td class="tableBorder">
                <button type="button" class="optionStyle">Seleccionar</button>
            </td>
        `;

        row.querySelector("button").addEventListener("click", () => {
            fillInputs(course);
        });

        table.appendChild(row);
    });
}

async function updateCourse() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const credits = Number(document.getElementById("credits").value);

    if (!id) {
        console.error("Course ID is required for update");
        return;
    }
    try {
        const response = await fetch('/course?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, credits }),
        });

        if (!response.ok) {
            console.log(await response.json());
        }

        form.reset();
        getCourses();
        
    } catch (error) {
        console.error("Error updating course:", error);
    }
}

document.getElementById("btnUpdate").addEventListener("click", updateCourse);


async function deleteCourse() {
    const id = document.getElementById("id").value;    

    if (!id) {
        console.error("Course ID is required for deletion");
        return;
    }
    
    try {
        const response = await fetch('/course?id=' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log(await response.json());
        }

        form.reset();
        getCourses();
        
    } catch (error) {
        console.error("Error deleting course:", error);
    }
};

document.getElementById("btnDelete").addEventListener("click", deleteCourse);

getCourses();
const API_URL = "https://ejary-go-be.vercel.app/developers/search?teamName=Freelancing Team&pageSize=2&page=";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZPeFk5M3E2QVQxR2lWb3lNbTFyIiwiZW1haWwiOiJkeWNhaGVnZXdlQG1haWxpbmF0b3IuY29tIiwiaWF0IjoxNzQwMzA5NDUzLCJleHAiOjE3NDI5MDE0NTN9.OOC3rRvP3AmHjQT6j_ZKlQHLipgUwbJilQbCn5hdW4w";

let currentPage = 1;

async function fetchTeamData(page) {
    try {
        const response = await fetch(API_URL + page, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        updateTable(data);
        updateMeta(data.meta);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
}

function updateTable(data) {
    const tableBody = document.getElementById("employee-table");
    tableBody.innerHTML = "";

    data.employees.forEach((employee, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${employee.name || "N/A"}</td>
                <td>${employee.email || "N/A"}</td>
                <td>${employee.role || "N/A"}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function updateMeta(meta) {
    const metaDiv = document.getElementById("meta-info");
    metaDiv.innerHTML = `
        <h5>📌 Team Manager: ${meta.teamManager?.name || "N/A"} </h5>
        <p><strong>Total Employees:</strong> ${meta.totalItems}</p>
        <p><strong>Current Page:</strong> ${meta.page} / ${meta.totalPages}</p>
    `;

    document.getElementById("prev-page").disabled = !meta.hasPrevPage;
    document.getElementById("next-page").disabled = !meta.hasNextPage;
}

document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchTeamData(currentPage);
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    currentPage++;
    fetchTeamData(currentPage);
});

// 🔄 Load initial data
fetchTeamData(currentPage);

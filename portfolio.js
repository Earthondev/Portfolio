function searchProjects() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const autocompleteList = document.getElementById('autocomplete-list');
    const projects = document.querySelectorAll('.project');
    let suggestions = [];

    // Clear the autocomplete list
    autocompleteList.innerHTML = '';

    // Find matching projects
    projects.forEach(project => {
        const projectTitle = project.querySelector('h2').textContent.toLowerCase();
        if (projectTitle.includes(searchInput)) {
            suggestions.push(projectTitle);
        }
    });

    // Show autocomplete suggestions
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.onclick = function() {
            document.getElementById('searchInput').value = suggestion;
            filterProjectsBySearch(suggestion);
        };
        autocompleteList.appendChild(li);
    });
}

function filterProjectsBySearch(searchTerm) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        const projectTitle = project.querySelector('h2').textContent.toLowerCase();
        if (projectTitle.includes(searchTerm.toLowerCase())) {
            project.style.display = 'flex';
        } else {
            project.style.display = 'none';
        }
    });
}

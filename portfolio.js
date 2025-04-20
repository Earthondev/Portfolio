document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const projects = Array.from(document.querySelectorAll('.project'));
    const autocompleteList = document.getElementById('autocomplete-list');

    function searchProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        autocompleteList.innerHTML = ''; // เคลียร์รายการ Autocomplete ก่อน

        if (searchTerm.trim() === '') {
            // ถ้าไม่มีคำค้นหา ให้แสดงทุกโปรเจกต์
            projects.forEach(project => {
                project.style.display = 'flex';
            });
            return;
        }

        let matchingProjects = [];

        projects.forEach(project => {
            const title = project.querySelector('h2').textContent.toLowerCase();
            const description = project.querySelector('p').textContent.toLowerCase();
            const tools = project.dataset.tools.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || tools.includes(searchTerm)) {
                project.style.display = 'flex';
                matchingProjects.push(project);
            } else {
                project.style.display = 'none';
            }
        });

        // ถ้าคุณต้องการ Autocomplete (แสดงผลขณะพิมพ์)
        if (searchTerm.length > 0) {
            const suggestions = projects
                .filter(project => {
                    const title = project.querySelector('h2').textContent.toLowerCase();
                    return title.startsWith(searchTerm);
                })
                .slice(0, 5); // แสดงแค่ 5 รายการแรก

            suggestions.forEach(suggestion => {
                const listItem = document.createElement('li');
                listItem.textContent = suggestion.querySelector('h2').textContent;
                listItem.addEventListener('click', function() {
                    searchInput.value = this.textContent;
                    searchProjects(); // ทำการค้นหาเมื่อคลิกที่ Autocomplete
                    autocompleteList.innerHTML = ''; // เคลียร์ Autocomplete
                });
                autocompleteList.appendChild(listItem);
            });
        }
    }

    // ผูกฟังก์ชัน searchProjects กับ Event 'input' ของช่องค้นหา
    searchInput.addEventListener('input', searchProjects);
});
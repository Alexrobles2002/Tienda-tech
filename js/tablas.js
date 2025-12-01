// ====================================================
// 1. BUSCADOR DINÁMICO DE TABLAS
// ====================================================

// La definición de las variables y el listener debe hacerse después de que el DOM esté cargado.
const searchInput = document.getElementById('product-search');
if (searchInput) {
    searchInput.addEventListener('keyup', filterTables);
}

/**
 * Filtra las filas de todas las tablas y oculta las secciones de tablas vacías.
 */
function filterTables() {
    const filter = searchInput.value.toUpperCase();
    
    // 1. Seleccionar todos los nuevos contenedores de sección (div.table-section)
    const sections = document.querySelectorAll('main .table-section');

    sections.forEach(section => {
        const table = section.querySelector('table');
        if (!table) return; 

        const tr = table.getElementsByTagName('tr');
        let sectionHasMatch = false; 
        
        // Iterar sobre cada fila de datos (empezando por la segunda fila, índice 1)
        for (let i = 1; i < tr.length; i++) {
            let rowFound = false;
            const td = tr[i].getElementsByTagName('td');
            
            // A. Verificar si la fila contiene el texto de búsqueda
            for (let j = 0; j < td.length; j++) {
                const cell = td[j];
                
                if (cell) {
                    const cellValue = cell.textContent || cell.innerText;
                    
                    if (cellValue.toUpperCase().indexOf(filter) > -1) {
                        rowFound = true;
                        sectionHasMatch = true; 
                        break; 
                    }
                }
            }

            // B. Mostrar u ocultar la fila
            if (rowFound) {
                tr[i].style.display = ''; 
            } else {
                tr[i].style.display = 'none'; 
            }
        }

        // 2. Mostrar u ocultar la SECCIÓN completa (el div.table-section)
        if (filter === '' || sectionHasMatch) {
            section.style.display = 'block'; 
        } else {
            section.style.display = 'none';
        }
    });
}


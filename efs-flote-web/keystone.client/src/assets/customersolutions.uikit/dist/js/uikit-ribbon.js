document.addEventListener('DOMContentLoaded', function() {
    const clearButtons = document.querySelectorAll('.clear');

    clearButtons.forEach(function(clearButton) {
        clearButton.addEventListener('click', function() {
            const searchInput = clearButton.parentElement.querySelector('.searchInput');
            if (searchInput) {
                searchInput.value = ''; // Clear the value of the search input
            }
        });
    });

    const parent = document.getElementById('searchbarmobiletray');
    const child = document.getElementById('searchBarToggleMobile');

    function toggleParentVisibility() {
        const isExpanded = child.getAttribute('aria-expanded') === 'false';
        parent.style.width = isExpanded ? '100%' : '0';
        parent.style.visibility = isExpanded ? 'visible' : 'hidden';
        if (!isExpanded) {
            const searchInputMobile = document.querySelector('#searchbarmobile .searchInput');
            if (searchInputMobile) {
                searchInputMobile.focus();
            }
        }
    }

    const buttonObserver = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
                toggleParentVisibility();
                break;
            }
        }
    });

    buttonObserver.observe(child, { attributes: true, attributeFilter: ['aria-expanded'] });

    toggleParentVisibility(); // Initially toggle visibility based on the initial value of aria-expanded

    const closeIcons = document.querySelectorAll('.mobileAppsMenu .close-icon');
    closeIcons.forEach(function(icon) {
        icon.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop event propagation to prevent closing the dropdown-menu
        });
    });

    const collapseButtons = document.querySelectorAll('.mobileAppsMenu [data-bs-toggle="collapse"]');
    collapseButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const target = button.getAttribute('data-bs-target');
            const targetPanel = document.querySelector(target);
            const openPanels = document.querySelectorAll('.mobileAppsMenu .collapse.show');
            openPanels.forEach(function(openPanel) {
                if (!openPanel.contains(targetPanel)) {
                    openPanel.classList.remove('show');
                    const openButton = document.querySelector('.mobileAppsMenu [data-bs-target="#' + openPanel.id + '"]');
                    openButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    document.addEventListener('click', function(event) {
        const searchBar = document.getElementById('searchbar');
        const searchBarMobile = document.getElementById('searchbarmobile');

        // Check if the desktop search input is open and clicked outside
        if (searchBar && searchBar.classList.contains('show')) {
            const searchInput = searchBar.querySelector('.searchInput');
            if (searchInput && !searchInput.contains(event.target) && searchInput.value.trim() === '') {
                const clearButton = searchInput.parentElement.querySelector('.clear');
                if (clearButton) {
                    clearButton.click();
                }
            }
        }

        // Check if the mobile search input is open and clicked outside
        if (searchBarMobile && searchBarMobile.classList.contains('show')) {
            const searchInputMobile = searchBarMobile.querySelector('.searchInput');
            if (searchInputMobile && !searchInputMobile.contains(event.target) && searchInputMobile.value.trim() === '') {
                const clearButtonMobile = searchInputMobile.parentElement.querySelector('.clear');
                if (clearButtonMobile) {
                    clearButtonMobile.click();
                }
            }
        }
        
        // Handle search button click for desktop
        if (event.target.id === 'goSearch') {
            const searchInput = document.querySelector('#searchbar .searchInput');
            if (searchInput && searchInput.value.trim().length >= 2) {
               // alert(searchInput.value.toLowerCase()); // Alert the value of the search input               
                window.location.href = '/search?' + searchInput.value.toLowerCase();
            }
        }

        // Handle mobile search button click
        if (event.target.id === 'goSearchmobile') {
            const searchInputMobile = document.querySelector('#searchbarmobile .searchInput');
            if (searchInputMobile && searchInputMobile.value.trim().length >= 2) {
                //alert(searchInputMobile.value); // Alert the value of the search input for mobile
                window.location.href = '/search?' + searchInputMobile.value.toLowerCase();
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        // Check if the Enter key is pressed
        if (event.key === 'Enter') {
            event.preventDefault();
            // Handle search button click for desktop
            const searchInput = document.querySelector('#searchbar .searchInput');
            if (searchInput && document.activeElement === searchInput && searchInput.value.trim().length >= 2) {               
                window.location.href = '/search?' + searchInput.value.toLowerCase();
            }

            // Handle mobile search button click
            const searchInputMobile = document.querySelector('#searchbarmobile .searchInput');
            if (searchInputMobile && document.activeElement === searchInputMobile && searchInputMobile.value.trim().length >= 2) {               
                window.location.href = '/search?' + searchInputMobile.value.toLowerCase();
            }
        }
    });

    const targetNode = document.getElementById('searchbar');
    const configAttributes = { attributes: true, attributeFilter: ['class'] };
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (targetNode.classList.contains('show')) {
                    const input = targetNode.querySelector('.searchInput');
                    if (input) {
                        input.focus();
                    }
                }
            }
        }
    };

    const observerSearchInput = new MutationObserver(callback);
    observerSearchInput.observe(targetNode, configAttributes);

    const targetElement = document.querySelector('.mobileAppsMenu');
    const observerPanelOpen = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const classList = mutation.target.classList;
                if (!classList.contains('show')) {
                    const openPanels = document.querySelectorAll('.mobileAppsMenu .collapse.show');
                    openPanels.forEach(function(openPanel) {
                        openPanel.classList.remove('show');
                        const openButton = document.querySelector('[data-bs-target="#' + openPanel.id + '"]');
                        openButton.setAttribute('aria-expanded', 'false');
                    });
                }
            }
        });
    });

    const config = { attributes: true, attributeOldValue: true };
    observerPanelOpen.observe(targetElement, config);
});

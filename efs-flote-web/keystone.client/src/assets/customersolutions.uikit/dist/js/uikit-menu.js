document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll("nav.appbar > ul > li");

    menuItems.forEach(menuItem => {
        const submenuButton = menuItem.querySelector("a.submenu");
        let submenuTimer;

        menuItem.addEventListener("mouseover", function () {
            // Highlight the hovered menu item
            menuItems.forEach(item => item.classList.remove("active"));
            menuItem.classList.add("active");

            // Show the direct submenu corresponding to the hovered menu item
            const submenu = menuItem.querySelector("ul");
            if (submenu) {
                submenu.style.display = "block";

                // Highlight the button when submenu is expanded
                if (submenuButton) {
                    submenuButton.classList.add("active");
                }
            }

            // Hide other direct submenus
            menuItems.forEach(item => {
                if (item !== menuItem) {
                    const otherSubmenu = item.querySelector("ul");
                    if (otherSubmenu) {
                        otherSubmenu.style.display = "none";
                    }
                }
            });
        });

        menuItem.addEventListener("mouseout", function () {
            // Remove highlight from the menu item
            menuItem.classList.remove("active");

            // Hide its direct submenu with a slight delay
            submenuTimer = setTimeout(() => {
                const submenu = menuItem.querySelector("ul");
                if (submenu) {
                    submenu.style.display = "none";

                    // Remove active state from the button
                    if (submenuButton) {
                        submenuButton.classList.remove("active");
                    }
                }
            }, 100);
        });

        // Clear the timeout if mouse re-enters the menu item
        menuItem.addEventListener("mouseover", function () {
            clearTimeout(submenuTimer);
        });

        // Handle mouse events for second-level submenu items
        const secondLevelSubmenus = menuItem.querySelectorAll("ul.menuDown-mob > li");
        if (secondLevelSubmenus) {
            secondLevelSubmenus.forEach(submenuItem => {
                const submenuButton = submenuItem.querySelector("a.submenu");
                submenuItem.addEventListener("mouseover", function () {
                    // Highlight the submenu item and prevent hiding of parent menu
                    clearTimeout(submenuTimer);
                    const submenuList = submenuItem.querySelector("ul");
                    if (submenuList) {
                        submenuList.style.display = "block";
                    }
                    if (submenuButton) {
                        submenuButton.classList.add("active");
                    }
                });

                submenuItem.addEventListener("mouseout", function () {
                    // Remove highlight from the submenu item
                    const submenuList = submenuItem.querySelector("ul");
                    if (submenuList) {
                        submenuList.style.display = "none";
                    }
                    if (submenuButton) {
                        submenuButton.classList.remove("active");
                    }
                });
            });
        }
    });
});
/* =========================================
   Shayla Bernal Portfolio Script
   Clean, organized, and lightweight
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       01. DOM ELEMENTS
    ========================================= */

    const menuIcon = document.getElementById("menu-icon");
    const navList = document.querySelector(".navlist");
    const header = document.querySelector("header");

    const headerLinks = document.querySelectorAll('header a[href^="#"]');
    const navLinks = document.querySelectorAll("header .navlist a");
    const sections = document.querySelectorAll("section");

    let menuScrollPosition = {
        top: 0,
        left: 0
    };


    /* ========================================
       02. MOBILE MENU / SCROLL LOCK
    ======================================== */

    function getPageScrollPosition() {
        if (document.body.style.position === "fixed") {
            return menuScrollPosition.top;
        }

        return window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
    }

    function closeMobileMenu() {
        if (!menuIcon || !navList) return;

        navList.classList.remove("open");

        document.documentElement.classList.remove("menu-open");
        document.body.classList.remove("menu-open");

        if (document.body.style.position === "fixed") {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";

            window.scrollTo({
                top: menuScrollPosition.top,
                left: menuScrollPosition.left,
                behavior: "auto"
            });
        }

        menuIcon.classList.add("bx-menu");
        menuIcon.classList.remove("bx-x");

        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }


    function openMobileMenu() {
        if (!menuIcon || !navList) return;

        menuScrollPosition = {
            top: getPageScrollPosition(),
            left: window.scrollX || window.pageXOffset || 0
        };

        updateActiveSection();

        navList.classList.add("open");

        document.documentElement.classList.add("menu-open");
        document.body.classList.add("menu-open");

        document.body.style.position = "fixed";
        document.body.style.top = `-${menuScrollPosition.top}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        menuIcon.classList.remove("bx-menu");
        menuIcon.classList.add("bx-x");

        menuIcon.setAttribute("aria-expanded", "true");
        menuIcon.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    }


    /* ========================================
       03. ACTIVE SECTION TRACKING
    ======================================== */

    function setActiveSection(sectionId) {
        if (!sectionId) return;

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${sectionId}`
            );
        });
    }


    function getCurrentSection() {
        if (!sections.length) return "";

        const scrollY = getPageScrollPosition();
        const documentHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body?.scrollHeight || 0
        );
        const maxScrollY = Math.max(
            0,
            documentHeight - window.innerHeight
        );

        if (scrollY <= 0) {
            return sections[0].id;
        }

        if (maxScrollY > 0 && scrollY >= maxScrollY - 1) {
            return sections[sections.length - 1].id;
        }

        const headerHeight =
            header?.getBoundingClientRect().height || 0;

        const usableViewportHeight =
            Math.max(0, window.innerHeight - headerHeight);

        const activationLine =
            headerHeight +
            Math.min(
                120,
                Math.max(48, usableViewportHeight * 0.2)
            );

        let visibleSection = sections[0].id;

        sections.forEach(section => {
            if (
                section.getBoundingClientRect().top <=
                activationLine
            ) {
                visibleSection = section.id;
            }
        });

        return visibleSection;
    }


    function updateActiveSection() {
        if (!sections.length) return;

        setActiveSection(getCurrentSection());
    }


    /* ========================================
       04. SECTION NAVIGATION
    ======================================== */

    function scrollToSection(target) {
        if (!target) return;

        if (target.id === "home") {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });

            return;
        }

        const headerHeight =
            header?.getBoundingClientRect().height || 0;

        const targetY =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

        window.scrollTo({
            top: Math.max(0, targetY),
            left: window.scrollX,
            behavior: "auto"
        });
    }


    function cleanHomeUrl() {
        if (
            window.history?.replaceState &&
            (
                window.location.pathname !== "/" ||
                window.location.hash
            )
        ) {
            window.history.replaceState(
                null,
                "",
                "/"
            );
        }
    }


    function navigateFromCurrentUrl(shouldScroll = true) {
        const hash = window.location.hash;

        const sectionId =
            hash ? hash.slice(1) : "home";

        const target =
            document.getElementById(sectionId) ||
            document.getElementById("home");

        if (!target) return;

        if (target.id === "home") {
            cleanHomeUrl();
        }

        if (shouldScroll) {
            scrollToSection(target);
        }

        setActiveSection(target.id);
    }


    function navigateToSection(link) {
        const hash = link.getAttribute("href");

        if (!hash || !hash.startsWith("#")) return;

        const target =
            document.getElementById(hash.slice(1));

        if (!target) return;

        /*
         * Close and unlock the mobile menu before
         * calculating the target position so fixed-body
         * restoration is complete first.
         */
        closeMobileMenu();

        setActiveSection(target.id);

        scrollToSection(target);

        if (target.id === "home") {
            cleanHomeUrl();
        } else if (
            window.history?.pushState &&
            window.location.hash !== hash
        ) {
            window.history.pushState(
                null,
                "",
                hash
            );
        }
    }


    /* ========================================
       05. MOBILE MENU TOGGLE
    ======================================== */

    if (menuIcon && navList) {

        menuIcon.addEventListener("click", () => {

            if (navList.classList.contains("open")) {
                closeMobileMenu();
                return;
            }

            openMobileMenu();
        });
    }


    /* ========================================
       06. HEADER / NAVIGATION
    ======================================== */

    headerLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            navigateToSection(link);
        });
    });


    /* ========================================
       07. KEYBOARD / ACCESSIBILITY
    ======================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });


    /* ========================================
       07. CONTACT FORM / EMAILJS
    ======================================== */

    const contactForm = document.getElementById("contact-form");
    const statusMessage = document.getElementById("contact-form-status");
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    if (contactForm && statusMessage && submitButton) {
        const EMAILJS_SERVICE_ID = "service_2164zqr";
        const EMAILJS_TEMPLATE_ID = "template_dz2dgwf";
        const EMAILJS_PUBLIC_KEY = "Wbb1rAfuCioW8KCtJ";
        let statusHideTimer = null;

        const clearStatusMessage = () => {
            if (statusHideTimer !== null) {
                window.clearTimeout(statusHideTimer);
                statusHideTimer = null;
            }

            statusMessage.textContent = "";
            statusMessage.className = "contact-form-status";
            statusMessage.hidden = true;
        };

        const showStatusMessage = (message, className) => {
            clearStatusMessage();
            statusMessage.textContent = message;
            statusMessage.className = className;
            statusMessage.hidden = false;
            statusHideTimer = window.setTimeout(clearStatusMessage, 5000);
        };

        clearStatusMessage();

        contactForm.addEventListener("submit", async event => {
            event.preventDefault();
            clearStatusMessage();

            if (
                EMAILJS_SERVICE_ID.startsWith("YOUR_") ||
                EMAILJS_TEMPLATE_ID.startsWith("YOUR_") ||
                EMAILJS_PUBLIC_KEY.startsWith("YOUR_")
            ) {
                showStatusMessage(
                    "EmailJS still needs your Service ID, Template ID, and Public Key.",
                    "contact-form-status contact-form-status-error"
                );
                return;
            }

            const originalButtonContent = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML =
                "<i class='bx bx-loader-alt bx-spin' aria-hidden='true'></i> Sending...";

            try {
                await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    contactForm,
                    {
                        publicKey: EMAILJS_PUBLIC_KEY
                    }
                );

                contactForm.reset();
                showStatusMessage(
                    "Your message was sent successfully. Thank you!",
                    "contact-form-status contact-form-status-success"
                );
            } catch (error) {
                console.error("EmailJS submission failed:", error);

                showStatusMessage(
                    "Your message could not be sent. Please try again or email me directly.",
                    "contact-form-status contact-form-status-error"
                );
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            }
        });
    }


    /* ========================================
       08. WINDOW EVENTS
    ======================================== */

    window.addEventListener(
        "scroll",
        () => {
            if (navList?.classList.contains("open")) return;

            updateActiveSection();
        },
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        () => {
            if (navList?.classList.contains("open")) return;

            updateActiveSection();
        }
    );


    /* ========================================
       09. HISTORY / HASH NAVIGATION
    ======================================== */

    window.addEventListener("popstate", () => {

        closeMobileMenu();

        navigateFromCurrentUrl();
    });

    window.addEventListener("hashchange", () => {

        navigateFromCurrentUrl();
    });


    /* ========================================
       10. INITIALIZATION
    ======================================== */

    navigateFromCurrentUrl(Boolean(window.location.hash));

    updateActiveSection();
});

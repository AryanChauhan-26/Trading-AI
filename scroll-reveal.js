(() => {
    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const sections = document.querySelectorAll(
        ".app-container > *, .static-container > *, .markets-shell > *, " +
        ".alerts-shell > *, .watchlist-shell > *, .desk-shell > *, " +
        ".share-analysis-shell > *, .auth-shell > *"
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px"
    });

    sections.forEach((section) => {
        section.classList.add("scroll-reveal");
        observer.observe(section);
    });
})();

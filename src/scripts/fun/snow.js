const snowStorm = {
    start: () => {
        snowStorm.stop();
        const snowHolder = document.createElement("div")
        snowHolder.classList.add("snowHolder")
        snowHolder.innerHTML = `<div class="snow"></div>`.repeat(200)
        document.body.append(snowHolder)
    },
    stop: () => {
        const snowHolder = document.querySelector(".snowHolder")
        if (snowHolder) snowHolder.remove()
    },
    translate: (percentage) => {
        const snowHolder = document.querySelector(".snowHolder")
        if (!snowHolder) return;
        snowHolder.style.setProperty("--translate", percentage + "vw");
    }
}
export { snowStorm }

// Returns true for the core Christmas window (Dec 20 - Dec 26)
export function isChristmas() {
    const today = new Date();
    const month = today.getMonth(); // 0-based
    const day = today.getDate();

    return month === 11 && day >= 20 && day <= 26;
}

// Returns true for winter months where snow should be enabled (Dec, Jan, Feb)
export function isWinter() {
    const today = new Date();
    const month = today.getMonth(); // 0 = Jan, 11 = Dec
    return month === 11 || month === 0 || month === 1;
}

// Returns true for the near-Halloween window (Oct 25 - Oct 31)
export function isHalloween() {
    const today = new Date();
    const month = today.getMonth(); // 0-based
    const day = today.getDate();

    return month === 9 && day >= 25 && day <= 31;
}
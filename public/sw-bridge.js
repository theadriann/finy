const start = async () => {
    const regs = await navigator.serviceWorker.getRegistrations();

    for (let reg of regs) {
        reg.unregister({ immediate: true });
    }

    return;

    const reg = await navigator.serviceWorker.register("/service-worker.js");

    reg.onupdatefound = async () => {
        let worker = reg.installing;

        worker.onstatechange = () => {
            if (worker.state === "installed") {
                window.dispatchEvent(new Event("pwaUpdate"));
            }
        };
    };
};

if ("serviceWorker" in navigator) {
    window.addEventListener("pwaUpdate", async () => {
        const reg = await navigator.serviceWorker.getRegistration();

        if (reg && reg.waiting) {
            //
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
        }
    });

    start();
}
